// src/components/AnimatedBackgroundContact.js
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const AnimatedBackgroundContact = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // ... (setup code: container, renderer, camera, scene variables) ...
    let renderer, camera, scene, torusKnot, particles;
    let animationFrameId;

    const init = () => {
      const container = mountRef.current; // Define container inside init
      if (!container) return; // Check container again just in case

      const width = container.clientWidth;
      const height = container.clientHeight;
      if (height === 0 || width === 0) return; // Check dimensions

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
      camera.position.z = 5; // Keep camera position for now

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);

      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      container.appendChild(renderer.domElement);

      // --- MODIFIED Torus knot Geometry ---
      // Reduced radius from 1.5 to 1.2 and tube from 0.5 to 0.4
      const geometry = new THREE.TorusKnotGeometry(1.2, 0.4, 100, 16);
      // ------------------------------------

      const material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
      torusKnot = new THREE.Mesh(geometry, material);
      scene.add(torusKnot);

      // Particle system (remains the same)
      const particleCount = 1000;
      const particlesGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      }
      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particlesMaterial = new THREE.PointsMaterial({
        color: 0x000000, size: 0.05, sizeAttenuation: true,
        transparent: true, opacity: 0.6
      });
      particles = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particles);

      animate();
    };

    const animate = () => {
      // ... (animate function as before) ...
      animationFrameId = requestAnimationFrame(animate);
      if (torusKnot && particles && renderer && scene && camera) {
          torusKnot.rotation.x += 0.005;
          torusKnot.rotation.y += 0.005;
          particles.rotation.y += 0.001;
          renderer.render(scene, camera);
      }
    };

    // Use ResizeObserver (recommended)
     const resizeObserver = new ResizeObserver(entries => {
        if (!entries || entries.length === 0) return;
        const container = mountRef.current; // Re-get container reference
        if (!renderer || !camera || !container) return;

        const { width, height } = entries[0].contentRect;

        if (width > 0 && height > 0) {
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }
    });

    if (mountRef.current) { // Ensure mountRef.current exists before observing and initializing
        resizeObserver.observe(mountRef.current);
        init(); // Call init after observing
    }

    // Cleanup function
    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
       const container = mountRef.current; // Need reference for cleanup
      if (renderer) {
        if (container && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }
      torusKnot?.geometry?.dispose();
      torusKnot?.material?.dispose();
      particles?.geometry?.dispose();
      particles?.material?.dispose();
       scene = null; camera = null; renderer = null; torusKnot = null; particles = null; // Help GC
    };
  }, []); // Empty dependency array

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative', // Changed back to relative
        // If you want it absolutely positioned within its flex container parent:
        // position: 'absolute', top: 0, left: 0,
      }}
    />
  );
};

export default AnimatedBackgroundContact;