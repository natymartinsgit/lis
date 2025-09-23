'use client';
import React, { useState } from 'react';

interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    value: string;
    color: string;
  }[];
}

interface ColorPalette {
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
    complement: string;
  };
  characteristics: string[];
  recommendations: string[];
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Qual cor você se sente mais confiante usando?",
    options: [
      { text: "Azul marinho ou preto", value: "cool-deep", color: "bg-slate-800" },
      { text: "Vermelho ou coral", value: "warm-bright", color: "bg-red-500" },
      { text: "Bege ou caramelo", value: "warm-soft", color: "bg-amber-600" },
      { text: "Rosa ou lilás", value: "cool-soft", color: "bg-pink-400" }
    ]
  },
  {
    id: 2,
    question: "Como as pessoas descrevem sua pele?",
    options: [
      { text: "Tom rosado ou avermelhado", value: "cool", color: "bg-rose-300" },
      { text: "Tom dourado ou amarelado", value: "warm", color: "bg-yellow-300" },
      { text: "Tom neutro (nem quente nem frio)", value: "neutral", color: "bg-gray-300" },
      { text: "Tom oliváceo", value: "olive", color: "bg-green-300" }
    ]
  },
  {
    id: 3,
    question: "Qual metal fica melhor em você?",
    options: [
      { text: "Prata, platina ou ouro branco", value: "cool", color: "bg-gray-400" },
      { text: "Ouro amarelo ou rose gold", value: "warm", color: "bg-yellow-500" },
      { text: "Ambos ficam bem", value: "neutral", color: "bg-amber-400" },
      { text: "Não uso muito acessórios", value: "minimal", color: "bg-gray-200" }
    ]
  },
  {
    id: 4,
    question: "Qual cor de batom/gloss você prefere?",
    options: [
      { text: "Rosa frio, berry ou vinho", value: "cool", color: "bg-purple-500" },
      { text: "Coral, pêssego ou laranja", value: "warm", color: "bg-orange-400" },
      { text: "Nude rosado ou marrom", value: "neutral", color: "bg-rose-400" },
      { text: "Vermelho clássico", value: "classic", color: "bg-red-600" }
    ]
  },
  {
    id: 5,
    question: "Que tipo de ambiente você prefere?",
    options: [
      { text: "Minimalista e clean", value: "minimal", color: "bg-gray-100" },
      { text: "Aconchegante e terroso", value: "warm", color: "bg-amber-700" },
      { text: "Elegante e sofisticado", value: "cool-deep", color: "bg-slate-700" },
      { text: "Vibrante e colorido", value: "bright", color: "bg-rainbow" }
    ]
  },
  {
    id: 6,
    question: "Qual estação do ano você mais se identifica?",
    options: [
      { text: "Inverno - cores intensas e contrastantes", value: "winter", color: "bg-blue-900" },
      { text: "Verão - cores suaves e frias", value: "summer", color: "bg-blue-300" },
      { text: "Outono - cores quentes e terrosas", value: "autumn", color: "bg-orange-600" },
      { text: "Primavera - cores claras e vibrantes", value: "spring", color: "bg-green-400" }
    ]
  }
];

