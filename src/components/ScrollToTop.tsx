'use client';

import { useEffect } from 'react';

const ScrollToTop = () => {
  useEffect(() => {
    // Scroll para o topo imediatamente quando o componente é montado
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    
    // Também garantir que sempre inicie no topo em navegação
    const handleRouteChange = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    };
    
    // Listener para mudanças de rota (se houver)
    window.addEventListener('popstate', handleRouteChange);
    
    // Garantir scroll no topo quando a página carrega completamente
    const handleLoad = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    };
    
    window.addEventListener('load', handleLoad);
    
    // Cleanup
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return null; // Este componente não renderiza nada visível
};

export default ScrollToTop;