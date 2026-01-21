
import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "./about.css";
import ContactModal from "../components/UI/ContactModal"; 


gsap.registerPlugin(ScrollTrigger);

const defaultMetrics = [
  { label: "Products shipped", value: 18, suffix: "+" },
  { label: "Clients supported", value: 65, suffix: "+" },
  { label: "Avg. delivery cycle", value: 21, suffix: " days" },
  { label: "Uptime focus", value: 99.9, suffix: "%" },
];

const defaultPillars = [
  { title: "Engineering-first", desc: "Production-grade code, predictable delivery, clean architecture." },
  { title: "Design systems", desc: "Consistent UI language across modules, mobile-first and accessible." },
  { title: "Data-driven", desc: "Dashboards, analytics, and automation that actually move numbers." },
  { title: "Security-aware", desc: "Auth, roles, audits, and secure integrations built-in by default." },
];

const defaultTimeline = [
  { k: "01", title: "Discover", desc: "We map goals, constraints, and success metrics." },
  { k: "02", title: "Design", desc: "Grid-based UI system + clickable prototypes." },
  { k: "03", title: "Build", desc: "Iterative releases with QA, reviews, and performance checks." },
  { k: "04", title: "Scale", desc: "Monitoring, optimizations, and long-term support." },
];

/* ----------------------------- Word Splitter (FAST) ----------------------------- */
/** Splits textContent into word spans while preserving spaces/newlines.
 *  - Skips if too long (perf protection)
 *  - Idempotent (won't split twice)
 */
function splitWords(el, { maxWords = 80 } = {}) {
  if (!el) return { words: [], skipped: true };
  if (el.dataset.splitWords === "1") {
    return { words: Array.from(el.querySelectorAll(".gsap-word")), skipped: false };
  }

  const original = el.textContent || "";
  const trimmed = original.trim();
  if (!trimmed) return { words: [], skipped: true };

  // Tokenize preserving whitespace (space, tabs, newlines)
  const tokens = original.match(/(\S+|\s+)/g) || [];
  const wordCount = tokens.filter((t) => !/^\s+$/.test(t)).length;

  // Perf guard: long paragraphs become simple reveal (no splitting)
  if (wordCount > maxWords) return { words: [], skipped: true };

  el.dataset.splitWords = "1";
  el.dataset.originalText = original;

  const html = tokens
    .map((t) => {
      if (/^\s+$/.test(t)) {
        // keep whitespace exactly (including newlines)
        return t.replace(/ /g, "&nbsp;").replace(/\n/g, "<br/>");
      }
      return `<span class="gsap-word">${t}</span>`;
    })
    .join("");

  el.innerHTML = html;
  return { words: Array.from(el.querySelectorAll(".gsap-word")), skipped: false };
}

