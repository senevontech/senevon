import React, { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "../components/production.css";

gsap.registerPlugin(ScrollTrigger);

/* ------------------- data (edit freely) ------------------- */
const SUBPARTS = [
  {
    id: "s1",
    name: "SENEVON STUDIO",
    role: "DESIGN + BRAND + UI SYSTEMS",
    desc: "We craft product UI, brand systems, motion, and web experiences with a strict modernist grid and functional motion.",
    tags: ["UI/UX", "Brand", "Motion", "Web"],
    img: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1400&q=60",
  },
  {
    id: "s2",
    name: "SENEVON GAMES",
    role: "GAME DEV + INTERACTIVE WORLDS",
    desc: "From concept to playable builds — mechanics, visuals, level design, and release-ready pipelines.",
    tags: ["Unity", "Unreal", "2D/3D", "Launch"],
    img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1400&q=60",
  },
  {
    id: "s3",
    name: "SENEVON ELECTRONICS",
    role: "IOT + EMBEDDED + PROTOTYPING",
    desc: "Hardware prototypes, embedded firmware, sensors, automation and smart devices designed for real environments.",
    tags: ["IoT", "Embedded", "Prototyping", "Sensors"],
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=60",
  },
  {
    id: "s4",
    name: "SENEVON LABS",
    role: "R&D + AI + EXPERIMENTS",
    desc: "Rapid experimentation: data, AI, automation, and internal tools to accelerate build speed and quality.",
    tags: ["AI", "Data", "Automation", "R&D"],
    img: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1400&q=60",
  },
  {
    id: "s5",
    name: "SENEVON SYSTEMS",
    role: "B2B SOFTWARE + INFRA",
    desc: "Production-grade systems for businesses: dashboards, analytics, ERP modules, and secure integrations.",
    tags: ["SaaS", "Dashboards", "APIs", "Security"],
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=60",
  },
  {
    id: "s6",
    name: "SENEVON ACADEMY",
    role: "TRAINING + MENTORSHIP",
    desc: "Workshops, mentorship and structured learning paths for teams and builders — shipping-first approach.",
    tags: ["Mentorship", "Workshops", "Teams", "Career"],
    img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=60",
  },
];

function clamp(i, n) {
  return ((i % n) + n) % n;
}

/* ------------------- helper: split into words (safe) ------------------- */
function splitWords(el) {
  if (!el) return [];
  if (!el.dataset.originalText) el.dataset.originalText = el.textContent || "";
  const text = el.dataset.originalText || "";
  const words = text.trim().split(/\s+/);

  el.innerHTML = words.map((w) => `<span class="gsap-word">${w}&nbsp;</span>`).join("");
  return el.querySelectorAll(".gsap-word");
}

export default function EcosystemPage() {
  const scopeRef = useRef(null);

  const featured = useMemo(() => {
    // first 4 as primary row (feel free to change)
    return [0, 1, 2, 3].map((i) => SUBPARTS[clamp(i, SUBPARTS.length)]);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // title reveal
      const titleEl = scopeRef.current?.querySelector("h2.prod-glitch");
      if (titleEl) {
        const words = splitWords(titleEl);
        gsap.set(words, { opacity: 0, y: 18, filter: "blur(10px)" });
        gsap.to(words, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.03,
          scrollTrigger: {
            trigger: titleEl,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      }

      // cards reveal (super light)
      const cards = scopeRef.current?.querySelectorAll("[data-eco-card]");
      if (cards?.length) {
        gsap.set(cards, { opacity: 0, y: 18 });
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: cards[0],
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      }
    }, scopeRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={scopeRef} className="relative w-full bg-[#d9d9d9]">
      {/* subtle grid background */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.55] [background-image:linear-gradient(to_right,rgba(0,0,0,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.18)_1px,transparent_1px)] [background-size:220px_220px]" />

      <div className="relative mx-auto w-full max-w-[1600px] px-3 py-10 md:px-6">
        <div className="grid grid-cols-12 gap-0 border border-black/25 bg-[#d9d9d9]">
          {/* BIG TITLE tile */}
          <Tile className="col-span-12 md:col-span-7 min-h-[160px]">
            <div className="relative h-full p-6 md:p-10">
              <span className="absolute left-6 top-6 h-3 w-3 bg-[#ff5a12]" />
              <h2 className="prod-glitch text-[34px] font-black tracking-[0.14em] text-black sm:text-[44px] md:text-[70px]">
                SUBS
              </h2>

              <p className="mt-3 max-w-[680px] font-mono text-[13px] leading-relaxed text-black/70 md:text-[14px]">
                Sub-brands and specialized teams — built on the same grid-first philosophy:
                clear hierarchy, engineered layouts, and functional motion.
              </p>
            </div>
          </Tile>

          {/* RIGHT meta tile */}
          <Tile className="col-span-12 md:col-span-5 min-h-[160px]">
            <div className="flex h-full flex-col justify-between gap-6 p-6 md:p-10">
              <div>
                <p className="font-mono text-[14px] leading-relaxed text-black/80">
                  • Built for real businesses
                  <br />
                  shipping real systems
                </p>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <MiniStat label="Subparts" value={`${SUBPARTS.length}+`} />
                  <MiniStat label="Domains" value="6" />
                  <MiniStat label="Live" value="Yes" />
                </div>
              </div>

              <div className="flex gap-3">
                <SharpButton onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                  TOP
                </SharpButton>
                <SharpButton
                  onClick={() => {
                    const el = scopeRef.current?.querySelector("#eco-grid");
                    el?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  VIEW UNITS
                </SharpButton>
              </div>
            </div>
          </Tile>

          {/* Featured row (4 cards) */}
          {featured.map((p) => (
            <Tile key={p.id} className="col-span-12 sm:col-span-6 md:col-span-3">
              <EcosystemCard part={p} />
            </Tile>
          ))}

          {/* Divider / note tile */}
          <Tile className="col-span-12">
            <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-8">
              <div className="font-mono text-[13px] leading-relaxed text-black/70">
                <span className="mr-2 inline-block h-2 w-2 bg-[#ff5a12]" />
                Each unit can operate independently — but shares the same quality bar:
                strict grid, sharp details, and production discipline.
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-[12px] tracking-widest text-black/60">
                  PARTNER NETWORK
                </span>
                <span className="inline-flex items-center gap-2 font-mono text-[12px] tracking-widest text-black/70">
                  <span className="h-2 w-2 rounded-full bg-[#ff5a12]" />
                  LIVE
                </span>
              </div>
            </div>
          </Tile>

          {/* Full grid of all subparts */}
          {SUBPARTS.map((p) => (
            <Tile key={p.id} className="col-span-12 md:col-span-6" id="eco-grid">
              <EcosystemWideCard part={p} />
            </Tile>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ UI pieces ------------------------------ */
function Tile({ className = "", children, ...rest }) {
  return (
    <div
      className={`relative overflow-hidden border border-black/25 bg-[#d9d9d9] ${className}`}
      {...rest}
    >
      <div className="pointer-events-none absolute inset-0 bg-white/15" />
      {children}
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="border border-black/20 bg-white/18 px-3 py-2">
      <div className="font-mono text-[10px] tracking-widest text-black/55">{label}</div>
      <div className="mt-0.5 text-[14px] font-black tracking-wide text-black">{value}</div>
    </div>
  );
}

function SharpButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        border border-black/25 bg-white/18 px-4 py-2
        font-mono text-[12px] tracking-widest text-black/80
        hover:bg-white/45 active:translate-y-[1px]
      "
    >
      {children}
    </button>
  );
}

function EcosystemCard({ part }) {
  return (
    <div data-eco-card className="flex h-full flex-col">
      <div className="border-b border-black/20 bg-white/18 px-5 py-4 text-center">
        <div className="prod-glitch-sm text-[14px] font-black tracking-[0.18em] text-black">
          {part.name}
        </div>
        <div className="mt-1 text-[11px] font-black tracking-[0.2em] text-black/60">
          {part.role}
        </div>
      </div>

      {/* 4:3 image */}
      <div className="p-5">
        <div className="fx-pixelate relative w-full overflow-hidden border border-black/25 bg-black/10 aspect-[4/3]">
          <img
            src={part.img}
            alt={part.name}
            className="absolute inset-0 h-full w-full object-cover grayscale"
            loading="lazy"
          />
          <span className="corner tl" />
          <span className="corner tr" />
          <span className="corner bl" />
          <span className="corner br" />
        </div>

        <p className="mt-4 line-clamp-3 font-mono text-[12px] leading-relaxed text-black/70">
          {part.desc}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {part.tags.map((t) => (
            <span
              key={t}
              className="border border-black/20 bg-white/18 px-2 py-1 font-mono text-[10px] tracking-widest text-black/70"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <button className="group mt-auto border-t border-black/20 bg-white/18 px-5 py-4 text-center font-mono text-[12px] tracking-widest text-black/80 hover:bg-white/45">
        EXPLORE <span className="text-[#ff5a12] font-black">+</span>
      </button>
    </div>
  );
}

function EcosystemWideCard({ part }) {
  return (
    <div data-eco-card className="grid grid-cols-12 gap-0">
      <div className="col-span-12 border-b border-black/20 bg-white/18 px-5 py-4 md:col-span-5 md:border-b-0 md:border-r md:border-black/20">
        <div className="text-[18px] font-black tracking-wide text-black">{part.name}</div>
        <div className="mt-1 font-mono text-[11px] tracking-widest text-black/60">{part.role}</div>

        <p className="mt-4 font-mono text-[12px] leading-relaxed text-black/70">{part.desc}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {part.tags.map((t) => (
            <span
              key={t}
              className="border border-black/20 bg-white/18 px-2 py-1 font-mono text-[10px] tracking-widest text-black/70"
            >
              {t}
            </span>
          ))}
        </div>

        <button className="mt-5 border border-black/25 bg-white/18 px-4 py-2 font-mono text-[12px] tracking-widest text-black/80 hover:bg-white/45 active:translate-y-[1px]">
          OPEN UNIT <span className="text-[#ff5a12] font-black">+</span>
        </button>
      </div>

      <div className="col-span-12 p-5 md:col-span-7">
        <div className="fx-pixelate relative w-full overflow-hidden border border-black/25 bg-black/10 aspect-[4/3]">
          <img
            src={part.img}
            alt={part.name}
            className="absolute inset-0 h-full w-full object-cover grayscale"
            loading="lazy"
          />
          <span className="corner tl" />
          <span className="corner tr" />
          <span className="corner bl" />
          <span className="corner br" />
        </div>
      </div>
    </div>
  );
}
