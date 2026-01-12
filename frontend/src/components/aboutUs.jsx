import React, { useMemo, useState } from "react";
import "./about.css";

const defaultMetrics = [
  { label: "Products shipped", value: 18, suffix: "+" },
  { label: "Clients supported", value: 65, suffix: "+" },
  { label: "Avg. delivery cycle", value: 21, suffix: " days" },
  { label: "Uptime focus", value: 99.9, suffix: "%" },
];

const defaultPillars = [
  {
    title: "Engineering-first",
    desc: "Production-grade code, predictable delivery, clean architecture.",
  },
  {
    title: "Design systems",
    desc: "Consistent UI language across modules, mobile-first and accessible.",
  },
  {
    title: "Data-driven",
    desc: "Dashboards, analytics, and automation that actually move numbers.",
  },
  {
    title: "Security-aware",
    desc: "Auth, roles, audits, and secure integrations built-in by default.",
  },
];

const defaultTimeline = [
  {
    k: "01",
    title: "Discover",
    desc: "We map goals, constraints, and success metrics.",
  },
  {
    k: "02",
    title: "Design",
    desc: "Grid-based UI system + clickable prototypes.",
  },
  {
    k: "03",
    title: "Build",
    desc: "Iterative releases with QA, reviews, and performance checks.",
  },
  {
    k: "04",
    title: "Scale",
    desc: "Monitoring, optimizations, and long-term support.",
  },
];

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

  return (
    <section className="relative w-full bg-[#d9d9d9]">
      {/* background grid lines */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.55] [background-image:linear-gradient(to_right,rgba(0,0,0,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.18)_1px,transparent_1px)] [background-size:220px_220px]" />

      <div className="relative mx-auto w-full max-w-[1600px] px-3 py-10 md:px-6">
        <div className="grid grid-cols-12 gap-0 border border-black/25 bg-[#d9d9d9]">
          {/* Title tile */}
          <Tile className="col-span-12 md:col-span-7 min-h-[160px]">
            <div className="relative h-full p-6 md:p-10">
              <span className="absolute left-6 top-6 h-3 w-3 bg-[#ff5a12]" />
              <h2 className="about-glitch text-[42px] font-black tracking-[0.14em] text-black md:text-[76px]">
                {title}
              </h2>
            </div>
          </Tile>

          {/* Tagline + CTA tile */}
          <Tile className="col-span-12 md:col-span-5 min-h-[160px]">
            <div className="flex h-full items-center justify-between gap-6 p-6 md:p-10">
              <p className="whitespace-pre-line font-mono text-[15px] leading-relaxed text-black/85">
                {heroTag.join("\n")}
              </p>

              <div className="flex flex-col items-end gap-3">
                <button className="rounded-xl bg-[#ff5a12] px-6 py-2.5 text-[12px] font-black tracking-widest text-white shadow-[0_16px_30px_rgba(255,90,18,0.24)] hover:brightness-[1.03] active:translate-y-[1px]">
                  CONTACT
                </button>
                <button className="rounded-xl border border-black/25 bg-white/25 px-6 py-2.5 text-[12px] font-black tracking-widest text-black/70 hover:bg-white/60 active:translate-y-[1px]">
                  VIEW WORK
                </button>
              </div>
            </div>
          </Tile>

          {/* Left: Intro */}
          <Tile className="col-span-12 md:col-span-4 min-h-[320px]">
            <div className="h-full p-6 md:p-8">
              <div className="text-[12px] font-black tracking-[0.24em] text-black/65">
                WHO WE ARE
              </div>

              <h3 className="mt-4 text-[22px] font-black leading-tight text-black md:text-[26px]">
                {introTitle}
              </h3>

              <p className="mt-4 max-w-[520px] text-[14px] leading-relaxed text-black/70">
                {introBody}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <MiniTag>Design system</MiniTag>
                <MiniTag>Performance</MiniTag>
                <MiniTag>Security</MiniTag>
                <MiniTag>Analytics</MiniTag>
              </div>
            </div>
          </Tile>

          {/* Middle: Metrics */}
          <Tile className="col-span-12 md:col-span-5 min-h-[320px]">
            <div className="h-full p-6 md:p-8">
              <div className="flex items-center justify-between">
                <div className="text-[12px] font-black tracking-[0.24em] text-black/65">
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
                      {m.value}
                      <span className="ml-1 text-[14px] font-black text-black/70">
                        {m.suffix}
                      </span>
                    </div>
                    <div className="mt-2 text-[12px] font-semibold text-black/65">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-black/20 bg-white/18 p-4">
                <div className="text-[12px] font-black tracking-[0.24em] text-black/65">
                  OPERATING PRINCIPLES
                </div>
                <ul className="mt-3 space-y-2 text-[13px] text-black/70">
                  <li className="flex gap-2">
                    <span className="mt-[6px] h-1.5 w-1.5 bg-[#ff5a12]" />
                    Ship in iterations. Measure impact. Repeat.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-[6px] h-1.5 w-1.5 bg-[#ff5a12]" />
                    Build for clarity: UX, code, and communication.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-[6px] h-1.5 w-1.5 bg-[#ff5a12]" />
                    Optimize for speed without sacrificing quality.
                  </li>
                </ul>
              </div>
            </div>
          </Tile>

          {/* Right: Pillars */}
          <Tile className="col-span-12 md:col-span-3 min-h-[320px]">
            <div className="h-full p-6 md:p-8">
              <div className="text-[12px] font-black tracking-[0.24em] text-black/65">
                WHAT WE DO
              </div>

              <div className="mt-4 space-y-3">
                {pillars.map((p) => (
                  <div
                    key={p.title}
                    className="fx-pixel-card rounded-2xl border border-black/20 bg-white/18 p-4 hover:bg-white/35"
                  >
                    <div className="about-glitch-sm text-[14px] font-black text-black">
                      {p.title}
                    </div>
                    <div className="mt-2 text-[12px] leading-relaxed text-black/65">
                      {p.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Tile>

          {/* Process / Timeline (full width) */}
          <Tile className="col-span-12 min-h-[240px]">
            <div className="h-full p-6 md:p-10">
              <div className="flex items-center justify-between">
                <div className="text-[12px] font-black tracking-[0.24em] text-black/65">
                  HOW WE WORK
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 bg-[#ff5a12]" />
                  <span className="text-[12px] font-black tracking-[0.24em] text-black/60">
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
                      <div className="text-[26px] font-black text-black/70">
                        {t.k}
                      </div>
                      <span className="h-2 w-2 bg-[#ff5a12]" />
                    </div>
                    <div className="mt-2 text-[15px] font-black text-black">
                      {t.title}
                    </div>
                    <div className="mt-2 text-[12px] leading-relaxed text-black/65">
                      {t.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Tile>

          {/* Interactive: Accordion / Story */}
          <Tile className="col-span-12 md:col-span-8 min-h-[320px]">
            <div className="h-full p-6 md:p-10">
              <div className="text-[12px] font-black tracking-[0.24em] text-black/65">
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
                        <div className="about-glitch-sm text-[14px] font-black text-black">
                          {item.q}
                        </div>
                        <span className="grid h-9 w-9 place-items-center rounded-xl border border-black/20 bg-white/25 text-black/70">
                          {active ? "–" : "+"}
                        </span>
                      </div>

                      <div
                        className={`grid transition-[grid-template-rows] duration-300 ${
                          active ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        }`}
                      >
                        <div className="overflow-hidden px-5 pb-4 text-[13px] leading-relaxed text-black/70">
                          {item.a}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </Tile>

          {/* CTA tile */}
          <Tile className="col-span-12 md:col-span-4 min-h-[320px]">
            <div className="relative h-full p-6 md:p-10">
              <span className="absolute right-6 top-6 h-3 w-3 bg-[#ff5a12]" />

              <div className="text-[12px] font-black tracking-[0.24em] text-black/65">
                LET’S BUILD
              </div>

              <h3 className="mt-4 text-[24px] font-black leading-tight text-black">
                Ready to ship a premium product?
              </h3>

              <p className="mt-3 text-[13px] leading-relaxed text-black/70">
                Tell us your scope. We’ll propose a timeline, architecture, and an
                execution plan optimized for quality and speed.
              </p>

              <div className="mt-6 space-y-3">
                <button className="w-full rounded-xl bg-[#ff5a12] px-6 py-3 text-[12px] font-black tracking-widest text-white shadow-[0_18px_32px_rgba(255,90,18,0.24)] hover:brightness-[1.03] active:translate-y-[1px]">
                  START A PROJECT
                </button>
                <button className="w-full rounded-xl border border-black/25 bg-white/25 px-6 py-3 text-[12px] font-black tracking-widest text-black/70 hover:bg-white/60 active:translate-y-[1px]">
                  SEE CAPABILITIES
                </button>
              </div>

              <div className="mt-6 rounded-2xl border border-black/20 bg-white/18 p-4">
                <div className="text-[12px] font-black tracking-[0.22em] text-black/60">
                  RESPONSE TIME
                </div>
                <div className="mt-2 text-[13px] text-black/70">
                  24–48 hours for a first reply.
                </div>
              </div>
            </div>
          </Tile>
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

function MiniTag({ children }) {
  return (
    <span className="rounded-full border border-black/20 bg-white/25 px-3 py-1 text-[12px] font-semibold text-black/70">
      {children}
    </span>
  );
}
