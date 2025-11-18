// src/components/AnimatedBackground.js
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

const AnimatedBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create scene with a light blue gradient background
    const scene = new THREE.Scene();
    const topColor = new THREE.Color(0xeff6ff); // Light blue
    const bottomColor = new THREE.Color(0xffffff); // White
    scene.background = new THREE.Color(0xffffff);

    // Set up camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 15;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      logarithmicDepthBuffer: true 
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // Background gradient
    const bgGeometry = new THREE.PlaneGeometry(50, 50);
    const bgMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform vec3 colorTop;
        uniform vec3 colorBottom;
        void main() {
          gl_FragColor = vec4(mix(colorBottom, colorTop, vUv.y), 1.0);
        }
      `,
      uniforms: {
        colorTop: { value: topColor },
        colorBottom: { value: bottomColor }
      },
      side: THREE.BackSide
    });
    const background = new THREE.Mesh(bgGeometry, bgMaterial);
    background.position.z = -10;
    scene.add(background);

    // Create phone parts and screen elements
    const objectsGroup = new THREE.Group();
    scene.add(objectsGroup);

    // Phone screens with glowing effect
    const createScreen = (x, y, scale = 1) => {
      const screenGeometry = new THREE.PlaneGeometry(2 * scale, 3.5 * scale);
      const screenMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x2563eb, // Blue screens
        opacity: 0.7,
        transparent: true
      });
      const screen = new THREE.Mesh(screenGeometry, screenMaterial);
      screen.position.set(x, y, 0.5);
      
      // Add screen to objects group
      objectsGroup.add(screen);
      
      // Animate opacity for glowing effect
      gsap.to(screenMaterial, {
        opacity: 0.3,
        duration: 1.5 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      
      return screen;
    };

    // Phone outlines
    const createPhoneOutline = (x, y, scale = 1) => {
      const phoneShape = new THREE.Shape();
      const width = 2.2 * scale;
      const height = 4 * scale;
      const radius = 0.4 * scale;
      
      // Rounded rectangle path
      phoneShape.moveTo(x - width/2 + radius, y - height/2);
      phoneShape.lineTo(x + width/2 - radius, y - height/2);
      phoneShape.quadraticCurveTo(x + width/2, y - height/2, x + width/2, y - height/2 + radius);
      phoneShape.lineTo(x + width/2, y + height/2 - radius);
      phoneShape.quadraticCurveTo(x + width/2, y + height/2, x + width/2 - radius, y + height/2);
      phoneShape.lineTo(x - width/2 + radius, y + height/2);
      phoneShape.quadraticCurveTo(x - width/2, y + height/2, x - width/2, y + height/2 - radius);
      phoneShape.lineTo(x - width/2, y - height/2 + radius);
      phoneShape.quadraticCurveTo(x - width/2, y - height/2, x - width/2 + radius, y - height/2);
      
      const geometry = new THREE.ShapeGeometry(phoneShape);
      const material = new THREE.LineBasicMaterial({ 
        color: 0x1e40af, // Darker blue for outline
        linewidth: 2,
        opacity: 0.8,
        transparent: true
      });

      // Create outline mesh by converting shape to points
      const points = new THREE.BufferGeometry().setFromPoints(phoneShape.getPoints(50));
      const outline = new THREE.Line(points, material);
      outline.position.set(0, 0, 0.4);
      objectsGroup.add(outline);
      
      return outline;
    };

    // Create circuit patterns
    const createCircuitLines = (x, y, scale = 1) => {
      const lineGroup = new THREE.Group();
      const lineCount = 5 + Math.floor(Math.random() * 5);
      const lineColor = 0x93c5fd; // Light blue
      
      for (let i = 0; i < lineCount; i++) {
        const points = [];
        const startX = (Math.random() - 0.5) * 4 * scale + x;
        const startY = (Math.random() - 0.5) * 6 * scale + y;
        let currentX = startX;
        let currentY = startY;
        
        points.push(new THREE.Vector3(currentX, currentY, 0.2));
        
        // Generate zig-zag circuit-like paths
        const segments = 2 + Math.floor(Math.random() * 4);
        for (let j = 0; j < segments; j++) {
          // Decide direction: horizontal or vertical
          if (Math.random() > 0.5) {
            currentX += (Math.random() - 0.5) * 3 * scale;
          } else {
            currentY += (Math.random() - 0.5) * 3 * scale;
          }
          points.push(new THREE.Vector3(currentX, currentY, 0.2));
        }
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ 
          color: lineColor,
          opacity: 0.6,
          transparent: true
        });
        
        const line = new THREE.Line(geometry, material);
        lineGroup.add(line);
      }
      
      objectsGroup.add(lineGroup);
      return lineGroup;
    };

    // Create floating components (circles, chips, smaller parts)
    const createComponent = (x, y, scale = 1) => {
      const type = Math.floor(Math.random() * 3);
      let component;
      
      switch (type) {
        case 0: // Circle (button or camera)
          const circleGeometry = new THREE.CircleGeometry(0.3 * scale, 32);
          const circleMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xdbeafe, // Very light blue
            opacity: 0.7,
            transparent: true
          });
          component = new THREE.Mesh(circleGeometry, circleMaterial);
          break;
          
        case 1: // Chip (rectangle)
          const chipGeometry = new THREE.PlaneGeometry(0.8 * scale, 0.8 * scale);
          const chipMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xbfdbfe, // Light blue
            opacity: 0.7,
            transparent: true
          });
          component = new THREE.Mesh(chipGeometry, chipMaterial);
          break;
          
        case 2: // Small connector
          const connectorGeometry = new THREE.PlaneGeometry(0.4 * scale, 1.2 * scale);
          const connectorMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xdbeafe, // Very light blue
            opacity: 0.6,
            transparent: true
          });
          component = new THREE.Mesh(connectorGeometry, connectorMaterial);
          break;
      }
      
      component.position.set(x, y, 0.3);
      objectsGroup.add(component);
      
      // Add subtle rotation animation
      gsap.to(component.rotation, {
        z: Math.PI * 2 * (Math.random() > 0.5 ? 1 : -1),
        duration: 15 + Math.random() * 15,
        repeat: -1,
        ease: "none"
      });
      
      return component;
    };

    // Create all elements
    const elements = [];
    const elementCount = Math.min(15, Math.max(5, Math.floor(width / 120))); // Responsive count

    for (let i = 0; i < elementCount; i++) {
      const scale = 0.6 + Math.random() * 0.8;
      const x = (Math.random() - 0.5) * width / 40;
      const y = (Math.random() - 0.5) * height / 40;
      
      if (Math.random() > 0.6) {
        // Create phone with screen
        const screen = createScreen(x, y, scale);
        createPhoneOutline(x, y, scale);
        elements.push(screen);
      } else if (Math.random() > 0.5) {
        // Create circuit pattern
        const circuit = createCircuitLines(x, y, scale);
        elements.push(circuit);
      } else {
        // Create smaller component
        const component = createComponent(x, y, scale);
        elements.push(component);
      }
    }

    // Animation for all elements
    elements.forEach(element => {
      // Random floating movement
      gsap.to(element.position, {
        y: element.position.y + (Math.random() - 0.5) * 3,
        x: element.position.x + (Math.random() - 0.5) * 3,
        duration: 10 + Math.random() * 20,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });

    // Subtle rotation for the entire objects group
    gsap.to(objectsGroup.rotation, {
      z: 0.05,
      y: 0.03,
      x: 0.02,
      duration: 15,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    
    const onMouseMove = (event) => {
      // Normalized mouse coordinates
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', onMouseMove);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Subtle camera movement based on mouse position
      camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
      camera.position.y += (mouseY * 2 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      renderer.setSize(newWidth, newHeight);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.traverse(object => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        zIndex: -1,
        overflow: 'hidden',
        background: 'linear-gradient(to bottom, #eff6ff, #ffffff)',
      }}
    />
  );
};

export default AnimatedBackground;

// // src/components/AnimeJsPhoneAnimation.js
// import React, { useEffect, useRef } from 'react';
// import anime from 'animejs/lib/anime.es.js';

// const AnimatedBackground = () => {
//   const containerRef = useRef(null);

//   useEffect(() => {
//     if (!containerRef.current) return;

//     // Clear any existing SVG content
//     containerRef.current.innerHTML = '';

//     // Create SVG element
//     const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
//     svg.setAttribute('width', '100%');
//     svg.setAttribute('height', '100%');
//     svg.setAttribute('viewBox', '0 0 1000 1000');
//     containerRef.current.appendChild(svg);

//     // Phone elements to be animated
//     const elements = [];
//     const colors = ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'];
    
//     // Create phone shapes
//     for (let i = 0; i < 15; i++) {
//       const phoneGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      
//       // Phone outline
//       const phoneOutline = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
//       const width = 60 + Math.random() * 40;
//       const height = width * 2;
//       const rx = width * 0.2; // Rounded corners
      
//       phoneOutline.setAttribute('width', width);
//       phoneOutline.setAttribute('height', height);
//       phoneOutline.setAttribute('rx', rx);
//       phoneOutline.setAttribute('ry', rx);
//       phoneOutline.setAttribute('fill', 'none');
//       phoneOutline.setAttribute('stroke', colors[Math.floor(Math.random() * colors.length)]);
//       phoneOutline.setAttribute('stroke-width', '2');
//       phoneOutline.setAttribute('opacity', '0.7');
      
//       // Phone screen
//       const phoneScreen = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
//       const screenWidth = width * 0.85;
//       const screenHeight = height * 0.7;
//       const screenX = (width - screenWidth) / 2;
//       const screenY = height * 0.15;
      
//       phoneScreen.setAttribute('width', screenWidth);
//       phoneScreen.setAttribute('height', screenHeight);
//       phoneScreen.setAttribute('x', screenX);
//       phoneScreen.setAttribute('y', screenY);
//       phoneScreen.setAttribute('rx', rx * 0.5);
//       phoneScreen.setAttribute('ry', rx * 0.5);
//       phoneScreen.setAttribute('fill', colors[Math.floor(Math.random() * colors.length)]);
//       phoneScreen.setAttribute('opacity', '0.3');
      
//       // Home button
//       const homeButton = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
//       const buttonSize = width * 0.15;
//       const buttonX = width / 2;
//       const buttonY = height * 0.9;
      
//       homeButton.setAttribute('r', buttonSize);
//       homeButton.setAttribute('cx', buttonX);
//       homeButton.setAttribute('cy', buttonY);
//       homeButton.setAttribute('fill', 'none');
//       homeButton.setAttribute('stroke', colors[Math.floor(Math.random() * colors.length)]);
//       homeButton.setAttribute('stroke-width', '1.5');
      
//       // Add elements to the phone group
//       phoneGroup.appendChild(phoneOutline);
//       phoneGroup.appendChild(phoneScreen);
//       phoneGroup.appendChild(homeButton);
      
//       // Random position
//       const posX = Math.random() * 1000;
//       const posY = Math.random() * 1000;
//       phoneGroup.setAttribute('transform', `translate(${posX}, ${posY})`);
      
//       // Add to SVG and elements array
//       svg.appendChild(phoneGroup);
//       elements.push({
//         el: phoneGroup,
//         x: posX,
//         y: posY,
//         angle: Math.random() * 360,
//         scale: 0.1 + Math.random() * 0.5,
//         speed: 1 + Math.random() * 3
//       });
//     }
    
//     // Create circuit lines
//     for (let i = 0; i < 25; i++) {
//       const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
//       const startX = Math.random() * 1000;
//       const startY = Math.random() * 1000;
      
//       // Create zig-zag paths like circuits
//       let pathData = `M ${startX} ${startY}`;
//       const segments = 3 + Math.floor(Math.random() * 4);
//       let currentX = startX;
//       let currentY = startY;
      
//       for (let j = 0; j < segments; j++) {
//         if (Math.random() > 0.5) {
//           currentX += (Math.random() - 0.5) * 200;
//         } else {
//           currentY += (Math.random() - 0.5) * 200;
//         }
//         pathData += ` L ${currentX} ${currentY}`;
//       }
      
//       line.setAttribute('d', pathData);
//       line.setAttribute('fill', 'none');
//       line.setAttribute('stroke', colors[Math.floor(Math.random() * colors.length)]);
//       line.setAttribute('stroke-width', '1.5');
//       line.setAttribute('opacity', '0.6');
      
//       svg.appendChild(line);
      
//       // Animate each circuit path drawing
//       anime({
//         targets: line,
//         strokeDashoffset: [anime.setDashoffset, 0],
//         easing: 'easeInOutSine',
//         duration: 1500 + Math.random() * 3000,
//         delay: Math.random() * 1000,
//         opacity: [0, 0.6],
//         loop: true,
//         direction: 'alternate'
//       });
//     }
    
//     // Create floating gears/components
//     for (let i = 0; i < 20; i++) {
//       const component = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
//       const size = 3 + Math.random() * 15;
//       const posX = Math.random() * 1000;
//       const posY = Math.random() * 1000;
      
//       component.setAttribute('r', size);
//       component.setAttribute('cx', posX);
//       component.setAttribute('cy', posY);
//       component.setAttribute('fill', Math.random() > 0.5 ? 'none' : colors[Math.floor(Math.random() * colors.length)]);
//       component.setAttribute('stroke', colors[Math.floor(Math.random() * colors.length)]);
//       component.setAttribute('stroke-width', '1');
//       component.setAttribute('opacity', '0.7');
      
//       svg.appendChild(component);
      
//       // Animate each component
//       anime({
//         targets: component,
//         translateX: posX + (Math.random() - 0.5) * 100,
//         translateY: posY + (Math.random() - 0.5) * 100,
//         scale: [
//           { value: 1 + Math.random() * 0.5, duration: 2000, easing: 'easeInOutQuad' },
//           { value: 0.8 + Math.random() * 0.3, duration: 2000, easing: 'easeInOutQuad' }
//         ],
//         opacity: [
//           { value: 0.9, duration: 1000, easing: 'easeInOutQuad' },
//           { value: 0.3, duration: 1000, easing: 'easeInOutQuad' }
//         ],
//         easing: 'easeInOutSine',
//         duration: 4000 + Math.random() * 3000,
//         loop: true,
//         direction: 'alternate'
//       });
//     }
    
//     // Animate phone elements
//     elements.forEach((item) => {
//       // Apply initial scale and rotation
//       item.el.style.transformOrigin = 'center';
//       item.el.style.transform = `scale(${item.scale}) rotate(${item.angle}deg)`;
      
//       // Floating animation with anime.js
//       anime({
//         targets: item.el,
//         translateX: [
//           { value: item.x + (Math.random() - 0.5) * 200, duration: 4000, easing: 'easeInOutQuad' },
//           { value: item.x + (Math.random() - 0.5) * 200, duration: 4000, easing: 'easeInOutQuad' }
//         ],
//         translateY: [
//           { value: item.y - 100 - Math.random() * 100, duration: 5000, easing: 'easeInOutQuad' },
//           { value: item.y + 100 + Math.random() * 100, duration: 5000, easing: 'easeInOutQuad' }
//         ],
//         rotate: item.angle + 360,
//         scale: [
//           { value: item.scale * 1.2, duration: 2000, easing: 'easeInOutQuad' },
//           { value: item.scale * 0.8, duration: 2000, easing: 'easeInOutQuad' }
//         ],
//         opacity: [
//           { value: 1, duration: 1000, easing: 'easeInOutQuad' },
//           { value: 0.5, duration: 1000, easing: 'easeInOutQuad' }
//         ],
//         easing: 'easeInOutSine',
//         duration: 7000 * item.speed,
//         loop: true,
//         direction: 'alternate'
//       });
//     });

//     // Create pulsing light effect in the background
//     const lightEffect = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
//     lightEffect.setAttribute('cx', '500');
//     lightEffect.setAttribute('cy', '500');
//     lightEffect.setAttribute('r', '300');
//     lightEffect.setAttribute('fill', 'url(#radialGradient)');
//     lightEffect.setAttribute('opacity', '0.2');
    
//     // Define gradient
//     const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
//     const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
//     gradient.setAttribute('id', 'radialGradient');
    
//     const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
//     stop1.setAttribute('offset', '0%');
//     stop1.setAttribute('stop-color', '#3b82f6');
    
//     const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
//     stop2.setAttribute('offset', '100%');
//     stop2.setAttribute('stop-color', '#ffffff');
//     stop2.setAttribute('stop-opacity', '0');
    
//     gradient.appendChild(stop1);
//     gradient.appendChild(stop2);
//     defs.appendChild(gradient);
    
//     svg.insertBefore(defs, svg.firstChild);
//     svg.insertBefore(lightEffect, svg.firstChild);
    
//     // Animate the light effect
//     anime({
//       targets: lightEffect,
//       r: [300, 400],
//       opacity: [0.1, 0.3],
//       easing: 'easeInOutSine',
//       duration: 5000,
//       loop: true,
//       direction: 'alternate'
//     });
    
//     // Add mouse interaction
//     const handleMouseMove = (e) => {
//       const rect = svg.getBoundingClientRect();
//       const mouseX = (e.clientX - rect.left) / rect.width * 1000;
//       const mouseY = (e.clientY - rect.top) / rect.height * 1000;
      
//       // Update light effect position
//       lightEffect.setAttribute('cx', mouseX);
//       lightEffect.setAttribute('cy', mouseY);
      
//       // Slightly affect nearby elements
//       elements.forEach(item => {
//         const dx = mouseX - parseFloat(item.el.getAttribute('transform').split('(')[1]);
//         const dy = mouseY - parseFloat(item.el.getAttribute('transform').split(', ')[1]);
//         const distance = Math.sqrt(dx * dx + dy * dy);
        
//         if (distance < 300) {
//           anime({
//             targets: item.el,
//             translateX: '+=' + (dx / 10),
//             translateY: '+=' + (dy / 10),
//             easing: 'easeOutElastic(1, .5)',
//             duration: 800
//           });
//         }
//       });
//     };
    
//     containerRef.current.addEventListener('mousemove', handleMouseMove);
    
//     // Clean up
//     return () => {
//       containerRef.current.removeEventListener('mousemove', handleMouseMove);
//     };
//   }, []);
  
//   return (
//     <div
//       ref={containerRef}
//       style={{
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         width: '100%',
//         height: '100%',
//         overflow: 'hidden',
//         background: 'linear-gradient(to bottom, #f0f9ff, #ffffff)',
//         zIndex: -1
//       }}
//     />
//   );
// };

// export default AnimatedBackground;

// // src/components/ParticlesPhoneAnimation.js
// import React, { useEffect, useRef } from 'react';

// const AnimatedBackground = () => {
//   const canvasRef = useRef(null);
//   const containerRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const container = containerRef.current;
//     if (!canvas || !container) return;

//     const ctx = canvas.getContext('2d');
//     let animationFrameId;
//     let width, height;

//     // Set canvas size to match container
//     const resizeCanvas = () => {
//       width = container.clientWidth;
//       height = container.clientHeight;
//       canvas.width = width;
//       canvas.height = height;
//     };
//     resizeCanvas();

//     // Phone icon blueprint
//     const drawPhone = (x, y, size, color, rotation) => {
//       ctx.save();
//       ctx.translate(x, y);
//       ctx.rotate(rotation);
      
//       // Phone outline
//       const phoneWidth = size * 0.6;
//       const phoneHeight = size;
//       const cornerRadius = size * 0.1;
      
//       ctx.beginPath();
//       ctx.moveTo(x - phoneWidth/2 + cornerRadius, y - phoneHeight/2);
//       ctx.lineTo(x + phoneWidth/2 - cornerRadius, y - phoneHeight/2);
//       ctx.arcTo(x + phoneWidth/2, y - phoneHeight/2, x + phoneWidth/2, y - phoneHeight/2 + cornerRadius, cornerRadius);
//       ctx.lineTo(x + phoneWidth/2, y + phoneHeight/2 - cornerRadius);
//       ctx.arcTo(x + phoneWidth/2, y + phoneHeight/2, x + phoneWidth/2 - cornerRadius, y + phoneHeight/2, cornerRadius);
//       ctx.lineTo(x - phoneWidth/2 + cornerRadius, y + phoneHeight/2);
//       ctx.arcTo(x - phoneWidth/2, y + phoneHeight/2, x - phoneWidth/2, y + phoneHeight/2 - cornerRadius, cornerRadius);
//       ctx.lineTo(x - phoneWidth/2, y - phoneHeight/2 + cornerRadius);
//       ctx.arcTo(x - phoneWidth/2, y - phoneHeight/2, x - phoneWidth/2 + cornerRadius, y - phoneHeight/2, cornerRadius);
//       ctx.closePath();
      
//       ctx.strokeStyle = color;
//       ctx.lineWidth = size * 0.04;
//       ctx.stroke();
      
//       // Screen
//       const screenWidth = phoneWidth * 0.85;
//       const screenHeight = phoneHeight * 0.7;
//       ctx.fillStyle = color;
//       ctx.globalAlpha = 0.2;
//       ctx.fillRect(-screenWidth/2, -phoneHeight/2 + phoneHeight*0.15, screenWidth, screenHeight);
//       ctx.globalAlpha = 1;
      
//       // Home button
//       ctx.beginPath();
//       ctx.arc(0, phoneHeight/2 - phoneHeight*0.15, phoneWidth*0.12, 0, Math.PI * 2);
//       ctx.strokeStyle = color;
//       ctx.lineWidth = size * 0.02;
//       ctx.stroke();
      
//       ctx.restore();
//     };

//     const drawComponent = (x, y, size, color, type, rotation) => {
//       ctx.save();
//       ctx.translate(x, y);
//       ctx.rotate(rotation);
      
//       ctx.strokeStyle = color;
//       ctx.fillStyle = color;
//       ctx.lineWidth = size * 0.05;
      
//       switch(type) {
//         case 0: // Chip
//           ctx.globalAlpha = 0.4;
//           ctx.fillRect(-size/2, -size/2, size, size);
//           ctx.globalAlpha = 0.8;
//           // Chip pins
//           for (let i = 0; i < 5; i++) {
//             const pinOffset = (size / 5) * i - size/2 + size/10;
//             // Top pins
//             ctx.beginPath();
//             ctx.moveTo(pinOffset, -size/2);
//             ctx.lineTo(pinOffset, -size/2 - size/5);
//             ctx.stroke();
//             // Bottom pins
//             ctx.beginPath();
//             ctx.moveTo(pinOffset, size/2);
//             ctx.lineTo(pinOffset, size/2 + size/5);
//             ctx.stroke();
//           }
//           break;
          
//         case 1: // Circuit
//           ctx.globalAlpha = 0.6;
//           const segments = 3 + Math.floor(Math.random() * 3);
//           ctx.beginPath();
//           ctx.moveTo(-size/2, 0);
          
//           let currentX = -size/2;
//           let currentY = 0;
          
//           for (let i = 0; i < segments; i++) {
//             if (i % 2 === 0) {
//               currentY = (Math.random() - 0.5) * size;
//             } else {
//               currentX += size / segments;
//             }
//             ctx.lineTo(currentX, currentY);
//           }
//           ctx.lineTo(size/2, 0);
//           ctx.stroke();
//           break;
          
//         case 2: // Connector
//           ctx.globalAlpha = 0.7;
//           // USB/Lightning port shape
//           const portWidth = size * 0.8;
//           const portHeight = size * 0.3;
//           ctx.beginPath();
//           ctx.rect(-portWidth/2, -portHeight/2, portWidth, portHeight);
//           ctx.stroke();
          
//           // Pins inside
//           for (let i = 0; i < 4; i++) {
//             const pinOffset = (portWidth / 4) * i - portWidth/2 + portWidth/8;
//             ctx.beginPath();
//             ctx.moveTo(pinOffset, -portHeight/4);
//             ctx.lineTo(pinOffset, portHeight/4);
//             ctx.stroke();
//           }
//           break;
          
//         default:
//           // Default to a simple circle
//           ctx.globalAlpha = 0.5;
//           ctx.beginPath();
//           ctx.arc(0, 0, size/2, 0, Math.PI * 2);
//           ctx.fill();
//       }
      
//       ctx.restore();
//     };

//     // Phone particles class
//     class Particle {
//       constructor(type) {
//         this.type = type; // 0: phone, 1: component
//         this.size = type === 0 
//           ? 15 + Math.random() * 25 
//           : 5 + Math.random() * 15;
//         this.x = Math.random() * width;
//         this.y = Math.random() * height;
//         this.vx = (Math.random() - 0.5) * 0.5;
//         this.vy = (Math.random() - 0.5) * 0.5;
//         this.color = this.getRandomColor();
//         this.rotation = Math.random() * Math.PI * 2;
//         this.rotationSpeed = (Math.random() - 0.5) * 0.01;
//         this.alpha = 0.1 + Math.random() * 0.7;
//         this.componentType = Math.floor(Math.random() * 3);
//       }
      
//       getRandomColor() {
//         const colors = [
//           '#1e40af', // Dark blue
//           '#3b82f6', // Medium blue
//           '#60a5fa', // Lighter blue
//           '#93c5fd', // Light blue
//           '#dbeafe'  // Very light blue
//         ];
//         return colors[Math.floor(Math.random() * colors.length)];
//       }
      
//       update() {
//         this.x += this.vx;
//         this.y += this.vy;
//         this.rotation += this.rotationSpeed;
        
//         // Boundary check with bounce
//         if (this.x - this.size/2 < 0 || this.x + this.size/2 > width) {
//           this.vx = -this.vx;
//         }
//         if (this.y - this.size/2 < 0 || this.y + this.size/2 > height) {
//           this.vy = -this.vy;
//         }
//       }
      
//       draw() {
//         ctx.globalAlpha = this.alpha;
//         if (this.type === 0) {
//           drawPhone(this.x, this.y, this.size, this.color, this.rotation);
//         } else {
//           drawComponent(this.x, this.y, this.size, this.color, this.componentType, this.rotation);
//         }
//         ctx.globalAlpha = 1;
//       }
//     }

//     // Connection lines class
//     class Connection {
//       constructor(particle1, particle2) {
//         this.particle1 = particle1;
//         this.particle2 = particle2;
//         this.color = '#93c5fd'; // Light blue
//         this.lineWidth = 0.5;
//       }
      
//       draw() {
//         const dx = this.particle1.x - this.particle2.x;
//         const dy = this.particle1.y - this.particle2.y;
//         const distance = Math.sqrt(dx * dx + dy * dy);
        
//         // Only draw connections between particles that are close enough
//         const maxDistance = 150;
//         if (distance < maxDistance) {
//           ctx.beginPath();
//           ctx.moveTo(this.particle1.x, this.particle1.y);
//           ctx.lineTo(this.particle2.x, this.particle2.y);
          
//           // Fade line based on distance
//           const alpha = 1 - (distance / maxDistance);
//           ctx.globalAlpha = alpha * 0.2;
//           ctx.strokeStyle = this.color;
//           ctx.lineWidth = this.lineWidth;
//           ctx.stroke();
//           ctx.globalAlpha = 1;
//         }
//       }
//     }

//     // Create particles
//     const phoneCount = Math.min(15, Math.max(5, Math.floor(width / 100))); // Responsive count
//     const componentCount = phoneCount * 3;
//     const particles = [];
    
//     for (let i = 0; i < phoneCount; i++) {
//       particles.push(new Particle(0)); // Add phones
//     }
    
//     for (let i = 0; i < componentCount; i++) {
//       particles.push(new Particle(1)); // Add components
//     }
    
//     // Mouse interaction
//     let mouseX = 0;
//     let mouseY = 0;
//     let isMouseMoving = false;
//     let mouseRadius = 100;
    
//     const handleMouseMove = (e) => {
//       const rect = canvas.getBoundingClientRect();
//       mouseX = e.clientX - rect.left;
//       mouseY = e.clientY - rect.top;
//       isMouseMoving = true;
      
//       // Reset timeout to track when mouse stops moving
//       clearTimeout(window.mouseStopTimer);
//       window.mouseStopTimer = setTimeout(() => {
//         isMouseMoving = false;
//       }, 100);
//     };
    
//     container.addEventListener('mousemove', handleMouseMove);
    
//     // Animation function
//     const animate = () => {
//       ctx.clearRect(0, 0, width, height);
      
//       // Draw connections first (behind particles)
//       for (let i = 0; i < particles.length; i++) {
//         for (let j = i + 1; j < particles.length; j++) {
//           const connection = new Connection(particles[i], particles[j]);
//           connection.draw();
//         }
//       }
      
//       // Draw and update particles
//       particles.forEach(particle => {
//         // Apply mouse force if mouse is moving
//         if (isMouseMoving) {
//           const dx = mouseX - particle.x;
//           const dy = mouseY - particle.y;
//           const distance = Math.sqrt(dx * dx + dy * dy);
          
//           if (distance < mouseRadius) {
//             // Calculate force direction and magnitude
//             const forceDirectionX = dx / distance;
//             const forceDirectionY = dy / distance;
//             const force = (mouseRadius - distance) / mouseRadius;
            
//             // Apply force - pull particles towards mouse
//             particle.vx += forceDirectionX * force * 0.2;
//             particle.vy += forceDirectionY * force * 0.2;
//           }
//         }
        
//         // Apply some drag/friction
//         particle.vx *= 0.99;
//         particle.vy *= 0.99;
        
//         // Make sure we don't exceed max velocity
//         const maxVel = 2;
//         const vel = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
//         if (vel > maxVel) {
//           particle.vx = (particle.vx / vel) * maxVel;
//           particle.vy = (particle.vy / vel) * maxVel;
//         }
        
//         particle.update();
//         particle.draw();
//       });
      
//       // Mouse pointer effect
//       if (isMouseMoving) {
//         ctx.beginPath();
//         ctx.arc(mouseX, mouseY, mouseRadius, 0, Math.PI * 2);
//         ctx.strokeStyle = '#3b82f6';
//         ctx.globalAlpha = 0.3;
//         ctx.lineWidth = 2;
//         ctx.stroke();
//         ctx.globalAlpha = 0.1;
//         ctx.fillStyle = '#dbeafe';
//         ctx.fill();
//         ctx.globalAlpha = 1;
//       }
      
//       animationFrameId = requestAnimationFrame(animate);
//     };
    
//     animate();
    
//     // Handle window resize
//     const handleResize = () => {
//       resizeCanvas();
//     };
//     window.addEventListener('resize', handleResize);
    
//     // Clean up
//     return () => {
//       cancelAnimationFrame(animationFrameId);
//       window.removeEventListener('resize', handleResize);
//       container.removeEventListener('mousemove', handleMouseMove);
//       clearTimeout(window.mouseStopTimer);
//     };
//   }, []);
  
//   return (
//     <div 
//       ref={containerRef}
//       style={{
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         width: '100%',
//         height: '100%',
//         overflow: 'hidden',
//         background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
//         zIndex: -1
//       }}
//     >
//       <canvas 
//         ref={canvasRef}
//         style={{
//           display: 'block'
//         }}
//       />
//     </div>
//   );
// };

// export default AnimatedBackground;