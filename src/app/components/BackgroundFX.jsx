import React, { useEffect, useRef } from "react";

/**
 * Canvas full-screen para brilhos/partículas discretas.
 * Uso:
 *   <BackgroundFX />  // global
 *   <BackgroundFX variant="login" /> // mais partículas na tela de login
 */
export default function BackgroundFX({ variant = "global" }) {
  const ref = useRef(null);

  useEffect(() => {
    const c = ref.current;
    const ctx = c.getContext("2d");
    let frame = 0;
    let raf = 0;

    function resize() {
      c.width = window.innerWidth * devicePixelRatio;
      c.height = window.innerHeight * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }
    resize();
    window.addEventListener("resize", resize);

    const DENSITY = variant === "login" ? 80 : 35; // mais “wow” no login
    const particles = Array.from({ length: DENSITY }, () => {
      const r = Math.random() * 1.6 + 0.4;
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r,
        a: Math.random() * Math.PI * 2,
        s: 0.15 + Math.random() * 0.35,
      };
    });

    function tick() {
      frame++;
      ctx.clearRect(0, 0, c.width, c.height);

      // leve véu roxo
      const grd = ctx.createLinearGradient(0,0, window.innerWidth, window.innerHeight);
      grd.addColorStop(0, "rgba(124,58,237,0.06)");
      grd.addColorStop(1, "rgba(167,139,250,0.05)");
      ctx.fillStyle = grd;
      ctx.fillRect(0,0, window.innerWidth, window.innerHeight);

      // partículas
      particles.forEach(p => {
        p.x += Math.cos(p.a) * p.s;
        p.y += Math.sin(p.a) * p.s;
        p.a += 0.004; // leve curvatura

        // wrap de tela
        if (p.x < -20) p.x = window.innerWidth + 20;
        if (p.x > window.innerWidth + 20) p.x = -20;
        if (p.y < -20) p.y = window.innerHeight + 20;
        if (p.y > window.innerHeight + 20) p.y = -20;

        // brilho pulsante
        const pulse = 0.5 + 0.5 * Math.sin(frame * 0.02 + p.a);
        ctx.beginPath();
        ctx.fillStyle = `rgba(196,181,253,${0.08 + pulse*0.12})`;
        ctx.arc(p.x, p.y, p.r * (1 + pulse*0.4), 0, Math.PI*2);
        ctx.fill();

        // núcleo
        ctx.beginPath();
        ctx.fillStyle = "rgba(124,58,237,0.55)";
        ctx.arc(p.x, p.y, p.r*0.6, 0, Math.PI*2);
        ctx.fill();
      });

      raf = requestAnimationFrame(tick);
    }
    tick();

    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [variant]);

  return (
    <canvas
      ref={ref}
      style={{
        position:"fixed", inset:0, width:"100vw", height:"100vh",
        zIndex:0, pointerEvents:"none", mixBlendMode:"screen", opacity:.85
      }}
      aria-hidden
    />
  );
}
