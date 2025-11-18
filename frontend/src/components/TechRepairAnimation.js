// src/components/TechRepairAnimation.js
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const TechRepairAnimation = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    let renderer, camera, scene, phoneGroup, particles, dataStreams;
    let animationFrameId;
    let mouseX = 0, mouseY = 0;

    const init = () => {
      const container = mountRef.current;
      if (!container) return;

      const width = container.clientWidth;
      const height = container.clientHeight;
      if (height === 0 || width === 0) return;

      // Scene setup
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
      camera.position.z = 15;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0x000000, 0); // Transparent background

      container.appendChild(renderer.domElement);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 10, 7.5);
      scene.add(directionalLight);

      createPhone();
      createParticles();
      createDataStreams();

      container.addEventListener('mousemove', onMouseMove, false);
      window.addEventListener('resize', onWindowResize, false);

      animate();
    };

    const createPhone = () => {
      phoneGroup = new THREE.Group();

      // Phone body
      const bodyGeometry = new THREE.BoxGeometry(4, 7.5, 0.5);
      const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x333333,
        metalness: 0.6,
        roughness: 0.4 
      });
      const phoneBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
      phoneGroup.add(phoneBody);

      // Phone screen with animated glow
      const screenGeometry = new THREE.PlaneGeometry(3.6, 7.1);
      const screenMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        emissive: 0x99ccff, // Light blue glow
        emissiveIntensity: 0.5,
        metalness: 0.2,
        roughness: 0.8,
      });
      const phoneScreen = new THREE.Mesh(screenGeometry, screenMaterial);
      phoneScreen.position.z = 0.251;
      phoneScreen.userData.material = screenMaterial; // For animation
      phoneGroup.add(phoneScreen);

      scene.add(phoneGroup);
    };

    const createParticles = () => {
      const particleCount = 300; // Reduced for less clutter
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      const color = new THREE.Color();

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() * 2 - 1) * 30;
        positions[i * 3 + 1] = (Math.random() * 2 - 1) * 20;
        positions[i * 3 + 2] = (Math.random() * 2 - 1) * 20 - 10;

        // Mostly white particles with subtle colors
        const colorChoice = Math.random();
        if (colorChoice < 0.15) color.setHSL(0.6, 0.3, 0.8); // Light blue
        else if (colorChoice < 0.3) color.setHSL(0.5, 0.3, 0.8); // Light teal
        else color.set(0xffffff); // White

        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        sizes[i] = Math.random() * 0.1 + 0.05;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const particleMaterial = new THREE.ShaderMaterial({
        uniforms: {
          pointTexture: { value: new THREE.TextureLoader().load(createCircleTexture()) }
        },
        vertexShader: `
          attribute float size;
          attribute vec3 customColor;
          varying vec3 vColor;
          void main() {
            vColor = customColor;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform sampler2D pointTexture;
          varying vec3 vColor;
          void main() {
            gl_FragColor = vec4(vColor, 1.0);
            gl_FragColor = gl_FragColor * texture2D(pointTexture, gl_PointCoord);
            if (gl_FragColor.a < 0.1) discard;
          }
        `,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true
      });

      particles = new THREE.Points(geometry, particleMaterial);
      scene.add(particles);
    };

    const createCircleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const context = canvas.getContext('2d');
      context.beginPath();
      context.arc(32, 32, 30, 0, 2 * Math.PI);
      context.fillStyle = 'white';
      context.fill();
      return canvas.toDataURL();
    };

    const createDataStreams = () => {
      dataStreams = new THREE.Group();
      const streamCount = 10; // Reduced for clarity
      const segmentCount = 20;
      const material = new THREE.LineBasicMaterial({ 
        color: 0xcccccc, // Light grey
        transparent: true, 
        opacity: 0.2 
      });

      for (let i = 0; i < streamCount; i++) {
        const points = [];
        for (let j = 0; j < segmentCount; j++) {
          points.push(new THREE.Vector3());
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material);
        line.userData = {
          speed: Math.random() * 0.1 + 0.05,
          angle: Math.random() * Math.PI * 2,
          radius: Math.random() * 5 + 5,
          currentY: (Math.random() - 0.5) * 15,
          direction: Math.random() > 0.5 ? 1 : -1
        };
        dataStreams.add(line);
      }
      scene.add(dataStreams);
    };

    const onMouseMove = (event) => {
      const rect = mountRef.current.getBoundingClientRect();
      mouseX = (event.clientX - rect.left - (rect.width / 2)) * 0.01;
      mouseY = (event.clientY - rect.top - (rect.height / 2)) * 0.01;
    };

    const onWindowResize = () => {
      const container = mountRef.current;
      if (!renderer || !camera || !container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width > 0 && height > 0) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!renderer || !scene || !camera) return;

      const time = Date.now() * 0.0005;

      if (phoneGroup) {
        phoneGroup.rotation.y = time * 0.3;
        phoneGroup.rotation.x = Math.sin(time * 0.2) * 0.1;
        const screen = phoneGroup.children.find(child => child.userData.material);
        if (screen) {
          screen.userData.material.emissiveIntensity = 0.5 + Math.sin(time * 2) * 0.3;
        }
      }

      if (particles) {
        particles.rotation.y = time * 0.05;
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 1] += Math.sin(time * 2 + positions[i]) * 0.001;
        }
        particles.geometry.attributes.position.needsUpdate = true;
      }

      if (dataStreams) {
        dataStreams.children.forEach(line => {
          const userData = line.userData;
          userData.currentY += userData.speed * userData.direction;
          if (userData.direction === 1 && userData.currentY > 10) userData.currentY = -10;
          if (userData.direction === -1 && userData.currentY < -10) userData.currentY = 10;

          const points = line.geometry.attributes.position.array;
          const startX = Math.cos(userData.angle) * userData.radius;
          const startZ = Math.sin(userData.angle) * userData.radius;
          const endX = 0, endY = 0, endZ = 0;

          for (let i = 0; i < points.length / 3; i++) {
            const t = i / (points.length / 3 - 1);
            if (userData.direction === 1) {
              points[i * 3] = THREE.MathUtils.lerp(startX, endX, t);
              points[i * 3 + 1] = THREE.MathUtils.lerp(userData.currentY, endY, t);
              points[i * 3 + 2] = THREE.MathUtils.lerp(startZ, endZ, t);
            } else {
              points[i * 3] = THREE.MathUtils.lerp(endX, startX, t);
              points[i * 3 + 1] = THREE.MathUtils.lerp(endY, userData.currentY, t);
              points[i * 3 + 2] = THREE.MathUtils.lerp(endZ, startZ, t);
            }
          }
          line.geometry.attributes.position.needsUpdate = true;
          line.material.opacity = 0.2 + Math.sin(time * 5 + userData.angle) * 0.1;
        });
      }

      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    if (mountRef.current) {
      const observer = new ResizeObserver(() => onWindowResize());
      observer.observe(mountRef.current);
      init();
      return () => observer.disconnect();
    }

    return () => {
      window.removeEventListener('resize', onWindowResize);
      if (mountRef.current) {
        mountRef.current.removeEventListener('mousemove', onMouseMove);
      }
      cancelAnimationFrame(animationFrameId);
      if (renderer && mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      scene?.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      });
      renderer?.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '300px',
        position: 'absolute',
        top: 0,
        left: 0,
        overflow: 'hidden',
        zIndex: 0,
        backgroundColor: 'white' // Solid white background
      }}
    />
  );
};

export default TechRepairAnimation;