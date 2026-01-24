// EcosystemPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Header from "../components/Header"

gsap.registerPlugin(ScrollTrigger);

/* ------------------- helpers: split into words (safe) ------------------- */
function splitWords(el) {
  if (!el) return [];
  if (!el.dataset.originalText) el.dataset.originalText = el.textContent || "";
  if (el.dataset.splitWords === "1") return el.querySelectorAll(".gsap-word");

  const text = el.dataset.originalText || "";
  const words = text.trim().split(/\s+/);

  el.dataset.splitWords = "1";
  el.innerHTML = words.map((w) => `<span class="gsap-word">${w}&nbsp;</span>`).join("");
  return el.querySelectorAll(".gsap-word");
}

/* ------------------- tiny, local “images” (svg data uri) ------------------- */
const svgURI = (label) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540">
    <defs>
      <pattern id="g" width="28" height="28" patternUnits="userSpaceOnUse">
        <path d="M 28 0 L 0 0 0 28" fill="none" stroke="rgba(0,0,0,0.25)" stroke-width="1"/>
      </pattern>
      <radialGradient id="r" cx="50%" cy="35%" r="70%">
        <stop offset="0%" stop-color="rgba(255,255,255,0.78)"/>
        <stop offset="60%" stop-color="rgba(255,255,255,0.06)"/>
        <stop offset="100%" stop-color="rgba(0,0,0,0.08)"/>
      </radialGradient>
    </defs>
    <rect width="960" height="540" fill="#d9d9d9"/>
    <rect width="960" height="540" fill="url(#g)" opacity="0.35"/>
    <rect width="960" height="540" fill="url(#r)"/>
    <rect x="56" y="56" width="848" height="428" fill="none" stroke="rgba(0,0,0,0.35)" stroke-width="2"/>
    <text x="50%" y="52%" text-anchor="middle" font-family="ui-monospace, Menlo, Monaco, Consolas" font-weight="800"
      font-size="34" fill="rgba(0,0,0,0.72)" letter-spacing="6">${label}</text>
    <circle cx="98" cy="96" r="8" fill="#ff5a12"/>
    <circle cx="862" cy="444" r="8" fill="#ff5a12"/>
  </svg>
`)}`;

/* ------------------- data ------------------- */
const ECOSYSTEM_PRODUCTS = [
  {
    id: "ep1",
    title: "Senevon Code Studio",
    type: "Platform",
    tag: "EDITOR",
    desc: "Low-latency in-browser editor with workspace-ready architecture, snippets, and extension hooks.",
    bullets: ["Fast rendering", "Workspace model", "Extensible"],
    img: svgURI("CODE STUDIO"),
  },
  {
    id: "ep2",
    title: "Hospital Management System",
    type: "Enterprise",
    tag: "HEALTHCARE",
    desc: "Appointments, billing, pharmacy, lab, staff, and patient records with audit-friendly workflows.",
    bullets: ["Role-based", "Secure", "Operational reports"],
    img: svgURI("HMS"),
  },
  {
    id: "ep3",
    title: "Project Management Suite",
    type: "Enterprise",
    tag: "PRODUCTIVITY",
    desc: "Sprints, tasks, approvals, docs, timelines — designed for clarity and execution speed.",
    bullets: ["Realtime", "Reports", "Team workflows"],
    img: svgURI("PM SUITE"),
  },
  {
    id: "ep4",
    title: "Retail / POS Analytics",
    type: "Software",
    tag: "ANALYTICS",
    desc: "Inventory insights, conversion analytics, dashboards, forecasting — built for operational decisions.",
    bullets: ["Insights", "Forecasting", "Dashboards"],
    img: svgURI("POS ANALYTICS"),
  },
];

const ECOSYSTEM_SERVICES = [
  { id: "s1", name: "Web Engineering", note: "Ship fast, sharp, scalable frontends." },
  { id: "s2", name: "Software Systems", note: "Enterprise architecture and clean APIs." },
  { id: "s3", name: "Mobile Apps", note: "Modern UX + performance-first builds." },
  { id: "s4", name: "Games", note: "Lightweight interactive experiences." },
  { id: "s5", name: "Design Studio", note: "Brand, UI systems, motion, and polish." },
];

