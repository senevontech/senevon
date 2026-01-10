import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";

function splitToSpans(text) {
  // Keeps spaces
  return Array.from(text).map((ch, i) => {
    if (ch === " ") return <span key={i}>&nbsp;</span>;
    return <span key={i} className="hero-letter">{ch}</span>;
  });
}

export default function Hero() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const rafRef = useRef(0);
  const isDownRef = useRef(false);
  const lastPointRef = useRef({ x: 0, y: 0 });

  const [erasedPct, setErasedPct] = useState(0);

  const title = "SENEVON";
  const subtitle = "Rectify your Online presence";

  const titleSpans = useMemo(() => splitToSpans(title), []);
  const subtitleSpans = useMemo(() => splitToSpans(subtitle), []);

  const setupCanvas = () => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
    const rect = wrap.getBoundingClientRect();

    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctxRef.current = ctx;

    // Reset transform for DPR
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Fill with white overlay
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Eraser mode: draw transparent holes
    ctx.globalCompositeOperation = "destination-out";
  };

  const getPoint = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    const clientX = e.touches?.[0]?.clientX ?? e.clientX;
    const clientY = e.touches?.[0]?.clientY ?? e.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const drawEraserStroke = (from, to) => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    // Brush size
    const radius = 102;

    // Smooth stroke by drawing along a line
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.hypot(dx, dy);
    const steps = Math.max(1, Math.floor(dist / 6));

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = from.x + dx * t;
      const y = from.y + dy * t;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const scheduleProgressCheck = () => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      const wrap = wrapRef.current;
      if (!canvas || !ctx || !wrap) return;

      // Lightweight progress estimation (sample pixels)
      // We sample a grid instead of scanning all pixels.
      const rect = wrap.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);
      if (w <= 0 || h <= 0) return;

      const sampleStep = 24; // bigger = faster, less accurate
      let total = 0;
      let cleared = 0;

      // Read pixel data in chunks
      // Note: canvas is in CSS px space because we setTransform(dpr..)
      for (let y = 0; y < h; y += sampleStep) {
        for (let x = 0; x < w; x += sampleStep) {
          const pixel = ctx.getImageData(x, y, 1, 1).data; // [r,g,b,a]
          total += 1;
          // white overlay exists where alpha > 0 (since we erase alpha)
          if (pixel[3] === 0) cleared += 1;
        }
      }

      const pct = total ? Math.round((cleared / total) * 100) : 0;
      setErasedPct(pct);
    });
  };

  const onPointerDown = (e) => {
    isDownRef.current = true;
    const p = getPoint(e);
    lastPointRef.current = p;
    drawEraserStroke(p, p);
    scheduleProgressCheck();
  };

  const onPointerMove = (e) => {
    if (!isDownRef.current) return;
    const p = getPoint(e);
    const last = lastPointRef.current;
    drawEraserStroke(last, p);
    lastPointRef.current = p;
    scheduleProgressCheck();
  };

  const onPointerUp = () => {
    isDownRef.current = false;
  };

  useEffect(() => {
    setupCanvas();
    const onResize = () => setupCanvas();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const titleLetters = wrap.querySelectorAll(".hero-title .hero-letter");
    const subtitleLetters = wrap.querySelectorAll(".hero-subtitle .hero-letter");

    gsap.set([titleLetters, subtitleLetters], {
      opacity: 0,
      y: 24,
      rotateX: 60,
      transformOrigin: "50% 50%",
    });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.to(titleLetters, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 0.7,
      stagger: 0.045,
    }).to(
      subtitleLetters,
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.55,
        stagger: 0.018,
      },
      "-=0.35"
    );

    return () => tl.kill();
  }, []);

  return (
    <section ref={wrapRef} className="hero">
      {/* Video UNDER the canvas */}
      <video
        className="hero-video"
        src="/video/video.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* White erasable canvas OVER the video */}
      <canvas
        ref={canvasRef}
        className="hero-canvas"
        onMouseDown={onPointerDown}
        onMouseMove={onPointerMove}
        onMouseUp={onPointerUp}
        onMouseLeave={onPointerUp}
        onTouchStart={(e) => {
          e.preventDefault();
          onPointerDown(e);
        }}
        onTouchMove={(e) => {
          e.preventDefault();
          onPointerMove(e);
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          onPointerUp();
        }}
      />

      {/* Text content ABOVE everything */}
      <div className="hero-content">
        <h1 className="hero-title">{titleSpans}</h1>
        <p className="hero-subtitle">{subtitleSpans}</p>

        <div className="hero-hint">
          <span className="dot" />
          <span>Erase to reveal</span>
          <span className="pct">{erasedPct}%</span>
        </div>
      </div>
    </section>
  );
}
