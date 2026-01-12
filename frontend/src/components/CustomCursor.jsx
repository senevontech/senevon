import React, { useEffect, useRef, useState } from "react";

// ✅ Put your hand cursor image here (adjust the path)
// Example: src/assets/hand-cursor.png
import handCursor from "../assets/icons/pointer.png";
// import "./CustomCursor.css";

export default function CustomCursor() {
  const rootRef = useRef(null);
  const rafRef = useRef(null);

  // Real mouse position (target)
  const mouse = useRef({ x: 0, y: 0 });

  // Smoothed main cursor position (current)
  const main = useRef({ x: 0, y: 0 });

  // Trail points
  const trailCount = 8;
  const trail = useRef(Array.from({ length: trailCount }, () => ({ x: 0, y: 0 })));

  const [active, setActive] = useState(false);
  const [isDown, setIsDown] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);

  useEffect(() => {
    const onEnter = () => setActive(true);
    const onLeave = () => setActive(false);

    const onMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (!active) setActive(true);
    };

    const onDown = () => setIsDown(true);
    const onUp = () => setIsDown(false);

    window.addEventListener("mouseenter", onEnter);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [active]);

  // Detect hover on interactive elements (buttons, links, clickable, role/button etc.)
  useEffect(() => {
    const isInteractiveEl = (el) => {
      if (!el) return false;

      // common interactive tags
      const tag = el.tagName?.toLowerCase();
      if (tag === "a" || tag === "button" || tag === "input" || tag === "textarea" || tag === "select")
        return true;

      // semantics / attributes
      if (el.getAttribute?.("role") === "button") return true;
      if (el.hasAttribute?.("data-cursor") && el.getAttribute("data-cursor") === "hand") return true;
      if (el.hasAttribute?.("onclick")) return true;

      // if element is explicitly clickable via tabindex
      const tabIndex = el.getAttribute?.("tabindex");
      if (tabIndex !== null && Number(tabIndex) >= 0) return true;

      // Tailwind / class convention you can use: add "cursor-hand" on any clickable
      if (el.classList?.contains("cursor-hand")) return true;

      return false;
    };

    const onOver = (e) => {
      const el = e.target?.closest?.(
        'a,button,input,textarea,select,[role="button"],[data-cursor="hand"],.cursor-hand'
      );
      setIsInteractive(isInteractiveEl(el));
    };

    const onOut = () => setIsInteractive(false);

    document.addEventListener("mouseover", onOver, true);
    document.addEventListener("mouseout", onOut, true);

    return () => {
      document.removeEventListener("mouseover", onOver, true);
      document.removeEventListener("mouseout", onOut, true);
    };
  }, []);

  // Animation loop (smooth follow + trail)
  useEffect(() => {
    const ease = 0.18; // main cursor smoothing

    const tick = () => {
      // smooth main cursor
      main.current.x += (mouse.current.x - main.current.x) * ease;
      main.current.y += (mouse.current.y - main.current.y) * ease;

      // trail follow
      const t = trail.current;
      const follow = 0.22; // trail smoothing
      for (let i = 0; i < t.length; i++) {
        const prev = i === 0 ? main.current : t[i - 1];
        t[i].x += (prev.x - t[i].x) * follow;
        t[i].y += (prev.y - t[i].y) * follow;
      }

      // apply transforms (no re-render)
      const root = rootRef.current;
      if (root) {
        const big = root.querySelector(".cc-big");
        if (big) {
          big.style.transform = `translate3d(${main.current.x}px, ${main.current.y}px, 0) translate(-50%, -50%) scale(${
            isDown ? 0.92 : 1
          })`;
          big.style.opacity = active ? "1" : "0";
        }

        const minis = root.querySelectorAll(".cc-mini");
        minis.forEach((node, idx) => {
          const p = t[idx];
          if (!p) return;
          node.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%)`;
          node.style.opacity = active ? "1" : "0";
        });

        const hand = root.querySelector(".cc-hand");
        if (hand) {
          hand.style.transform = `translate3d(${main.current.x}px, ${main.current.y}px, 0) translate(-50%, -50%) scale(${
            isDown ? 0.95 : 1
          })`;
          hand.style.opacity = active && isInteractive ? "1" : "0";
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, isDown, isInteractive]);

  return (
    <div
      ref={rootRef}
      className="cc-root"
      aria-hidden="true"
    >
      {/* Big glass cursor (hidden when interactive hand is shown) */}
      <div className={`cc-big ${isInteractive ? "cc-hide" : ""}`} />

      {/* Mini trailing circles */}
      {Array.from({ length: trailCount }).map((_, i) => (
        <div key={i} className="cc-mini" style={{ "--i": i }} />
      ))}

      {/* Hand cursor (local image) */}
      <img className="cc-hand" src={handCursor} alt="" draggable={false} />
    </div>
  );
}
