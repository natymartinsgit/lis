'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import InstagramLookCard from './InstagramLookCard';

interface SavedLook {
  id: string;
  descricao: string;
  imagens: string[];
  dicas: string[];
  acessorios: string[];
  profile: {
    clima?: string;
    ocasiao?: string;
    cores?: string;
    estilo?: string;
    conforto?: string;
    personalidade?: string;
  };
  createdAt: string;
  isFavorite: boolean;
}

interface LookbookProps {
  onClose: () => void;
}

export default function Lookbook({ onClose }: LookbookProps) {
  const [looks, setLooks] = useState<SavedLook[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedLook, setSelectedLook] = useState<SavedLook | null>(null);

  useEffect(() => {
    fetchLooks();
  }, [showFavoritesOnly]);

  const fetchLooks = async () => {
    try {
      setLoading(true);
      const url = showFavoritesOnly 
        ? '/api/lookbook?favorites=true' 
        : '/api/lookbook';
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setLooks(data.looks);
      }
    } catch (error) {
      console.error('Erro ao carregar lookbook:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (lookId: string, currentFavorite: boolean) => {
    try {
      const response = await fetch('/api/lookbook', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: lookId,
          action: 'favorite',
          data: { isFavorite: !currentFavorite }
        })
      });
      
      const result = await response.json();
      if (result.success) {
        fetchLooks(); // Recarregar a lista
      }
    } catch (error) {
      console.error('Erro ao favoritar look:', error);
    }
  };

  const deleteLook = async (lookId: string) => {
    if (!confirm('Tem certeza que deseja remover este look do seu lookbook?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/lookbook?id=${lookId}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      if (result.success) {
        fetchLooks(); // Recarregar a lista
        setSelectedLook(null);
      }
    } catch (error) {
      console.error('Erro ao remover look:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">💖 Meu Lookbook</h2>
              <p className="text-pink-100">Seus looks favoritos em um só lugar!</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-pink-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          
          {/* Filtros */}
          <div className="mt-4 flex gap-4">
            <button
              onClick={() => setShowFavoritesOnly(false)}
              className={`px-4 py-2 rounded-full transition-colors ${
                !showFavoritesOnly 
                  ? 'bg-white text-pink-600' 
                  : 'bg-pink-400 text-white hover:bg-pink-300'
              }`}
            >
              Todos ({looks.length})
            </button>
            <button
              onClick={() => setShowFavoritesOnly(true)}
              className={`px-4 py-2 rounded-full transition-colors ${
                showFavoritesOnly 
                  ? 'bg-white text-pink-600' 
                  : 'bg-pink-400 text-white hover:bg-pink-300'
              }`}
            >
              ⭐ Favoritos
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando seus looks...</p>
            </div>
          ) : looks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👗</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {showFavoritesOnly ? 'Nenhum look favoritado ainda' : 'Seu lookbook está vazio'}
              </h3>
              <p className="text-gray-500">
                {showFavoritesOnly 
                  ? 'Favorite alguns looks para vê-los aqui!' 
                  : 'Comece criando looks com a Lookia para salvá-los aqui!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {looks.map((look) => (
                <div key={look.id} className="flex justify-center">
                  <InstagramLookCard
                    look={{
                      id: look.id,
                      descricao: look.descricao,
                      imagens: look.imagens || [],
                      dicas: look.dicas || [],
                      acessorios: look.acessorios || []
                    }}
                    isLiked={look.isFavorite}
                    onLike={() => toggleFavorite(look.id, look.isFavorite)}
                    showSaveButton={false}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Modal de detalhes */}
      {selectedLook && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">Detalhes do Look</h3>
                <button
                  onClick={() => setSelectedLook(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Descrição:</h4>
                  <p className="text-gray-600">{selectedLook.descricao}</p>
                </div>
                
                {selectedLook.dicas.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Dicas:</h4>
                    <ul className="space-y-1">
                      {selectedLook.dicas.map((dica, index) => (
                        <li key={index} className="text-gray-600 text-sm">• {dica}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {selectedLook.acessorios.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Acessórios:</h4>
                    <ul className="space-y-1">
                      {selectedLook.acessorios.map((acessorio, index) => (
                        <li key={index} className="text-gray-600 text-sm">• {acessorio}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {selectedLook.imagens.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Imagens:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedLook.imagens.map((img, index) => (
                        <div key={index} className="relative h-32 bg-gray-200 rounded-lg overflow-hidden">
                          <Image
                            src={img}
                            alt={`Look ${index + 1}`}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}