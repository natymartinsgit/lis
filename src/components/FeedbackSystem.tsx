'use client';

import React, { useState } from 'react';

interface FeedbackSystemProps {
  userProfile: {
    clima?: string;
    ocasiao?: string;
    cores?: string;
    estilo?: string;
    conforto?: string;
    personalidade?: string;
  };
  recommendation: {
    descricao: string;
    imagens: string[];
    dicas: string[];
    acessorios: string[];
  };
  lookId?: string;
  onFeedbackSubmitted?: (feedback: 'like' | 'dislike') => void;
}

export default function FeedbackSystem({ 
  userProfile, 
  recommendation, 
  lookId, 
  onFeedbackSubmitted 
}: FeedbackSystemProps) {
  const [selectedFeedback, setSelectedFeedback] = useState<'like' | 'dislike' | null>(null);
  const [showDetailedFeedback, setShowDetailedFeedback] = useState(false);
  const [reason, setReason] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleQuickFeedback = async (feedback: 'like' | 'dislike') => {
    setSelectedFeedback(feedback);
    
    if (feedback === 'like') {
      // Para feedback positivo, enviar imediatamente
      await submitFeedback(feedback);
    } else {
      // Para feedback negativo, mostrar opções detalhadas
      setShowDetailedFeedback(true);
    }
  };

  const submitFeedback = async (feedbackType: 'like' | 'dislike', detailedReason?: string, detailedSuggestions?: string) => {
    setSubmitting(true);
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfile,
          recommendation,
          feedback: feedbackType,
          reason: detailedReason || reason,
          suggestions: detailedSuggestions || suggestions,
          lookId
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSubmitted(true);
        setShowDetailedFeedback(false);
        onFeedbackSubmitted?.(feedbackType);
        
        // Mostrar mensagem de sucesso por alguns segundos
        setTimeout(() => {
          setSubmitted(false);
          setSelectedFeedback(null);
          setReason('');
          setSuggestions('');
        }, 3000);
      } else {
        alert('Erro ao enviar feedback: ' + result.error);
      }
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
      alert('Erro ao enviar feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDetailedSubmit = () => {
    if (selectedFeedback) {
      submitFeedback(selectedFeedback, reason, suggestions);
    }
  };

  const reasonOptions = [
    'Não combina com meu estilo',
    'Cores não são adequadas',
    'Não é apropriado para a ocasião',
    'Muito formal/informal',
    'Não gosto dos acessórios sugeridos',
    'Não é confortável',
    'Outro motivo'
  ];

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="text-4xl mb-3">✨</div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Obrigada pelo seu feedback!
        </h3>
        <p className="text-green-600 text-sm">
          Suas opiniões me ajudam a criar looks ainda melhores para você! 💖
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent flex items-center gap-3">
        💭 O que achou do look?
      </h3>
      
      {!showDetailedFeedback ? (
        <div className="space-y-4">
          <p className="text-gray-600 text-sm mb-4">
            Seu feedback me ajuda a aprender e criar sugestões ainda melhores!
          </p>
          
          <div className="flex justify-center gap-6 animate-slide-in">
            <button
              onClick={() => handleQuickFeedback('like')}
              disabled={submitting}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover-lift shadow-soft transform hover:scale-105 ${
                selectedFeedback === 'like'
                  ? 'gradient-accent text-white shadow-medium'
                  : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-700 border-2 border-gray-200 hover:border-green-300'
              } disabled:opacity-50`}
            >
              <span className="text-2xl">👍</span> Adorei!
            </button>
            
            <button
              onClick={() => handleQuickFeedback('dislike')}
              disabled={submitting}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover-lift shadow-soft transform hover:scale-105 ${
                selectedFeedback === 'dislike'
                  ? 'gradient-secondary text-white shadow-medium'
                  : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-700 border-2 border-gray-200 hover:border-red-300'
              } disabled:opacity-50`}
            >
              <span className="text-2xl">👎</span> Não gostei
            </button>
          </div>
          
          {submitting && (
            <div className="text-center py-2">
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
              <span className="ml-2 text-sm text-gray-600">Enviando feedback...</span>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-800 mb-3">
              Nos ajude a melhorar! O que não funcionou?
            </h4>
            
            <div className="space-y-3 mb-6 animate-fade-in">
              {reasonOptions.map((option, index) => (
                <label key={index} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-red-50 transition-all duration-300">
                  <input
                    type="radio"
                    name="reason"
                    value={option}
                    checked={reason === option}
                    onChange={(e) => setReason(e.target.value)}
                    className="text-red-500 focus:ring-red-500 w-4 h-4"
                  />
                  <span className="text-lg font-medium text-gray-700">{option}</span>
                </label>
              ))}
            </div>
            
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                Sugestões para melhorar (opcional):
              </label>
              <textarea
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
                placeholder="Como posso criar um look melhor para você?"
                className="w-full p-4 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 resize-none text-lg shadow-soft"
                rows={4}
              />
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={handleDetailedSubmit}
                disabled={!reason || submitting}
                className="flex-1 gradient-primary text-white py-4 px-6 rounded-2xl font-bold text-lg hover-lift shadow-soft transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {submitting ? '📤 Enviando...' : '📤 Enviar Feedback'}
              </button>
              <button
                onClick={() => {
                  setShowDetailedFeedback(false);
                  setSelectedFeedback(null);
                  setReason('');
                  setSuggestions('');
                }}
                className="px-6 py-4 bg-gray-200 text-gray-700 rounded-2xl font-bold text-lg hover:bg-gray-300 transition-all duration-300 shadow-soft hover-lift transform hover:scale-105"
              >
                ❌ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          💡 Seus feedbacks são anônimos e usados apenas para melhorar as sugestões
        </p>
      </div>
    </div>
  );
}