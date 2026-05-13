import { useEffect, useRef, useState } from "react";

export default function DeferredMount({
  children,
  className = "",
  minHeight = 360,
  rootMargin = "350px",
  fallback = null,
}) {
  const hostRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible) return undefined;

    const node = hostRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return (
    <section
      ref={hostRef}
      className={className}
      style={{
        contentVisibility: "auto",
        containIntrinsicSize: `auto ${minHeight}px`,
      }}
    >
      {isVisible
        ? children
        : fallback || <div aria-hidden="true" style={{ minHeight: `${minHeight}px` }} />}
    </section>
  );
}
