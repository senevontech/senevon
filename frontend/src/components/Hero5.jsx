import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";

/* ----------------------------- helpers ----------------------------- */
function splitToSpans(text, { originIndex } = {}) {
  return Array.from(text).map((ch, i) => {
    if (ch === " ") return <span key={i}>&nbsp;</span>;
    const isOrigin = i === originIndex;

    return (
      <span
        key={i}
        className={`hero-letter ${isOrigin ? "hero-origin-letter" : ""}`}
        data-origin={isOrigin ? "true" : "false"}
      >
        {ch}
      </span>
    );
  });
}

/* ------------------------------ component ------------------------------ */
export default function Hero() {
  const wrapRef = useRef(null);

  // canvas erase
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const rafRef = useRef(0);
  const isDownRef = useRef(false);
  const lastPointRef = useRef({ x: 0, y: 0 });

  const [erasedPct, setErasedPct] = useState(0);
  const [isFullyErased, setIsFullyErased] = useState(false);
  const didTurnWhiteRef = useRef(false);

  // ripple
  const rippleRef = useRef(null);
  const rippleTweenRef = useRef(null);

  // custom cursor (mouse only)
  const cursorRef = useRef(null);
  const cursorRafRef = useRef(0);
  const cursorTargetRef = useRef({ x: 0, y: 0 });
  const cursorPosRef = useRef({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const title = "SENEVON";
  const subtitle = "Future Framed Engineering";

  // "O" index in SENEVON = 5
  const titleSpans = useMemo(() => splitToSpans(title, { originIndex: 5 }), []);
  const subtitleSpans = useMemo(() => splitToSpans(subtitle), []);

  /* --------------------------- canvas setup --------------------------- */
  const setupCanvas = () => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
    const rect = wrap.getBoundingClientRect();
    const w = Math.max(1, Math.floor(rect.width));
    const h = Math.max(1, Math.floor(rect.height));

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctxRef.current = ctx;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // paint mask
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#d9d9d9";
    ctx.fillRect(0, 0, w, h);

    // erase mode
    ctx.globalCompositeOperation = "destination-out";

    setErasedPct(0);
    setIsFullyErased(false);
    didTurnWhiteRef.current = false;

    // reset text colors
    gsap.set(wrap.querySelectorAll(".hero-title, .hero-subtitle, .hero-hint"), {
      color: "#000",
    });
    gsap.set(wrap.querySelectorAll(".hero-hint"), { opacity: 1 });
  };

  const getPoint = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    const clientX = e.touches?.[0]?.clientX ?? e.clientX;
    const clientY = e.touches?.[0]?.clientY ?? e.clientY;

    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const drawEraserStroke = (from, to) => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    // slightly smaller = smoother & cheaper (still feels big)
    const radius = 96;

    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.hypot(dx, dy);

    // fewer steps on low-end = cheaper (dynamic based on distance)
    const step = 8; // px
    const steps = Math.max(1, Math.floor(dist / step));

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

      const ctx = ctxRef.current;
      const wrap = wrapRef.current;
      if (!ctx || !wrap) return;

      const rect = wrap.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);
      if (w <= 0 || h <= 0) return;

      // sampling is the expensive part → keep it light
      const sampleStep = 28; // bigger step = faster
      let total = 0;
      let cleared = 0;

      for (let y = 0; y < h; y += sampleStep) {
        for (let x = 0; x < w; x += sampleStep) {
          const pixel = ctx.getImageData(x, y, 1, 1).data;
          total++;
          if (pixel[3] === 0) cleared++;
        }
      }

      const pct = total ? Math.round((cleared / total) * 100) : 0;
      setErasedPct(pct);
      if (pct >= 98) setIsFullyErased(true);
    });
  };

  /* -------------------------- custom cursor -------------------------- */
  const startCursorLoop = () => {
    if (cursorRafRef.current) return;

    const tick = () => {
      const el = cursorRef.current;
      if (!el) {
        cursorRafRef.current = 0;
        return;
      }

      const target = cursorTargetRef.current;
      const pos = cursorPosRef.current;

      pos.x += (target.x - pos.x) * 0.22;
      pos.y += (target.y - pos.y) * 0.22;

      el.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
      cursorRafRef.current = requestAnimationFrame(tick);
    };

    cursorRafRef.current = requestAnimationFrame(tick);
  };

  const stopCursorLoop = () => {
    if (!cursorRafRef.current) return;
    cancelAnimationFrame(cursorRafRef.current);
    cursorRafRef.current = 0;
  };

  const updateCursorTargetFromEvent = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    const clientX = e.touches?.[0]?.clientX ?? e.clientX;
    const clientY = e.touches?.[0]?.clientY ?? e.clientY;

    cursorTargetRef.current = { x: clientX - rect.left, y: clientY - rect.top };

    // first show → snap
    if (!cursorVisible) cursorPosRef.current = { ...cursorTargetRef.current };
  };

  /* ------------------------------ ripple ------------------------------ */
  const measureRipple = () => {
    const wrap = wrapRef.current;
    const ripple = rippleRef.current;
    if (!wrap || !ripple) return;

    const originEl = wrap.querySelector(".hero-origin-letter");
    if (!originEl) return;

    const wrapRect = wrap.getBoundingClientRect();
    const oRect = originEl.getBoundingClientRect();

    const ox = oRect.left - wrapRect.left + oRect.width / 2;
    const oy = oRect.top - wrapRect.top + oRect.height / 2;

    const w = wrapRect.width;
    const h = wrapRect.height;

    const d1 = Math.hypot(ox - 0, oy - 0);
    const d2 = Math.hypot(ox - w, oy - 0);
    const d3 = Math.hypot(ox - 0, oy - h);
    const d4 = Math.hypot(ox - w, oy - h);
    const maxR = Math.ceil(Math.max(d1, d2, d3, d4));

    ripple.style.width = `${maxR * 2}px`;
    ripple.style.height = `${maxR * 2}px`;
    ripple.style.left = `${ox - maxR}px`;
    ripple.style.top = `${oy - maxR}px`;
    ripple.style.transform = "scale(0)";
  };

  const playRipple = () => {
    const ripple = rippleRef.current;
    if (!ripple) return;

    rippleTweenRef.current?.kill?.();
    gsap.set(ripple, { scale: 0, opacity: 0 });

    rippleTweenRef.current = gsap
      .timeline()
      .to(ripple, { opacity: 0.28, duration: 0.18, ease: "power2.out" })
      .to(
        ripple,
        { scale: 1, duration: 1.45, ease: "expo.out" },
        0 // start with fade-in
      )
      .to(ripple, { opacity: 0, duration: 0.7, ease: "power2.out" }, 0.85);
  };

  /* --------------------------- pointer events -------------------------- */
  const onPointerEnter = () => {
    if (isTouch) return;
    setCursorVisible(true);
    startCursorLoop();
  };

  const onPointerLeave = () => {
    setCursorVisible(false);
    stopCursorLoop();
    isDownRef.current = false;
  };

  const onPointerDown = (e) => {
    isDownRef.current = true;
    const p = getPoint(e);
    lastPointRef.current = p;
    drawEraserStroke(p, p);
    scheduleProgressCheck();
  };

  const onPointerMove = (e) => {
    if (!isTouch) updateCursorTargetFromEvent(e);
    if (!isDownRef.current) return;

    const p = getPoint(e);
    drawEraserStroke(lastPointRef.current, p);
    lastPointRef.current = p;
    scheduleProgressCheck();
  };

  const onPointerUp = () => {
    isDownRef.current = false;
  };

  /* ----------------------------- mount/setup ----------------------------- */
  useEffect(() => {
    const touchCapable =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0;
    setIsTouch(!!touchCapable);

    setupCanvas();

    // layout must exist first
    requestAnimationFrame(() => measureRipple());

    const onResize = () => {
      setupCanvas();
      measureRipple();
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      stopCursorLoop();
      rippleTweenRef.current?.kill?.();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -------------------------- intro + ripple -------------------------- */
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

    tl.add(() => {
      measureRipple();
      playRipple();
    }, "-=0.10");

    return () => {
      tl.kill();
      rippleTweenRef.current?.kill?.();
    };
  }, []);

  /* ------------------ text to white after fully erased ------------------ */
  useEffect(() => {
    if (!isFullyErased) return;
    if (didTurnWhiteRef.current) return;

    const wrap = wrapRef.current;
    if (!wrap) return;

    didTurnWhiteRef.current = true;

    gsap.to(wrap.querySelectorAll(".hero-title, .hero-subtitle"), {
      color: "#ffffff",
      duration: 0.6,
      ease: "power2.out",
    });

    gsap.to(wrap.querySelectorAll(".hero-hint"), {
      opacity: 0.5,
      duration: 0.5,
      ease: "power2.out",
    });
  }, [isFullyErased]);

  return (
    <section ref={wrapRef} className="hero">
      <video
        className="hero-video"
        src="/video/robot.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      <canvas
        ref={canvasRef}
        className="hero-canvas"
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture?.(e.pointerId);
          onPointerDown(e);
        }}
        onPointerMove={onPointerMove}
        onPointerUp={(e) => {
          onPointerUp();
          e.currentTarget.releasePointerCapture?.(e.pointerId);
        }}
        onPointerCancel={(e) => {
          onPointerUp();
          e.currentTarget.releasePointerCapture?.(e.pointerId);
        }}
      />

      {/* ✅ Ripple layer (super light) */}
      <div ref={rippleRef} className="hero-ripple" aria-hidden="true" />

      {/* ✅ Custom cursor (mouse only) */}
      {!isTouch && (
        <div
          ref={cursorRef}
          className={`hero-eraser-cursor ${cursorVisible ? "is-visible" : ""} ${
            isDownRef.current ? "is-down" : ""
          }`}
          aria-hidden="true"
        >
          <div className="hero-eraser-ring" />
          <div className="hero-eraser-dot" />
        </div>
      )}

      <div className="hero-content">
        <h1 className="hero-title">{titleSpans}</h1>
        <p className="hero-subtitle">{subtitleSpans}</p>

        <div className="hero-hint">
          <span className="dot" />
          <span>{isFullyErased ? "Good job, u got it" : "Erase It"}</span>
          <span className="pct">{erasedPct}%</span>
        </div>
      </div>
    </section>
  );
}
