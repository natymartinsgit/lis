import React from 'react';

const WardrobeSection = () => {
  return (
    <section id="wardrobe" className="relative py-24 px-4 bg-gradient-to-br from-black via-gray-950 to-gray-900 flex flex-col items-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 animate-fade-in">Guarda-Roupa Virtual 👗</h2>
      <p className="text-lg text-gray-300 mb-10 max-w-2xl text-center animate-fade-in">
        Fotografe suas roupas e deixe a IA sugerir combinações perfeitas para cada ocasião.
      </p>
      <button className="px-10 py-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-semibold shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-glow">
        Entrar no Guarda-Roupa Virtual
      </button>
    </section>
  );
};

export default WardrobeSection;
