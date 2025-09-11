'use client';
import { useState, useEffect } from 'react';


interface LookInspirationViewerProps {
  lookDescription: string;
  userProfile?: {
    ocasiao?: string;
    estilo?: string;
    cores?: string[];
  };
}

interface ImageData {
  images: string[];
  tags: string[];
}

interface ImagesDatabase {
  looks: Record<string, Record<string, ImageData>>;
  pieces: Record<string, Record<string, string[]>>;
  colors: Record<string, string[]>;
  styles: Record<string, string[]>;
}

export default function LookInspirationViewer({ lookDescription, userProfile }: LookInspirationViewerProps) {
  const [inspirationImages, setInspirationImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [extractedKeywords, setExtractedKeywords] = useState<string[]>([]);

  // Sistema de extração de palavras-chave
  const extractKeywords = (text: string): string[] => {
    const keywords: string[] = [];
    const lowercaseText = text.toLowerCase();

    // Palavras-chave para peças de roupa
    const pieces = [
      'vestido', 'blusa', 'camisa', 'camiseta', 't-shirt', 'top',
      'calça', 'jeans', 'legging', 'shorts', 'saia',
      'blazer', 'jaqueta', 'casaco', 'moletom', 'cardigan',
      'sapato', 'tênis', 'sandália', 'salto', 'rasteira', 'bota',
      'bolsa', 'mochila', 'clutch', 'carteira'
    ];

    // Palavras-chave para cores
    const colors = [
      'preto', 'branco', 'cinza', 'nude', 'bege', 'marrom',
      'azul', 'vermelho', 'rosa', 'verde', 'amarelo', 'roxo',
      'laranja', 'dourado', 'prateado'
    ];

    // Palavras-chave para estilos
    const styles = [
      'elegante', 'casual', 'minimalista', 'streetwear', 'boho',
      'moderno', 'clássico', 'romântico', 'rock', 'vintage',
      'esportivo', 'formal', 'despojado'
    ];

    // Palavras-chave para ocasiões
    const occasions = [
      'trabalho', 'festa', 'casamento', 'encontro', 'passeio',
      'shopping', 'academia', 'corrida', 'praia', 'viagem',
      'casa', 'home office', 'balada'
    ];

    // Extrair palavras-chave de cada categoria
    [...pieces, ...colors, ...styles, ...occasions].forEach(keyword => {
      if (lowercaseText.includes(keyword)) {
        keywords.push(keyword);
      }
    });

    // Adicionar palavras-chave do perfil do usuário
    if (userProfile) {
      if (userProfile.ocasiao) keywords.push(userProfile.ocasiao.toLowerCase());
      if (userProfile.estilo) keywords.push(userProfile.estilo.toLowerCase());
      if (userProfile.cores) {
        userProfile.cores.forEach((cor: string) => keywords.push(cor.toLowerCase()));
      }
    }

    return [...new Set(keywords)]; // Remove duplicatas
  };


  // Busca imagens do Pinterest via API interna
  const fetchPinterestImages = async (keywords: string[]): Promise<string[]> => {
    const query = keywords.join(' ');
    try {
      const res = await fetch('/api/pinterest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      // O retorno esperado é { results: [...] }
      interface PinterestResultItem {
        images?: {
          original?: {
            url?: string;
          };
        };
        media?: {
          images?: {
            original?: {
              url?: string;
            };
          };
        };
        link?: string;
      }
      if (Array.isArray(data.results)) {
        // Tenta extrair as URLs das imagens (ajuste conforme o formato retornado pela API)
        return data.results
          .map((item: PinterestResultItem) => item.images?.original?.url || item.media?.images?.original?.url || item.link || '')
          .filter(Boolean)
          .slice(0, 8);
      }
      return [];
    } catch (e) {
      return [];
    }
  };

  useEffect(() => {
    if (lookDescription) {
      setLoading(true);

      // Extrair palavras-chave
      const keywords = extractKeywords(lookDescription);
      setExtractedKeywords(keywords);

      // Buscar imagens do Pinterest
      fetchPinterestImages(keywords).then((images) => {
        setInspirationImages(images);
        setLoading(false);
      });
    }
  }, [lookDescription, userProfile]);

  if (loading) {
    return (
      <div className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 bg-purple-400 rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-4 h-4 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <span className="ml-3 text-gray-600">Buscando inspirações visuais...</span>
        </div>
      </div>
    );
  }

  if (inspirationImages.length === 0) {
    return (
      <div className="mt-8 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl text-center">
        <p className="text-gray-600">✨ Nenhuma inspiração visual encontrada para este look específico.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          ✨ Inspirações Visuais
        </h3>
        <p className="text-gray-600 text-sm">
          Baseado nas palavras-chave: <span className="font-medium text-purple-600">{extractedKeywords.join(', ')}</span>
        </p>
      </div>

      {/* Grid de Imagens estilo Pinterest */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {inspirationImages.map((imageUrl, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white"
            style={{
              aspectRatio: '3/4', // Proporção típica de fotos de moda
            }}
          >
            <img
              src={imageUrl}
              alt={`Inspiração ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
              onError={(e) => {
                // Fallback para imagem padrão em caso de erro
                const target = e.target as HTMLImageElement;
                target.src = '/api/proxy-image/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop&crop=center';
              }}
            />
            
            {/* Overlay com efeito hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-3 left-3 right-3">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                  <p className="text-xs font-medium text-gray-800 truncate">
                    Inspiração {index + 1}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer com dica */}
      <div className="mt-6 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
        <p className="text-sm text-gray-600 text-center">
          💡 <strong>Dica:</strong> Essas inspirações foram selecionadas automaticamente com base na sua sugestão de look. 
          Use-as como referência para montar seu visual!
        </p>
      </div>
    </div>
  );
}