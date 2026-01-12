
// import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
// import gsap from "gsap";

// function splitToSpans(text) {
//   // Keeps spaces
//   return Array.from(text).map((ch, i) => {
//     if (ch === " ") return <span key={i}>&nbsp;</span>;
//     return (
//       <span key={i} className="hero-letter">
//         {ch}
//       </span>
//     );
//   });
// }

// export default function Hero() {
//   const wrapRef = useRef(null);
//   const canvasRef = useRef(null);
//   const ctxRef = useRef(null);

//   const rafRef = useRef(0);
//   const isDownRef = useRef(false);
//   const lastPointRef = useRef({ x: 0, y: 0 });

//   const [erasedPct, setErasedPct] = useState(0);
//   const [isFullyErased, setIsFullyErased] = useState(false);

//   // prevents repeated gsap triggers
//   const didTurnWhiteRef = useRef(false);

//   const title = "SENEVON";
//   const subtitle = "Rectify your Online presence";

//   const titleSpans = useMemo(() => splitToSpans(title), []);
//   const subtitleSpans = useMemo(() => splitToSpans(subtitle), []);

//   const setupCanvas = () => {
//     const canvas = canvasRef.current;
//     const wrap = wrapRef.current;
//     if (!canvas || !wrap) return;

//     const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
//     const rect = wrap.getBoundingClientRect();

//     canvas.width = Math.floor(rect.width * dpr);
//     canvas.height = Math.floor(rect.height * dpr);
//     canvas.style.width = `${rect.width}px`;
//     canvas.style.height = `${rect.height}px`;

//     const ctx = canvas.getContext("2d", { willReadFrequently: true });
//     ctxRef.current = ctx;

//     // Reset transform for DPR
//     ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

//     // Fill with white overlay
//     ctx.globalCompositeOperation = "source-over";
//     ctx.fillStyle = "#ffffff";
//     ctx.fillRect(0, 0, rect.width, rect.height);

//     // Eraser mode: draw transparent holes
//     ctx.globalCompositeOperation = "destination-out";

//     // reset states on resize / reset
//     setErasedPct(0);
//     setIsFullyErased(false);
//     didTurnWhiteRef.current = false;

//     // Reset text back to black instantly (so resize doesn’t keep white)
//     if (wrap) {
//       gsap.set(wrap.querySelectorAll(".hero-title, .hero-subtitle, .hero-hint"), {
//         color: "#000",
//       });
//       gsap.set(wrap.querySelectorAll(".hero-hint"), { opacity: 1 });
//     }
//   };

//   const getPoint = (e) => {
//     const canvas = canvasRef.current;
//     if (!canvas) return { x: 0, y: 0 };
//     const rect = canvas.getBoundingClientRect();

//     const clientX = e.touches?.[0]?.clientX ?? e.clientX;
//     const clientY = e.touches?.[0]?.clientY ?? e.clientY;

//     return {
//       x: clientX - rect.left,
//       y: clientY - rect.top,
//     };
//   };

//   const drawEraserStroke = (from, to) => {
//     const ctx = ctxRef.current;
//     const canvas = canvasRef.current;
//     if (!ctx || !canvas) return;

//     const radius = 102;

//     const dx = to.x - from.x;
//     const dy = to.y - from.y;
//     const dist = Math.hypot(dx, dy);
//     const steps = Math.max(1, Math.floor(dist / 6));

//     for (let i = 0; i <= steps; i++) {
//       const t = i / steps;
//       const x = from.x + dx * t;
//       const y = from.y + dy * t;

//       ctx.beginPath();
//       ctx.arc(x, y, radius, 0, Math.PI * 2);
//       ctx.fill();
//     }
//   };

//   const scheduleProgressCheck = () => {
//     if (rafRef.current) return;
//     rafRef.current = requestAnimationFrame(() => {
//       rafRef.current = 0;
//       const ctx = ctxRef.current;
//       const wrap = wrapRef.current;
//       if (!ctx || !wrap) return;

//       const rect = wrap.getBoundingClientRect();
//       const w = Math.floor(rect.width);
//       const h = Math.floor(rect.height);
//       if (w <= 0 || h <= 0) return;

//       const sampleStep = 24;
//       let total = 0;
//       let cleared = 0;

//       for (let y = 0; y < h; y += sampleStep) {
//         for (let x = 0; x < w; x += sampleStep) {
//           const pixel = ctx.getImageData(x, y, 1, 1).data; // [r,g,b,a]
//           total += 1;
//           if (pixel[3] === 0) cleared += 1;
//         }
//       }

//       const pct = total ? Math.round((cleared / total) * 100) : 0;
//       setErasedPct(pct);

//       // ✅ mark fully erased (use 98 to avoid “never hits 100” due to sampling)
//       if (pct >= 98) setIsFullyErased(true);
//     });
//   };

//   const onPointerDown = (e) => {
//     isDownRef.current = true;
//     const p = getPoint(e);
//     lastPointRef.current = p;
//     drawEraserStroke(p, p);
//     scheduleProgressCheck();
//   };

//   const onPointerMove = (e) => {
//     if (!isDownRef.current) return;
//     const p = getPoint(e);
//     const last = lastPointRef.current;
//     drawEraserStroke(last, p);
//     lastPointRef.current = p;
//     scheduleProgressCheck();
//   };

//   const onPointerUp = () => {
//     isDownRef.current = false;
//   };

