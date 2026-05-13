import { useEffect, useRef, useState } from "react";

export default function useInViewOnce(ref, options = { rootMargin: "200px" }) {
  const [inView, setInView] = useState(false);
  const optionsRef = useRef(options);

  useEffect(() => {
    if (!ref?.current || inView) return;

    const el = ref.current;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        io.disconnect();
      }
    }, optionsRef.current);

    io.observe(el);
    return () => io.disconnect();
  }, [ref, inView]);

  return inView;
}
