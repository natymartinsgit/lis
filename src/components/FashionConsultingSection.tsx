import React from 'react';

const FashionConsultingSection = () => {
  return (
    <section
      id="consultoria"
      className="relative py-24 px-4 bg-gradient-to-br from-gray-950 via-black to-gray-900 flex flex-col items-center"
    >
      {/* Título da seção */}
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 animate-fade-in">
        Consultoria de Moda
      </h2>

      {/* Blocos */}
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl animate-slide-in">
        {/* Converse com a Lis */}
        <div className="flex-1 bg-white/10 rounded-3xl p-8 shadow-xl glassmorphism flex flex-col items-center">
          <span className="text-4xl mb-2">💬</span>
          <h3 className="text-xl font-semibold text-white mb-2">Converse com a Lis</h3>
          <p className="text-gray-200 text-center mb-4">
            Tire dúvidas de moda, receba inspirações de looks e descubra combinações
            criadas pela sua assistente de moda pessoal.
          </p>
          <button
            className="mt-4 px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-glow"
            onClick={() => {
              // Aqui você conecta com a função que abre o chat da Lis
              alert("Abrindo conversa com a Lis...");
            }}
          >
            Falar com a Lis
          </button>
        </div>

        {/* Consultoria Real */}
        <div className="flex-1 bg-white/10 rounded-3xl p-8 shadow-xl glassmorphism flex flex-col items-center opacity-80">
          <span className="text-4xl mb-2">👩‍💼</span>
          <h3 className="text-xl font-semibold text-white mb-2">
            Consultoria Real com Profissionais
          </h3>
          <p className="text-gray-200 text-center mb-4">
            Em breve você poderá se conectar com especialistas de moda reais e receber
            dicas personalizadas ao vivo.
          </p>
          <button
            disabled
            className="mt-4 px-8 py-3 rounded-full bg-gradient-to-r from-gray-600 to-gray-500 text-white font-semibold shadow-lg cursor-not-allowed opacity-60"
          >
            Em breve
          </button>
        </div>
      </div>
    </section>
  );
};

export default FashionConsultingSection;
