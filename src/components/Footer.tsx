import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-black/80 text-gray-300 py-10 px-4 border-t border-gray-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start">
          <h2 className="text-2xl font-bold text-white mb-2">Lookia</h2>
          <p className="text-sm text-gray-400 mb-2">Feito com <span className="text-pink-400">❤️</span> para transformar sua forma de se vestir.</p>
          <div className="flex space-x-4 mt-2">
            <a href="#" className="hover:text-purple-400 transition-colors"><i className="fab fa-instagram"></i> Instagram</a>
            <a href="#" className="hover:text-blue-400 transition-colors"><i className="fab fa-twitter"></i> Twitter</a>
            <a href="#" className="hover:text-pink-400 transition-colors"><i className="fab fa-tiktok"></i> TikTok</a>
          </div>
        </div>
        <div className="flex flex-col items-center md:items-end gap-2">
          <a href="#" className="hover:text-purple-400 transition-colors">Sobre</a>
          <a href="#" className="hover:text-purple-400 transition-colors">Blog</a>
          <a href="#" className="hover:text-purple-400 transition-colors">Termos</a>
          <a href="#" className="hover:text-purple-400 transition-colors">Contato</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
