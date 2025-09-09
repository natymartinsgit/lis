import { NextRequest, NextResponse } from 'next/server';
import imagesData from '@/data/images.json';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { UserProfile, StyleRecommendation } from '@/types';

// Tipagem das imagens
interface ImageDatabase {
  looks: {
    [estilo: string]: {
      [ocasiao: string]: string[];
    };
  };
  default: string[];
}

const typedImagesData = imagesData as ImageDatabase;

// --------------------
// Instância única Gemini
// --------------------
const genAI = process.env.GOOGLE_API_KEY && process.env.GOOGLE_API_KEY !== "your-google-api-key-here"
  ? new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
  : null;

// --------------------
// Função para buscar dados de clima
// --------------------
async function fetchWeatherData(city: string) {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      console.log('⚠️ API key do OpenWeatherMap não configurada');
      return null;
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=pt_br`
    );

    if (!response.ok) {
      console.log(`⚠️ Erro na API do OpenWeatherMap: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return {
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      condition: data.weather[0].main.toLowerCase(),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6),
      feelsLike: Math.round(data.main.feels_like)
    };
  } catch (error) {
    console.error('Erro ao buscar dados do clima:', error);
    return null;
  }
}

// --------------------
// Mapear respostas do usuário para categorias de imagens
// --------------------
function mapUserResponsesToCategories(profile: UserProfile) {
  const estiloMap: { [key: string]: string } = {
    'casual': 'casual',
    'formal': 'elegante',
    'esportivo': 'esportivo',
    'romântico': 'romântico',
    'moderno': 'moderno',
    'confortável': 'casual',
    'ousado': 'moderno'
  };

  const ocasiaoMap: { [key: string]: string } = {
    'trabalho': 'trabalho',
    'encontro': 'encontro',
    'festa': 'festa',
    'passeio': 'passeio',
    'casa': 'casual',
    'churrasco': 'passeio',
    'restaurante': 'encontro'
  };

  return {
    estilo: profile.estiloDesejado ? estiloMap[profile.estiloDesejado as keyof typeof estiloMap] || 'casual' : 'casual',
    ocasiao: profile.ocasiao ? ocasiaoMap[profile.ocasiao] || 'passeio' : 'passeio'
  };
}

// --------------------
// Buscar imagens baseadas no perfil
// --------------------
function buscarImagensPorPerfil(profile: UserProfile): string[] {
  const { estilo, ocasiao } = mapUserResponsesToCategories(profile);

  try {
    if (typedImagesData.looks[estilo]) {
      return typedImagesData.looks[estilo][ocasiao] || typedImagesData.looks[estilo][Object.keys(typedImagesData.looks[estilo])[0]] || typedImagesData.default;
    }
    return typedImagesData.default;
  } catch (error) {
    console.error('Erro ao buscar imagens:', error);
    return typedImagesData.default;
  }
}

// --------------------
// Chamar Google Gemini
// --------------------
async function callGeminiWithProfile(profile: UserProfile): Promise<string | null> {
  if (!genAI) return null;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const climaInfo = profile.weatherData
      ? `${profile.weatherData.temperature}°C, ${profile.weatherData.description}`
      : 'Não especificado';

    const prompt = `Baseado nestas informações:
- Clima: ${climaInfo}
- Ocasião: ${profile.ocasiao}
- Local: ${profile.local}
- Estilo: ${profile.estiloDesejado}
- Formalidade: ${profile.formalidade}
- Conforto/Ousadia: ${profile.confortoOusadia}
- Preferências: ${profile.preferencias}
- Restrições: ${profile.restricoes || 'nenhuma'}
- Impacto: ${profile.impacto}

Gere uma descrição detalhada de look seguindo este formato:

"Show! 🎉 Aqui vai minha inspiração:

👖 Look principal: [descrição detalhada]

✨ Alternativa 1 (mais ousada): [descrição]

✨ Alternativa 2 (mais neutra): [descrição]

📌 Acessórios: [sugestões]

💄 Dica extra: [dica de estilo]

Gostou ou ajustamos?"`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("❌ Erro ao chamar Gemini:", error);
    return null;
  }
}

// --------------------
// Gerar dicas baseadas no clima e estilo
// --------------------
function gerarDicasPersonalizadas(profile: UserProfile): string[] {
  const dicas: string[] = [];
  
  if (profile.weatherData) {
    const { temperature, condition } = profile.weatherData;

    if (temperature <= 15) dicas.push('🧥 Está friozinho! Use camadas para ficar aquecida e estilosa');
    else if (temperature >= 30) dicas.push('☀️ Calor! Prefira tecidos leves como linho e algodão');

    if (condition.includes('rain')) dicas.push('☔ Chovendo! Leve guarda-chuva e calçados impermeáveis');
  }

  if (profile.estiloDesejado === 'confortável') dicas.push('😌 Priorize peças com bom caimento e tecidos macios');
  else if (profile.estiloDesejado === 'ousado') dicas.push('💫 Aposte em cores vibrantes e peças statement');

  return dicas;
}

// --------------------
// Sugerir acessórios
// --------------------
function sugerirAcessorios(profile: UserProfile): string[] {
  if (profile.formalidade === 'formal') {
    return ['💼 Bolsa estruturada', '⌚ Relógio clássico', '👔 Acessórios refinados'];
  } else {
    return ['🕶️ Óculos de sol', '🎒 Bolsa casual', '👟 Tênis confortável'];
  }
}

// --------------------
// POST: gerar look personalizado
// --------------------
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profile }: { profile: UserProfile } = body;

    if (!profile) {
      return NextResponse.json({ error: "Perfil do usuário é obrigatório." }, { status: 400 });
    }

    // Buscar clima se não existir
    if (profile.cidade && !profile.weatherData) {
      const weatherData = await fetchWeatherData(profile.cidade);
      if (weatherData) profile.weatherData = weatherData;
    }

    // Descrição Gemini
    let descricao = await callGeminiWithProfile(profile);
    if (!descricao) descricao = "Look personalizado baseado nas suas preferências e no clima atual.";

    // Imagens, dicas e acessórios
    const imagens = buscarImagensPorPerfil(profile);
    const dicas = gerarDicasPersonalizadas(profile);
    const acessorios = sugerirAcessorios(profile);

    const resultado: StyleRecommendation = { descricao, imagens, dicas, acessorios };

    return NextResponse.json(resultado, { status: 200 });
  } catch (error) {
    console.error("Erro na API styleAssistant:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// --------------------
// GET: teste de funcionamento
// --------------------
export async function GET() {
  return NextResponse.json({ message: "API do Assistente de Estilo funcionando!" }, { status: 200 });
}
