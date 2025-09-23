'use client';
import React, { useState } from 'react';

interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    value: string;
    icon: string;
  }[];
}

interface StyleProfile {
  name: string;
  description: string;
  characteristics: string[];
  keyPieces: string[];
  colors: string[];
  accessories: string[];
  celebrities: string[];
  tips: string[];
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Como você prefere se vestir no dia a dia?",
    options: [
      { text: "Confortável e prático", value: "casual", icon: "👕" },
      { text: "Elegante e sofisticado", value: "classic", icon: "👔" },
      { text: "Criativo e único", value: "bohemian", icon: "🌸" },
      { text: "Moderno e minimalista", value: "minimal", icon: "⚪" }
    ]
  },
  {
    id: 2,
    question: "Qual ambiente mais combina com você?",
    options: [
      { text: "Café aconchegante", value: "bohemian", icon: "☕" },
      { text: "Escritório corporativo", value: "classic", icon: "🏢" },
      { text: "Parque ao ar livre", value: "casual", icon: "🌳" },
      { text: "Galeria de arte moderna", value: "minimal", icon: "🎨" }
    ]
  },
  {
    id: 3,
    question: "Qual peça você nunca dispensaria no guarda-roupa?",
    options: [
      { text: "Jeans confortável", value: "casual", icon: "👖" },
      { text: "Blazer bem cortado", value: "classic", icon: "🧥" },
      { text: "Vestido fluido", value: "bohemian", icon: "👗" },
      { text: "Camiseta básica perfeita", value: "minimal", icon: "👕" }
    ]
  },
  {
    id: 4,
    question: "Como você escolhe suas roupas pela manhã?",
    options: [
      { text: "Pego o que está mais à mão", value: "casual", icon: "🤷" },
      { text: "Planejo com antecedência", value: "classic", icon: "📅" },
      { text: "Vou pelo humor do dia", value: "bohemian", icon: "🌈" },
      { text: "Tenho um uniforme pessoal", value: "minimal", icon: "👤" }
    ]
  },
  {
    id: 5,
    question: "Qual sua atitude em relação às tendências?",
    options: [
      { text: "Adapto ao meu estilo pessoal", value: "casual", icon: "🔄" },
      { text: "Prefiro peças atemporais", value: "classic", icon: "⏰" },
      { text: "Adoro experimentar novidades", value: "bohemian", icon: "✨" },
      { text: "Ignoro completamente", value: "minimal", icon: "🚫" }
    ]
  },
  {
    id: 6,
    question: "Qual seu acessório favorito?",
    options: [
      { text: "Tênis confortável", value: "casual", icon: "👟" },
      { text: "Relógio clássico", value: "classic", icon: "⌚" },
      { text: "Joias artesanais", value: "bohemian", icon: "💍" },
      { text: "Óculos de design", value: "minimal", icon: "🕶️" }
    ]
  },
  {
    id: 7,
    question: "Como você se sente melhor vestida?",
    options: [
      { text: "Quando posso me mover livremente", value: "casual", icon: "🏃" },
      { text: "Quando projeto confiança", value: "classic", icon: "💪" },
      { text: "Quando expresso minha criatividade", value: "bohemian", icon: "🎭" },
      { text: "Quando tudo está em harmonia", value: "minimal", icon: "☯️" }
    ]
  }
];

