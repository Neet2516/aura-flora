import React, { useEffect, useRef } from 'react';

interface ProjectVisualProps {
  type: 'aviation' | 'bioacoustic' | 'typography' | 'webgl' | 'archival';
  isHovered: boolean;
}

export const ProjectVisual: React.FC<ProjectVisualProps> = ({ type, isHovered }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;

    const render = () => {
      t += isHovered ? 0.04 : 0.015;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Deep matte charcoal background
      ctx.fillStyle = '#141414';
      ctx.fillRect(0, 0, width, height);

      // 1px Subtle Grid in Canvas
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 32;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      if (type === 'aviation') {
        // Supersonic Airfoil & Aerodynamic Streamlines
        const centerY = height / 2;
        ctx.strokeStyle = isHovered ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1.5;

        // Airfoil shape
        ctx.beginPath();
        ctx.moveTo(width * 0.2, centerY);
        ctx.bezierCurveTo(
          width * 0.4, centerY - 45 - Math.sin(t) * 3,
          width * 0.65, centerY - 25,
          width * 0.85, centerY
        );
        ctx.bezierCurveTo(
          width * 0.65, centerY + 18,
          width * 0.4, centerY + 15,
          width * 0.2, centerY
        );
        ctx.stroke();

        // Streamlines
        ctx.lineWidth = 1;
        for (let i = -3; i <= 3; i++) {
          if (i === 0) continue;
          ctx.strokeStyle = isHovered ? 'rgba(236, 236, 232, 0.45)' : 'rgba(140, 140, 140, 0.2)';
          ctx.beginPath();
          const startY = centerY + i * 22;
          ctx.moveTo(width * 0.08, startY);
          const cpX1 = width * 0.35;
          const cpY1 = startY + (i > 0 ? 25 : -35) * Math.sin(t * 0.8 + i);
          const cpX2 = width * 0.7;
          const cpY2 = startY;
          ctx.bezierCurveTo(cpX1, cpY1, cpX2, cpY2, width * 0.92, startY);
          ctx.stroke();
        }

        // Mach cone shockwave angle
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.moveTo(width * 0.2, centerY);
        ctx.lineTo(width * 0.75, centerY - 80);
        ctx.moveTo(width * 0.2, centerY);
        ctx.lineTo(width * 0.75, centerY + 80);
        ctx.stroke();
        ctx.setLineDash([]);

        // Technical HUD tags
        ctx.font = '10px JetBrains Mono';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillText(`MACH 2.4 · RE 2.4M · α ${(2.4 + Math.sin(t) * 0.4).toFixed(2)}°`, 24, height - 20);
        ctx.fillText(`COMPUTATIONAL WIND TUNNEL`, 24, 30);
      } else if (type === 'bioacoustic') {
        // Real-time BioAcoustic FFT Spectrum & Biophony Wave
        const numBars = 48;
        const barWidth = (width - 48) / numBars;
        const baseline = height * 0.75;

        for (let i = 0; i < numBars; i++) {
          const freqFactor = Math.sin(i * 0.2 + t * 2) * 0.5 + 0.5;
          const harmonic = Math.cos(i * 0.35 - t) * 0.3 + 0.5;
          const barHeight = Math.max(4, freqFactor * harmonic * (height * 0.52) * (isHovered ? 1.25 : 1.0));

          const isBiophony = i >= 14 && i <= 38; // 2kHz - 8kHz biophony band
          ctx.fillStyle = isBiophony
            ? (isHovered ? '#FFFFFF' : 'rgba(236, 236, 232, 0.75)')
            : 'rgba(140, 140, 140, 0.25)';

          ctx.fillRect(24 + i * barWidth, baseline - barHeight, barWidth - 2, barHeight);
        }

        // Biophony threshold curve
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(24, height * 0.45);
        ctx.lineTo(width - 24, height * 0.45);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.font = '10px JetBrains Mono';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fillText(`BIOPHONY RATIO: ${(0.82 + Math.sin(t) * 0.04).toFixed(3)} (PRISTINE)`, 24, height - 20);
        ctx.fillText(`16kHz FFT SPECTRAL CENTROID`, 24, 30);
      } else if (type === 'typography') {
        // Chronos Brutalist Mechanical Horological Gauge
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.34;

        // Outer ring
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();

        // 60 tick indices
        for (let i = 0; i < 60; i++) {
          const angle = (i / 60) * Math.PI * 2;
          const isMajor = i % 5 === 0;
          const r1 = radius - (isMajor ? 12 : 5);
          const r2 = radius;

          ctx.strokeStyle = isMajor ? 'rgba(255, 255, 255, 0.8)' : 'rgba(140, 140, 140, 0.3)';
          ctx.lineWidth = isMajor ? 1.5 : 1;
          ctx.beginPath();
          ctx.moveTo(centerX + Math.cos(angle) * r1, centerY + Math.sin(angle) * r1);
          ctx.lineTo(centerX + Math.cos(angle) * r2, centerY + Math.sin(angle) * r2);
          ctx.stroke();
        }

        // Sweeping mechanical hand
        const handAngle = t * 1.5 - Math.PI / 2;
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + Math.cos(handAngle) * (radius - 14), centerY + Math.sin(handAngle) * (radius - 14));
        ctx.stroke();

        // Center jewel
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '10px JetBrains Mono';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillText(`28,800 VPH · 4.0 Hz ESCAPEMENT`, 24, height - 20);
        ctx.fillText(`BRUTALIST TIMEPIECE ENGINE`, 24, 30);
      } else if (type === 'webgl') {
        // Volumetric Particle Matrix & Vector Coordinates
        const count = 35;
        const centerX = width / 2;
        const centerY = height / 2;

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1;

        for (let i = 0; i < count; i++) {
          const phi = (i / count) * Math.PI * 2 + t * 0.5;
          const rad = (Math.sin(t * 0.7 + i) * 0.35 + 0.65) * (width * 0.32);
          const px = centerX + Math.cos(phi) * rad;
          const py = centerY + Math.sin(phi * 1.5) * (rad * 0.55);

          // Node
          ctx.fillStyle = isHovered ? '#FFFFFF' : 'rgba(236, 236, 232, 0.7)';
          ctx.beginPath();
          ctx.arc(px, py, isHovered ? 2.5 : 1.5, 0, Math.PI * 2);
          ctx.fill();

          // Vector connector line to center
          if (i % 3 === 0) {
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(px, py);
            ctx.stroke();
          }
        }

        ctx.font = '10px JetBrains Mono';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillText(`250K PARTICLES · COMPUTE SHADER`, 24, height - 20);
        ctx.fillText(`VOLUMETRIC VECTOR MATRIX`, 24, 30);
      } else if (type === 'archival') {
        // Swiss Architectural Monograph Grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;

        // Archival Book spread outline
        const bookX = width * 0.18;
        const bookY = height * 0.18;
        const bookW = width * 0.64;
        const bookH = height * 0.64;

        ctx.strokeRect(bookX, bookY, bookW, bookH);
        ctx.beginPath();
        ctx.moveTo(bookX + bookW / 2, bookY);
        ctx.lineTo(bookX + bookW / 2, bookY + bookH);
        ctx.stroke();

        // Architectural typography block representations
        ctx.fillStyle = isHovered ? 'rgba(255, 255, 255, 0.7)' : 'rgba(140, 140, 140, 0.4)';
        ctx.fillRect(bookX + 16, bookY + 20, 60, 4);
        ctx.fillRect(bookX + 16, bookY + 30, bookW / 2 - 32, 2);
        ctx.fillRect(bookX + 16, bookY + 38, bookW / 2 - 40, 2);
        ctx.fillRect(bookX + 16, bookY + 46, bookW / 2 - 50, 2);

        // Right page image plate
        ctx.strokeRect(bookX + bookW / 2 + 16, bookY + 20, bookW / 2 - 32, bookH - 40);

        ctx.font = '10px JetBrains Mono';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillText(`EDITION OF 500 · 170GSM FEDRIGONI`, 24, height - 20);
        ctx.fillText(`SWISS ARCHIVAL MONOGRAPH`, 24, 30);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [type, isHovered]);

  return (
    <canvas
      ref={canvasRef}
      width={480}
      height={300}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        objectFit: 'cover',
      }}
    />
  );
};
