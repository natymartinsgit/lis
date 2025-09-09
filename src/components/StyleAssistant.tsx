'use client';
import { useState, useEffect, useRef } from 'react';
import LocationDetector from './LocationDetector';
import LookInspirationViewer from './LookInspirationViewer';
import { Message, UserProfile } from '@/types';

interface StyleAssistantProps {
  onComplete: (profile: UserProfile) => void;
}

export default function StyleAssistant({ onComplete }: StyleAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  const [isTyping, setIsTyping] = useState(false);

  const [showLocationDetector, setShowLocationDetector] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [waitingForInput, setWaitingForInput] = useState(false);
  const messageIdRef = useRef(0);



  const addMessage = (text: string, isUser: boolean) => {
    messageIdRef.current += 1;
    const newMessage: Message = {
      id: messageIdRef.current,
      text,
      isUser,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleLocationDetected = (location: { 
    latitude: number; 
    longitude: number; 
    city?: string; 
    country?: string; 
    weatherData?: {
      temperature?: number;
      conditions?: string;
    }; 
  }) => {
    const updatedProfile = {
      ...userProfile,
      cidade: location.city || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`,
      weatherData: location.weatherData
    };
setUserProfile(prevProfile => ({
  ...prevProfile,
  cidade: updatedProfile.cidade,
  weatherData: updatedProfile.weatherData ? {
    temperature: updatedProfile.weatherData.temperature || 0,
    description: '',
    condition: updatedProfile.weatherData.conditions || '',
    humidity: 0,
    windSpeed: 0,
    feelsLike: 0
  } : undefined
}));
    setShowLocationDetector(false);

    // Construir mensagem inicial personalizada
    const city = location.city || 'sua região';
    const temperature = location.weatherData?.temperature || 'N/A';
    let climaMensagem = 'o clima está perfeito para looks confortáveis';

    if (location.weatherData?.temperature) {
      const temp = location.weatherData.temperature;
      if (temp >= 30) {
        climaMensagem = 'está um calorzão! Perfeito para looks frescos e leves 🔥';
      } else if (temp <= 15) {
        climaMensagem = 'está um friozinho gostoso! Hora de caprichar nas camadas 🧥';
      } else if (temp <= 20) {
        climaMensagem = 'a temperatura está agradável! Ideal para qualquer estilo 🌤️';
      }
    }

    // Enviar mensagem inicial através da API
    generateInitialAIMessage();
    setTimeout(() => setWaitingForInput(true), 1500);
  };

  const handleLocationError = (error: string) => {
    addMessage(`⚠️ ${error}. Não se preocupe, você pode informar o clima manualmente!`, false);
    setTimeout(() => {
      setShowLocationDetector(false);
      generateInitialAIMessage();
      setWaitingForInput(true);
    }, 1500);
  };

  const generateInitialAIMessage = async () => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'iniciar conversa',
          userProfile: userProfile,
          conversationHistory: []
        })
      });

      const data = await response.json();
      if (data.message) {
        addMessage(data.message, false);
      }
    } catch (error) {
      console.error('Erro ao gerar mensagem inicial:', error);
      addMessage('Olá! 👋 Sou sua assistente de moda pessoal! Vamos começar! Me conta sobre a ocasião de hoje?', false);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Adicionar resposta do usuário
    addMessage(inputValue, true);
    const userInput = inputValue;
    setInputValue('');
    setWaitingForInput(false);



    // Processar resposta da IA
    setIsTyping(true);
    generateAIResponse(userInput);
  };

  const generateAIResponse = async (userInput: string) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userInput,
          userProfile: userProfile,
          conversationHistory: messages
        })
      });

      const data = await response.json();
      setIsTyping(false);

      if (data.message) {
        addMessage(data.message, false);

        let finalProfile = userProfile;
        if (data.userProfile) {
          finalProfile = { ...userProfile, ...data.userProfile };
          setUserProfile(finalProfile);
        }

        // Verificar se a resposta contém sugestões completas (indica conclusão)
        const hasCompleteSuggestions = data.message.includes('Look Principal') || 
                                     data.message.includes('LOOK PRINCIPAL') ||
                                     data.message.includes('**Look Principal**');
        
        if (hasCompleteSuggestions) {
          setTimeout(() => {
            onComplete(finalProfile);
          }, 1500);
        } else {
          setTimeout(() => setWaitingForInput(true), 500);
        }
      }
    } catch (error) {
      setIsTyping(false);
      console.error('Erro ao gerar resposta da IA:', error);
      addMessage('Desculpe, houve um erro. Pode repetir sua resposta?', false);
      setTimeout(() => setWaitingForInput(true), 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          👗 Assistente de Estilo
        </h2>
        <p className="text-purple-100 mt-1">Vamos descobrir seu look perfeito!</p>
      </div>

      {/* Location Detector */}
      {showLocationDetector && (
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">🌍 Detecção de Localização</h3>
            <p className="text-sm text-gray-600 mb-4">
              Para oferecer sugestões mais precisas baseadas no clima da sua região, gostaria de detectar sua localização automaticamente.
            </p>
          </div>

          <LocationDetector
            onLocationDetected={handleLocationDetected}
            onError={handleLocationError}
          />

          <div className="mt-4 text-center">
            <button
              onClick={() => handleLocationError("Localização não detectada")}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Pular e continuar sem localização automática
            </button>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className={`${showLocationDetector ? 'h-64' : 'h-96'} overflow-y-auto p-8 space-y-6 bg-gradient-to-b from-gray-50 to-white`}>
        {messages.map((message, index) => {
          // Detectar se a mensagem contém uma sugestão de look completo
          const isCompleteLook = !message.isUser && (
            message.text.toLowerCase().includes('look principal') ||
            message.text.toLowerCase().includes('sugestão de look') ||
            message.text.toLowerCase().includes('look completo') ||
            message.text.toLowerCase().includes('recomendo') ||
            message.text.toLowerCase().includes('sugiro') ||
            message.text.toLowerCase().includes('perfeito para') ||
            // Detectar combinações de peças + calçados
            ((message.text.toLowerCase().includes('vestido') || 
              message.text.toLowerCase().includes('blusa') || 
              message.text.toLowerCase().includes('camisa') ||
              message.text.toLowerCase().includes('camiseta') ||
              message.text.toLowerCase().includes('top') ||
              message.text.toLowerCase().includes('blazer') ||
              message.text.toLowerCase().includes('jaqueta') ||
              message.text.toLowerCase().includes('calça') ||
              message.text.toLowerCase().includes('saia') ||
              message.text.toLowerCase().includes('shorts')) &&
             (message.text.toLowerCase().includes('sapato') || 
              message.text.toLowerCase().includes('sandália') || 
              message.text.toLowerCase().includes('tênis') ||
              message.text.toLowerCase().includes('salto') ||
              message.text.toLowerCase().includes('rasteira') ||
              message.text.toLowerCase().includes('bota'))) ||
            // Detectar descrições de looks com múltiplas peças
            (message.text.split(' ').length > 15 && 
             (message.text.toLowerCase().includes('com') || message.text.toLowerCase().includes('e ')) &&
             (message.text.toLowerCase().includes('cor') || message.text.toLowerCase().includes('estilo') || message.text.toLowerCase().includes('tecido')))
          );

          return (
            <div key={message.id} className="animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-6 py-4 rounded-2xl shadow-soft transition-smooth hover-lift ${
                    message.isUser
                      ? 'gradient-primary text-white font-medium'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{message.text}</p>
                </div>
              </div>
              
              {/* Exibir inspirações visuais para looks completos */}
              {isCompleteLook && (
                <div className="flex justify-start mt-4">
                  <div className="max-w-4xl w-full">
                    <LookInspirationViewer 
                      lookDescription={message.text}
                      userProfile={userProfile}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white text-gray-800 shadow-soft px-6 py-4 rounded-2xl border border-gray-200">
              <div className="flex space-x-2 items-center">
                <span className="text-sm text-gray-500 mr-2">Digitando</span>
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce-custom"></div>
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce-custom" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce-custom" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      {waitingForInput && (
        <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 border-t border-gray-200 animate-fade-in">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua resposta aqui..."
                className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-purple-300 focus:outline-none resize-none transition-all duration-300 bg-white shadow-soft"
                rows={2}
                disabled={isTyping}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="px-6 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl font-medium shadow-soft hover:shadow-medium transition-all duration-300 hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enviar
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">
            💡 Dica: Seja específico(a) sobre suas preferências para receber sugestões mais personalizadas!
          </p>
        </div>
      )}
    </div>
  );
}
