// src/components/AnimatedCursor.js
import React, { useEffect } from 'react';

const AnimatedCursor = () => {
  useEffect(() => {
    // Create a container for the trail elements
    const trailContainer = document.createElement('div');
    trailContainer.className = 'cursor-trail-container';
    document.body.appendChild(trailContainer);

    // Function to create a trail element at the current cursor position
    const createTrail = (x, y) => {
      const trail = document.createElement('div');
      trail.className = 'cursor-trail';
      trail.style.left = `${x}px`;
      trail.style.top = `${y}px`;
      trailContainer.appendChild(trail);

      // Remove the trail after 800ms (matches our animation duration)
      setTimeout(() => {
        trail.remove();
      }, 800);
    };

    // Handler for mousemove events
    const handleMouseMove = (e) => {
      createTrail(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      trailContainer.remove();
    };
  }, []);

  return null;
};

export default AnimatedCursor;
