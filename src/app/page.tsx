'use client';
import { useState } from 'react';
import StyleAssistant from '@/components/StyleAssistant';
import Lookbook from '@/components/Lookbook';
import FeedbackSystem from '@/components/FeedbackSystem';
import AlternativesViewer from '@/components/AlternativesViewer';
import InstagramLookCard from '@/components/InstagramLookCard';
import { UserProfile, StyleRecommendation } from '@/types';

export default function Home() {
  const [showAssistant, setShowAssistant] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [recommendation, setRecommendation] = useState<StyleRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLookbook, setShowLookbook] = useState(false);
  const [savingLook, setSavingLook] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);

  const handleAssistantComplete = async (profile: UserProfile) => {
    setUserProfile(profile);
    setShowAssistant(false);
    setLoading(true);

    try {
      const res = await fetch('/api/styleAssistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      });

      const data = await res.json();
      setRecommendation(data);
    } catch (error) {
      console.error('Erro ao obter recomendação:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToLookbook = async () => {
    if (!recommendation || !userProfile) return;
    
    setSavingLook(true);
    try {
      const response = await fetch('/api/lookbook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          look: recommendation,
          profile: userProfile
        })
      });
      
      const result = await response.json();
      if (result.success) {
        alert('💖 Look salvo no seu lookbook com sucesso!');
      } else {
        alert('Erro ao salvar look: ' + result.error);
      }
    } catch (error) {
      console.error('Erro ao salvar look:', error);
      alert('Erro ao salvar look');
    } finally {
      setSavingLook(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 animate-gradient">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-soft border-b border-purple-100 sticky top-0 z-50 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
                Lookia
              </h1>
              <span className="text-sm text-gray-500 animate-slide-in">Sua IA Estilista Pessoal</span>
            </div>
            <nav className="flex space-x-4 animate-slide-in">
              <button
                onClick={() => setShowLookbook(true)}
                className="px-4 py-2 text-purple-600 hover:text-purple-800 font-medium transition-all duration-300 hover:scale-105 hover-glow"
              >
                📚 Meu Lookbook
              </button>
              <button
                onClick={() => {
                  setShowAssistant(true);
                  setRecommendation(null);
                  setUserProfile(null);
                  setShowAlternatives(false);
                }}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 hover-glow"
              >
                ✨ Novo Look
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showAssistant && (
          <div className="animate-fade-in">
            <StyleAssistant onComplete={handleAssistantComplete} />
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-pink-600 rounded-full animate-spin-reverse"></div>
            </div>
            <p className="mt-6 text-lg text-gray-600 animate-pulse">✨ Criando seu look perfeito...</p>
            <p className="mt-2 text-sm text-gray-500 animate-bounce">Analisando seu perfil e preferências</p>
          </div>
        )}

        {recommendation && !showAssistant && !loading && (
          <div className="space-y-8 animate-fade-in">
            {/* Descrição do Look */}
            <div className="bg-white rounded-2xl shadow-soft hover-lift p-6 md:p-8 glass border border-purple-100">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  💫 Seu Look Personalizado
                </h2>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowAlternatives(true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 text-sm font-medium"
                  >
                    🔄 Ver Alternativas
                  </button>
                  <button
                    onClick={handleSaveToLookbook}
                    disabled={savingLook}
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg hover:from-pink-600 hover:to-red-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    {savingLook ? '💾 Salvando...' : '💖 Salvar Look'}
                  </button>
                </div>
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg animate-slide-in">{recommendation.descricao}</p>
              </div>
            </div>

            {/* Inspiração de Look estilo Instagram */}
            {recommendation && (
              <div className="animate-slide-in">
                <h3 className="text-2xl font-semibold mb-6 text-gray-800 text-center flex items-center justify-center gap-2">
                  📸 Inspiração de Look
                </h3>
                <div className="flex justify-center">
                  <InstagramLookCard
                    look={{
                      descricao: recommendation.descricao,
                      imagens: recommendation.imagens || [],
                      dicas: recommendation.dicas || [],
                      acessorios: recommendation.acessorios || []
                    }}
                    onSave={handleSaveToLookbook}
                    showSaveButton={true}
                  />
                </div>
              </div>
            )}

            {/* Sistema de Feedback */}
            <div className="animate-slide-in">
              <div className="bg-white rounded-2xl shadow-soft hover-lift p-6 md:p-8 glass border border-purple-100">
                <FeedbackSystem
                  userProfile={{
                    clima: userProfile?.clima || '',
                    ocasiao: userProfile?.ocasiao || '',
                    cores: Array.isArray(userProfile?.cores) ? userProfile.cores.join(', ') : userProfile?.cores || '',
                    estilo: userProfile?.estilo || '',
                    conforto: userProfile?.confortoOusadia || '',
                    personalidade: userProfile?.personalidade || ''
                  }}
                  recommendation={recommendation}
                  onFeedbackSubmitted={(feedback) => {
                    console.log('Feedback recebido:', feedback);
                  }}
                />
              </div>
            </div>

            {/* Alternativas de Looks */}
            {showAlternatives && userProfile && (
              <div className="animate-fade-in">
                <div className="bg-white rounded-2xl shadow-soft hover-lift p-6 md:p-8 glass border border-purple-100">
                  <AlternativesViewer
                    userProfile={userProfile}
                    onSelectAlternative={(alternative) => {
                      setRecommendation({
                        descricao: alternative.descricao,
                        imagens: alternative.imagens,
                        dicas: alternative.dicas,
                        acessorios: alternative.acessorios
                      });
                      setShowAlternatives(false);
                    }}
                    onSaveToLookbook={async (alternative) => {
                      try {
                        const response = await fetch('/api/lookbook', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            look: {
                              descricao: alternative.descricao,
                              imagens: alternative.imagens,
                              dicas: alternative.dicas,
                              acessorios: alternative.acessorios
                            },
                            profile: userProfile
                          })
                        });
                        
                        const result = await response.json();
                        if (result.success) {
                          alert('💖 Alternativa salva no seu lookbook com sucesso!');
                        } else {
                          alert('Erro ao salvar alternativa: ' + result.error);
                        }
                      } catch (error) {
                        console.error('Erro ao salvar alternativa:', error);
                        alert('Erro ao salvar alternativa');
                      }
                    }}
                  />
                </div>
              </div>
            )}

            {/* Seção de dicas e acessórios */}
            {recommendation && (
              <div className="grid md:grid-cols-2 gap-6 animate-slide-in">
                {recommendation.dicas && recommendation.dicas.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-soft hover-lift p-6 glass border border-purple-100">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                      💡 Dicas de Estilo
                    </h3>
                    <ul className="space-y-3">
                      {recommendation.dicas.map((dica, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-600">
                          <span className="text-purple-500 mt-1">•</span>
                          <span>{dica}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {recommendation.acessorios && recommendation.acessorios.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-soft hover-lift p-6 glass border border-purple-100">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                      ✨ Acessórios Sugeridos
                    </h3>
                    <ul className="space-y-3">
                      {recommendation.acessorios.map((acessorio, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-600">
                          <span className="text-purple-500 mt-1">•</span>
                          <span>{acessorio}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
      
      {showLookbook && (
        <Lookbook onClose={() => setShowLookbook(false)} />
      )}
    </div>
  );
}