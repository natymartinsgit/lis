import React, { useState } from 'react';
import Image from 'next/image';

interface InstagramLookCardProps {
  look: {
    id?: string;
    descricao: string;
    imagens: string[];
    dicas: string[];
    acessorios: string[];
    title?: string;
  };
  onSave?: () => void;
  onLike?: () => void;
  isLiked?: boolean;
  showSaveButton?: boolean;
}

export default function InstagramLookCard({ 
  look, 
  onSave, 
  onLike, 
  isLiked = false, 
  showSaveButton = true 
}: InstagramLookCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [localLiked, setLocalLiked] = useState(isLiked);

  const handleLike = () => {
    setLocalLiked(!localLiked);
    if (onLike) onLike();
  };

  const nextImage = () => {
    if (look.imagens.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % look.imagens.length);
    }
  };

  const prevImage = () => {
    if (look.imagens.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + look.imagens.length) % look.imagens.length);
    }
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-md mx-auto border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      {/* Header estilo Instagram */}
      <div className="flex items-center p-4 border-b border-gray-100">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">L</span>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="font-semibold text-gray-800 text-sm">lookia_oficial</h3>
          <p className="text-gray-500 text-xs">Inspiração de look</p>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      {/* Imagem principal */}
      <div className="relative aspect-square bg-gray-100">
        {look.imagens && look.imagens.length > 0 ? (
          <>
            <Image
              src={look.imagens[currentImageIndex]}
              alt={`Look inspiração ${currentImageIndex + 1}`}
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-outfit.jpg';
              }}
            />
            
            {/* Indicadores de múltiplas imagens */}
            {look.imagens.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition-all"
                >
                  ‹
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition-all"
                >
                  ›
                </button>
                
                {/* Dots indicator */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {look.imagens.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <p className="text-sm">Sem imagem</p>
            </div>
          </div>
        )}
      </div>

      {/* Ações estilo Instagram */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`transition-colors duration-200 ${
                localLiked ? 'text-red-500' : 'text-gray-700 hover:text-red-500'
              }`}
            >
              <svg className="w-6 h-6" fill={localLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 000-6.364 4.5 4.5 0 00-6.364 0L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button className="text-gray-700 hover:text-gray-900 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
            <button className="text-gray-700 hover:text-gray-900 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          {showSaveButton && (
            <button
              onClick={onSave}
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          )}
        </div>

        {/* Descrição */}
        <div className="mb-3">
          <p className="text-sm text-gray-800">
            <span className="font-semibold">lookia_oficial</span>{' '}
            {showFullDescription ? look.descricao : truncateText(look.descricao)}
            {look.descricao.length > 150 && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-gray-500 ml-1 hover:text-gray-700"
              >
                {showFullDescription ? 'ver menos' : 'ver mais'}
              </button>
            )}
          </p>
        </div>

        {/* Dicas como hashtags */}
        {look.dicas && look.dicas.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {look.dicas.slice(0, 3).map((dica, index) => {
                const hashtag = dica.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '').toLowerCase();
                return (
                  <span key={index} className="text-blue-600 text-sm hover:underline cursor-pointer">
                    #{hashtag.substring(0, 15)}
                  </span>
                );
              })}
              {look.dicas.length > 3 && (
                <span className="text-gray-500 text-sm">+{look.dicas.length - 3} mais</span>
              )}
            </div>
          </div>
        )}

        {/* Acessórios como comentário */}
        {look.acessorios && look.acessorios.length > 0 && (
          <div className="text-sm text-gray-600">
            <span className="font-semibold">lookia_oficial</span> Acessórios que vão completar o look: {look.acessorios.slice(0, 2).join(', ')}
            {look.acessorios.length > 2 && '...'}
          </div>
        )}

        {/* Timestamp */}
        <div className="mt-3 text-xs text-gray-400 uppercase tracking-wide">
          Há algumas horas
        </div>
      </div>
    </div>
  );
}