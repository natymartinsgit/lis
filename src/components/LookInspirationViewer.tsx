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
      // Buscar imagens do Pinterest
          <div className="w-4 h-4 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
  }
        </h3>
      // Componente desativado temporariamente. Lógica de busca de inspirações removida por solicitação do usuário.
      return null;