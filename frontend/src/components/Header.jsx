import React from "react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/25 bg-[#d9d9d9]">
      <div className="grid h-[74px] grid-cols-[280px_1fr_260px] items-stretch">
        {/* Left: logo block */}
        <div className="flex items-center gap-3 border-r border-black/25 px-6">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-[#ff5a12] shadow-[0_10px_22px_rgba(255,90,18,0.25)]">
            <span className="text-lg font-black text-white">⌁</span>
          </div>
          <div className="leading-none">
            <div className="text-[12px] font-semibold tracking-wide text-black/70">
              ChainGPT
            </div>
            <div className="text-[20px] font-black tracking-[0.16em] text-black">
              LABS
            </div>
          </div>
        </div>

        {/* Center: nav */}
        <nav className="hidden items-center justify-center gap-10 border-r border-black/25 px-6 text-[13px] font-medium tracking-wide text-black/70 md:flex">
          {["Our Programs", "Portfolio", "Media", "Reviews", "Team", "FAQ", "Blog"].map(
            (t) => (
              <a
                key={t}
                href="#"
                className="hover:text-black transition-colors"
              >
                {t}
              </a>
            )
          )}

          <a
            href="#"
            className="group flex items-center gap-2 text-black/80 hover:text-black"
          >
            <span className="grid h-6 w-6 place-items-center rounded-md border border-black/25 bg-white/40">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff5a12]" />
            </span>
            Our Ecosystem
          </a>
        </nav>

        {/* Right: CTA */}
        <div className="flex items-center justify-end px-6">
          <button className="rounded-xl bg-[#ff5a12] px-6 py-2.5 text-[12px] font-black tracking-widest text-white shadow-[0_16px_32px_rgba(255,90,18,0.25)] hover:brightness-[1.03] active:translate-y-[1px]">
            APPLY NOW
          </button>
        </div>
      </div>
    </header>
  );
}
