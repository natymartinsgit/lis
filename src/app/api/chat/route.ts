import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { UserProfile } from '@/types';

const genAI = process.env.GOOGLE_API_KEY && process.env.GOOGLE_API_KEY !== "your-google-api-key-here"
  ? new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
  : null;

// Tipos de ocasião para detecção automática
const occasionTypes = ['trabalho', 'encontro', 'passeio', 'festa', 'evento', 'esporte', 'viagem', 'casa'];
const styleTypes = ['casual', 'formal', 'elegante', 'descontraído', 'moderno', 'clássico'];

// Gera mensagem inicial personalizada
function generateInitialMessage(): string {
  return `Olá! 👋 Sou sua assistente de moda pessoal! \n\nEstou aqui para te ajudar a criar o look perfeito para qualquer ocasião. ✨\n\nVamos começar! Me conta sobre a ocasião de hoje?`;
}

// Detectar ocasião e estilo na mensagem
function extractInfoFromMessage(message: string): Partial<UserProfile> {
  const lower = message.toLowerCase();
  const updates: Partial<UserProfile> = {};

  // Detectar ocasião
  occasionTypes.forEach(occasion => {
    if (lower.includes(occasion)) {
      updates.ocasiao = occasion;
    }
  });

  // Detectar estilo
  styleTypes.forEach(style => {
    if (lower.includes(style)) {
      updates.estiloDesejado = style;
    }
  });

  // Detectar restrições
  if (lower.includes('não quero') || lower.includes('não gosto')) {
    const restrictionPart = lower.split(/não quero|não gosto/)[1];
    if (restrictionPart) {
      updates.restricoes = restrictionPart.trim();
    }
  }
  
  return updates;
}

// Função de fallback quando API do Gemini falha
function generateFallbackResponse(
  message: string,
  userProfile: {
    occasion?: string;
    weather?: string;
    style?: string;
  },
  conversationHistory: Array<{ isUser: boolean; text: string }>
) {
  const lowerMessage = message.toLowerCase();
  
  // Se é uma saudação inicial (apenas no início da conversa)
  if (conversationHistory.length === 0) {
    return `Olá! Sou sua assistente de moda pessoal! 👗✨\n\nPara criar o look perfeito para você, me conte: para que ocasião você precisa se vestir hoje?\n\n📍 **Ocasiões que posso ajudar:**\n• Trabalho/reunião\n• Encontro romântico\n• Passeio casual\n• Festa/evento\n• Exercícios\n• Viagem\n• Ficar em casa`;
  }
  
  // Se o usuário está cumprimentando no meio da conversa
  if (lowerMessage.includes('oi') || lowerMessage.includes('olá')) {
    return `Oi! Como posso ajudar você com seu look hoje? 😊\n\nMe conte para que ocasião você precisa se vestir!`;
  }
  
  // Se mencionou ocasião
  if (lowerMessage.includes('trabalho') || lowerMessage.includes('reunião')) {
    return `Perfeito! Para o trabalho, vou criar um look profissional e elegante para você! 💼\n\nMe conte mais alguns detalhes:\n• Qual é o clima hoje?\n• Você prefere algo mais formal ou business casual?\n• Tem alguma cor favorita ou que deve evitar?`;
  }
  
  if (lowerMessage.includes('encontro') || lowerMessage.includes('romântico')) {
    return `Que romântico! 💕 Vou criar um look encantador para seu encontro!\n\nPara personalizar melhor:\n• Onde será o encontro? (restaurante, cinema, parque...)\n• Qual seu estilo preferido? (elegante, casual, boho...)\n• Tem alguma peça favorita no guarda-roupa?`;
  }
  
  if (lowerMessage.includes('festa') || lowerMessage.includes('evento')) {
    return `Festa! 🎉 Vamos criar um look incrível para você arrasar!\n\nMe ajude com os detalhes:\n• Que tipo de festa? (aniversário, casamento, balada...)\n• É durante o dia ou à noite?\n• Tem dress code específico?`;
  }
  
  // Se tem informações suficientes, gera sugestão completa
  if (userProfile.occasion && (userProfile.weather || userProfile.style)) {
    return generateCompleteLookSuggestion(userProfile);
  }
  
  // Resposta genérica para continuar a conversa
  return `Entendi! Para criar o look ideal, preciso saber mais alguns detalhes:\n\n• Para que ocasião você precisa se vestir?\n• Como está o clima hoje?\n• Qual seu estilo preferido?\n\nCom essas informações, posso sugerir looks incríveis para você! ✨`;
}

// Função para gerar sugestão completa de look
function generateCompleteLookSuggestion(userProfile: {
  occasion?: string;
  weather?: string;
}) {
  const occasion = userProfile.occasion || 'casual';
  const weather = userProfile.weather || 'ameno';
  
  return `## 👗 **Look Principal**\n\n**Para ${occasion}:**\n• **Top:** Blusa social branca ou camisa de seda\n• **Bottom:** Calça alfaiataria ou saia midi\n• **Calçado:** Sapato fechado confortável ou scarpin baixo\n• **Terceira peça:** Blazer estruturado\n\n---\n\n## ✨ **Alternativas**\n\n**Opção 2:** Vestido midi + cardigan + sapatilha\n**Opção 3:** Calça jeans escura + blusa elegante + jaqueta\n\n---\n\n## 👜 **Acessórios**\n• Bolsa estruturada pequena/média\n• Relógio delicado\n• Brincos discretos\n• Cinto fino (opcional)\n\n---\n\n## 💡 **Dica Especial**\n\nPara ${weather}, lembre-se de levar uma peça extra para se adaptar à temperatura! A confiança é o melhor acessório - use o que faz você se sentir bem! ✨\n\n*Precisa de mais alguma coisa? Posso ajudar com outras ocasiões!*`;
}

