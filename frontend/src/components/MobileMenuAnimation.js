// src/components/MobilePhoneAnimation.js
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

const MobilePhoneAnimation = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer, camera, scene, phoneMesh, screenMesh, buttonMesh, cameraMesh; // Keep track of objects
    let animationFrameId; // Store animation frame request id

    const init = () => {
        const width = container.clientWidth;
        const height = container.clientHeight;

        if (width === 0 || height === 0) return; // Don't init if no size

        scene = new THREE.Scene();
        // Set transparent background
        
        // Adjust camera for potentially smaller aspect ratio
        camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.z = 3.5;

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);

        while (container.firstChild) { // Clear previous canvas if any
            container.removeChild(container.firstChild);
        }
        container.appendChild(renderer.domElement);

        // Create ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        // Create directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);

        // Phone shape
        const phoneShape = new THREE.Shape();
        const phoneWidth = 1; 
        const phoneHeight = 2; 
        const cornerRadius = 0.15;
        phoneShape.moveTo(-phoneWidth/2 + cornerRadius, -phoneHeight/2);
        phoneShape.lineTo(phoneWidth/2 - cornerRadius, -phoneHeight/2);
        phoneShape.quadraticCurveTo(phoneWidth/2, -phoneHeight/2, phoneWidth/2, -phoneHeight/2 + cornerRadius);
        phoneShape.lineTo(phoneWidth/2, phoneHeight/2 - cornerRadius);
        phoneShape.quadraticCurveTo(phoneWidth/2, phoneHeight/2, phoneWidth/2 - cornerRadius, phoneHeight/2);
        phoneShape.lineTo(-phoneWidth/2 + cornerRadius, phoneHeight/2);
        phoneShape.quadraticCurveTo(-phoneWidth/2, phoneHeight/2, -phoneWidth/2, phoneHeight/2 - cornerRadius);
        phoneShape.lineTo(-phoneWidth/2, -phoneHeight/2 + cornerRadius);
        phoneShape.quadraticCurveTo(-phoneWidth/2, -phoneHeight/2, -phoneWidth/2 + cornerRadius, -phoneHeight/2);

        const extrudeSettings = { depth: 0.1, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.02, bevelSegments: 3 };
        const geometry = new THREE.ExtrudeGeometry(phoneShape, extrudeSettings);
        geometry.center();

        // Blue wireframe material
        const phoneMaterial = new THREE.MeshBasicMaterial({ 
          color: 0x2563eb, // Blue color
          wireframe: true,
          transparent: true,
          opacity: 0.8
        });
        
        phoneMesh = new THREE.Mesh(geometry, phoneMaterial);
        scene.add(phoneMesh);

        // Add screen
        const screenGeometry = new THREE.PlaneGeometry(phoneWidth * 0.85, phoneHeight * 0.7);
        const screenMaterial = new THREE.MeshBasicMaterial({ 
          color: 0x3b82f6, // Lighter blue
          transparent: true,
          opacity: 0.2,
          side: THREE.DoubleSide
        });
        screenMesh = new THREE.Mesh(screenGeometry, screenMaterial);
        screenMesh.position.z = 0.06; // Slightly in front of the phone
        scene.add(screenMesh);

        // Add home button
        const buttonGeometry = new THREE.CircleGeometry(0.12, 32);
        const buttonMaterial = new THREE.MeshBasicMaterial({ 
          color: 0x3b82f6, 
          transparent: true,
          opacity: 0.5
        });
        buttonMesh = new THREE.Mesh(buttonGeometry, buttonMaterial);
        buttonMesh.position.set(0, -phoneHeight/2 + 0.3, 0.06);
        scene.add(buttonMesh);

        // Add camera
        const cameraGeometry = new THREE.CircleGeometry(0.08, 32);
        const cameraMaterial = new THREE.MeshBasicMaterial({ 
          color: 0x1e40af, // Darker blue
          transparent: true,
          opacity: 0.7
        });
        cameraMesh = new THREE.Mesh(cameraGeometry, cameraMaterial);
        cameraMesh.position.set(0, phoneHeight/2 - 0.2, 0.06);
        scene.add(cameraMesh);

        // Initial animation with GSAP
        gsap.from(phoneMesh.rotation, {
          x: -Math.PI,
          y: -Math.PI,
          duration: 1.5,
          ease: "power2.out"
        });

        gsap.from(phoneMesh.position, {
          z: -5,
          duration: 1.2,
          ease: "back.out(1.7)"
        });

        // Pulsing animation for screen
        gsap.to(screenMaterial, {
          opacity: 0.5,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });

        animate();
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (phoneMesh && renderer && scene && camera) {
          // Smooth floating rotation
          phoneMesh.rotation.y += 0.008;
          phoneMesh.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
          
          // Screen and other elements follow the phone
          if (screenMesh) {
            screenMesh.rotation.copy(phoneMesh.rotation);
          }
          if (buttonMesh) {
            buttonMesh.rotation.copy(phoneMesh.rotation);
          }
          if (cameraMesh) {
            cameraMesh.rotation.copy(phoneMesh.rotation);
          }
          
          renderer.render(scene, camera);
      }
    };

    // Use ResizeObserver for better resize handling
    const resizeObserver = new ResizeObserver(entries => {
        if (!entries || entries.length === 0) return;
        if (!renderer || !camera || !container) return;

        const { width, height } = entries[0].contentRect;

        if (width > 0 && height > 0) {
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }
    });

    if (container) {
        resizeObserver.observe(container);
        init(); // Initialize after observing
    }

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      if (renderer) {
          if (container && container.contains(renderer.domElement)) {
              container.removeChild(renderer.domElement);
          }
          renderer.dispose();
      }
      // Clean up all meshes
      phoneMesh?.geometry?.dispose();
      phoneMesh?.material?.dispose();
      screenMesh?.geometry?.dispose();
      screenMesh?.material?.dispose();
      buttonMesh?.geometry?.dispose();
      buttonMesh?.material?.dispose();
      cameraMesh?.geometry?.dispose();
      cameraMesh?.material?.dispose();
      
      scene = null; camera = null; renderer = null; 
      phoneMesh = null; screenMesh = null; buttonMesh = null; cameraMesh = null;
    };
  }, []); // Empty dependency array

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        overflow: 'hidden',
        background: 'transparent',
      }}
    />
  );
};

export default MobilePhoneAnimation;