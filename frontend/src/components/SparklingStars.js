// src/components/SparklingStars.js
import React, { useMemo, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

function SparklingStars({ seed }) {
  const containerRef = useRef(null);
  const starsRef = useRef([]);

  // Star configuration - blue theme color palette
  const blueColors = [
    'rgba(59, 130, 246, 0.9)',  // #3b82f6 - Medium blue
    'rgba(96, 165, 250, 0.9)',  // #60a5fa - Lighter blue
    'rgba(147, 197, 253, 0.8)', // #93c5fd - Very light blue
    'rgba(30, 64, 175, 0.7)',   // #1e40af - Dark blue
    'rgba(37, 99, 235, 0.8)'    // #2563eb - Royal blue
  ];

  // Create stars with different sizes, colors, and animations
  const stars = useMemo(() => {
    const count = 35; // Increased count for more stars
    return Array.from({ length: count }, () => ({
      size: Math.random() * 3 + 1, // 1-4px
      baseOpacity: Math.random() * 0.4 + 0.4, // 0.4-0.8
      animationDuration: Math.random() * 4 + 3, // 3-7 seconds
      color: blueColors[Math.floor(Math.random() * blueColors.length)],
      blurAmount: Math.random() * 1.5 + 0.5, // 0.5-2px blur
      pulse: Math.random() > 0.5, // Some stars pulse, some move
      scale: Math.random() * 0.5 + 0.8, // Scale factor for pulsing
      trail: Math.random() > 0.7, // Some stars leave trails
    }));
  }, [seed]);

  const animateStar = (starElement, starConfig) => {
    const master = gsap.timeline({ repeat: -1 });
    
    // Initial setup
    gsap.set(starElement, {
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      opacity: 0,
      scale: starConfig.pulse ? starConfig.scale : 1
    });

    // Fade in first
    const fadeIn = gsap.to(starElement, {
      opacity: starConfig.baseOpacity,
      duration: 0.8,
      ease: "sine.inOut"
    });
    
    master.add(fadeIn);

    // Create different animation types
    if (starConfig.pulse) {
      // Pulsing animation
      const pulse = gsap.timeline({ repeat: 2, yoyo: true });
      pulse.to(starElement, {
        scale: 1.5,
        opacity: starConfig.baseOpacity * 1.2,
        duration: starConfig.animationDuration / 6,
        ease: "sine.inOut"
      });
      
      master.add(pulse);
    } else {
      // Movement animation
      const move = gsap.timeline();
      move.to(starElement, {
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        duration: starConfig.animationDuration * 0.8,
        ease: "none"
      });
      
      master.add(move);
    }
    
    // Fade out at the end
    const fadeOut = gsap.to(starElement, {
      opacity: 0,
      duration: 0.8,
      ease: "sine.inOut"
    });
    
    master.add(fadeOut);
    
    // Add delay before next cycle
    master.to({}, { duration: Math.random() * 2 });
    
    return master;
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Clear any existing animations
      gsap.killTweensOf(starsRef.current);
      
      // Initialize each star with random position and animation
      starsRef.current.forEach((starElement, index) => {
        if (!starElement) return;
        
        const tl = animateStar(starElement, stars[index]);
        tl.progress(Math.random()); // Random start position in the timeline
      });
    }, containerRef);

    return () => ctx.revert();
  }, [stars, seed]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden'
      }}
    >
      {stars.map((star, i) => (
        <div
          key={`star-${i}-${seed}`} // Added seed to key for proper re-rendering
          ref={el => starsRef.current[i] = el}
          className="star"
          style={{
            position: 'absolute',
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color,
            borderRadius: '50%',
            filter: `blur(${star.blurAmount}px)`,
            boxShadow: star.trail ? `0 0 6px ${star.color.replace(/[^,]+(?=\))/, '0.6')}` : 'none',
            willChange: 'transform, opacity, top, left',
            transform: 'translate3d(0,0,0)', // Hardware acceleration
            opacity: 0 // Start invisible
          }}
        />
      ))}
      
      {/* Add a few glowing orbs for additional effect */}
      {[1, 2, 3].map((_, i) => (
        <div
          key={`orb-${i}-${seed}`}
          ref={el => {
            // Add animation for the orbs
            if (el) {
              gsap.set(el, {
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.1
              });
              
              gsap.to(el, {
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.2,
                duration: 15 + i * 5,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true
              });
            }
          }}
          style={{
            position: 'absolute',
            width: `${30 + i * 10}px`,
            height: `${30 + i * 10}px`,
            backgroundColor: 'transparent',
            borderRadius: '50%',
            boxShadow: `0 0 20px 5px rgba(59, 130, 246, 0.2)`,
            filter: 'blur(8px)',
            opacity: 0
          }}
        />
      ))}
    </div>
  );
}

export default SparklingStars;