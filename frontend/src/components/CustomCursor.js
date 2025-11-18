// // // src/components/CustomCursor.js
// // import React, { useEffect, useRef, useState } from 'react';

// // const CustomCursor = () => {
// //   const cursorRef = useRef(null);
// //   const canvasRef = useRef(null);
// //   const [position, setPosition] = useState({ x: -100, y: -100 });
// //   const trailPoints = useRef([]);

// //   useEffect(() => {
// //     const canvas = canvasRef.current;
// //     const ctx = canvas.getContext('2d');

// //     const setCanvasSize = () => {
// //       canvas.width = window.innerWidth;
// //       canvas.height = window.innerHeight;
// //     };
// //     setCanvasSize();
// //     window.addEventListener('resize', setCanvasSize);

// //     const handleMouseMove = (e) => {
// //       const { clientX, clientY } = e;
// //       setPosition({ x: clientX, y: clientY });
// //       // Record each mouse move with a timestamp
// //       trailPoints.current.push({ x: clientX, y: clientY, time: Date.now() });
// //     };

// //     window.addEventListener('mousemove', handleMouseMove);

// //     let animationFrameId;

// //     const maxDuration = 1000; // ms: trail lasts for 1 second
// //     const maxOpacity = 0.8;   // new points start with 0.8 opacity
// //     ctx.lineWidth = 4;        // You can adjust this for a thicker or thinner line

// //     const drawTrail = () => {
// //       ctx.clearRect(0, 0, canvas.width, canvas.height);
// //       const now = Date.now();

// //       // Filter points to keep only those within maxDuration
// //       trailPoints.current = trailPoints.current.filter((p) => now - p.time < maxDuration);

// //       // Draw line segments between each pair of points
// //       for (let i = 0; i < trailPoints.current.length - 1; i++) {
// //         const p = trailPoints.current[i];
// //         const next = trailPoints.current[i + 1];
// //         const age = now - p.time;
// //         const alpha = Math.max(0, ((maxDuration - age) / maxDuration) * maxOpacity);
// //         ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`; // black color
// //         ctx.beginPath();
// //         ctx.moveTo(p.x, p.y);
// //         ctx.lineTo(next.x, next.y);
// //         ctx.stroke();
// //       }

// //       animationFrameId = requestAnimationFrame(drawTrail);
// //     };

// //     drawTrail();

// //     return () => {
// //       window.removeEventListener('mousemove', handleMouseMove);
// //       window.removeEventListener('resize', setCanvasSize);
// //       cancelAnimationFrame(animationFrameId);
// //     };
// //   }, []);

// //   return (
// //     <>
// //       {/* Custom Cursor Circle */}
// //       <div
// //         ref={cursorRef}
// //         style={{
// //           position: 'fixed',
// //           top: position.y,
// //           left: position.x,
// //           width: '10px',
// //           height: '10px',
// //           backgroundColor: '#000',
// //           borderRadius: '50%',
// //           transform: 'translate(-50%, -50%)',
// //           pointerEvents: 'none',
// //           zIndex: 10000,
// //         }}
// //       />
// //       {/* Canvas for drawing the trail */}
// //       <canvas
// //         ref={canvasRef}
// //         style={{
// //           position: 'fixed',
// //           top: 0,
// //           left: 0,
// //           pointerEvents: 'none',
// //           zIndex: 9999,
// //         }}
// //       />
// //     </>
// //   );
// // };

// // export default CustomCursor;


// // src/components/CustomCursorStars.js
// import React, { useEffect, useRef, useState } from 'react';

// const CustomCursor = () => {
//   const canvasRef = useRef(null);
//   const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
//   const trailStars = useRef([]);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');

//     // Set canvas size to match viewport
//     const setCanvasSize = () => {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//     };
//     setCanvasSize();
//     window.addEventListener('resize', setCanvasSize);

//     // Handle mouse movement
//     const handleMouseMove = (e) => {
//       const { clientX, clientY } = e;
//       setCursorPos({ x: clientX, y: clientY });
//       // Add the new star with the current timestamp
//       trailStars.current.push({ x: clientX, y: clientY, time: Date.now() });
//     };
//     window.addEventListener('mousemove', handleMouseMove);

//     let animationFrameId;
//     const maxDuration = 800; // Stars vanish after 800ms
//     const maxOpacity = 1.0;  // New stars are fully opaque

//     // Function to draw a star shape at (x,y)
//     const drawStar = (ctx, x, y, spikes, outerRadius, innerRadius, fillStyle) => {
//       let rot = Math.PI / 2 * 3;
//       let step = Math.PI / spikes;
//       ctx.save();
//       ctx.beginPath();
//       ctx.translate(x, y);
//       ctx.moveTo(0, 0 - outerRadius);
//       for (let i = 0; i < spikes; i++) {
//         ctx.lineTo(Math.cos(rot) * outerRadius, Math.sin(rot) * outerRadius);
//         rot += step;
//         ctx.lineTo(Math.cos(rot) * innerRadius, Math.sin(rot) * innerRadius);
//         rot += step;
//       }
//       ctx.lineTo(0, 0 - outerRadius);
//       ctx.closePath();
//       ctx.fillStyle = fillStyle;
//       ctx.fill();
//       ctx.restore();
//     };

//     // Draw the starry trail on the canvas
//     const drawTrail = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       const now = Date.now();

//       // Filter out stars older than maxDuration
//       trailStars.current = trailStars.current.filter((star) => now - star.time < maxDuration);

//       // Draw each star with decreasing opacity based on age
//       trailStars.current.forEach((star) => {
//         const age = now - star.time;
//         const opacity = Math.max(0, ((maxDuration - age) / maxDuration) * maxOpacity);
//         // Draw a star at the point (adjust the number of spikes and radii as desired)
//         drawStar(ctx, star.x, star.y, 5, 8, 4, `rgba(0, 0, 0, ${opacity})`);
//       });

//       animationFrameId = requestAnimationFrame(drawTrail);
//     };

//     drawTrail();

//     return () => {
//       window.removeEventListener('mousemove', handleMouseMove);
//       window.removeEventListener('resize', setCanvasSize);
//       cancelAnimationFrame(animationFrameId);
//     };
//   }, []);

//   return (
//     <>
//       {/* Custom Cursor Circle */}
//       <div
//         style={{
//           position: 'fixed',
//           top: cursorPos.y,
//           left: cursorPos.x,
//           width: '10px',
//           height: '10px',
//           backgroundColor: '#000',
//           borderRadius: '50%',
//           transform: 'translate(-50%, -50%)',
//           pointerEvents: 'none',
//           zIndex: 10000,
//         }}
//       />
//       {/* Canvas for the starry trail */}
//       <canvas
//         ref={canvasRef}
//         style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           pointerEvents: 'none',
//           zIndex: 9999,
//         }}
//       />
//     </>
//   );
// };

// export default CustomCursor;
