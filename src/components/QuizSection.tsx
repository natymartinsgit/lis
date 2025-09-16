import React from 'react';

const quizOptions = [
  {
    title: 'Descubra sua paleta',
    color: 'bg-blue-400',
    emoji: '🎨',
    description: 'Veja quais cores combinam mais com você e monte sua paleta personalizada.'
  },
  {
    title: 'Descubra seu estilo',
    color: 'bg-pink-500',
    emoji: '�',
    description: 'Descubra qual estilo de moda mais combina com sua personalidade.'
  },
];

const QuizSection = () => {
  return (
    <section id="quiz" className="relative py-24 px-4 bg-gradient-to-br from-gray-950 via-gray-900 to-black flex flex-col items-center">
  <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 animate-fade-in">Descubra sua paleta e descubra seu estilo</h2>
  <p className="text-lg text-gray-300 mb-10 max-w-2xl text-center animate-fade-in">Escolha abaixo o que você gostaria de fazer:</p>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-2xl animate-slide-in">
        {quizOptions.map((option, idx) => (
          <div
            key={option.title}
            className={`rounded-3xl p-8 flex flex-col items-center shadow-xl cursor-pointer transform hover:scale-105 transition-all duration-300 ${option.color} bg-opacity-80 glassmorphism`}
          >
            <span className="text-5xl mb-4 animate-pop">{option.emoji}</span>
            <h3 className="text-xl font-semibold text-white mb-2">{option.title}</h3>
            <p className="text-gray-100 text-center text-base mb-2">{option.description}</p>
            <button className="mt-4 px-6 py-2 rounded-full bg-white/20 text-white font-medium border border-white/30 hover:bg-white/40 transition-all duration-200 animate-glow">
              {idx === 0 ? 'Descobrir minha paleta' : 'Descobrir meu estilo'}
            </button>
          </div>
        ))}
      </div>
      {/* Botão removido conforme solicitado */}
    </section>
  );
};

export default QuizSection;
