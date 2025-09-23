import React, { useState } from 'react';
import { FaCommentDots } from 'react-icons/fa';
import LisAssistant from './LisAssistant';
import { UserProfile } from '@/types';

const FloatingLisChat = () => {
  const [open, setOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({});

  const handleAssistantComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setShowResults(true);
  };

  const handleRestart = () => {
    setShowResults(false);
    setUserProfile({});
  };

  return (
    <>
      {/* Botão flutuante */}
      <button
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-xl p-5 flex items-center gap-2 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-glow"
        onClick={() => setOpen((v) => !v)}
        aria-label="Converse com a Lis"
      >
        <FaCommentDots className="text-2xl" />
        <span className="hidden md:inline font-semibold">Converse com a Lis 👗</span>
      </button>

      {/* Janela do chat */}
      {open && (
        <div 
          className="fixed bottom-24 right-8 z-50 w-[450px] max-w-[95vw] bg-white rounded-2xl shadow-2xl border border-purple-200 flex flex-col animate-fade-in max-h-[80vh] min-h-[500px]"
        >
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-2xl">
            <span className="text-white font-bold">👗 Assistente Lis</span>
            <div className="flex items-center gap-2">
              {showResults && (
                <button 
                  onClick={handleRestart}
                  className="text-white text-sm bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition-colors"
                >
                  Nova Conversa
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-white text-xl font-bold hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center">×</button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            {showResults ? (
              <div className="p-4 h-full overflow-y-auto custom-scrollbar">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-purple-600 mb-2">🎉 Perfil Completo!</h3>
                  <p className="text-sm text-gray-600">Suas preferências foram salvas com sucesso!</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-2">Seu Perfil:</h4>
                  <div className="space-y-1 text-sm">
                    {userProfile.ocasiao && <p><strong>Ocasião:</strong> {userProfile.ocasiao}</p>}
                    {userProfile.estiloDesejado && <p><strong>Estilo:</strong> {userProfile.estiloDesejado}</p>}
                    {userProfile.cidade && <p><strong>Localização:</strong> {userProfile.cidade}</p>}
                    {userProfile.weatherData && (
                      <p><strong>Clima:</strong> {userProfile.weatherData.temperature}°C, {userProfile.weatherData.condition}</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <LisAssistant onComplete={handleAssistantComplete} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingLisChat;
