

import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "./production.css";
import leftArrow from "../assets/icons/arrow-l.png";
import rightArrow from "../assets/icons/arrow-r.png";

gsap.registerPlugin(ScrollTrigger);

const demoProducts = [
  {
    id: "p1",
    name: "Retail-Rail",
    role: "RETAIL ANALYTICS",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "p2",
    name: "K-Stock",
    role: "STOCK + GRN",
    img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "p3",
    name: "SNV-HR",
    role: "HR + PAYROLL",
    img: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "p4",
    name: "CodeMist",
    role: "Cloud CODE EDITOR",
    img: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "p5",
    name: "Travar",
    role: "Travel management system",
    img: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=60",
  },
];

function clamp(i, n) {
  return ((i % n) + n) % n;
}

/* ------------------- helpers: split into words (safe) ------------------- */
function splitWords(el) {
  if (!el.dataset.originalText) el.dataset.originalText = el.textContent || "";
  const text = el.dataset.originalText || "";
  const words = text.trim().split(/\s+/);

  el.innerHTML = words.map((w) => `<span class="gsap-word">${w}&nbsp;</span>`).join("");
  return el.querySelectorAll(".gsap-word");
}

export default function ProductsSection({ products = demoProducts }) {
  const [index, setIndex] = useState(0);
  const scopeRef = useRef(null);

  const visible = useMemo(() => {
    const n = products.length || 1;
    return [0, 1, 2, 3].map((k) => products[clamp(index + k, n)]);
  }, [index, products]);


  // ✅ Animate ONLY the title "OUR PRODUCTS"
  useEffect(() => {
    const ctx = gsap.context(() => {
      // target ONLY the main title (do not touch other elements)
      const titleEl = scopeRef.current?.querySelector("h2.prod-glitch");
      if (!titleEl) return;

      const words = splitWords(titleEl);
      if (!words?.length) return;

      gsap.set(words, { opacity: 0, y: 18, filter: "blur(8px)" });

      gsap.to(words, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.03,
        scrollTrigger: {
          trigger: titleEl,
          start: "top 85%",
          end: "top 55%",
          toggleActions: "play none none reverse",
          // if you want only once:
          // toggleActions: "play none none none",
        },
      });
    }, scopeRef);

    return () => ctx.revert();
  }, []);


  return (
    <section ref={scopeRef} className="relative w-full bg-[#d9d9d9]">
      {/* subtle big grid lines behind */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.55] [background-image:linear-gradient(to_right,rgba(0,0,0,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.18)_1px,transparent_1px)] [background-size:220px_220px]" />

      <div className="relative mx-auto w-full max-w-[1600px] px-3 py-8 md:px-6">
        <div className="grid grid-cols-12 gap-0 border border-black/25 bg-[#d9d9d9]">
          {/* Title tile (left) */}
          <Tile className="col-span-12 md:col-span-7 min-h-[160px]">
            <div className="relative h-full p-6 md:p-10">
              <span className="absolute left-6 top-6 h-3 w-3 bg-[#ff5a12]" />
              <h2
                data-animate="words"
                className="prod-glitch text-[40px] font-black tracking-[0.14em] text-black md:text-[70px]"
              >
                OUR PRODUCTS
              </h2>
            </div>
          </Tile>

          {/* Tagline + arrows (right) */}
          <Tile className="col-span-12 md:col-span-5 min-h-[160px]">
            <div className="flex h-full items-center justify-between gap-6 p-6 md:p-10">
              <p
                data-animate="words"
                className="max-w-[320px] font-mono text-[15px] leading-relaxed text-black/80"
              >
                • Built for teams
                <br />
                shipping real systems
              </p>

              {/* <div className="flex items-center gap-3">
                <button
                  onClick={() => setIndex((v) => v - 1)}
                  className="grid h-12 w-16 place-items-center border border-black/30 bg-white/25 text-lg font-black text-black/70 hover:bg-white/60 active:translate-y-[1px]"
                  aria-label="Previous"
                >
                  ‹
                </button>
                <button
                  onClick={() => setIndex((v) => v + 1)}
                  className="grid h-12 w-16 place-items-center border border-black/30 bg-white/25 text-lg font-black text-black/70 hover:bg-white/60 active:translate-y-[1px]"
                  aria-label="Next"
                >
                  ›
                </button>
              </div> */}


              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIndex((v) => v - 1)}
                  className="grid h-12 w-16 place-items-center border border-black/30 bg-white/25 hover:bg-white/60 active:translate-y-[1px]"
                  aria-label="Previous"
                >
                  <img
                    src={leftArrow}
                    alt="Previous"
                    className="h-6 w-6 object-contain pointer-events-none"
                  />
                </button>

                <button
                  onClick={() => setIndex((v) => v + 1)}
                  className="grid h-12 w-16 place-items-center border border-black/30 bg-white/25 hover:bg-white/60 active:translate-y-[1px]"
                  aria-label="Next"
                >
                  <img
                    src={rightArrow}
                    alt="Next"
                    className="h-6 w-6 object-contain pointer-events-none"
                  />
                </button>
              </div>



            </div>
          </Tile>

          {/* Product cards (4) */}
          {visible.map((p) => (
            <Tile
              key={p?.id}
              className="col-span-12 sm:col-span-6 md:col-span-3 min-h-[520px]"
            >
              <ProductCard product={p} />
            </Tile>
          ))}
        </div>
      </div>
    </section>
  );
}

function Tile({ className = "", children }) {
  return (
    <div className={`relative overflow-hidden border border-black/25 bg-[#d9d9d9] ${className}`}>
      <div className="pointer-events-none absolute inset-0 bg-white/15" />
      {children}
    </div>
  );
}

function ProductCard({ product }) {
  if (!product) return null;

  return (
    <div className="flex h-full flex-col">
      {/* Top label */}
      <div className="border-b border-black/20 bg-white/18 px-5 py-4 text-center">
        <div
          data-animate="words"
          className="prod-glitch-sm text-[16px] font-semibold tracking-wide text-black"
        >
          {product.name}
        </div>
        <div
          data-animate="words"
          className="mt-1 text-[12px] font-black tracking-[0.2em] text-black/60"
        >
          {product.role}
        </div>
      </div>

      {/* Image area */}
      <div className="relative flex-1 p-5">
        <div className="prod-image fx-pixelate relative h-full w-full overflow-hidden border border-black/25 bg-black/10">
          <img
            src={product.img}
            alt={product.name}
            className="h-full w-full object-cover grayscale"
            loading="lazy"
          />

          <span className="corner tl" />
          <span className="corner tr" />
          <span className="corner bl" />
          <span className="corner br" />
        </div>
      </div>

      {/* Bottom CTA */}
      <button
        data-animate="words"
        className="group border-t border-black/20 bg-white/18 px-5 py-4 text-center font-mono text-[13px] tracking-widest text-black/80 hover:bg-white/45"
      >
        VIEW <span className="text-[#ff5a12] font-black">+</span>
      </button>
    </div>
  );
}
