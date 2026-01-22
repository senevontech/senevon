import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Header from "../components/Header";

gsap.registerPlugin(ScrollTrigger);

/* ------------------- helpers: split into words (safe) ------------------- */
function splitWords(el) {
  if (!el) return [];
  if (!el.dataset.originalText) el.dataset.originalText = el.textContent || "";
  if (el.dataset.splitWords === "1") return el.querySelectorAll(".gsap-word");

  const text = el.dataset.originalText || "";
  const words = text.trim().split(/\s+/);

  el.dataset.splitWords = "1";
  el.innerHTML = words
    .map((w) => `<span class="gsap-word">${w}&nbsp;</span>`)
    .join("");
  return el.querySelectorAll(".gsap-word");
}

/* ------------------- data ------------------- */
const NAV = ["Home", "Products", "Portfolio", "Media", "Team", "FAQ", "Blog"];

const PRODUCT_CATEGORIES = ["All", "Software", "Enterprise", "Games"];

const PRODUCTS = [
  {
    id: "p1",
    title: "Senevon Code Studio",
    category: "Software",
    desc: "A modern in-browser code editor with snippets, AI assist hooks, and workspace-ready architecture.",
    tag: "Editor",
    metricA: "Low-latency",
    metricB: "Extensible",
    accent: "orange",
  },
  {
    id: "p2",
    title: "Hospital Management System",
    category: "Enterprise",
    desc: "End-to-end hospital ops: appointments, billing, pharmacy, lab, staff, and patient records — audit-friendly.",
    tag: "Healthcare",
    metricA: "Secure",
    metricB: "Role-based",
    accent: "mono",
  },
  {
    id: "p3",
    title: "Project Management Suite",
    category: "Enterprise",
    desc: "Tasks, sprints, timelines, docs, approvals — built for teams that need clarity and execution speed.",
    tag: "Productivity",
    metricA: "Realtime",
    metricB: "Reports",
    accent: "grid",
  },
  {
    id: "p4",
    title: "Retail / POS Analytics",
    category: "Software",
    desc: "Dashboards, forecasting, inventory insights, conversion analytics — designed for operational decisions.",
    tag: "Analytics",
    metricA: "Insights",
    metricB: "Forecasting",
    accent: "orange",
  },
  {
    id: "p5",
    title: "Arcade Micro-Games",
    category: "Games",
    desc: "Fast-loading web games with clean UI, scoring, and leaderboard-ready backend hooks.",
    tag: "Games",
    metricA: "Fast",
    metricB: "Fun",
    accent: "mono",
  },
  {
    id: "p6",
    title: "Custom Systems",
    category: "Software",
    desc: "We design and ship bespoke platforms: admin panels, dashboards, workflows, and scalable APIs.",
    tag: "Build",
    metricA: "Scalable",
    metricB: "Optimized",
    accent: "grid",
  },
];

