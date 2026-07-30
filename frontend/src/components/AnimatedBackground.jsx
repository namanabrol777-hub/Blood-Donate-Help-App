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

    // Mouse tracking for medical red spotlight
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      radius: 200,
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Floating Blood Cell Particles
    const numCells = Math.min(Math.floor((width * height) / 16000), 65);
    const bloodCells = [];

    class BloodCell {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 3 + 2;
        this.baseAlpha = Math.random() * 0.4 + 0.2;
        this.color = Math.random() > 0.3 ? "#DC2626" : "#EF4444";
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
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
        ctx.shadowColor = "#DC2626";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      }
    }

    for (let i = 0; i < numCells; i++) {
      bloodCells.push(new BloodCell());
    }

    // ECG Heartbeat wave parameters
    let ecgOffsetX = 0;

    const drawECGLine = () => {
      const centerY = height * 0.85;
      ecgOffsetX = (ecgOffsetX + 2.5) % width;

      ctx.beginPath();
      ctx.moveTo(0, centerY);

      for (let x = 0; x < width; x += 5) {
        let y = centerY;
        const distToPulse = Math.abs(x - ecgOffsetX);

        if (distToPulse < 40) {
          // ECG Heartbeat spikes (PQRST wave pattern)
          const norm = (distToPulse / 40) * Math.PI * 2;
          y = centerY - Math.sin(norm) * 35 * Math.exp(-Math.abs(distToPulse - 20) / 10);
        }

        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = "rgba(220, 38, 38, 0.25)";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#DC2626";
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    // Main 60FPS Render Loop
    const render = () => {
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // Radial Medical Red + Emergency Blue spotlight
      const radialGradient = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        380
      );
      radialGradient.addColorStop(0, "rgba(220, 38, 38, 0.16)");
      radialGradient.addColorStop(0.5, "rgba(59, 130, 246, 0.06)");
      radialGradient.addColorStop(1, "rgba(9, 9, 11, 0)");

      ctx.fillStyle = radialGradient;
      ctx.fillRect(0, 0, width, height);

      // Draw floating blood cells
      for (let i = 0; i < bloodCells.length; i++) {
        bloodCells[i].update();
        bloodCells[i].draw();

        // Connect nearby blood cells with subtle crimson lines
        for (let j = i + 1; j < bloodCells.length; j++) {
          const dx = bloodCells[i].x - bloodCells[j].x;
          const dy = bloodCells[i].y - bloodCells[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(bloodCells[i].x, bloodCells[i].y);
            ctx.lineTo(bloodCells[j].x, bloodCells[j].y);
            ctx.strokeStyle = "rgba(220, 38, 38, 0.12)";
            ctx.lineWidth = 1 - dist / 110;
            ctx.stroke();
          }
        }
      }

      // Draw ECG Line
      drawECGLine();

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
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#09090b]">
      {/* Medical Crimson & Emergency Blue Aurora Blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/20 rounded-full blur-[130px] animate-pulse" />
      <div className="absolute top-1/2 -right-40 w-[30rem] h-[30rem] bg-rose-600/20 rounded-full blur-[150px] animate-pulse delay-1000" />
      <div className="absolute -bottom-40 left-1/3 w-[26rem] h-[26rem] bg-blue-600/15 rounded-full blur-[140px] animate-pulse delay-700" />

      {/* 60FPS Interactive Canvas */}
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

export default AnimatedBackground;