const colorPalettes: Record<string, ColorPalette> = {
  'cool-deep': {
    name: "Inverno Profundo",
    description: "Você tem uma beleza marcante que combina com cores intensas e contrastantes.",
    colors: {
      primary: "#1e293b",
      secondary: "#dc2626",
      accent: "#7c3aed",
      neutral: "#f8fafc",
      complement: "#059669"
    },
    characteristics: [
      "Contraste alto entre pele, cabelo e olhos",
      "Cores intensas realçam sua beleza natural",
      "Preto, branco e cores puras são suas aliadas"
    ],
    recommendations: [
      "Use preto, branco e cinza como base",
      "Adicione toques de vermelho, roxo ou azul royal",
      "Evite cores desbotadas ou muito suaves",
      "Aposte em contrastes marcantes"
    ]
  },
  'cool-soft': {
    name: "Verão Suave",
    description: "Sua beleza é delicada e harmoniosa, combinando com tons suaves e frios.",
    colors: {
      primary: "#64748b",
      secondary: "#ec4899",
      accent: "#8b5cf6",
      neutral: "#f1f5f9",
      complement: "#06b6d4"
    },
    characteristics: [
      "Tom de pele frio com subtom rosado",
      "Cores suaves e acinzentadas são ideais",
      "Contraste médio a baixo"
    ],
    recommendations: [
      "Prefira azuis, rosas e roxos suaves",
      "Use cinza como neutro principal",
      "Evite cores muito vibrantes ou quentes",
      "Aposte em tons pastel e acinzentados"
    ]
  },
  'warm-bright': {
    name: "Primavera Radiante",
    description: "Você irradia energia e vitalidade, combinando com cores quentes e vibrantes.",
    colors: {
      primary: "#f59e0b",
      secondary: "#ef4444",
      accent: "#10b981",
      neutral: "#fef3c7",
      complement: "#3b82f6"
    },
    characteristics: [
      "Tom de pele quente com subtom dourado",
      "Cores claras e vibrantes realçam sua energia",
      "Contraste médio com cores puras"
    ],
    recommendations: [
      "Use dourado, coral e verde como destaque",
      "Prefira creme e bege como neutros",
      "Evite cores muito escuras ou frias",
      "Aposte em tons vibrantes e energéticos"
    ]
  },
  'warm-soft': {
    name: "Outono Acolhedor",
    description: "Sua beleza é rica e aconchegante, combinando com tons terrosos e dourados.",
    colors: {
      primary: "#92400e",
      secondary: "#dc2626",
      accent: "#059669",
      neutral: "#fef7ed",
      complement: "#1d4ed8"
    },
    characteristics: [
      "Tom de pele quente com subtom dourado",
      "Cores terrosas e ricas são perfeitas",
      "Contraste médio com tons profundos"
    ],
    recommendations: [
      "Use marrom, caramelo e dourado como base",
      "Adicione toques de vermelho tijolo ou verde musgo",
      "Evite cores muito frias ou neon",
      "Aposte em tons terrosos e aconchegantes"
    ]
  }
};

interface ColorPaletteQuizProps {
  onClose: () => void;
}

const ColorPaletteQuiz: React.FC<ColorPaletteQuizProps> = ({ onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<ColorPalette | null>(null);

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

    let paletteKey = 'cool-soft';

    if (scoreMap['cool'] >= 2 && scoreMap['cool-deep'] >= 1) {
      paletteKey = 'cool-deep';
    } else if (scoreMap['cool'] >= 2) {
      paletteKey = 'cool-soft';
    } else if (scoreMap['warm'] >= 2 && scoreMap['bright'] >= 1) {
      paletteKey = 'warm-bright';
    } else if (scoreMap['warm'] >= 2) {
      paletteKey = 'warm-soft';
    } else if (scoreMap['winter'] >= 1) {
      paletteKey = 'cool-deep';
    } else if (scoreMap['spring'] >= 1) {
      paletteKey = 'warm-bright';
    } else if (scoreMap['autumn'] >= 1) {
      paletteKey = 'warm-soft';
    }

    setResult(colorPalettes[paletteKey]);
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
              <h2 className="text-3xl font-bold text-gray-800">Sua Paleta Personalizada</h2>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-purple-600 mb-2">{result.name}</h3>
              <p className="text-gray-600 text-lg">{result.description}</p>
            </div>

            <div className="mb-8">
              <h4 className="text-xl font-semibold mb-4">Suas Cores Ideais:</h4>
              <div className="grid grid-cols-5 gap-4">
                {Object.entries(result.colors).map(([name, color]) => (
                  <div key={name} className="text-center">
                    <div 
                      className="w-16 h-16 rounded-full mx-auto mb-2 shadow-lg"
                      style={{ backgroundColor: color }}
                    ></div>
                    <p className="text-sm font-medium capitalize">{name}</p>
                    <p className="text-xs text-gray-500">{color}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h4 className="text-xl font-semibold mb-4">Suas Características:</h4>
              <ul className="space-y-2">
                {result.characteristics.map((char, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-purple-500 mr-2">✓</span>
                    {char}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <h4 className="text-xl font-semibold mb-4">Recomendações de Estilo:</h4>
              <ul className="space-y-2">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-pink-500 mr-2 mt-1">💡</span>
                    {rec}
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
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-colors"
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
            <h2 className="text-2xl font-bold text-gray-800">Descubra Sua Paleta</h2>
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
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
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
                  className="w-full p-4 text-left rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 flex items-center"
                >
                  <div className={`w-6 h-6 rounded-full mr-4 ${option.color}`}></div>
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

export default ColorPaletteQuiz;