
import React from "react";
import SplineScene from "../components/UI/splineTile";
const NAV = ["Our Programs", "Portfolio", "Media", "Reviews", "Team", "FAQ", "Blog"];

const PARTNERS = [
  { name: "Chainlink", mark: "⬡" },
  { name: "TRON", mark: "△" },
  { name: "BNB", mark: "⬢" },
  { name: "0x", mark: "▦" },
];

export default function ChainGptHeroSection() {
  return (
    <section className="min-h-screen bg-[#d9d9d9] text-black">
      {/* Subtle background grid */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.45] [background-image:linear-gradient(to_right,rgba(0,0,0,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.16)_1px,transparent_1px)] [background-size:220px_220px]" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-black/25 bg-[#d9d9d9]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1600px] items-stretch px-3 sm:px-4">
          {/* Left brand */}
          <div className="flex items-center gap-3 py-3 pr-3 sm:pr-6">
            <div className="grid h-10 w-10 place-items-center rounded-lg border border-black/25 bg-white/50 shadow-[0_10px_22px_rgba(0,0,0,0.06)]">
              <span className="text-lg font-black">⌁</span>
            </div>
            <div className="leading-none">
              <div className="text-[11px] font-semibold tracking-wide text-black/70">
                SENEVON
              </div>
              <div className="text-[18px] font-black tracking-[0.14em] text-black">
                LABS
              </div>
            </div>
          </div>



          {/* Right CTA */}
          <div className="ml-auto flex items-center gap-3 py-3 pl-3 sm:pl-6">

            <button className="md:hidden grid h-10 w-10 place-items-center rounded-xl border border-black/25 bg-white/50">
              <span className="h-2 w-2 rounded-full bg-[#ff5a12]" />
            </button>



            {/* Mobile CTA */}
            <CornerButton className="sm:hidden px-4 py-2 text-[11px]">
              APPLY
            </CornerButton>
          </div>
        </div>

        {/* Mobile nav row (simple + clean) */}
        <div className="md:hidden border-t border-black/20">
          <div className="mx-auto flex max-w-[1600px] items-center gap-4 overflow-x-auto px-3 py-2 sm:px-4">
            {NAV.slice(0, 5).map((t) => (
              <a
                key={t}
                href="#"
                className="whitespace-nowrap text-[12px] font-semibold tracking-wide text-black/65 hover:text-black"
              >
                {t}
              </a>
            ))}
            <a
              href="#"
              className="ml-auto inline-flex items-center gap-2 whitespace-nowrap text-[12px] font-bold tracking-wide text-black/70"
            >
              <span className="grid h-5 w-5 place-items-center rounded-md border border-black/25 bg-white/55">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff5a12]" />
              </span>
              Ecosystem
            </a>
          </div>
        </div>
      </header>

      {/* Right social rail (desktop) */}
      <div className="fixed right-5 top-[130px] z-40 hidden w-[46px] overflow-hidden rounded-xl border border-black/25 bg-white/45 backdrop-blur md:block">
        {["◎", "𝕏", "↗", "M", "in"].map((t, i) => (
          <button
            key={t}
            className={[
              "grid h-11 w-full place-items-center text-sm font-black text-black/70 hover:bg-white/70",
              i !== 4 ? "border-b border-black/15" : "",
            ].join(" ")}
            aria-label={`Social ${t}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Main grid */}
      <main className="relative mx-auto w-full max-w-[1600px] px-3 py-4 sm:px-4 sm:py-6">
        <div className="grid grid-cols-12 gap-0 border border-black/25 bg-[#d9d9d9]">
          {/* small left icon tile */}
          <Tile className="col-span-12 md:col-span-1 min-h-[70px] md:min-h-[84px]">
            <div className="flex h-full items-center justify-start px-4">
              <div className="grid h-10 w-10 place-items-center rounded-lg border border-black/25 bg-white/40">
                ✕
              </div>
            </div>
          </Tile>

          {/* Title tile */}
          <Tile className="col-span-12 md:col-span-11 min-h-[220px] sm:min-h-[260px] md:min-h-[360px]">
            <div className="relative h-full">
              <AccentDot className="left-6 top-6" />
              <AccentDot className="right-6 bottom-6" />

              <div className="flex h-full items-center justify-center px-5 sm:px-8">
                <h1 className="text-center font-black tracking-[0.18em] text-black text-[44px] sm:text-[64px] md:text-[110px] lg:text-[140px] font-[tron]">
                  BACKING TOMORROW
                </h1>
              </div>

              {/* Small “BACKING TOMORROW” mini row (like screenshot) */}
              <div className="absolute left-6 bottom-4 hidden items-center gap-6 md:flex">
                <span className="inline-flex items-center gap-2 text-[11px] font-black tracking-[0.22em] text-black/75">
                  <span className="h-2 w-2 bg-[#ff5a12]" />
                  BACKING
                </span>
                <span className="text-[11px] font-black tracking-[0.22em] text-black/55">
                  TOMORROW
                </span>
              </div>
            </div>
          </Tile>

          {/* Left copy tile */}
          <Tile className="col-span-12 md:col-span-3 min-h-[280px] md:min-h-[320px]">
            <div className="h-full p-5 sm:p-6">
              <div className="flex items-center gap-6 text-[11px] font-black tracking-[0.22em] text-black/75">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 bg-[#ff5a12]" />
                  BACKING
                </span>
                <span className="text-black/55">TOMORROW</span>
              </div>

              <p className="mt-6 max-w-[330px] font-mono text-[13.5px] leading-relaxed text-black/70">
                Backing the very best web3 builders — transforming visionary ideas into
                real-world growth.
              </p>

              <div className="mt-7">
                <CornerButton className="w-full justify-center">
                  APPLY FOR INCUBATION
                </CornerButton>
              </div>
            </div>
          </Tile>

          {/* Middle 3D object tile (placeholder) */}
          {/* <Tile className="col-span-12 md:col-span-6 min-h-[280px] md:min-h-[320px]">
            <div className="relative h-full overflow-hidden">
             
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(650px_260px_at_50%_35%,rgba(255,255,255,0.78),transparent_62%)]" />
              <div className="pointer-events-none absolute inset-0 opacity-[0.55] [background:linear-gradient(180deg,rgba(255,255,255,0),rgba(0,0,0,0.06))]" />

              
              <div className="grid h-full place-items-center p-6">
                <div className="relative">
                  <div className="absolute -inset-10 rounded-[48px] bg-black/5 blur-2xl" />
                  <div className="relative grid h-[220px] w-[220px] place-items-center rounded-[46px] border border-black/15 bg-white/55 shadow-[0_38px_90px_rgba(0,0,0,0.16)]">
                    <div className="grid h-[150px] w-[150px] place-items-center rounded-[34px] border border-black/15 bg-white">
                      <div className="grid h-[110px] w-[110px] place-items-center rounded-[26px] bg-[#ff5a12] shadow-[0_22px_50px_rgba(255,90,18,0.25)]">
                        <div className="h-[64px] w-[64px] rounded-2xl bg-black/15" />
                      </div>
                    </div>

                  
                    <div className="absolute right-[-12px] top-1/2 h-10 w-10 -translate-y-1/2 rounded-full border border-black/15 bg-white shadow-[0_12px_28px_rgba(0,0,0,0.10)]" />
                  </div>
                </div>
              </div>
            </div>
          </Tile> */}

          {/* Middle tile: Spline Scene (lazy + optimized)  */}
          <Tile className="col-span-12 md:col-span-6 min-h-[280px] md:min-h-[320px]">
            <div className="relative h-full overflow-hidden">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(650px_260px_at_50%_35%,rgba(255,255,255,0.78),transparent_62%)]" />
              <div className="pointer-events-none absolute inset-0 opacity-[0.55] [background:linear-gradient(180deg,rgba(255,255,255,0),rgba(0,0,0,0.06))]" />

              <div className="absolute inset-5 sm:inset-6 border border-black/15 bg-white/25">
                <SplineScene
                  scene="https://prod.spline.design/cqkCM4wTqKla9twy/scene.splinecode"
                  className="h-full w-full"
                />
              </div>
              <div
      className="
        pointer-events-none
        absolute
        bottom-10 right-10
        z-20
        bg-[#d9d9d9]
        w-[140px] h-[44px]
        sm:w-[160px] sm:h-[48px]
        md:w-[180px] md:h-[52px]
      "
    />
            </div>
          </Tile>




          {/* Right media + partners header */}
          <Tile className="col-span-12 md:col-span-3 min-h-[280px] md:min-h-[320px]">
            <div className="h-full p-5 sm:p-6">
              <div className="grid h-[160px] w-full place-items-center overflow-hidden rounded-xl border border-black/25 bg-black/70">
                <div className="relative grid h-[120px] w-[120px] place-items-center rounded-2xl bg-white/90 shadow-inner">
                  <div className="absolute inset-0 grid place-items-center text-[46px] font-black text-black/70">
                    ✳
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-black/15 pt-4">
                <div className="text-[11px] font-black tracking-[0.22em] text-black/65">
                  OUR PARTNERS :
                </div>
                <div className="flex items-center gap-2">
                  <button className="grid h-10 w-10 place-items-center rounded-xl border border-black/25 bg-white/45 hover:bg-white/70">
                    ‹
                  </button>
                  <button className="grid h-10 w-10 place-items-center rounded-xl border border-black/25 bg-white/45 hover:bg-white/70">
                    ›
                  </button>
                </div>
              </div>
            </div>
          </Tile>

          

          {/* Partners row */}
          {PARTNERS.map((p) => (
            <Tile key={p.name} className="col-span-12 sm:col-span-6 md:col-span-3 min-h-[90px] md:min-h-[120px]">
              <div className="flex h-full items-center justify-center gap-3 px-4">
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-black/25 bg-white/45 text-[18px]">
                  {p.mark}
                </span>
                <div className="text-[20px] font-black text-black/80">{p.name}</div>
              </div>
            </Tile>
          ))}
        </div>
      </main>
    </section>
  );
}

/* ---------------- UI helpers ---------------- */

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

/**
 * Corner bracket button (matches screenshot CTA style)
 * - Mobile-first sizing
 * - No pseudo-elements (pure JSX for reliability)
 */
function CornerButton({ className = "", children }) {
  return (
    <button
      className={[
        "group relative inline-flex items-center rounded-none bg-[#ff5a12] px-5 py-2.5",
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
