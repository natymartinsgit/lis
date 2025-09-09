import { NextRequest, NextResponse } from 'next/server';
import { UserProfile } from '@/types';

interface StyleRecommendation {
  id: string;
  title: string;
  descricao: string;
  imagens: string[];
  dicas: string[];
  acessorios: string[];
  style: string;
}

// Importar funções da API principal
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Função para gerar alternativas com IA
async function generateAlternativeWithGemini(profile: UserProfile, variation: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const weatherInfo = profile.weatherData 
      ? `Clima atual: ${profile.weatherData.temperature}°C, ${profile.weatherData.condition}, umidade ${profile.weatherData.humidity}%, vento ${profile.weatherData.windSpeed}km/h.`
      : profile.clima ? `Clima: ${profile.clima}` : '';
    
    const prompt = `
Você é a Lookia, uma estilista IA super amigável e carinhosa! 💖

Crie uma ${variation} do look para este perfil:
- Ocasião: ${profile.ocasiao || 'Não especificado'}
- Estilo: ${profile.estilo || 'Não especificado'}
- Cores preferidas: ${profile.cores || 'Não especificado'}
- Conforto: ${profile.confortoOusadia || 'Não especificado'}
- Personalidade: ${profile.personalidade || 'Não especificado'}
${weatherInfo}

Sua resposta deve ser:
- Muito amigável e carinhosa, usando emojis 💖✨🌟
- Explicar por que esta variação é especial
- Máximo 150 palavras
- Tom conversacional como se fosse sua melhor amiga

Variação solicitada: ${variation}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Erro ao gerar alternativa com Gemini:', error);
    return '';
  }
}

// Função para buscar imagens por estilo
function getImagesByStyle(style: string): string[] {
  const imageDatabase = {
    casual: [
      '/api/proxy-image/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop&crop=center',
      '/api/proxy-image/photo-1469334031218-e382a71b716b?w=400&h=600&fit=crop&crop=center',
      '/api/proxy-image/photo-1445205170230-053b83016050?w=400&h=600&fit=crop&crop=center'
    ],
    elegante: [
      '/api/proxy-image/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop&crop=center',
      '/api/proxy-image/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop&crop=center',
      '/api/proxy-image/photo-1551698618-1dfe5d97d256?w=400&h=600&fit=crop&crop=center'
    ],
    boho: [
      '/api/proxy-image/photo-1509631179647-0177331693ae?w=400&h=600&fit=crop&crop=center',
      '/api/proxy-image/photo-1502716119720-b23a93e5fe1b?w=400&h=600&fit=crop&crop=center',
      '/api/proxy-image/photo-1551232864-3f0890e580d9?w=400&h=600&fit=crop&crop=center'
    ]
  };
  
  const style_key = style.toLowerCase() as keyof typeof imageDatabase;
  return imageDatabase[style_key] || imageDatabase.casual;
}

// Função para gerar dicas por variação
function generateTipsByVariation(profile: UserProfile, variation: string): string[] {
  const baseTips = {
    'versão clássica': [
      '✨ Esta é a versão mais atemporal - nunca sai de moda!',
      '💼 Perfeita para ocasiões que pedem elegância sem exageros',
      '👗 Aposte em peças básicas de qualidade, amor!'
    ],
    'versão moderna': [
      '🔥 Aqui a gente inova com tendências atuais!',
      '💫 Mix de texturas e cores que estão super em alta',
      '🌟 Para quem quer se destacar com estilo contemporâneo'
    ],
    'versão confortável': [
      '☁️ Máximo conforto sem abrir mão do estilo!',
      '🤗 Tecidos macios e cortes que te deixam livre para se movimentar',
      '💕 Porque você merece se sentir bem o dia todo, querida!'
    ]
  };
  
  return baseTips[variation as keyof typeof baseTips] || baseTips['versão clássica'];
}

// Função para gerar acessórios por variação
function generateAccessoriesByVariation(profile: UserProfile, variation: string): string[] {
  const baseAccessories = {
    'versão clássica': [
      '👜 Bolsa estruturada em couro ou material nobre',
      '⌚ Relógio clássico que nunca sai de moda',
      '👠 Sapato de salto médio confortável e elegante'
    ],
    'versão moderna': [
      '🎒 Bolsa com design inovador ou cor statement',
      '📱 Acessórios tech que combinam com o look',
      '👟 Tênis fashion ou sapato com detalhes modernos'
    ],
    'versão confortável': [
      '🎒 Mochila ou bolsa crossbody super prática',
      '🧢 Boné ou chapéu para proteção e estilo',
      '👟 Tênis ultra confortável para o dia a dia'
    ]
  };
  
  return baseAccessories[variation as keyof typeof baseAccessories] || baseAccessories['versão clássica'];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profile }: { profile: UserProfile } = body;

    if (!profile) {
      return NextResponse.json(
        { error: "Perfil do usuário é obrigatório." },
        { status: 400 }
      );
    }

    console.log('🎨 Gerando alternativas para o perfil:', profile);

    const variations = [
      { id: 'classic', title: 'Versão Clássica', style: 'elegante', variation: 'versão clássica' },
      { id: 'modern', title: 'Versão Moderna', style: 'casual', variation: 'versão moderna' },
      { id: 'comfort', title: 'Versão Confortável', style: 'boho', variation: 'versão confortável' }
    ];

    const alternatives: StyleRecommendation[] = [];

    // Gerar cada alternativa
    for (const variant of variations) {
      let descricao = await generateAlternativeWithGemini(profile, variant.variation);
      
      // Fallback se a IA não funcionar
      if (!descricao) {
        descricao = `💖 ${variant.title}: Um look especial pensado para você! Combinando ${profile.cores || 'suas cores favoritas'} com o estilo ${profile.estilo || 'que mais combina com você'}, perfeito para ${profile.ocasiao || 'qualquer ocasião'}! ✨`;
      }

      const alternative: StyleRecommendation = {
        id: variant.id,
        title: variant.title,
        descricao,
        imagens: getImagesByStyle(variant.style),
        dicas: generateTipsByVariation(profile, variant.variation),
        acessorios: generateAccessoriesByVariation(profile, variant.variation),
        style: variant.style
      };

      alternatives.push(alternative);
    }

    console.log(`✅ ${alternatives.length} alternativas geradas com sucesso`);
    
    return NextResponse.json({
      success: true,
      message: '🎉 Criei 3 alternativas incríveis para você escolher!',
      alternatives,
      total: alternatives.length
    }, { status: 200 });
    
  } catch (error) {
    console.error("Erro na API alternatives:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "API de alternativas de looks funcionando! Use POST para gerar alternativas."
  });
}