//   useEffect(() => {
//     setupCanvas();
//     const onResize = () => setupCanvas();
//     window.addEventListener("resize", onResize);
//     return () => window.removeEventListener("resize", onResize);
//   }, []);

//   useLayoutEffect(() => {
//     const wrap = wrapRef.current;
//     if (!wrap) return;

//     const titleLetters = wrap.querySelectorAll(".hero-title .hero-letter");
//     const subtitleLetters = wrap.querySelectorAll(".hero-subtitle .hero-letter");

//     gsap.set([titleLetters, subtitleLetters], {
//       opacity: 0,
//       y: 24,
//       rotateX: 60,
//       transformOrigin: "50% 50%",
//     });

//     const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

//     tl.to(titleLetters, {
//       opacity: 1,
//       y: 0,
//       rotateX: 0,
//       duration: 0.7,
//       stagger: 0.045,
//     }).to(
//       subtitleLetters,
//       {
//         opacity: 1,
//         y: 0,
//         rotateX: 0,
//         duration: 0.55,
//         stagger: 0.018,
//       },
//       "-=0.35"
//     );

//     return () => tl.kill();
//   }, []);

//   // ✅ When fully erased → animate text to white
//   useEffect(() => {
//     if (!isFullyErased) return;
//     if (didTurnWhiteRef.current) return;

//     const wrap = wrapRef.current;
//     if (!wrap) return;

//     didTurnWhiteRef.current = true;

//     gsap.to(wrap.querySelectorAll(".hero-title, .hero-subtitle"), {
//       color: "#ffffff",
//       duration: 0.6,
//       ease: "power2.out",
//     });

//     // optional: hint becomes subtle
//     gsap.to(wrap.querySelectorAll(".hero-hint"), {
//       opacity: 0.5,
//       duration: 0.5,
//       ease: "power2.out",
//     });
//   }, [isFullyErased]);

//   return (
//     <section ref={wrapRef} className="hero">
//       <video
//         className="hero-video"
//         src="/video/video.mp4"
//         autoPlay
//         muted
//         loop
//         playsInline
//       />

//       <canvas
//         ref={canvasRef}
//         className="hero-canvas"
//         onMouseDown={onPointerDown}
//         onMouseMove={onPointerMove}
//         onMouseUp={onPointerUp}
//         onMouseLeave={onPointerUp}
//         onTouchStart={(e) => {
//           e.preventDefault();
//           onPointerDown(e);
//         }}
//         onTouchMove={(e) => {
//           e.preventDefault();
//           onPointerMove(e);
//         }}
//         onTouchEnd={(e) => {
//           e.preventDefault();
//           onPointerUp();
//         }}
//       />

//       <div className="hero-content">
//         <h1 className="hero-title">{titleSpans}</h1>
//         <p className="hero-subtitle">{subtitleSpans}</p>

//         <div className="hero-hint">
//           <span className="dot" />
//           <span>Erase to reveal</span>
//           <span className="pct">{erasedPct}%</span>
//         </div>
//       </div>
//     </section>
//   );
// }














































import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";

function splitToSpans(text) {
  return Array.from(text).map((ch, i) => {
    if (ch === " ") return <span key={i}>&nbsp;</span>;
    return (
      <span key={i} className="hero-letter">
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

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.globalCompositeOperation = "destination-out";

    setErasedPct(0);
    setIsFullyErased(false);
    didTurnWhiteRef.current = false;

    if (wrap) {
      gsap.set(wrap.querySelectorAll(".hero-title, .hero-subtitle, .hero-hint"), {
        color: "#000",
      });
      gsap.set(wrap.querySelectorAll(".hero-hint"), { opacity: 1 });
    }
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

    const radius = 102;

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

    // initialize position on first show
    if (!cursorVisible) {
      cursorPosRef.current = { ...cursorTargetRef.current };
    }
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

  useEffect(() => {
    // detect touch devices so we don't show cursor
    const touchCapable =
      "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    setIsTouch(!!touchCapable);

    setupCanvas();
    const onResize = () => setupCanvas();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      stopCursorLoop();
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

    return () => tl.kill();
  }, []);

  // ✅ text to white after fully erased
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
      <video className="hero-video" src="/video/video.mp4" autoPlay muted loop playsInline />

      {/* <canvas
        ref={canvasRef}
        className="hero-canvas"
        onMouseEnter={onPointerEnter}
        onMouseLeave={onPointerLeave}
        onMouseDown={onPointerDown}
        onMouseMove={onPointerMove}
        onMouseUp={onPointerUp}
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
      /> */}

      <canvas
  ref={canvasRef}
  className="hero-canvas"
  onPointerEnter={onPointerEnter}
  onPointerLeave={onPointerLeave}
  onPointerDown={(e) => {
    // capture pointer so move works even if finger leaves canvas briefly
    e.currentTarget.setPointerCapture?.(e.pointerId);

    // ✅ only start erasing for mouse OR single-finger touch
    if (e.pointerType === "touch") {
      // allow scroll unless user is actually drawing
      isDownRef.current = true;
    }
    onPointerDown(e);
  }}
  onPointerMove={(e) => {
    onPointerMove(e);
  }}
  onPointerUp={(e) => {
    onPointerUp(e);
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  }}
  onPointerCancel={(e) => {
    onPointerUp(e);
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  }}
/>




      {/* ✅ Custom cursor (only for mouse devices) */}
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
          <span>Erase to reveal</span>
          <span className="pct">{erasedPct}%</span>
        </div>
      </div>
    </section>
  );
}
