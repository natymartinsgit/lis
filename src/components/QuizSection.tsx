'use client';
import React, { useState } from 'react';
import ColorPaletteQuiz from './ColorPaletteQuiz';
import StyleQuiz from './StyleQuiz';

const QuizSection = () => {
  const [showColorQuiz, setShowColorQuiz] = useState(false);
  const [showStyleQuiz, setShowStyleQuiz] = useState(false);

  const handleColorQuizClick = () => {
    setShowColorQuiz(true);
  };

  const handleStyleQuizClick = () => {
    setShowStyleQuiz(true);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            DESCUBRA SEU <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">ESTILO</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Encontre sua paleta de cores ideal e descubra seu estilo pessoal através dos nossos quizzes personalizados
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto mb-16">
          {/* Quiz de Paleta de Cores */}
          <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center mb-6 mx-auto">
              <span className="text-3xl">🎨</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Quiz de Paleta de Cores</h3>
            <p className="text-gray-600 text-center mb-6 leading-relaxed">
              Descubra quais cores mais combinam com sua personalidade e estilo de vida. 
              Receba uma paleta personalizada com dicas de como usar cada cor.
            </p>
            <button 
              onClick={handleColorQuizClick}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-full hover:from-pink-600 hover:to-purple-600 transition-colors font-semibold text-lg"
            >
              Descobrir Minha Paleta
            </button>
          </div>

          {/* Quiz de Estilo */}
          <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-teal-400 rounded-full flex items-center justify-center mb-6 mx-auto">
              <span className="text-3xl">👗</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Quiz de Estilo Pessoal</h3>
            <p className="text-gray-600 text-center mb-6 leading-relaxed">
              Identifique seu estilo único e receba dicas personalizadas sobre peças-chave, 
              combinações e como expressar sua personalidade através da moda.
            </p>
            <button 
              onClick={handleStyleQuizClick}
              className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-4 rounded-full hover:from-blue-600 hover:to-teal-600 transition-colors font-semibold text-lg"
            >
              Descobrir Meu Estilo
            </button>
          </div>
        </div>

        {/* Seção de Inspiração */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-red-400 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-xl">🌸</span>
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2 text-center">Romântico</h4>
            <p className="text-gray-600 text-center text-sm">Tons suaves e delicados</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-xl">💼</span>
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2 text-center">Profissional</h4>
            <p className="text-gray-600 text-center text-sm">Elegância corporativa</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-400 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-xl">🌿</span>
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2 text-center">Natural</h4>
            <p className="text-gray-600 text-center text-sm">Tons terrosos e orgânicos</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-xl">✨</span>
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2 text-center">Vibrante</h4>
            <p className="text-gray-600 text-center text-sm">Cores intensas e marcantes</p>
          </div>
        </div>
      </div>

      {/* Modais dos Quizzes */}
      {showColorQuiz && (
        <ColorPaletteQuiz onClose={() => setShowColorQuiz(false)} />
      )}
      
      {showStyleQuiz && (
        <StyleQuiz onClose={() => setShowStyleQuiz(false)} />
      )}
    </section>
  );
};

export default QuizSection;