// Função principal que chama a IA para processar a conversa
async function callGeminiForChat(
  message: string,
  profile: Partial<UserProfile>,
  conversationHistory: Array<{ isUser: boolean; text: string }>
): Promise<string> {
  if (!genAI) return "Desculpe, não consegui processar sua mensagem agora. Tente novamente mais tarde.";
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Histórico da conversa para contexto
    const historyContext = conversationHistory.map(msg => 
      `${msg.isUser ? 'Usuário' : 'Assistente'}: ${msg.text}`
    ).join('\n');
    
    const prompt = `Você é uma assistente de moda pessoal especializada em criar looks personalizados. Seu objetivo é:

1. **CUMPRIMENTO E IDENTIFICAÇÃO DA OCASIÃO:**
   - APENAS cumprimente se for a primeira mensagem da conversa ou se o usuário estiver cumprimentando
   - Identifique a ocasião (trabalho, encontro, passeio, festa/evento, esporte, viagem, casa)
   - Se a ocasião não estiver clara, faça perguntas específicas

2. **CLASSIFICAÇÃO E DETALHAMENTO:**
   - Classifique a ocasião em categorias (formal/casual, interno/externo, etc.)
   - Colete informações sobre: local específico, horário, clima, preferências, restrições

3. **ESTRUTURA DE RESPOSTA (quando tiver informações suficientes):**
   - **Look Principal:** Descrição detalhada da sugestão principal
   - **Alternativa 1:** Segunda opção com justificativa
   - **Alternativa 2:** Terceira opção diferenciada
   - **Acessórios:** Sugestões de complementos
   - **Dica Extra:** Conselho personalizado

4. **PERSONALIZAÇÃO:**
   - Use o clima atual: ${profile.weatherData?.temperature || 'N/A'}°C, ${profile.weatherData?.condition || 'N/A'}
   - Considere a localização: ${profile.cidade || 'N/A'}
   - Adapte ao perfil: ocasião=${profile.ocasiao || 'N/A'}, estilo=${profile.estiloDesejado || 'N/A'}

5. **TRATAMENTO DE ERROS:**
   - Para respostas vagas: faça perguntas direcionadas
   - Para contexto fora de moda: redirecione gentilmente
   - Mantenha sempre o foco em moda e estilo

**HISTÓRICO DA CONVERSA:**
${historyContext}

**MENSAGEM ATUAL DO USUÁRIO:** ${message}

**INSTRUÇÕES IMPORTANTES:**
- Seja natural, amigável e profissional
- Use emojis moderadamente
- NÃO adicione "oi" ou cumprimentos desnecessários nas respostas
- APENAS cumprimente se for realmente apropriado (primeira mensagem ou resposta a cumprimento)
- Faça uma pergunta por vez quando precisar de mais informações
- Quando tiver informações suficientes, forneça as sugestões completas
- Mantenha respostas concisas mas informativas
- Vá direto ao ponto sem cumprimentos repetitivos`;

    const result = await model.generateContent(prompt);
    const fullText = (await result.response).text();
    // Divide a resposta em bolhas curtas (máximo 2 quebras de linha por bolha)
    const bubbles = fullText
      .split(/\n{2,}/)
      .map(msg => msg.trim())
      .filter(Boolean)
      .map(msg => (msg.length > 180 ? msg.slice(0, 180) + '...' : msg));
    return bubbles;
    
  } catch (error: Error | unknown) {
    console.error('Erro na IA:', error);
    
    // Fallback quando API do Gemini falha (limite de quota ou indisponibilidade)
    const status = (error as { status?: number })?.status;
    if (status === 429 || status === 503) {
      return generateFallbackResponse(message, {
        occasion: profile.ocasiao,
        weather: profile.weatherData?.condition,
        style: profile.estiloDesejado
      }, conversationHistory);
    }
    return "Desculpe, tive um problema técnico. Pode repetir sua mensagem?";
  }
}

// Endpoint POST
export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory, userProfile } = await request.json();
    
    // Extrai informações da mensagem atual
    const extractedInfo = extractInfoFromMessage(message);
    
    // Atualiza o perfil do usuário com as novas informações
    const updatedProfile = {
      ...userProfile,
      ...extractedInfo
    };
    
    // Chama a IA para gerar a resposta
    const aiResponse = await callGeminiForChat(message, updatedProfile, conversationHistory);
    
    return NextResponse.json({
      messages: Array.isArray(aiResponse) ? aiResponse : [aiResponse],
      userProfile: updatedProfile
    });
    
  } catch (error) {
    console.error('Erro no chat:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}