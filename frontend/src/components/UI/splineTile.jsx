import React, { useEffect, useMemo, useRef, useState } from "react";
import Spline from "@splinetool/react-spline";

function useInView(ref, rootMargin = "250px") {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);

  return inView;
}

export default function SplineScene({
  scene = "https://prod.spline.design/cqkCM4wTqKla9twy/scene.splinecode",
  className = "",
  fallbackLabel = "Loading 3D…",
}) {
  const wrapRef = useRef(null);
  const inView = useInView(wrapRef);

  const reduceMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  }, []);

  return (
    <div ref={wrapRef} className={"relative h-full w-full " + className}>
      {/* Lazy mount Spline only when visible + motion allowed */}
      {inView && !reduceMotion ? (
        <Spline scene={scene} className="h-full w-full" />
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <div className="flex items-center gap-3 rounded-xl border border-black/15 bg-white/50 px-4 py-3">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black/70" />
            <span className="text-[12px] font-semibold text-black/70">
              {fallbackLabel}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

