import React, { useEffect, useRef } from "react";

const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Mouse tracking for magnetic lighting & DNA speed reactivity
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      radius: 240,
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // --- 1. Floating Blood Cells & Molecules ---
    // Red Blood Cells (RBC), White Blood Cells (WBC), Oxygen Molecules
    const numCells = Math.min(Math.floor((width * height) / 15000), 70);
    const cells = [];

    class Cell {
      constructor() {
        this.reset();
        this.y = Math.random() * height; // initial distribution
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 50;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = -(Math.random() * 0.5 + 0.2);
        
        // Type: 0 = RBC (Red), 1 = WBC (White/Cyan), 2 = Oxygen (Cyan dot)
        const rand = Math.random();
        if (rand < 0.6) {
          this.type = 0; // Red Blood Cell
          this.radius = Math.random() * 4 + 3;
          this.color = "#DC2626";
        } else if (rand < 0.85) {
          this.type = 1; // White Blood Cell
          this.radius = Math.random() * 6 + 5;
          this.color = "#3B82F6";
        } else {
          this.type = 2; // Oxygen Molecule
          this.radius = Math.random() * 2.5 + 1.5;
          this.color = "#06B6D4";
        }
        this.baseAlpha = Math.random() * 0.35 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.y < -20 || this.x < -20 || this.x > width + 20) {
          this.reset();
        }
      }

      draw() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let alpha = this.baseAlpha;

        if (dist < mouse.radius) {
          alpha = this.baseAlpha + (1 - dist / mouse.radius) * 0.5;
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = alpha;

        if (this.type === 0) {
          // Biconcave inner shadow for RBC
          ctx.shadowColor = "#DC2626";
          ctx.shadowBlur = 8;
          ctx.fill();
        } else if (this.type === 1) {
          // Glow for WBC
          ctx.shadowColor = "#3B82F6";
          ctx.shadowBlur = 12;
          ctx.fill();
        } else {
          ctx.shadowColor = "#06B6D4";
          ctx.shadowBlur = 6;
          ctx.fill();
        }

        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      }
    }

    for (let i = 0; i < numCells; i++) {
      cells.push(new Cell());
    }

    // --- 2. 3D Rotating DNA Double Helix ---
    let dnaRotationAngle = 0;

    const draw3DDNAHelix = () => {
      const centerX = width * 0.85; // Right-hand side vertical DNA strand
      const startY = -50;
      const endY = height + 50;
      const numRungs = 35;
      const helixWidth = 45;
      const stepY = (endY - startY) / numRungs;

      // Mouse speed influence
      const dx = mouse.x - centerX;
      const speedMult = Math.abs(dx) < 300 ? 0.025 : 0.015;
      dnaRotationAngle += speedMult;

      for (let i = 0; i < numRungs; i++) {
        const y = startY + i * stepY;
        const phase = i * 0.25 + dnaRotationAngle;

        // 3D Projection Sine/Cosine
        const sinVal = Math.sin(phase);
        const cosVal = Math.cos(phase);

        const x1 = centerX + sinVal * helixWidth;
        const x2 = centerX - sinVal * helixWidth;

        const z1 = cosVal; // Depth factor (-1 to +1)
        const z2 = -cosVal;

        // Base pair connecting rung
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 + Math.abs(z1) * 0.12})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Strand 1 Nucleotide Bead
        const r1 = 3.5 + z1 * 1.5;
        ctx.beginPath();
        ctx.arc(x1, y, Math.max(1, r1), 0, Math.PI * 2);
        ctx.fillStyle = z1 > 0 ? "#DC2626" : "#3B82F6";
        ctx.globalAlpha = 0.3 + (z1 + 1) * 0.35;
        ctx.shadowColor = z1 > 0 ? "#DC2626" : "#3B82F6";
        ctx.shadowBlur = 10;
        ctx.fill();

        // Strand 2 Nucleotide Bead
        const r2 = 3.5 + z2 * 1.5;
        ctx.beginPath();
        ctx.arc(x2, y, Math.max(1, r2), 0, Math.PI * 2);
        ctx.fillStyle = z2 > 0 ? "#DC2626" : "#06B6D4";
        ctx.globalAlpha = 0.3 + (z2 + 1) * 0.35;
        ctx.shadowColor = z2 > 0 ? "#DC2626" : "#06B6D4";
        ctx.shadowBlur = 10;
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      }
    };

    // --- 3. ECG Heartbeat Wave ---
    let ecgProgress = 0;

    const drawECGWave = () => {
      const centerY = height * 0.88;
      ecgProgress = (ecgProgress + 3) % width;

      ctx.beginPath();
      ctx.moveTo(0, centerY);

      for (let x = 0; x < width; x += 6) {
        let y = centerY;
        const dist = Math.abs(x - ecgProgress);

        if (dist < 45) {
          const norm = (dist / 45) * Math.PI * 2;
          y = centerY - Math.sin(norm) * 40 * Math.exp(-Math.abs(dist - 22) / 12);
        }

        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = "rgba(220, 38, 38, 0.3)";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "#DC2626";
      ctx.shadowBlur = 14;
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    // --- Main 60FPS Render Loop ---
    const render = () => {
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // VisionOS Biotech Background Gradient
      const bgGrad = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        450
      );
      bgGrad.addColorStop(0, "rgba(220, 38, 38, 0.14)");
      bgGrad.addColorStop(0.4, "rgba(59, 130, 246, 0.07)");
      bgGrad.addColorStop(1, "rgba(5, 7, 13, 0)");

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw Floating Cells (RBC/WBC/Oxygen)
      for (let i = 0; i < cells.length; i++) {
        cells[i].update();
        cells[i].draw();
      }

      // Draw 3D Rotating DNA Strand
      draw3DDNAHelix();

      // Draw ECG Wave Line
      drawECGWave();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#05070d]">
      {/* VisionOS Holographic Ambient Blobs */}
      <div className="absolute -top-40 -left-40 w-[30rem] h-[30rem] bg-red-600/18 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute top-1/3 -right-40 w-[35rem] h-[35rem] bg-blue-600/18 rounded-full blur-[160px] animate-pulse delay-1000" />
      <div className="absolute -bottom-40 left-1/3 w-[30rem] h-[30rem] bg-cyan-600/15 rounded-full blur-[150px] animate-pulse delay-700" />

      {/* 60FPS Interactive Biotech Canvas */}
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

export default AnimatedBackground;
