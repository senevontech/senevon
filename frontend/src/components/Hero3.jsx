import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";

/**
 * ✅ CHANGE:
 * - Support attaching a ref to a specific character index (for ripple origin).
 */
function splitToSpans(text, opts = {}) {
  const { rippleIndex = -1, rippleRef } = opts;

  return Array.from(text).map((ch, i) => {
    if (ch === " ") return <span key={i}>&nbsp;</span>;

    const isRipple = i === rippleIndex;

    return (
      <span
        key={i}
        ref={isRipple ? rippleRef : null} // ✅ CHANGE: ref on the "O"
        className={["hero-letter", isRipple ? "hero-letter--ripple" : ""].join(" ")}
      >
        {ch}
      </span>
    );
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
  const [isFullyErased, setIsFullyErased] = useState(false);
  const didTurnWhiteRef = useRef(false);

  // ✅ Custom cursor
  const cursorRef = useRef(null);
  const cursorRafRef = useRef(0);
  const cursorTargetRef = useRef({ x: 0, y: 0 });
  const cursorPosRef = useRef({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  // ✅ Ripple refs
  const rippleSourceRef = useRef(null); // the "O"
  const rippleCircleRef = useRef(null); // ring 1
  const rippleRing2Ref = useRef(null);  // ring 2
  const rippleTlRef = useRef(null);     // ✅ CHANGE: looping timeline

  const title = "SENEVON";
  const subtitle = "Rectify your Online presence";

  /**
   * ✅ CHANGE:
   * "S E N E V O N" => O is index 5 (0-based)
   */
  const titleSpans = useMemo(
    () => splitToSpans(title, { rippleIndex: 5, rippleRef: rippleSourceRef }),
    []
  );
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

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#d9d9d9";
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.globalCompositeOperation = "destination-out";

    setErasedPct(0);
    setIsFullyErased(false);
    didTurnWhiteRef.current = false;

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

    const radius = 92;

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
      const ctx = ctxRef.current;
      const wrap = wrapRef.current;
      if (!ctx || !wrap) return;

      const rect = wrap.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);
      if (w <= 0 || h <= 0) return;

      const sampleStep = 24;
      let total = 0;
      let cleared = 0;

      for (let y = 0; y < h; y += sampleStep) {
        for (let x = 0; x < w; x += sampleStep) {
          const pixel = ctx.getImageData(x, y, 1, 1).data;
          total += 1;
          if (pixel[3] === 0) cleared += 1;
        }
      }

      const pct = total ? Math.round((cleared / total) * 100) : 0;
      setErasedPct(pct);

      if (pct >= 98) setIsFullyErased(true);
    });
  };

  // ✅ Smooth cursor follow loop
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

      // lerp for smoothing
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

    cursorTargetRef.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };

    if (!cursorVisible) cursorPosRef.current = { ...cursorTargetRef.current };
  };

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
    const last = lastPointRef.current;
    drawEraserStroke(last, p);
    lastPointRef.current = p;
    scheduleProgressCheck();
  };

  const onPointerUp = () => {
    isDownRef.current = false;
  };

  // ✅ CHANGE: Update ripple center to "O" (no restart)
  const updateRippleOriginToO = () => {
    const oEl = rippleSourceRef.current;
    const ring1 = rippleCircleRef.current;
    const ring2 = rippleRing2Ref.current;
    if (!oEl || !ring1 || !ring2) return;

    const r = oEl.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;

    gsap.set([ring1, ring2], { x: cx, y: cy });
  };

  /**
   * ✅ CHANGE: Slow + smooth + cyclic fullscreen ripple (from "O")
   * - uses GSAP timeline repeat:-1 (loop)
   * - only transform + opacity (fast)
   * - respects prefers-reduced-motion
   */
  const startRippleLoopFromO = () => {
    const oEl = rippleSourceRef.current;
    const ring1 = rippleCircleRef.current;
    const ring2 = rippleRing2Ref.current;
    if (!oEl || !ring1 || !ring2) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) return;

    const r = oEl.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;

    const vw = window.innerWidth || 1;
    const vh = window.innerHeight || 1;
    const diag = Math.hypot(vw, vh);
    const targetScale = Math.min(5.2, Math.max(3.6, diag / 420)); // smooth + adaptive

    // kill old loop
    rippleTlRef.current?.kill();
    rippleTlRef.current = null;

    gsap.set([ring1, ring2], {
      x: cx,
      y: cy,
      scale: 0,
      opacity: 0,
      transformOrigin: "50% 50%",
    });

    const tl = gsap.timeline({
      repeat: -1,
      defaults: { ease: "power2.out" },
    });

    // ring 1
    tl.to(
      ring1,
      {
        scale: targetScale,
        opacity: 0,
        duration: 4.8,
        immediateRender: false,
        onStart: () => gsap.set(ring1, { opacity: 0.75, scale: 0 }),
      },
      0
    );

    // ring 2 (delayed)
    tl.to(
      ring2,
      {
        scale: targetScale,
        opacity: 0,
        duration: 4.8,
        immediateRender: false,
        onStart: () => gsap.set(ring2, { opacity: 0.55, scale: 0 }),
      },
      1.6
    );

    rippleTlRef.current = tl;
  };

  useEffect(() => {
    const touchCapable =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0;

    setIsTouch(!!touchCapable);

    setupCanvas();

    const onResize = () => {
      setupCanvas();
      updateRippleOriginToO(); // ✅ CHANGE: reposition without restarting loop
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      stopCursorLoop();

      // ✅ CHANGE: cleanup ripple loop
      rippleTlRef.current?.kill();
      rippleTlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    // ✅ CHANGE: start slow cyclic ripple after title settles
    tl.call(() => startRippleLoopFromO(), [], "+=0.10");

    return () => tl.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      {/* ✅ CHANGE: Fullscreen ripple layer (fixed) */}
      <div className="hero-ripple-layer" aria-hidden="true">
        <span ref={rippleCircleRef} className="hero-ripple-circle hero-r1" />
        <span ref={rippleRing2Ref} className="hero-ripple-circle hero-r2" />
      </div>

      <canvas
        ref={canvasRef}
        className="hero-canvas"
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture?.(e.pointerId);
          if (e.pointerType === "touch") isDownRef.current = true;
          onPointerDown(e);
        }}
        onPointerMove={(e) => onPointerMove(e)}
        onPointerUp={(e) => {
          onPointerUp(e);
          e.currentTarget.releasePointerCapture?.(e.pointerId);
        }}
        onPointerCancel={(e) => {
          onPointerUp(e);
          e.currentTarget.releasePointerCapture?.(e.pointerId);
        }}
      />

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
