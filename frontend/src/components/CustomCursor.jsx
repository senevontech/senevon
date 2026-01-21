

import React, { useEffect, useRef } from "react";
import handCursor from "../assets/icons/cursor.png";

export default function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    // hide default cursor globally while this component is mounted
    const prevCursor = document.documentElement.style.cursor;
    document.documentElement.style.cursor = "none";
    document.body.style.cursor = "none";

    const move = (e) => {
      const el = cursorRef.current;
      if (!el) return;

      // position cursor image
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-2px, -2px)`;
      el.style.opacity = "1";
    };

    const leave = () => {
      const el = cursorRef.current;
      if (!el) return;
      el.style.opacity = "0";
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseleave", leave);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", leave);

      // restore default cursor
      document.documentElement.style.cursor = prevCursor;
      document.body.style.cursor = prevCursor || "";
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[999999] opacity-0"
      ref={cursorRef}
    >
      <img
        src={handCursor}
        alt=""
        draggable={false}
        className="block h-7 w-7 select-none"
      />
    </div>
  );
}



