import React from 'react';

const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-950 to-black">
      {/* Parallax background (pode trocar por vídeo ou imagem fashion) */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-fashion.jpg"
          alt="Fashion Parallax"
          className="w-full h-full object-cover object-center opacity-60 scale-105 parallax-bg"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-transparent" />
      </div>
      {/* Conteúdo principal */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 animate-typing">
          Descubra seu estilo. Reinvente seu guarda-roupa. <span className="text-purple-400">✨</span>
        </h1>
        <button className="mt-4 px-10 py-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-semibold shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-glow">
          Comece Agora
        </button>
        <p className="mt-6 text-lg text-gray-200 max-w-xl mx-auto animate-fade-in">
          Com a assistente <span className="font-bold text-purple-300">Lis</span>, seu visual ganha vida com inteligência artificial e inspiração real.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
// Seção explicativa sobre o site
export const SiteExplanation = () => (
  <section className="relative w-full flex flex-col items-center justify-center py-16 px-6 bg-gradient-to-br from-black/80 via-gray-950/80 to-gray-900/80">
    <div className="max-w-3xl mx-auto text-center rounded-3xl p-8 glassmorphism shadow-xl border border-white/10">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-center justify-center gap-2">✨ Sobre o Site</h2>
      <p className="text-lg text-gray-200 mb-6">Nosso site foi criado para transformar a forma como você se conecta com a moda. 🎨👗</p>
      <ul className="text-base text-gray-300 mb-6 space-y-3 text-left mx-auto max-w-xl">
        <li><b>Quiz de estilo e paleta de cores</b> → descubra quais combinações mais refletem sua personalidade.</li>
        <li><b>Guarda-roupa virtual</b> → organize suas peças, faça upload de fotos e receba sugestões de looks criados pela inteligência artificial.</li>
        <li><b>Assistente de moda Lis</b> → tire dúvidas, receba inspirações personalizadas e converse sobre seu estilo de forma interativa.</li>
        <li><b>Consultoria real</b> → além da IA, conecte-se com profissionais de moda para orientações exclusivas.</li>
      </ul>
      <p className="text-base text-gray-400 mb-2">Nosso objetivo é facilitar sua relação com a moda, deixando seu dia a dia mais prático, criativo e cheio de confiança no que veste.</p>
      <p className="text-base text-gray-400">Aqui, tecnologia encontra autenticidade para você descobrir, reinventar e viver seu estilo. ✨</p>
    </div>
  </section>
);