const styleProfiles: Record<string, StyleProfile> = {
  casual: {
    name: "Estilo Casual Chic",
    description: "Você valoriza o conforto sem abrir mão do estilo. Sua elegância vem da naturalidade e praticidade.",
    characteristics: [
      "Prioriza conforto e funcionalidade",
      "Gosta de peças versáteis e práticas",
      "Prefere looks descomplicados",
      "Valoriza qualidade sobre quantidade"
    ],
    keyPieces: [
      "Jeans de qualidade",
      "Camisetas e blusas básicas",
      "Tênis estilosos",
      "Cardigã ou jaqueta jeans",
      "Vestidos simples e confortáveis"
    ],
    colors: [
      "Neutros: branco, preto, cinza",
      "Azul denim",
      "Tons terrosos: bege, caramelo",
      "Toques de cor: coral, verde menta"
    ],
    accessories: [
      "Bolsas práticas e funcionais",
      "Tênis ou sapatilhas confortáveis",
      "Óculos de sol clássicos",
      "Joias delicadas e simples"
    ],
    celebrities: [
      "Jennifer Aniston",
      "Meghan Markle",
      "Gigi Hadid",
      "Emma Stone"
    ],
    tips: [
      "Invista em peças básicas de qualidade",
      "Crie um 'uniforme' pessoal com suas peças favoritas",
      "Adicione um toque especial com acessórios",
      "Mantenha o guarda-roupa organizado e funcional"
    ]
  },
  classic: {
    name: "Estilo Clássico Elegante",
    description: "Você aprecia a elegância atemporal e a sofisticação. Seu estilo é refinado e sempre apropriado.",
    characteristics: [
      "Prefere peças atemporais",
      "Valoriza qualidade e acabamento",
      "Gosta de looks estruturados",
      "Aprecia elegância discreta"
    ],
    keyPieces: [
      "Blazer bem cortado",
      "Camisa branca impecável",
      "Calça social ou saia lápis",
      "Vestido tubinho",
      "Trench coat clássico"
    ],
    colors: [
      "Neutros sofisticados: preto, branco, cinza",
      "Azul marinho",
      "Camel e bege",
      "Toques de cor: vermelho, azul royal"
    ],
    accessories: [
      "Bolsa estruturada de couro",
      "Sapatos de salto clássicos",
      "Relógio elegante",
      "Pérolas ou joias discretas"
    ],
    celebrities: [
      "Kate Middleton",
      "Amal Clooney",
      "Reese Witherspoon",
      "Gwyneth Paltrow"
    ],
    tips: [
      "Invista em peças de alfaiataria",
      "Mantenha as roupas sempre bem passadas",
      "Escolha acessórios de qualidade",
      "Prefira cortes clássicos e bem estruturados"
    ]
  },
  bohemian: {
    name: "Estilo Boêmio Criativo",
    description: "Você é livre, criativa e expressiva. Seu estilo reflete sua personalidade artística e espírito aventureiro.",
    characteristics: [
      "Adora experimentar e criar looks únicos",
      "Valoriza a expressão pessoal",
      "Gosta de texturas e estampas",
      "Prefere peças fluidas e confortáveis"
    ],
    keyPieces: [
      "Vestidos longos e fluidos",
      "Kimonos e cardigãs longos",
      "Calças palazzo ou pantalonas",
      "Blusas com bordados ou rendas",
      "Saias midi com movimento"
    ],
    colors: [
      "Tons terrosos: marrom, caramelo, mostarda",
      "Cores quentes: laranja, vermelho tijolo",
      "Neutros: creme, off-white",
      "Toques vibrantes: turquesa, roxo"
    ],
    accessories: [
      "Bolsas de palha ou couro artesanal",
      "Sandálias rasteiras ou botas",
      "Chapéus e lenços",
      "Joias étnicas e artesanais"
    ],
    celebrities: [
      "Sienna Miller",
      "Vanessa Hudgens",
      "Florence Welch",
      "Zoe Kravitz"
    ],
    tips: [
      "Misture texturas e estampas com confiança",
      "Aposte em peças vintage e brechós",
      "Use camadas para criar profundidade",
      "Deixe sua personalidade brilhar através das roupas"
    ]
  },
  minimal: {
    name: "Estilo Minimalista Moderno",
    description: "Você aprecia a simplicidade e a funcionalidade. Seu estilo é clean, moderno e sem excessos.",
    characteristics: [
      "Prefere linhas limpas e simples",
      "Valoriza qualidade sobre quantidade",
      "Gosta de paleta de cores reduzida",
      "Aprecia design funcional"
    ],
    keyPieces: [
      "Camisetas básicas perfeitas",
      "Calças retas ou skinny",
      "Blazer sem lapela",
      "Vestidos de linha A",
      "Casacos de corte reto"
    ],
    colors: [
      "Monocromático: preto, branco, cinza",
      "Tons neutros: bege, nude",
      "Um toque de cor: azul marinho ou camel",
      "Evita estampas chamativas"
    ],
    accessories: [
      "Bolsas de linhas geométricas",
      "Sapatos de design clean",
      "Óculos de armação simples",
      "Joias geométricas ou ausência delas"
    ],
    celebrities: [
      "Phoebe Philo",
      "Tilda Swinton",
      "Céline Dion (fase atual)",
      "Victoria Beckham"
    ],
    tips: [
      "Invista em peças de corte perfeito",
      "Mantenha o guarda-roupa enxuto",
      "Foque na qualidade dos tecidos",
      "Crie looks através de proporções e texturas"
    ]
  }
};

