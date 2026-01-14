import React, { useEffect, useRef } from "react";
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

/* ------------------- page ------------------- */
export default function AboutUsPage() {
  const scopeRef = useRef(null);

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // word reveal
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

      // tile reveal
      const tiles = gsap.utils.toArray(scope.querySelectorAll("[data-tile]"));
      if (!tiles.length) return;

      if (reduceMotion) {
        gsap.set(tiles, { opacity: 1, y: 0 });
        return;
      }

      ScrollTrigger.batch(tiles, {
        start: "top 85%",
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, y: 18 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              ease: "power3.out",
              stagger: 0.07,
              overwrite: true,
            }
          );
        },
      });
    }, scopeRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={scopeRef} className="min-h-screen bg-[#d9d9d9] text-black">
        <Header />
      {/* Background grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.45]
        [background-image:linear-gradient(to_right,rgba(0,0,0,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.16)_1px,transparent_1px)]
        [background-size:220px_220px]"
      />

      {/* Desktop social rail (optional, same system) */}
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

      {/* Main grid */}
      <main className="relative mx-auto w-full max-w-[1600px] px-3 py-4 sm:px-4 sm:py-6">
        <div className="grid grid-cols-12 gap-0 border border-black/25 bg-[#d9d9d9]">
          {/* Left icon tile */}
          <Tile data-tile className="col-span-12 md:col-span-1 min-h-[70px] md:min-h-[84px]">
            <div className="flex h-full items-center justify-start px-4">
              <div className="grid h-10 w-10 place-items-center border border-black/25 bg-white/40">
                ✕
              </div>
            </div>
          </Tile>

          {/* Title tile */}
          <Tile data-tile className="col-span-12 md:col-span-11 min-h-[220px] sm:min-h-[260px] md:min-h-[360px]">
            <div className="relative h-full">
              <AccentDot className="left-6 top-6" />
              <AccentDot className="right-6 bottom-6" />

              <div className="flex h-full items-center justify-center px-5 sm:px-8">
                <h1
                  data-animate="words"
                  className="text-center font-black tracking-[0.18em] text-black text-[36px] sm:text-[56px] md:text-[96px] lg:text-[120px] font-[tron]"
                >
                  ABOUT US
                </h1>
              </div>

              <div className="absolute left-6 bottom-4 hidden items-center gap-6 md:flex">
                <span className="inline-flex items-center gap-2 text-[11px] font-black tracking-[0.22em] text-black/75">
                  <span className="h-2 w-2 bg-[#ff5a12]" />
                  SENEVON
                </span>
                <span className="text-[11px] font-black tracking-[0.22em] text-black/55">
                  PRODUCT + SERVICES
                </span>
              </div>
            </div>
          </Tile>

          {/* Narrative tile */}
          <Tile data-tile className="col-span-12 md:col-span-5 min-h-[320px] md:min-h-[360px]">
            <div className="h-full p-5 sm:p-6">
              <div
                data-animate="words"
                className="text-[11px] font-black tracking-[0.22em] text-black/75"
              >
                WHO WE ARE
              </div>

              <p
                data-animate="words"
                className="mt-5 max-w-[560px] font-mono text-[13.5px] leading-relaxed text-black/70"
              >
                Senevon is a product + services company. We build our own software and also
                ship client systems with the same internal standards: sharp UI, clean borders,
                optimized performance, and production-ready architecture.
              </p>

              <p
                data-animate="words"
                className="mt-4 max-w-[560px] font-mono text-[13.5px] leading-relaxed text-black/70"
              >
                From web platforms and enterprise software to mobile apps, games, and a full design
                studio — we deliver end-to-end execution that feels premium from day one.
              </p>

              {/* Values strip */}
              <div className="mt-6 border-t border-black/15 pt-4">
                <div className="text-[11px] font-black tracking-[0.22em] text-black/60">
                  PRINCIPLES
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <SharpPill>PERFORMANCE</SharpPill>
                  <SharpPill>CLARITY</SharpPill>
                  <SharpPill>SECURITY</SharpPill>
                  <SharpPill>DELIVERY</SharpPill>
                </div>
              </div>

              <div className="mt-6">
                <CornerButton className="w-full justify-center">WORK WITH US</CornerButton>
              </div>
            </div>
          </Tile>

          {/* Visual system tile */}
          <Tile data-tile className="col-span-12 md:col-span-7 min-h-[320px] md:min-h-[360px]">
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
                      OUR SYSTEM
                    </div>
                    <p
                      data-animate="words"
                      className="mt-3 max-w-[700px] text-[13.5px] font-semibold leading-relaxed text-black/60"
                    >
                      We operate like a product team: structured process, measurable output, and
                      consistent UI/UX across everything we ship.
                    </p>
                  </div>

                  <CornerButton className="hidden sm:inline-flex px-4 py-2 text-[11px]">
                    PROCESS ↗
                  </CornerButton>
                </div>

                {/* Execution pipeline grid */}
                <div className="mt-6 border border-black/20 bg-white/35 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-black tracking-[0.22em] text-black/60">
                      EXECUTION PIPELINE
                    </div>
                    <div className="text-[11px] font-black tracking-[0.22em] text-black/55">
                      ACTIVE <span className="ml-2 inline-block h-2 w-2 bg-[#ff5a12]" />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-12 gap-1">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <span
                        key={i}
                        className={[
                          "h-2 border border-black/10 bg-white/50",
                          i % 9 === 0 ? "bg-[#ff5a12]/75" : "",
                          i % 17 === 0 ? "bg-black/25" : "",
                        ].join(" ")}
                      />
                    ))}
                  </div>

                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <MiniStat label="Design" value="Systems" />
                    <MiniStat label="Build" value="Production" />
                    <MiniStat label="Ship" value="Fast" />
                    <MiniStat label="Support" value="Reliable" />
                  </div>
                </div>

                {/* Small “capabilities” row */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <CapabilityTile label="Web" mark="▦" />
                  <CapabilityTile label="Software" mark="⬡" />
                  <CapabilityTile label="Apps" mark="△" />
                  <CapabilityTile label="Games" mark="✳" />
                  <CapabilityTile label="Design" mark="⌁" />
                </div>
              </div>
            </div>
          </Tile>

          {/* Team / Culture tile */}
          <Tile data-tile className="col-span-12 md:col-span-8 min-h-[260px] md:min-h-[300px]">
            <div className="h-full p-5 sm:p-6">
              <div
                data-animate="words"
                className="text-[11px] font-black tracking-[0.22em] text-black/75"
              >
                CULTURE
              </div>

              <p
                data-animate="words"
                className="mt-5 max-w-[820px] font-mono text-[13.5px] leading-relaxed text-black/70"
              >
                Small, fast-moving teams. Clear communication. No messy UI. No slow experiences.
                We optimize for quality and consistency — then we ship.
              </p>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2">
                <MiniStat label="Iterations" value="Weekly" />
                <MiniStat label="Ownership" value="High" />
                <MiniStat label="Quality" value="Strict" />
                <MiniStat label="Support" value="Always" />
              </div>

              <div className="mt-6 border-t border-black/15 pt-4 flex items-center justify-between">
                <div className="text-[11px] font-black tracking-[0.22em] text-black/55">
                  LET’S BUILD
                </div>
                <CornerButton className="px-4 py-2 text-[11px]">CONTACT ↗</CornerButton>
              </div>
            </div>
          </Tile>

          {/* Proof / highlights tile */}
          <Tile data-tile className="col-span-12 md:col-span-4 min-h-[260px] md:min-h-[300px]">
            <div className="relative h-full p-5 sm:p-6 overflow-hidden">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(520px_220px_at_50%_35%,rgba(255,255,255,0.72),transparent_60%)]" />

              <div className="relative">
                <div
                  data-animate="words"
                  className="text-[11px] font-black tracking-[0.22em] text-black/75"
                >
                  HIGHLIGHTS
                </div>

                <div className="mt-5 border border-black/20 bg-white/40 p-4">
                  <div className="text-[11px] font-black tracking-[0.22em] text-black/60">
                    PRODUCT-MINDED DELIVERY
                  </div>
                  <p className="mt-3 font-mono text-[13.5px] leading-relaxed text-black/70">
                    Everything we deliver is built like it’s ours: clean structure, optimized UX,
                    and consistent UI systems.
                  </p>
                </div>

                <div className="mt-4 border border-black/20 bg-white/40 p-4">
                  <div className="text-[11px] font-black tracking-[0.22em] text-black/60">
                    SHARP DESIGN LANGUAGE
                  </div>
                  <p className="mt-3 font-mono text-[13.5px] leading-relaxed text-black/70">
                    Hard edges, strong hierarchy, and grid discipline — so the interface stays crisp
                    on mobile and desktop.
                  </p>
                </div>

                <div className="mt-6">
                  <CornerButton className="w-full justify-center">
                    SEE OUR WORK
                  </CornerButton>
                </div>
              </div>

              <span className="pointer-events-none absolute left-3 top-3 h-2 w-2 bg-[#ff5a12]" />
              <span className="pointer-events-none absolute right-3 bottom-3 h-2 w-2 bg-[#ff5a12]" />
            </div>
          </Tile>
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

