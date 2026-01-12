import React from "react";
import "./ChainGrids.css";

const partners = ["Chainlink", "TRON", "BNB", "0x"];

export default function ChainLabsGridHero() {
  return (
    // <section className="relative min-h-[calc(100vh-74px)] bg-[#d9d9d9] overflow-hidden">
        <section className="relative min-h-screen bg-[#d9d9d9] overflow-hidden">
      {/* Subtle page grid lines */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.55] [background-image:linear-gradient(to_right,rgba(0,0,0,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.18)_1px,transparent_1px)] [background-size:220px_220px]" />

      {/* RIGHT social bar like screenshot */}
      <div className="absolute right-6 top-[110px] z-20 hidden w-[44px] overflow-hidden rounded-xl border border-black/25 bg-white/40 backdrop-blur md:block">
        {["◎", "𝕏", "↗", "M", "in"].map((t) => (
          <button
            key={t}
            className="grid h-11 w-full place-items-center border-b border-black/15 text-sm font-black text-black/70 hover:bg-white/70"
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 md:px-6">
        {/* Random-size grid (12 cols) */}
        <div className="grid-auto grid grid-cols-12 gap-0 border border-black/25 bg-[#d9d9d9]">
          {/* Top-left small utility tile */}
          <Tile className="col-span-12 md:col-span-2 min-h-[84px]">
            <div className="flex h-full items-center justify-start px-4 text-black/70">
              <div className="grid h-10 w-10 place-items-center rounded-lg border border-black/25 bg-white/30">
                ✕
              </div>
            </div>
          </Tile>

          {/* Giant title tile (TOMORROW) */}
          <Tile className="col-span-12 md:col-span-10 min-h-[320px] md:min-h-[360px]">
            <div className="relative h-full">
              <div className="absolute left-6 top-6 h-3 w-3 bg-[#ff5a12]" />
              <div className="absolute right-6 bottom-6 h-3 w-3 bg-[#ff5a12]" />

              <div className="flex h-full items-center justify-center px-6">
                <h1 className="glitch text-center text-[64px] font-black tracking-[0.18em] text-black md:text-[110px] lg:text-[150px] font-brand">
                  Senevon
                </h1>
              </div>
            </div>
          </Tile>

          {/* Left copy / CTA */}
          <Tile className="col-span-12 md:col-span-3 min-h-[320px]">
            <div className="h-full p-6">
              <div className="flex items-center gap-6 text-[12px] font-black tracking-[0.2em] text-black/80">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-[#ff5a12]" /> BACKING
                </span>
                <span>TOMORROW</span>
              </div>

              <p className="mt-6 max-w-[320px] font-mono text-[14px] leading-relaxed text-black/70">
                Backing the very best web3 builders — transforming visionary ideas
                into real-world growth.
              </p>

              <button className="mt-8 w-full rounded-xl bg-[#ff5a12] px-5 py-3 text-[12px] font-black tracking-widest text-white shadow-[0_18px_30px_rgba(255,90,18,0.25)] hover:brightness-[1.04] active:translate-y-[1px]">
                APPLY FOR INCUBATION
              </button>
            </div>
          </Tile>

          {/* Center “3D bot” image tile */}
          <Tile className="col-span-12 md:col-span-6 min-h-[320px]">
            <div className="relative h-full overflow-hidden">
              {/* Fake 3D bot placeholder (use your image here) */}
              <div className="pixel-surface absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(600px_260px_at_50%_40%,rgba(255,255,255,0.75),transparent_65%)]" />
                <div className="absolute inset-0 opacity-[0.55] [background:linear-gradient(180deg,rgba(255,255,255,0.0),rgba(0,0,0,0.06))]" />

                <div className="grid h-full place-items-center">
                  <div className="relative">
                    <div className="absolute -inset-10 rounded-[42px] bg-black/5 blur-2xl" />
                    <div className="grid h-[210px] w-[210px] place-items-center rounded-[42px] bg-white/50 border border-black/20 shadow-[0_30px_80px_rgba(0,0,0,0.15)]">
                      <div className="grid h-[120px] w-[120px] place-items-center rounded-[30px] bg-white border border-black/15">
                        <div className="grid h-[92px] w-[92px] place-items-center rounded-[26px] bg-[#ff5a12]">
                          <Face />
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 text-center font-mono text-[12px] text-black/60">
                      Senevon AI
                    </div>
                  </div>
                </div>
              </div>

              {/* Corner markers */}
              <Corner x="12px" y="12px" />
              <Corner x="calc(100% - 12px)" y="12px" />
              <Corner x="12px" y="calc(100% - 12px)" />
              <Corner x="calc(100% - 12px)" y="calc(100% - 12px)" />
            </div>
          </Tile>

          {/* Right media tile */}
          <Tile className="col-span-12 md:col-span-3 min-h-[320px]">
            <div className="relative h-full p-6">
              <div className="pixel-box grid h-[160px] w-full place-items-center overflow-hidden rounded-xl border border-black/25 bg-black/70">
                {/* replace with real image */}
                <div className="relative h-[120px] w-[120px] rounded-2xl bg-white/90 shadow-inner">
                  <div className="absolute inset-0 grid place-items-center text-[40px] font-black text-black/70">
                    ✳
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t border-black/15 pt-4 text-[12px] font-black tracking-[0.2em] text-black/70">
                OUR PARTNERS :
              </div>

              <div className="mt-3 flex items-center justify-between">
                <button className="grid h-11 w-11 place-items-center rounded-xl border border-black/25 bg-white/40 hover:bg-white/70">
                  ‹
                </button>
                <button className="grid h-11 w-11 place-items-center rounded-xl border border-black/25 bg-white/40 hover:bg-white/70">
                  ›
                </button>
              </div>
            </div>
          </Tile>

          {/* Partners strip (bottom row) */}
          {partners.map((p) => (
            <Tile
              key={p}
              className="col-span-6 md:col-span-3 min-h-[120px]"
            >
              <div className="grid h-full place-items-center">
                <div className="flex items-center gap-3 text-[24px] font-black text-black/80">
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-black/25 bg-white/40">
                    ⬣
                  </span>
                  {p}
                </div>
              </div>
            </Tile>
          ))}
        </div>
      </div>
    </section>
  );
}

function Tile({ className = "", children }) {
  return (
    <div
      className={
        "relative border border-black/25 bg-[#d9d9d9] overflow-hidden " + className
      }
    >
      {/* subtle tile inner tint */}
      <div className="pointer-events-none absolute inset-0 bg-white/15" />
      {children}
    </div>
  );
}

function Corner({ x, y }) {
  return (
    <span
      className="pointer-events-none absolute h-3 w-3 bg-[#ff5a12]"
      style={{ left: x, top: y, transform: "translate(-50%,-50%)" }}
    />
  );
}

function Face() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <rect x="14" y="20" width="8" height="8" fill="white" opacity="0.95" />
      <rect x="42" y="20" width="8" height="8" fill="white" opacity="0.95" />
      <rect x="18" y="38" width="28" height="8" rx="4" fill="white" opacity="0.95" />
      <rect x="24" y="30" width="6" height="6" fill="white" opacity="0.95" />
      <rect x="34" y="30" width="6" height="6" fill="white" opacity="0.95" />
    </svg>
  );
}