interface StyleQuizProps {
  onClose: () => void;
}

const StyleQuiz: React.FC<StyleQuizProps> = ({ onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<StyleProfile | null>(null);

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = () => {
    const answerValues = Object.values(answers);
    const scoreMap: Record<string, number> = {};

    answerValues.forEach(value => {
      scoreMap[value] = (scoreMap[value] || 0) + 1;
    });

    const maxScore = Math.max(...Object.values(scoreMap));
    const winningStyle = Object.keys(scoreMap).find(key => scoreMap[key] === maxScore) || 'casual';

    setResult(styleProfiles[winningStyle]);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setResult(null);
  };

  if (showResults && result) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Seu Estilo Personalizado</h2>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-blue-600 mb-2">{result.name}</h3>
              <p className="text-gray-600 text-lg">{result.description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="text-xl font-semibold mb-4">Suas Características:</h4>
                <ul className="space-y-2">
                  {result.characteristics.map((char, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-blue-500 mr-2">✓</span>
                      {char}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-4">Peças-Chave:</h4>
                <ul className="space-y-2">
                  {result.keyPieces.map((piece, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-pink-500 mr-2">👗</span>
                      {piece}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="text-xl font-semibold mb-4">Paleta de Cores:</h4>
                <ul className="space-y-2">
                  {result.colors.map((color, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-purple-500 mr-2">🎨</span>
                      {color}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-4">Acessórios:</h4>
                <ul className="space-y-2">
                  {result.accessories.map((accessory, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-orange-500 mr-2">💎</span>
                      {accessory}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mb-8">
              <h4 className="text-xl font-semibold mb-4">Inspirações (Celebridades):</h4>
              <div className="flex flex-wrap gap-2">
                {result.celebrities.map((celebrity, index) => (
                  <span key={index} className="bg-gradient-to-r from-blue-100 to-purple-100 px-3 py-1 rounded-full text-sm font-medium">
                    {celebrity}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h4 className="text-xl font-semibold mb-4">Dicas Personalizadas:</h4>
              <ul className="space-y-2">
                {result.tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">💡</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={resetQuiz}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors"
              >
                Refazer Quiz
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 transition-colors"
              >
                Salvar Resultado
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Descubra Seu Estilo</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Pergunta {currentQuestion + 1} de {quizQuestions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">{question.question}</h3>
            <div className="space-y-4">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(question.id, option.value)}
                  className="w-full p-4 text-left rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 flex items-center"
                >
                  <span className="text-2xl mr-4">{option.icon}</span>
                  <span className="font-medium">{option.text}</span>
                </button>
              ))}
            </div>
          </div>

          {currentQuestion > 0 && (
            <div className="flex justify-center">
              <button
                onClick={() => setCurrentQuestion(prev => prev - 1)}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Voltar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StyleQuiz;