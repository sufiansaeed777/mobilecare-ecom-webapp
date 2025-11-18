import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Force scroll to top with immediate behavior
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
    
    // Fallback for older browsers
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
}

export default ScrollToTop;