// utils/capabilities.js
export const canUseWebGL = (() => {
    if (typeof window === 'undefined') return false;   // SSR / build
    try {
      const canvas = document.createElement('canvas');
      return !!(
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl')
      );
    } catch {
      return false;
    }
  })();
  