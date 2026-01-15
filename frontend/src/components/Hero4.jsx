import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";

/**
 * Split text into spans and attach a ref to a specific index ("O" in SENEVON).
 */
function splitToSpans(text, opts = {}) {
  const { rippleIndex = -1, rippleRef } = opts;

  return Array.from(text).map((ch, i) => {
    if (ch === " ") return <span key={i}>&nbsp;</span>;

    const isRipple = i === rippleIndex;

    return (
      <span
        key={i}
        ref={isRipple ? rippleRef : null}
        className={"hero-letter" + (isRipple ? " hero-letter--ripple" : "")}
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

  // Erase tracking (FAST: no getImageData)
  const gridRef = useRef({
    cols: 0,
    rows: 0,
    cell: 0,
    hit: null, // Uint8Array
    cleared: 0,
    total: 0,
  });

  const rafDrawRef = useRef(0);
  const isDownRef = useRef(false);
  const lastPointRef = useRef({ x: 0, y: 0 });
  const strokeQueueRef = useRef([]); // points batch per RAF

  const [erasedPct, setErasedPct] = useState(0);
  const [isFullyErased, setIsFullyErased] = useState(false);
  const didTurnWhiteRef = useRef(false);

  // Custom cursor (desktop only)
  const cursorRef = useRef(null);
  const cursorRafRef = useRef(0);
  const cursorTargetRef = useRef({ x: 0, y: 0 });
  const cursorPosRef = useRef({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  // Ripple origin = "O"
  const rippleSourceRef = useRef(null);

  const title = "SENEVON";
  const subtitle = "Rectify your Online presence";

  // "S E N E V O N" => O is index 5 (0-based)
  const titleSpans = useMemo(
    () => splitToSpans(title, { rippleIndex: 5, rippleRef: rippleSourceRef }),
    []
  );
  const subtitleSpans = useMemo(() => splitToSpans(subtitle), []);

  const prefersReduceMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const setupCanvas = () => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const rect = wrap.getBoundingClientRect();

    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d", { willReadFrequently: false });
    ctxRef.current = ctx;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // White-ish layer to erase
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#d9d9d9";
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Erasing mode
    ctx.globalCompositeOperation = "destination-out";

    // --- FAST ERASE GRID SETUP ---
    // Choose a cell size that is stable across screens (bigger = faster)
    const cell = rect.width < 520 ? 28 : 34; // mobile: tighter, desktop: faster
    const cols = Math.max(10, Math.floor(rect.width / cell));
    const rows = Math.max(10, Math.floor(rect.height / cell));
    const total = cols * rows;

    gridRef.current = {
      cols,
      rows,
      cell,
      hit: new Uint8Array(total),
      cleared: 0,
      total,
    };

    setErasedPct(0);
    setIsFullyErased(false);
    didTurnWhiteRef.current = false;

    // Reset text colors
    gsap.set(wrap.querySelectorAll(".hero-title, .hero-subtitle, .hero-hint"), {
      color: "#000",
    });
    gsap.set(wrap.querySelectorAll(".hero-hint"), { opacity: 1 });

    // Update ripple origin vars
    updateRippleVars();
  };

  const getPoint = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches?.[0]?.clientX ?? e.clientX;
    const clientY = e.touches?.[0]?.clientY ?? e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  // Mark erase grid by circle area (fast)
  const markGridByCircle = (x, y, radius) => {
    const g = gridRef.current;
    if (!g.hit) return;

    const { cols, rows, cell } = g;

    const minCol = Math.max(0, Math.floor((x - radius) / cell));
    const maxCol = Math.min(cols - 1, Math.floor((x + radius) / cell));
    const minRow = Math.max(0, Math.floor((y - radius) / cell));
    const maxRow = Math.min(rows - 1, Math.floor((y + radius) / cell));

    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        const idx = r * cols + c;
        if (g.hit[idx] === 1) continue;

        // optional: circle check for accuracy (still cheap)
        const cx = c * cell + cell / 2;
        const cy = r * cell + cell / 2;
        const dx = cx - x;
        const dy = cy - y;
        if (dx * dx + dy * dy <= (radius + cell * 0.65) ** 2) {
          g.hit[idx] = 1;
          g.cleared += 1;
        }
      }
    }
  };

  const queueStroke = (from, to) => {
    strokeQueueRef.current.push({ from, to });
    if (rafDrawRef.current) return;

    rafDrawRef.current = requestAnimationFrame(() => {
      rafDrawRef.current = 0;

      const ctx = ctxRef.current;
      const wrap = wrapRef.current;
      if (!ctx || !wrap) return;

      const queue = strokeQueueRef.current;
      strokeQueueRef.current = [];

      // Big radius = expensive, but OK if we batch per RAF
      const radius = wrap.getBoundingClientRect().width < 520 ? 78 : 102;

      for (const seg of queue) {
        const { from, to } = seg;

        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const dist = Math.hypot(dx, dy);
        const steps = Math.max(1, Math.floor(dist / 10)); // fewer steps (faster)

        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const x = from.x + dx * t;
          const y = from.y + dy * t;

          // draw
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();

          // update erase grid
          markGridByCircle(x, y, radius);
        }
      }

      // update percentage (no canvas reads)
      const g = gridRef.current;
      const pct = g.total ? Math.round((g.cleared / g.total) * 100) : 0;
      setErasedPct(pct);
      if (pct >= 98) setIsFullyErased(true);
    });
  };

  // Cursor smoothing loop
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
    queueStroke(p, p);
  };

  const onPointerMove = (e) => {
    if (!isTouch) updateCursorTargetFromEvent(e);
    if (!isDownRef.current) return;

    const p = getPoint(e);
    const last = lastPointRef.current;
    queueStroke(last, p);
    lastPointRef.current = p;
  };

  const onPointerUp = () => {
    isDownRef.current = false;
  };

  // ✅ Ripple: set CSS vars from "O" position (no GSAP loop)
  const updateRippleVars = () => {
    const wrap = wrapRef.current;
    const oEl = rippleSourceRef.current;
    if (!wrap || !oEl) return;

    const r = oEl.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;

    wrap.style.setProperty("--ripple-x", `${cx}px`);
    wrap.style.setProperty("--ripple-y", `${cy}px`);
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
      updateRippleVars();
    };

    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("resize", onResize);
      stopCursorLoop();
      if (rafDrawRef.current) cancelAnimationFrame(rafDrawRef.current);
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

    // set ripple vars after letters are in place
    tl.call(() => updateRippleVars(), [], "+=0.03");

    return () => tl.kill();
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
      opacity: 0.55,
      duration: 0.5,
      ease: "power2.out",
    });
  }, [isFullyErased]);

  // reduce motion: disable ripple animation via class
  const reduce = prefersReduceMotion();

  return (
    <section ref={wrapRef} className={"hero" + (reduce ? " reduce-motion" : "")}>
      <video
        className="hero-video"
        src="/video/robot.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* ✅ Fullscreen ripple (slow + cyclic) */}
      <div className="hero-ripple-layer" aria-hidden="true">
        <span className="hero-ripple r1" />
        <span className="hero-ripple r2" />
        <span className="hero-ripple r3" />
      </div>

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

      {!isTouch && (
        <div
          ref={cursorRef}
          className={
            "hero-eraser-cursor" +
            (cursorVisible ? " is-visible" : "") +
            (isDownRef.current ? " is-down" : "")
          }
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