const ECOSYSTEM_INTEGRATIONS = [
  { id: "i1", name: "Payments", meta: "Razorpay / Stripe / UPI" },
  { id: "i2", name: "Cloud", meta: "AWS / GCP / Azure" },
  { id: "i3", name: "Auth", meta: "JWT / OAuth / RBAC" },
  { id: "i4", name: "Analytics", meta: "Dashboards / Event tracking" },
  { id: "i5", name: "Messaging", meta: "Email / SMS / Push" },
  { id: "i6", name: "Automation", meta: "Webhooks / Integrations" },
];

const DOMAINS = ["Retail", "Healthcare", "Education", "Startups", "Enterprises"];

/* ------------------- page ------------------- */
export default function EcosystemPage() {
  const scopeRef = useRef(null);
  const [active, setActive] = useState("Platforms");

  const tabs = useMemo(() => ["Platforms", "Services", "Integrations", "Domains"], []);
  const activeIndex = tabs.indexOf(active);

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // Words
      const wordTargets = scope.querySelectorAll('[data-animate="words"]');
      wordTargets.forEach((el) => {
        const words = splitWords(el);
        if (!words?.length) return;

        gsap.set(words, { opacity: 0, y: 14, filter: "blur(10px)" });

        if (reduceMotion) {
          gsap.set(words, { opacity: 1, y: 0, filter: "blur(0px)" });
          return;
        }

        gsap.to(words, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.03,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            end: "top 55%",
            toggleActions: "play none none reverse",
          },
        });
      });

      // Cards
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
            { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08, overwrite: true }
          );

          batch.forEach((card) => {
            const img = card.querySelector("[data-img]");
            if (img) {
              gsap.fromTo(
                img,
                { scale: 1.04, filter: "blur(7px)" },
                { scale: 1, filter: "blur(0px)", duration: 0.9, ease: "power3.out", overwrite: true }
              );
            }
          });
        },
      });

      // Subtle “network” drift
      const dots = scope.querySelectorAll("[data-net-dot]");
      if (!reduceMotion && dots.length) {
        dots.forEach((d, i) => {
          gsap.to(d, {
            x: (i % 3 === 0 ? 1 : -1) * (6 + (i % 5)),
            y: (i % 2 === 0 ? 1 : -1) * (5 + (i % 4)),
            duration: 2.8 + (i % 6) * 0.25,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        });
      }
    }, scopeRef);

    return () => ctx.revert();
  }, [active]);

  return (
    <section ref={scopeRef} className="min-h-screen bg-[#ff5a12] text-black">
      <Header />
      {/* Orange grid background */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.28]
        [background-image:linear-gradient(to_right,rgba(0,0,0,0.22)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.22)_1px,transparent_1px)]
        [background-size:220px_220px]"
      />

      {/* Page container (header is global — not included) */}
      <main className="relative mx-auto w-full max-w-[1600px] px-3 py-4 sm:px-4 sm:py-6">
        <div className="grid grid-cols-12 gap-0 border border-black/30 bg-transparent">
          {/* Left “system mark” tile */}
          <Tile className="col-span-12 md:col-span-1 min-h-[70px] md:min-h-[86px]">
            <div className="flex h-full items-center justify-start px-4">
              <div className="grid h-10 w-10 place-items-center border border-black/25 bg-[#d9d9d9]">
                ⌁
              </div>
            </div>
          </Tile>

          {/* Title tile */}
          <Tile className="col-span-12 md:col-span-11 min-h-[200px] sm:min-h-[240px] md:min-h-[320px]">
            <div className="relative h-full">
              <AccentDot className="left-6 top-6" />
              <AccentDot className="right-6 bottom-6" />

              <div className="flex h-full items-center justify-center px-5 sm:px-8">
                <h1
                  data-animate="words"
                  className="text-center font-black tracking-[0.18em] text-black text-[30px] sm:text-[52px] md:text-[92px] lg:text-[120px] font-[tron]"
                >
                  OUR ECOSYSTEM
                </h1>
              </div>

              <div className="absolute left-6 bottom-4 hidden items-center gap-6 md:flex">
                <span className="inline-flex items-center gap-2 text-[11px] font-black tracking-[0.22em] text-black/80">
                  <span className="h-2 w-2 bg-black" />
                  SENEVON
                </span>
                <span className="text-[11px] font-black tracking-[0.22em] text-black/60">
                  PLATFORMS • SERVICES • INTEGRATIONS
                </span>
              </div>
            </div>
          </Tile>

          {/* Overview / Tabs tile */}
          <Tile className="col-span-12 md:col-span-4 min-h-[280px] md:min-h-[340px]">
            <div className="h-full p-5 sm:p-6">
              <div data-animate="words" className="text-[11px] font-black tracking-[0.22em] text-black/80">
                SYSTEM VIEW
              </div>

              <p
                data-animate="words"
                className="mt-5 max-w-[440px] font-mono text-[13px] sm:text-[13.5px] leading-relaxed text-black/80"
              >
                The Senevon ecosystem is a connected network of products, services, and integrations designed to build,
                scale, and support modern digital systems — from prototypes to enterprise platforms.
              </p>

              {/* Tabs */}
              <div className="mt-6 border-t border-black/25 pt-4">
                <div className="text-[11px] font-black tracking-[0.22em] text-black/75">
                  NAVIGATE
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  {tabs.map((t) => {
                    const isActive = t === active;
                    return (
                      <button
                        key={t}
                        onClick={() => setActive(t)}
                        type="button"
                        className={[
                          "h-10 border border-black/30 bg-[#d9d9d9] px-3 text-[12px] font-black tracking-widest text-black/75 transition",
                          "hover:brightness-[1.02] active:translate-y-[1px]",
                          isActive ? "bg-[#ff5a12] text-[#ff5a12]" : "",
                        ].join(" ")}
                      >
                        {t.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CTA */}
              <div className="mt-6">
                <CornerButton className="w-full justify-center">
                  ENTER ECOSYSTEM
                </CornerButton>
              </div>

              {/* Micro status */}
              <div className="mt-5 border-t border-black/25 pt-4 flex items-center justify-between">
                <div className="text-[11px] font-black tracking-[0.22em] text-black/75">STATUS</div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-black" />
                  <span className="text-[11px] font-black tracking-[0.22em] text-black/70">LIVE</span>
                </div>
              </div>
            </div>
          </Tile>

          {/* “Ecosystem Map” tile */}
          <Tile className="col-span-12 md:col-span-8 min-h-[280px] md:min-h-[340px]">
            <div className="relative h-full p-5 sm:p-6 overflow-hidden">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(720px_300px_at_50%_35%,rgba(255,255,255,0.65),transparent_62%)]" />
              <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background:linear-gradient(180deg,rgba(255,255,255,0),rgba(0,0,0,0.10))]" />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <div data-animate="words" className="text-[11px] font-black tracking-[0.22em] text-black/80">
                    ECOSYSTEM MAP
                  </div>
                  <p
                    data-animate="words"
                    className="mt-3 max-w-[720px] text-[13px] sm:text-[13.5px] font-semibold leading-relaxed text-black/75"
                  >
                    A unified view of how products connect to service layers and integrations — designed for speed,
                    stability, and clean delivery.
                  </p>
                </div>

                <CornerButton className="hidden sm:inline-flex px-4 py-2 text-[11px]">
                  REQUEST INTEGRATION
                </CornerButton>
              </div>

              {/* Map visual */}
              <div className="mt-6 border border-black/30 bg-[#d9d9d9] p-4 sm:p-5">
                <div className="grid grid-cols-12 gap-2">
                  {/* Left column: Products node */}
                  <MapNode title="PLATFORMS" note="Products we ship" className="col-span-12 md:col-span-4">
                    <ul className="mt-3 space-y-2">
                      {ECOSYSTEM_PRODUCTS.slice(0, 3).map((p) => (
                        <li key={p.id} className="flex items-center justify-between border border-black/25 bg-white/60 px-3 py-2">
                          <span className="text-[11px] font-black tracking-[0.16em] text-black/75">
                            {p.title.toUpperCase()}
                          </span>
                          <span className="h-2 w-2 bg-[#ff5a12]" />
                        </li>
                      ))}
                    </ul>
                  </MapNode>

                  {/* Middle column: Connection grid */}
                  <div className="col-span-12 md:col-span-4">
                    <div className="h-full border border-black/25 bg-white/55 p-4">
                      <div className="text-[11px] font-black tracking-[0.22em] text-black/70">
                        CONNECTION GRID
                      </div>
                      <div className="mt-3 grid grid-cols-12 gap-1">
                        {Array.from({ length: 60 }).map((_, i) => (
                          <span
                            key={i}
                            data-net-dot
                            className={[
                              "h-2 border border-black/20 bg-white/70",
                              i % 11 === 0 ? "bg-[#ff5a12]" : "",
                              i % 19 === 0 ? "bg-black/70" : "",
                            ].join(" ")}
                          />
                        ))}
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-black/20 pt-3">
                        <span className="text-[10px] font-black tracking-[0.22em] text-black/65">SYNC</span>
                        <span className="text-[10px] font-black tracking-[0.22em] text-black/60">
                          {tabs[activeIndex]?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right column: Services + Integrations node */}
                  <MapNode title="LAYERED DELIVERY" note="Services + Integrations" className="col-span-12 md:col-span-4">
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <MiniStat label="Build" value="Fast" />
                      <MiniStat label="UX" value="Sharp" />
                      <MiniStat label="Scale" value="Ready" />
                      <MiniStat label="Ops" value="Secure" />
                    </div>

                    <div className="mt-4 border-t border-black/20 pt-3">
                      <div className="text-[10px] font-black tracking-[0.22em] text-black/65">INTEGRATIONS</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {ECOSYSTEM_INTEGRATIONS.slice(0, 4).map((i) => (
                          <span
                            key={i.id}
                            className="border border-black/20 bg-white/65 px-2.5 py-1 text-[10px] font-black tracking-[0.18em] text-black/65"
                          >
                            {i.name.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </MapNode>
                </div>
              </div>
            </div>
          </Tile>

          {/* Platforms (interactive cards) */}
          <Tile className="col-span-12 min-h-[80px]">
            <div className="p-5 sm:p-6 border-b border-black/25">
              <div data-animate="words" className="text-[11px] font-black tracking-[0.22em] text-black/80">
                CORE PLATFORMS
              </div>
              <p
                data-animate="words"
                className="mt-3 max-w-[980px] font-mono text-[13px] sm:text-[13.5px] leading-relaxed text-black/75"
              >
                Product-grade systems designed to be extended, customized, and integrated into your operations — with
                sharp UI and performance-first delivery.
              </p>
            </div>
          </Tile>

          {ECOSYSTEM_PRODUCTS.map((p) => (
            <Tile key={p.id} className="col-span-12 md:col-span-6 min-h-[320px]">
              <EcosystemProductCard product={p} />
            </Tile>
          ))}

          {/* Services pipeline */}
          <Tile className="col-span-12 md:col-span-7 min-h-[320px]">
            <div data-card className="relative h-full p-5 sm:p-6 overflow-hidden">
              <div className="pointer-events-none absolute inset-0 opacity-[0.10]
                [background-image:linear-gradient(to_right,rgba(0,0,0,0.20)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.20)_1px,transparent_1px)]
                [background-size:180px_180px]" />
              <div className="relative">
                <div data-animate="words" className="text-[11px] font-black tracking-[0.22em] text-black/80">
                  SERVICES LAYER
                </div>

                <p
                  data-animate="words"
                  className="mt-3 max-w-[720px] text-[13px] sm:text-[13.5px] font-semibold leading-relaxed text-black/75"
                >
                  Every platform is powered by service modules — engineered to fit your scope, timeline, and scale.
                </p>

                <div className="mt-5 border border-black/30 bg-white/60 p-4 sm:p-5">
                  <div className="text-[10px] font-black tracking-[0.22em] text-black/70">DELIVERY PIPELINE</div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ECOSYSTEM_SERVICES.map((s, idx) => (
                      <div
                        key={s.id}
                        data-card
                        className="group border border-black/25 bg-[#d9d9d9] p-4 transition"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-[12px] font-black tracking-[0.20em] text-black/80">
                              {String(idx + 1).padStart(2, "0")}
                            </div>
                            <div className="mt-2 text-[16px] font-black text-black/85">{s.name}</div>
                            <div className="mt-2 font-mono text-[12.5px] leading-relaxed text-black/70">
                              {s.note}
                            </div>
                          </div>

                          <span className="h-10 w-10 border border-black/25 bg-[#ff5a12] group-hover:bg-black transition" />
                        </div>

                        <div className="mt-4 border-t border-black/20 pt-3 flex items-center justify-between">
                          <span className="text-[10px] font-black tracking-[0.22em] text-black/60">MODULE</span>
                          <span className="text-[10px] font-black tracking-[0.22em] text-black/65">
                            READY ↗
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* little “progress bars” */}
                  <div className="mt-5 border-t border-black/20 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black tracking-[0.22em] text-black/65">THROUGHPUT</span>
                      <span className="text-[10px] font-black tracking-[0.22em] text-black/60">AUTO</span>
                    </div>
                    <div className="mt-3 grid grid-cols-12 gap-1">
                      {Array.from({ length: 48 }).map((_, i) => (
                        <span
                          key={i}
                          className={[
                            "h-2 border border-black/20 bg-white/70",
                            i % 8 === 0 ? "bg-black/70" : "",
                            i % 13 === 0 ? "bg-[#ff5a12]" : "",
                          ].join(" ")}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tile>

          {/* Integrations (interactive list + copy) */}
          <Tile className="col-span-12 md:col-span-5 min-h-[320px]">
            <IntegrationsTile />
          </Tile>

          {/* Domains */}
          <Tile className="col-span-12 min-h-[240px]">
            <div data-card className="relative h-full p-5 sm:p-6 overflow-hidden">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(760px_320px_at_50%_35%,rgba(255,255,255,0.60),transparent_64%)]" />
              <div className="relative">
                <div data-animate="words" className="text-[11px] font-black tracking-[0.22em] text-black/80">
                  INDUSTRY DOMAINS
                </div>
                <p
                  data-animate="words"
                  className="mt-3 max-w-[980px] font-mono text-[13px] sm:text-[13.5px] leading-relaxed text-black/75"
                >
                  We build systems that are industry-agnostic — yet deployment-ready for real workflows across retail,
                  healthcare, education, and fast-moving startups.
                </p>

                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {DOMAINS.map((d) => (
                    <div
                      key={d}
                      data-card
                      className="group border border-black/30 bg-white/60 px-4 py-4 transition hover:bg-white/75"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black tracking-[0.22em] text-black/75">
                          {d.toUpperCase()}
                        </span>
                        <span className="h-2 w-2 bg-[#ff5a12] group-hover:bg-black transition" />
                      </div>
                      <div className="mt-3 h-10 border border-black/20 bg-[#d9d9d9]">
                        <div className="h-full w-[62%] bg-black/70 transition-all group-hover:w-[78%]" />
                      </div>
                      <div className="mt-3 text-[10px] font-black tracking-[0.22em] text-black/60">
                        DEPLOY ↗
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-t border-black/25 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="text-[11px] font-black tracking-[0.22em] text-black/75">
                    READY TO BUILD INSIDE THE ECOSYSTEM?
                  </div>
                  <div className="flex gap-2">
                    <CornerButton className="px-4 py-2 text-[11px]">REQUEST DEMO</CornerButton>
                    <button
                      type="button"
                      className="border border-black/30 bg-[#d9d9d9] px-4 py-2 text-[11px] font-black tracking-widest text-black/75 hover:brightness-[1.02] active:translate-y-[1px] transition"
                    >
                      VIEW WORK ↗
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Tile>
        </div>

        {/* minimal styling for GSAP split words */}
        <style>{`
          .gsap-word{ display:inline-block; will-change:transform,opacity,filter; transform:translateZ(0); }
        `}</style>
      </main>
    </section>
  );
}

/* ---------------- UI blocks ---------------- */

function Tile({ className = "", children }) {
  return (
    <div className={"relative border border-black/30 bg-[#d9d9d9] " + className}>
      <div className="pointer-events-none absolute inset-0 bg-white/12" />
      {children}
    </div>
  );
}

function AccentDot({ className = "" }) {
  return <span className={"absolute h-3 w-3 bg-black " + className} />;
}

function MiniStat({ label, value }) {
  return (
    <div className="border border-black/25 bg-white/60 px-3 py-2">
      <div className="text-[10px] font-black tracking-[0.22em] text-black/65">{label}</div>
      <div className="mt-1 text-[13px] font-black text-black/85">{value}</div>
    </div>
  );
}

function MapNode({ title, note, className = "", children }) {
  return (
    <div className={"h-full border border-black/25 bg-white/55 p-4 " + className}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-black tracking-[0.22em] text-black/75">{title}</div>
          <div className="mt-1 font-mono text-[12px] text-black/70">{note}</div>
        </div>
        <span className="h-10 w-10 border border-black/25 bg-[#ff5a12]" />
      </div>
      {children}
    </div>
  );
}

function EcosystemProductCard({ product }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div data-card className="relative h-full p-5 sm:p-6 overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-black tracking-[0.22em] text-black/65">
            {product.type.toUpperCase()}
          </div>
          <div data-animate="words" className="mt-2 text-[18px] sm:text-[20px] font-black text-black/90">
            {product.title}
          </div>
        </div>
        <div className="h-9 w-9 border border-black/25 bg-[#ff5a12]" />
      </div>

      {/* Image */}
      <div
        data-img
        className="mt-5 relative border border-black/30 bg-white/55 overflow-hidden"
      >
        <img
          src={product.img}
          alt={product.title}
          className="block h-[140px] sm:h-[160px] w-full object-cover"
          loading="lazy"
          decoding="async"
          draggable={false}
        />
        <div className="pointer-events-none absolute left-3 top-3 h-3 w-3 bg-[#ff5a12]" />
        <div className="pointer-events-none absolute right-3 bottom-3 h-3 w-3 bg-[#ff5a12]" />
        <div className="absolute inset-x-0 bottom-0 border-t border-black/25 bg-[#d9d9d9]/90 px-3 py-2">
          <span className="text-[10px] font-black tracking-[0.22em] text-black/75">
            {product.tag}
          </span>
        </div>
      </div>

      <p data-animate="words" className="mt-5 font-mono text-[13px] leading-relaxed text-black/80">
        {product.desc}
      </p>

      {/* Bullets */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {product.bullets.map((b) => (
          <MiniStat key={b} label="Focus" value={b} />
        ))}
      </div>

      {/* Interactive row */}
      <div className="mt-5 border-t border-black/25 pt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setExpanded((s) => !s)}
          className="border border-black/30 bg-white/60 px-4 py-2 text-[11px] font-black tracking-widest text-black/75 hover:bg-white/75 active:translate-y-[1px] transition"
        >
          {expanded ? "HIDE" : "DETAILS"} ↗
        </button>

        <CornerButton className="px-4 py-2 text-[11px]">VIEW</CornerButton>
      </div>

      {/* Expand */}
      <div
        className={[
          "mt-3 border border-black/25 bg-white/55 overflow-hidden transition-[max-height] duration-300",
          expanded ? "max-h-[180px]" : "max-h-0",
        ].join(" ")}
      >
        <div className="p-4">
          <div className="text-[10px] font-black tracking-[0.22em] text-black/65">MODULES</div>
          <div className="mt-3 grid grid-cols-12 gap-1">
            {Array.from({ length: 36 }).map((_, i) => (
              <span
                key={i}
                className={[
                  "h-2 border border-black/20 bg-white/70",
                  i % 9 === 0 ? "bg-[#ff5a12]" : "",
                ].join(" ")}
              />
            ))}
          </div>
          <div className="mt-3 text-[11px] font-semibold text-black/70">
            Built to extend, integrate, and deploy clean.
          </div>
        </div>
      </div>
    </div>
  );
}

function IntegrationsTile() {
  const [copied, setCopied] = useState(false);

  const snippet = `// Integration handshake (example)
POST /api/integrations/webhook
Authorization: Bearer <token>
{
  "event": "order.paid",
  "payload": { ... }
}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 900);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div data-card className="relative h-full p-5 sm:p-6 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-[0.10]
        [background-image:linear-gradient(to_right,rgba(0,0,0,0.20)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.20)_1px,transparent_1px)]
        [background-size:180px_180px]" />

      <div className="relative">
        <div data-animate="words" className="text-[11px] font-black tracking-[0.22em] text-black/80">
          INTEGRATIONS
        </div>
        <p
          data-animate="words"
          className="mt-3 text-[13px] sm:text-[13.5px] font-semibold leading-relaxed text-black/75"
        >
          Plug into modern tools: payments, auth, analytics, notifications, automation — delivered with secure patterns.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-2">
          {ECOSYSTEM_INTEGRATIONS.map((i) => (
            <div
              key={i.id}
              data-card
              className="group border border-black/25 bg-white/60 px-4 py-3 transition hover:bg-white/75"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[12px] font-black tracking-[0.18em] text-black/80">{i.name.toUpperCase()}</div>
                  <div className="mt-1 font-mono text-[12px] text-black/70">{i.meta}</div>
                </div>
                <span className="h-8 w-8 border border-black/25 bg-[#ff5a12] group-hover:bg-black transition" />
              </div>
            </div>
          ))}
        </div>

        {/* Code snippet (interactive) */}
        <div className="mt-5 border border-black/30 bg-white/55">
          <div className="flex items-center justify-between border-b border-black/25 px-4 py-3">
            <div className="text-[10px] font-black tracking-[0.22em] text-black/70">QUICK START</div>
            <button
              type="button"
              onClick={copy}
              className="border border-black/30 bg-[#d9d9d9] px-3 py-1.5 text-[10px] font-black tracking-widest text-black/75 hover:brightness-[1.02] active:translate-y-[1px] transition"
            >
              {copied ? "COPIED" : "COPY"} ↗
            </button>
          </div>
          <pre className="overflow-auto p-4 text-[11px] leading-relaxed text-black/80">
            <code>{snippet}</code>
          </pre>
        </div>

        <div className="mt-5 border-t border-black/25 pt-4 flex items-center justify-between">
          <div className="text-[11px] font-black tracking-[0.22em] text-black/75">SECURE BY DESIGN</div>
          <CornerButton className="px-4 py-2 text-[11px]">TALK TO US</CornerButton>
        </div>
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
        "group relative inline-flex items-center justify-center bg-black px-5 py-2.5",
        "text-[12px] font-black tracking-widest text-[#ff5a12]",
        "shadow-[0_18px_34px_rgba(0,0,0,0.22)]",
        "hover:brightness-[1.04] active:translate-y-[1px] transition",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-[#ff5a12]",
        className,
      ].join(" ")}
      type="button"
    >
      <span className="pointer-events-none absolute -left-2 -top-2 h-4 w-4 border-l-2 border-t-2 border-black" />
      <span className="pointer-events-none absolute -right-2 -top-2 h-4 w-4 border-r-2 border-t-2 border-black" />
      <span className="pointer-events-none absolute -left-2 -bottom-2 h-4 w-4 border-l-2 border-b-2 border-black" />
      <span className="pointer-events-none absolute -right-2 -bottom-2 h-4 w-4 border-r-2 border-b-2 border-black" />
      <span className="relative z-10">{children}</span>
    </button>
  );
}