/* ------------------- page ------------------- */
export default function ProductsPage() {
  const scopeRef = useRef(null);
  const [activeCat, setActiveCat] = useState("All");

  const filtered = useMemo(() => {
    if (activeCat === "All") return PRODUCTS;
    return PRODUCTS.filter((p) => p.category === activeCat);
  }, [activeCat]);

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // --- Word reveal ---
      const wordTargets = scope.querySelectorAll('[data-animate="words"]');
      wordTargets.forEach((el) => {
        const words = splitWords(el);
        if (!words?.length) return;

        gsap.set(words, { opacity: 0, y: 14, filter: "blur(8px)" });

        if (reduceMotion) {
          gsap.set(words, { opacity: 1, y: 0, filter: "blur(0px)" });
          return;
        }

        gsap.to(words, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.03,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            end: "top 50%",
            toggleActions: "play none none reverse",
          },
        });
      });

      // --- Card + image reveal (optimized batch) ---
      const cards = gsap.utils.toArray(scope.querySelectorAll("[data-card]"));
      if (!cards.length) return;

      if (reduceMotion) {
        gsap.set(cards, { opacity: 1, y: 0 });
        return;
      }

      ScrollTrigger.batch(cards, {
        start: "top 85%",
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, y: 18 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              stagger: 0.07,
              overwrite: true,
            }
          );

          batch.forEach((card) => {
            const img = card.querySelector("[data-img]");
            if (img) {
              gsap.fromTo(
                img,
                { scale: 1.05, filter: "blur(6px)" },
                {
                  scale: 1,
                  filter: "blur(0px)",
                  duration: 0.9,
                  ease: "power3.out",
                  overwrite: true,
                }
              );
            }
          });
        },
      });
    }, scopeRef);

    return () => ctx.revert();
  }, [activeCat]);

  return (
    <section ref={scopeRef} className="min-h-screen bg-[#d9d9d9] text-black">
      {/* Background grid (same style) */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.45]
        [background-image:linear-gradient(to_right,rgba(0,0,0,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.16)_1px,transparent_1px)]
        [background-size:220px_220px]" />

      {/* Header (mobile first) */}
      <Header />

      {/* Desktop social rail (optional) */}
      <div className="fixed right-5 top-[130px] z-40 hidden w-[46px] overflow-hidden border border-black/25 bg-white/45 backdrop-blur md:block">
        {[
          { label: "fb", href: "https://www.facebook.com/" },
          { label: "𝕏", href: "https://twitter.com/" },
          { label: "In", href: "https://www.linkedin.com/" },
          { label: "Ig", href: "https://www.instagram.com/" },
          { label: "wp", href: "https://wa.me/" },
        ].map((s, i) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className={[
              "grid h-11 w-full place-items-center text-[12px] font-black text-black/70 hover:bg-white/70 transition",
              i !== 4 ? "border-b border-black/15" : "",
            ].join(" ")}
            aria-label={`Social ${s.label}`}
          >
            {s.label}
          </a>
        ))}
      </div>

      {/* Main grid layout */}
      <main className="relative mx-auto w-full max-w-[1600px] px-3 py-4 sm:px-4 sm:py-6">
        <div className="grid grid-cols-12 gap-0 border border-black/25 bg-[#d9d9d9]">
          {/* Left icon tile */}
          <Tile className="col-span-12 md:col-span-1 min-h-[70px] md:min-h-[84px]">
            <div className="flex h-full items-center justify-start px-4">
              <div className="grid h-10 w-10 place-items-center border border-black/25 bg-white/40">
                ✕
              </div>
            </div>
          </Tile>

          {/* Hero title tile */}
          <Tile className="col-span-12 md:col-span-11 min-h-[220px] sm:min-h-[260px] md:min-h-[360px]">
            <div className="relative h-full">
              <AccentDot className="left-6 top-6" />
              <AccentDot className="right-6 bottom-6" />

              <div className="flex h-full items-center justify-center px-5 sm:px-8">
                <h1
                  data-animate="words"
                  className="text-center font-black tracking-[0.18em] text-black text-[36px] sm:text-[56px] md:text-[96px] lg:text-[120px] font-[tron]"
                >
                  PRODUCTS
                </h1>
              </div>

              <div className="absolute left-6 bottom-4 hidden items-center gap-6 md:flex">
                <span className="inline-flex items-center gap-2 text-[11px] font-black tracking-[0.22em] text-black/75">
                  <span className="h-2 w-2 bg-[#ff5a12]" />
                  SENEVON
                </span>
                <span className="text-[11px] font-black tracking-[0.22em] text-black/55">
                  BUILDING SYSTEMS
                </span>
              </div>
            </div>
          </Tile>

          {/* Intro / filter tile */}
          <Tile className="col-span-12 md:col-span-4 min-h-[260px] md:min-h-[320px]">
            <div className="h-full p-5 sm:p-6">
              <div
                data-animate="words"
                className="text-[11px] font-black tracking-[0.22em] text-black/75"
              >
                SHOWCASE
              </div>

              <p
                data-animate="words"
                className="mt-5 max-w-[420px] font-mono text-[13.5px] leading-relaxed text-black/70"
              >
                From product-grade software to enterprise systems and lightweight web games —
                we craft fast, scalable, and sharply-designed experiences that ship clean.
              </p>

              <div className="mt-6 border-t border-black/15 pt-4">
                <div className="text-[11px] font-black tracking-[0.22em] text-black/60">
                  FILTER
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  {PRODUCT_CATEGORIES.map((c) => {
                    const active = c === activeCat;
                    return (
                      <button
                        key={c}
                        onClick={() => setActiveCat(c)}
                        className={[
                          "h-10 border border-black/25 bg-white/45 px-3 text-[12px] font-black tracking-widest text-black/70 transition",
                          "hover:bg-[#ff5a12] active:translate-y-[1px]",
                          active ? "bg-black- text-white hover:bg-[#ff5a12]" : "",
                        ].join(" ")}
                        type="button"
                      >
                        {c.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6">
                <CornerButton className="w-full justify-center">
                  REQUEST A DEMO
                </CornerButton>
              </div>
            </div>
          </Tile>

          {/* Highlight tile (stats) */}
          <Tile className="col-span-12 md:col-span-8 min-h-[260px] md:min-h-[320px]">
            <div className="relative h-full p-5 sm:p-6 overflow-hidden">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(680px_280px_at_50%_35%,rgba(255,255,255,0.72),transparent_60%)]" />
              <div className="pointer-events-none absolute inset-0 opacity-[0.55] [background:linear-gradient(180deg,rgba(255,255,255,0),rgba(0,0,0,0.06))]" />

              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div
                      data-animate="words"
                      className="text-[11px] font-black tracking-[0.22em] text-black/70"
                    >
                      DELIVERY PRINCIPLES
                    </div>
                    <p
                      data-animate="words"
                      className="mt-3 max-w-[680px] text-[13.5px] font-semibold leading-relaxed text-black/60"
                    >
                      Sharp UI. Clean borders. Optimized performance. Production-ready architecture.
                      We ship products that feel premium from the first interaction.
                    </p>
                  </div>

                  <CornerButton className="hidden sm:inline-flex px-4 py-2 text-[11px]">
                    VIEW CASES
                  </CornerButton>
                </div>

                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <MiniStat label="Build" value="Fast" />
                  <MiniStat label="UX" value="Sharp" />
                  <MiniStat label="Scale" value="Ready" />
                  <MiniStat label="Ops" value="Secure" />
                </div>

                {/* a subtle “scanline” style grid for uniqueness */}
                <div className="mt-6 border border-black/20 bg-white/35 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-black tracking-[0.22em] text-black/60">
                      CURRENT TRACK
                    </div>
                    <div className="text-[11px] font-black tracking-[0.22em] text-black/55">
                      LIVE <span className="ml-2 inline-block h-2 w-2 bg-[#ff5a12]" />
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-12 gap-1">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <span
                        key={i}
                        className={[
                          "h-2 border border-black/10 bg-white/50",
                          i % 7 === 0 ? "bg-[#ff5a12]/70" : "",
                        ].join(" ")}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Tile>

          {/* Product cards */}
          {filtered.map((p) => (
            <Tile
              key={p.id}
              className="col-span-12 md:col-span-4 min-h-[260px] md:min-h-[300px]"
            >
              <ProductCard product={p} />
            </Tile>
          ))}
        </div>
      </main>

      {/* minimal styling for GSAP split words */}
      <style>{`
        .gsap-word{ display:inline-block; will-change:transform,opacity,filter; transform:translateZ(0); }
      `}</style>
    </section>
  );
}

/* ---------------- UI blocks ---------------- */

function Tile({ className = "", children }) {
  return (
    <div className={"relative border border-black/25 bg-[#d9d9d9] " + className}>
      <div className="pointer-events-none absolute inset-0 bg-white/15" />
      {children}
    </div>
  );
}

function AccentDot({ className = "" }) {
  return <span className={"absolute h-3 w-3 bg-[#ff5a12] " + className} />;
}

function MiniStat({ label, value }) {
  return (
    <div className="border border-black/20 bg-white/45 px-3 py-2">
      <div className="text-[10px] font-black tracking-[0.22em] text-black/55">
        {label}
      </div>
      <div className="mt-1 text-[13px] font-black text-black/80">{value}</div>
    </div>
  );
}

function ProductCard({ product }) {
  const accentClass =
    product.accent === "orange"
      ? "bg-[#ff5a12]"
      : product.accent === "grid"
      ? "bg-black/70"
      : "bg-white/70";

  const visualBg =
    product.accent === "grid"
      ? "[background-image:linear-gradient(to_right,rgba(0,0,0,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.18)_1px,transparent_1px)] [background-size:18px_18px]"
      : "";

  return (
    <div data-card className="relative h-full p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-black tracking-[0.22em] text-black/60">
            {product.category.toUpperCase()}
          </div>
          <div
            data-animate="words"
            className="mt-2 text-[18px] sm:text-[20px] font-black text-black/85"
          >
            {product.title}
          </div>
        </div>

        <div className={"h-9 w-9 border border-black/25 " + accentClass} />
      </div>

      {/* visual "image" block (replace with <img /> anytime) */}
      <div
        data-img
        className={[
          "mt-5 relative h-[120px] sm:h-[130px] border border-black/25 bg-white/40 overflow-hidden",
          visualBg,
        ].join(" ")}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(380px_160px_at_50%_35%,rgba(255,255,255,0.7),transparent_60%)]" />
        <div className="absolute left-3 top-3 h-3 w-3 bg-[#ff5a12]" />
        <div className="absolute right-3 bottom-3 h-3 w-3 bg-[#ff5a12]" />

        <div className="absolute inset-0 grid place-items-center">
          <div className="border border-black/25 bg-[#d9d9d9] px-3 py-2 text-[11px] font-black tracking-[0.22em] text-black/70">
            {product.tag.toUpperCase()}
          </div>
        </div>
      </div>

      <p
        data-animate="words"
        className="mt-5 font-mono text-[13.5px] leading-relaxed text-black/70"
      >
        {product.desc}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <MiniStat label="Focus" value={product.metricA} />
        <MiniStat label="Value" value={product.metricB} />
      </div>

      <div className="mt-5 border-t border-black/15 pt-4 flex items-center justify-between">
        <div className="text-[11px] font-black tracking-[0.22em] text-black/55">
          DETAILS
        </div>
        <CornerButton className="px-4 py-2 text-[11px]">
          VIEW ↗
        </CornerButton>
      </div>
    </div>
  );
}

/**
 * Sharp-corner bracket button (no pseudo elements, no rounding)
 */
function CornerButton({ className = "", children }) {
  return (
    <button
      className={[
        "group relative inline-flex items-center justify-center bg-[#ff5a12] px-5 py-2.5",
        "text-[12px] font-black tracking-widest text-white",
        "shadow-[0_18px_34px_rgba(255,90,18,0.22)]",
        "hover:brightness-[1.03] active:translate-y-[1px] transition",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#d9d9d9]",
        className,
      ].join(" ")}
      type="button"
    >
      {/* corner brackets */}
      <span className="pointer-events-none absolute -left-2 -top-2 h-4 w-4 border-l-2 border-t-2 border-black/80" />
      <span className="pointer-events-none absolute -right-2 -top-2 h-4 w-4 border-r-2 border-t-2 border-black/80" />
      <span className="pointer-events-none absolute -left-2 -bottom-2 h-4 w-4 border-l-2 border-b-2 border-black/80" />
      <span className="pointer-events-none absolute -right-2 -bottom-2 h-4 w-4 border-r-2 border-b-2 border-black/80" />

      <span className="relative z-10">{children}</span>
    </button>
  );
}
