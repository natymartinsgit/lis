'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import InstagramLookCard from './InstagramLookCard';
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

interface AlternativesResponse {
  success: boolean;
  message: string;
  alternatives: StyleRecommendation[];
  total: number;
}

interface AlternativesViewerProps {
  userProfile: UserProfile;
  onSelectAlternative?: (alternative: StyleRecommendation) => void;
  onSaveToLookbook?: (alternative: StyleRecommendation) => void;
}

const AlternativesViewer: React.FC<AlternativesViewerProps> = ({
  userProfile,
  onSelectAlternative,
  onSaveToLookbook
}) => {
  const [alternatives, setAlternatives] = useState<StyleRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAlternative, setSelectedAlternative] = useState<StyleRecommendation | null>(null);
  const [showModal, setShowModal] = useState(false);

  const generateAlternatives = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/alternatives', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profile: userProfile }),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar alternativas');
      }

      const data: AlternativesResponse = await response.json();
      setAlternatives(data.alternatives);
    } catch (err) {
      setError('Erro ao gerar alternativas. Tente novamente.');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (alternative: StyleRecommendation) => {
    setSelectedAlternative(alternative);
    setShowModal(true);
  };

  const handleSelectAlternative = (alternative: StyleRecommendation) => {
    if (onSelectAlternative) {
      onSelectAlternative(alternative);
    }
    setShowModal(false);
  };

  const handleSaveToLookbook = async (alternative: StyleRecommendation) => {
    if (onSaveToLookbook) {
      onSaveToLookbook(alternative);
    }
  };

  return (
    <div className="alternatives-viewer bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">🎨 Alternativas de Looks</h2>
        <p className="text-gray-600">Descubra diferentes variações do seu estilo!</p>
      </div>

      {alternatives.length === 0 && (
        <div className="text-center">
          <button
            onClick={generateAlternatives}
            disabled={loading}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Gerando alternativas...
              </span>
            ) : (
              '✨ Gerar Alternativas'
            )}
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {alternatives.length > 0 && (
        <div className="space-y-6">
          <div className="text-center">
            <button
              onClick={generateAlternatives}
              disabled={loading}
              className="bg-gray-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-600 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Gerando...' : '🔄 Gerar Novas Alternativas'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {alternatives.map((alternative, index) => (
              <div key={alternative.id} className="flex justify-center">
                <InstagramLookCard
                  look={{
                    id: `alt-${index}`,
                    descricao: alternative.descricao,
                    imagens: alternative.imagens || [],
                    dicas: alternative.dicas || [],
                    acessorios: alternative.acessorios || [],
                    title: alternative.title
                  }}
                  onSave={() => handleSaveToLookbook(alternative)}
                  showSaveButton={true}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Detalhes */}
      {showModal && selectedAlternative && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{selectedAlternative.title}</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {selectedAlternative.imagens.slice(0, 4).map((img, index) => (
                      <div key={index} className="relative h-32 rounded-lg overflow-hidden">
                        <Image
                          src={img}
                          alt={`Look ${index + 1}`}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-outfit.jpg';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-800 mb-2">💖 Descrição</h3>
                    <p className="text-gray-600">{selectedAlternative.descricao}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-800 mb-2">💡 Dicas</h3>
                    <ul className="space-y-1">
                      {selectedAlternative.dicas.map((dica, index) => (
                        <li key={index} className="text-sm text-gray-600">{dica}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-2">👜 Acessórios</h3>
                    <ul className="space-y-1">
                      {selectedAlternative.acessorios.map((acessorio, index) => (
                        <li key={index} className="text-sm text-gray-600">{acessorio}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleSelectAlternative(selectedAlternative)}
                      className="flex-1 bg-purple-500 text-white py-3 px-4 rounded-full font-semibold hover:bg-purple-600 transition-colors duration-300"
                    >
                      ✨ Usar Este Look
                    </button>
                    
                    <button
                      onClick={() => handleSaveToLookbook(selectedAlternative)}
                      className="flex-1 bg-green-500 text-white py-3 px-4 rounded-full font-semibold hover:bg-green-600 transition-colors duration-300"
                    >
                      💾 Salvar no Lookbook
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlternativesViewer;