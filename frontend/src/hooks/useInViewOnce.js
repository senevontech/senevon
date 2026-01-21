import { useEffect, useState } from "react";

export default function useInViewOnce(ref, options = { rootMargin: "200px" }) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref?.current || inView) return;

    const el = ref.current;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        io.disconnect();
      }
    }, options);

    io.observe(el);
    return () => io.disconnect();
  }, [ref, inView, options]);

  return inView;
}