export default function AboutSection({
  title = "ABOUT US",
  tagline = "• Built for real businesses\n  shipping real systems",
  introTitle = "We build systems that feel premium and run reliably.",
  introBody = `From ERP and retail analytics to investor platforms — we design, engineer,
and ship production-grade products with a grid-based UI language, measurable KPIs,
and performance-first architecture.`,
  metrics = defaultMetrics,
  pillars = defaultPillars,
  timeline = defaultTimeline,
}) {
  const [open, setOpen] = useState(0);
  const heroTag = useMemo(() => tagline.split("\n"), [tagline]);
  const scopeRef = useRef(null);

  const [contactOpen, setContactOpen] = useState(false);


  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    // Reduced motion: keep site accessible + fast
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) return;

    // Global GSAP perf knobs (helps on mobile)
    gsap.defaults({ overwrite: "auto" });

    const ctx = gsap.context(() => {
      /* -------------------- 1) Tiles reveal (batched) -------------------- */
      const tiles = gsap.utils.toArray(scope.querySelectorAll("[data-tile]"));
      gsap.set(tiles, { opacity: 0, y: 16 });

      ScrollTrigger.batch(tiles, {
        start: "top 92%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power3.out",
            stagger: 0.06,
          }),
      });

      /* -------------------- 2) Text: WORD-BY-WORD (batched) -------------------- */
      const textEls = gsap.utils.toArray(scope.querySelectorAll('[data-animate="text"]'));

      // Pre-split small/medium elements only (fast)
      const splitTargets = [];
      const simpleTargets = [];

      textEls.forEach((el) => {
        const { words, skipped } = splitWords(el, { maxWords: 80 });
        if (!skipped && words.length) splitTargets.push({ el, words });
        else simpleTargets.push(el);
      });

      // WORD reveal
      splitTargets.forEach(({ words }) => {
        gsap.set(words, { opacity: 0, y: 12 });
      });

      // Batch triggers for split elements using their parent as trigger
      ScrollTrigger.batch(
        splitTargets.map((x) => x.el),
        {
          start: "top 88%",
          once: true,
          onEnter: (batch) => {
            batch.forEach((el) => {
              const item = splitTargets.find((x) => x.el === el);
              if (!item) return;
              gsap.to(item.words, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power3.out",
                stagger: 0.02,
              });
            });
          },
        }
      );

      // Fallback reveal for long paragraphs (no splitting)
      if (simpleTargets.length) {
        gsap.set(simpleTargets, { opacity: 0, y: 10 });

        ScrollTrigger.batch(simpleTargets, {
          start: "top 88%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.45,
              ease: "power3.out",
              stagger: 0.04,
            }),
        });
      }

      /* -------------------- 3) Count-up numbers (lightweight) -------------------- */
      const counters = gsap.utils.toArray(scope.querySelectorAll("[data-count]"));

      counters.forEach((node) => {
        const end = parseFloat(node.getAttribute("data-count") || "0") || 0;
        const decimals = Number(node.getAttribute("data-decimals") || "0");
        const obj = { v: 0 };

        const fmt = (n) => {
          if (decimals) return n.toFixed(decimals);
          return Math.round(n).toString();
        };

        node.textContent = fmt(0);

        ScrollTrigger.create({
          trigger: node,
          start: "top 88%",
          once: true,
          onEnter: () => {
            gsap.to(obj, {
              v: end,
              duration: 1.0,
              ease: "power2.out",
              onUpdate: () => {
                node.textContent = fmt(obj.v);
              },
            });
          },
        });
      });

      // Refresh once after splitting (prevents layout-jump triggers)
      ScrollTrigger.refresh();
    }, scopeRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={scopeRef} className="relative w-full bg-[#d9d9d9]">
      <div className="pointer-events-none absolute inset-0 opacity-[0.55] [background-image:linear-gradient(to_right,rgba(0,0,0,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.18)_1px,transparent_1px)] [background-size:220px_220px]" />

      <div className="relative mx-auto w-full max-w-[1600px] px-3 py-10 md:px-6">
        <div className="grid grid-cols-12 gap-0 border border-black/25 bg-[#d9d9d9]">
          <Tile className="col-span-12 md:col-span-7 min-h-[160px]">
            <div className="relative h-full p-6 md:p-10">
              <span className="absolute left-6 top-6 h-3 w-3 bg-[#ff5a12]" />
              <h2
                data-animate="text"
                className="about-glitch text-[42px] font-black tracking-[0.14em] text-black md:text-[76px]"
              >
                {title}
              </h2>
            </div>
          </Tile>

          <Tile className="col-span-12 md:col-span-5 min-h-[160px]">
            <div className="flex h-full items-center justify-between gap-6 p-6 md:p-10">
              <p
                data-animate="text"
                className="whitespace-pre-line font-mono text-[15px] leading-relaxed text-black/85"
              >
                {heroTag.join("\n")}
              </p>

              <div className="flex flex-col items-end gap-3">

                {/* <button
                  data-animate="text"
                  className="rounded-xl bg-[#ff5a12] px-6 py-2.5 text-[12px] font-black tracking-widest text-white shadow-[0_16px_30px_rgba(255,90,18,0.24)] hover:brightness-[1.03] active:translate-y-[1px]"
                >
                  CONTACT
                </button> */}

                <button
                  data-animate="text"
                  onClick={() => setContactOpen(true)}
                  className="
    relative
    bg-[#ff5a12]
    px-6 py-2.5
    text-[12px] font-black tracking-widest text-white
    shadow-[0_16px_30px_rgba(255,90,18,0.24)]
    overflow-hidden
    transition-all duration-300 ease-out
    hover:brightness-[1.04]
    active:translate-y-[1px]

    /* TOP-LEFT CORNER */
    before:absolute before:top-1.5 before:left-1.5
    before:h-3 before:w-3
    before:border-l-2 before:border-t-2
    before:border-black
    before:content-['']
    before:transition-all before:duration-300

    /* BOTTOM-RIGHT CORNER */
    after:absolute after:bottom-1.5 after:right-1.5
    after:h-3 after:w-3
    after:border-r-2 after:border-b-2
    after:border-black
    after:content-['']
    after:transition-all after:duration-300

    /* UNIQUE HOVER EFFECT */
    hover:before:-translate-x-1 hover:before:-translate-y-1
    hover:after:translate-x-1 hover:after:translate-y-1
  "
                >
                  CONTACT
                </button>


                <button
                  id="view-work"
                  data-animate="text"
                  className="border border-black/25 bg-white/25 px-4 py-2.5 text-[12px] font-black tracking-widest text-black/70 hover:bg-white/60 active:translate-y-[1px]"
                   onClick={() => document.getElementById("works")?.scrollIntoView({ behavior: "smooth", block: "start" })}

                >
                  VIEW WORK
                </button>
              </div>
            </div>
          </Tile>

          <Tile className="col-span-12 md:col-span-4 min-h-[320px]">
            <div className="h-full p-6 md:p-8">
              <div data-animate="text" className="text-[12px] font-black tracking-[0.24em] text-black/65">
                WHO WE ARE
              </div>

              <h3 data-animate="text" className="mt-4 text-[22px] font-black leading-tight text-black md:text-[26px]">
                {introTitle}
              </h3>

              <p data-animate="text" className="mt-4 max-w-[520px] text-[14px] leading-relaxed text-black/70">
                {introBody}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <MiniTag><span data-animate="text">Design system</span></MiniTag>
                <MiniTag><span data-animate="text">Performance</span></MiniTag>
                <MiniTag><span data-animate="text">Security</span></MiniTag>
                <MiniTag><span data-animate="text">Analytics</span></MiniTag>
              </div>
            </div>
          </Tile>

          <Tile className="col-span-12 md:col-span-5 min-h-[320px]">
            <div className="h-full p-6 md:p-8">
              <div className="flex items-center justify-between">
                <div data-animate="text" className="text-[12px] font-black tracking-[0.24em] text-black/65">
                  BY THE NUMBERS
                </div>
                <span className="h-3 w-3 bg-[#ff5a12]" />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                {metrics.map((m) => (
                  <div
                    key={m.label}
                    className="about-metric fx-noise rounded-2xl border border-black/20 bg-white/18 p-4 hover:bg-white/35"
                  >
                    <div className="text-[28px] font-black text-black">
                      <span
                        data-count={m.value}
                        data-decimals={String(m.value).includes(".") ? "1" : "0"}
                      >
                        0
                      </span>
                      <span data-animate="text" className="ml-1 text-[14px] font-black text-black/70">
                        {m.suffix}
                      </span>
                    </div>
                    <div data-animate="text" className="mt-2 text-[12px] font-semibold text-black/65">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-black/20 bg-white/18 p-4">
                <div data-animate="text" className="text-[12px] font-black tracking-[0.24em] text-black/65">
                  OPERATING PRINCIPLES
                </div>
                <ul className="mt-3 space-y-2 text-[13px] text-black/70">
                  <li className="flex gap-2">
                    <span className="mt-[6px] h-1.5 w-1.5 bg-[#ff5a12]" />
                    <span data-animate="text">Ship in iterations. Measure impact. Repeat.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-[6px] h-1.5 w-1.5 bg-[#ff5a12]" />
                    <span data-animate="text">Build for clarity: UX, code, and communication.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-[6px] h-1.5 w-1.5 bg-[#ff5a12]" />
                    <span data-animate="text">Optimize for speed without sacrificing quality.</span>
                  </li>
                </ul>
              </div>
            </div>
          </Tile>

          <Tile className="col-span-12 md:col-span-3 min-h-[320px]">
            <div className="h-full p-6 md:p-8">
              <div data-animate="text" className="text-[12px] font-black tracking-[0.24em] text-black/65">
                WHAT WE DO
              </div>

              <div className="mt-4 space-y-3">
                {pillars.map((p) => (
                  <div
                    key={p.title}
                    className="fx-pixel-card rounded-2xl border border-black/20 bg-white/18 p-4 hover:bg-white/35"
                  >
                    <div data-animate="text" className="about-glitch-sm text-[14px] font-black text-black">
                      {p.title}
                    </div>
                    <div data-animate="text" className="mt-2 text-[12px] leading-relaxed text-black/65">
                      {p.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Tile>

          <Tile className="col-span-12 min-h-[240px]">
            <div className="h-full p-6 md:p-10">
              <div className="flex items-center justify-between">
                <div data-animate="text" className="text-[12px] font-black tracking-[0.24em] text-black/65">
                  HOW WE WORK
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 bg-[#ff5a12]" />
                  <span data-animate="text" className="text-[12px] font-black tracking-[0.24em] text-black/60">
                    INDUSTRY FLOW
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                {timeline.map((t) => (
                  <div
                    key={t.k}
                    className="fx-scan rounded-2xl border border-black/20 bg-white/18 p-5 hover:bg-white/35"
                  >
                    <div className="flex items-center justify-between">
                      <div data-animate="text" className="text-[26px] font-black text-black/70">
                        {t.k}
                      </div>
                      <span className="h-2 w-2 bg-[#ff5a12]" />
                    </div>
                    <div data-animate="text" className="mt-2 text-[15px] font-black text-black">
                      {t.title}
                    </div>
                    <div data-animate="text" className="mt-2 text-[12px] leading-relaxed text-black/65">
                      {t.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Tile>

          <Tile className="col-span-12 md:col-span-8 min-h-[320px]">
            <div className="h-full p-6 md:p-10">
              <div data-animate="text" className="text-[12px] font-black tracking-[0.24em] text-black/65">
                OUR STORY
              </div>

              <div className="mt-4 divide-y divide-black/15 rounded-2xl border border-black/20 bg-white/18">
                {[
                  {
                    q: "Why this grid-based UI system?",
                    a: "It enforces clarity. Every tile is a purpose-built unit: content, interaction, and data. It scales across dashboards, ERP modules, and consumer pages with consistency.",
                  },
                  {
                    q: "How do you keep performance high with effects?",
                    a: "We use GPU-friendly transforms, avoid heavy reflow, and keep effects lightweight (scanlines/noise/glitch). For real pixelation, we only use canvas when necessary.",
                  },
                  {
                    q: "What’s your delivery approach?",
                    a: "We ship in iterations: design → build → QA → release. Every iteration includes measurable outcomes and system hardening (security, monitoring, optimizations).",
                  },
                ].map((item, idx) => {
                  const active = open === idx;
                  return (
                    <button
                      key={item.q}
                      onClick={() => setOpen((v) => (v === idx ? -1 : idx))}
                      className="w-full text-left"
                    >
                      <div className="flex items-center justify-between px-5 py-4 hover:bg-white/30">
                        <div data-animate="text" className="about-glitch-sm text-[14px] font-black text-black">
                          {item.q}
                        </div>
                        <span className="grid h-9 w-9 place-items-center rounded-xl border border-black/20 bg-white/25 text-black/70">
                          {active ? "–" : "+"}
                        </span>
                      </div>

                      <div
                        className={`grid transition-[grid-template-rows] duration-300 ${active ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                          }`}
                      >
                        <div data-animate="text" className="overflow-hidden px-5 pb-4 text-[13px] leading-relaxed text-black/70">
                          {item.a}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </Tile>

          <Tile className="col-span-12 md:col-span-4 min-h-[320px]">
            <div className="relative h-full p-6 md:p-10">
              <span className="absolute right-6 top-6 h-3 w-3 bg-[#ff5a12]" />

              <div data-animate="text" className="text-[12px] font-black tracking-[0.24em] text-black/65">
                LET’S BUILD
              </div>

              <h3 data-animate="text" className="mt-4 text-[24px] font-black leading-tight text-black">
                Ready to ship a premium product?
              </h3>

              <p data-animate="text" className="mt-3 text-[13px] leading-relaxed text-black/70">
                Tell us your scope. We’ll propose a timeline, architecture, and an execution plan optimized for quality and speed.
              </p>

              <div className="mt-6 space-y-3">
                <button
                  data-animate="text"
                  className="
    relative
    w-full
    bg-[#ff5a12]
    px-6 py-3
    text-[12px] font-black tracking-widest text-white
    shadow-[0_18px_32px_rgba(255,90,18,0.24)]
    overflow-hidden
    transition-all duration-300 ease-out
    hover:brightness-[1.05]
    active:translate-y-[1px]

    /* TOP-LEFT CORNER */
    before:absolute before:top-2 before:left-2
    before:h-3.5 before:w-3.5
    before:border-l-2 before:border-t-2
    before:border-black
    before:content-['']
    before:transition-all before:duration-300

    /* BOTTOM-RIGHT CORNER */
    after:absolute after:bottom-2 after:right-2
    after:h-3.5 after:w-3.5
    after:border-r-2 after:border-b-2
    after:border-black
    after:content-['']
    after:transition-all after:duration-300

    /* PRIMARY HOVER EFFECT */
    hover:before:-translate-x-1 hover:before:-translate-y-1
    hover:after:translate-x-1 hover:after:translate-y-1
  "
   onClick={() => setContactOpen(true)}
                >
                  START A PROJECT
                </button>
                <button
                  data-animate="text"
                  className="w-full border border-black/25 bg-white/25 px-6 py-3 text-[12px] font-black tracking-widest text-black/70 hover:bg-white/60 active:translate-y-[1px]"
                >
                  SEE CAPABILITIES
                </button>
              </div>

              <div className="mt-6 rounded-2xl border border-black/20 bg-white/18 p-4">
                <div data-animate="text" className="text-[12px] font-black tracking-[0.22em] text-black/60">
                  RESPONSE TIME
                </div>
                <div data-animate="text" className="mt-2 text-[13px] text-black/70">
                  24–48 hours for a first reply.
                </div>
              </div>
            </div>
          </Tile>
        </div>
      </div>
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />

    </section>
  );
}

function Tile({ className = "", children }) {
  return (
    <div data-tile className={`relative overflow-hidden border border-black/25 bg-[#d9d9d9] ${className}`}>
      <div className="pointer-events-none absolute inset-0 bg-white/15" />
      {children}
    </div>
  );
}

function MiniTag({ children }) {
  return (
    <span className="rounded-full border border-black/20 bg-white/25 px-3 py-1 text-[12px] font-semibold text-black/70">
      {children}
    </span>
  );
}
