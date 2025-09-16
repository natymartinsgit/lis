import React, { useState } from 'react';
import { FaCommentDots } from 'react-icons/fa';

const FloatingLisChat = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Botão flutuante */}
      <button
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-xl p-5 flex items-center gap-2 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-glow"
        onClick={() => setOpen((v) => !v)}
        aria-label="Converse com a Lis"
      >
        <FaCommentDots className="text-2xl" />
        <span className="hidden md:inline font-semibold">Converse com a Lis 👗</span>
      </button>

      {/* Janela do chat */}
      {open && (
        <div className="fixed bottom-24 right-8 z-50 w-[350px] max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-purple-200 flex flex-col animate-fade-in">
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-2xl">
            <span className="text-white font-bold">Assistente Lis</span>
            <button onClick={() => setOpen(false)} className="text-white text-xl font-bold">×</button>
          </div>
          <div className="p-4 flex-1 overflow-y-auto" style={{ minHeight: 200 }}>
            <p className="text-gray-700 text-center">Chat da Lis em breve aqui! 😉</p>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingLisChat;