function Tile({ className = "", children, ...props }) {
  return (
    <div
      {...props}
      className={"relative border border-black/25 bg-[#d9d9d9] " + className}
    >
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

function SharpPill({ children }) {
  return (
    <div className="h-10 border border-black/25 bg-white/45 px-3 grid place-items-center text-[12px] font-black tracking-widest text-black/70">
      {children}
    </div>
  );
}

function CapabilityTile({ label, mark }) {
  return (
    <div className="border border-black/20 bg-white/45 px-3 py-3 flex items-center gap-3">
      <span className="grid h-9 w-9 place-items-center border border-black/25 bg-white/60 text-[16px] font-black text-black/70">
        {mark}
      </span>
      <div className="text-[12px] font-black tracking-[0.18em] text-black/70">
        {label.toUpperCase()}
      </div>
    </div>
  );
}

/**
 * Sharp-corner bracket button (no rounding)
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
      <span className="pointer-events-none absolute -left-2 -top-2 h-4 w-4 border-l-2 border-t-2 border-black/80" />
      <span className="pointer-events-none absolute -right-2 -top-2 h-4 w-4 border-r-2 border-t-2 border-black/80" />
      <span className="pointer-events-none absolute -left-2 -bottom-2 h-4 w-4 border-l-2 border-b-2 border-black/80" />
      <span className="pointer-events-none absolute -right-2 -bottom-2 h-4 w-4 border-r-2 border-b-2 border-black/80" />
      <span className="relative z-10">{children}</span>
    </button>
  );
}
