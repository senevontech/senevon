
import React from "react";
// import SplineScene from "../components/UI/splineTile";
import RobotGrid from "../components/robotGrid";

import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaLinkedinIn,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";



const NAV = ["Our Programs", "Portfolio", "Media", "Reviews", "Team", "FAQ", "Blog"];

const PARTNERS = [
  { name: "Chainlink", mark: "⬡" },
  { name: "TRON", mark: "△" },
  { name: "BNB", mark: "⬢" },
  { name: "0x", mark: "▦" },
];

function MiniStat({ label, value }) {
  return (
    <div className="rounded-xl border border-black/20 bg-white/45 px-3 py-2">
      <div className="text-[10px] font-black tracking-[0.22em] text-black/55">
        {label}
      </div>
      <div className="mt-1 text-[13px] font-black text-black/80">
        {value}
      </div>
    </div>
  );
}


export default function ChainGptHeroSection() {

   const socials = [
    {
      label: "Facebook",
      href: "https://www.facebook.com/profile.php?id=61585962131769",
      icon: FaFacebookF,
    },
    {
      label: "X (Twitter)",
      href: "https://x.com/senevon_tech",
      icon: FaXTwitter,
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/senevon_tech/",
      icon: FaInstagram,
    },
    {
      label: "WhatsApp",
      href: "https://wa.me/",
      icon: FaWhatsapp,
    },
    {
      label: "LinkedIn",
      href: "https://www.instagram.com/senevon_tech/",
      icon: FaLinkedinIn,
    },
  ];


  return (
    <section className="min-h-screen bg-[#d9d9d9] text-black">
      {/* Subtle background grid */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.45] [background-image:linear-gradient(to_right,rgba(0,0,0,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.16)_1px,transparent_1px)] [background-size:220px_220px]" />

      {/* Header */}
      <header className="top-0 z-50 border-b border-black/25 bg-[#d9d9d9]/95 backdrop-blur">
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

            <button className="md:hidden grid h-10 w-10 place-items-center rounded-full border border-black/25 bg-white/50">
              <span className="h-2 w-2 rounded-full bg-[#ff5a12]" />
            </button>



            {/* Mobile CTA */}
            
          </div>
        </div>
      </header>

      {/* Right social rail (desktop) */}

      <div className="fixed right-5 top-[130px] z-40 hidden w-[46px] overflow-hidden  border border-black/25 bg-white/45 backdrop-blur md:block">
      {socials.map((item, i) => {
        const Icon = item.icon;

        return (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            className={[
              "group grid h-11 w-full place-items-center",
              "text-black/70 transition-all duration-300",
              "hover:bg-white hover:text-[#ff5a12]",
              "active:scale-[0.96]",
              i !== socials.length - 1 ? "border-b border-black/15" : "",
            ].join(" ")}
          >
            <Icon className="text-[15px] transition-transform duration-300 group-hover:scale-110" />
          </a>
        );
      })}
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

    {/* <div className="absolute inset-5 sm:inset-6 border border-black/15 bg-white/25">
      <RobotGrid
        url="/models/robot.glb"   
        className="h-full w-full"
      />
    </div> */}

    <div className="absolute inset-0">
  <RobotGrid url="/models/robot.glb" className="h-full w-full" />
</div>

  </div>
</Tile>





          {/* Right media + partners header */}
          {/* <Tile className="col-span-12 md:col-span-3 min-h-[280px] md:min-h-[320px]">
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
          </Tile> */}

          <Tile className="col-span-12 md:col-span-3 min-h-[280px] md:min-h-[320px]">
  <div className="relative h-full p-5 sm:p-6 overflow-hidden">

    {/* Header */}
    <div className="text-[11px] font-black tracking-[0.22em] text-black/65">
      ECOSYSTEM PULSE
    </div>

    <div className="mt-2 text-[13px] font-semibold text-black/60 leading-relaxed">
      Active builders, protocols, and launches across the Senevon network.
    </div>

    {/* Pulse bars */}
    <div className="relative mt-5 h-[120px] rounded-xl border border-black/20 bg-white/40 overflow-hidden">
      <div className="absolute inset-0 flex items-end justify-between px-4 pb-3 gap-[6px]">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="
              w-[6px]
              bg-[#ff5a12]
              opacity-80
              animate-ecosystemPulse
            "
            style={{
              height: `${30 + (i % 5) * 12}px`,
              animationDelay: `${i * 120}ms`,
            }}
          />
        ))}
      </div>

      {/* soft overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.6),rgba(0,0,0,0.04))]" />
    </div>

    {/* Stats */}
    <div className="mt-5 grid grid-cols-3 gap-3">
      <MiniStat label="Builders" value="42+" />
      <MiniStat label="Protocols" value="18" />
      <MiniStat label="Launched" value="9" />
    </div>

    {/* Footer */}
    <div className="mt-5 flex items-center justify-between border-t border-black/15 pt-4">
      <div className="text-[11px] font-black tracking-[0.22em] text-black/60">
        PARTNER NETWORK
      </div>
      <div className="flex items-center gap-1">
        <span className="h-2 w-2 rounded-full bg-[#ff5a12]" />
        <span className="text-[11px] font-semibold text-black/55">LIVE</span>
      </div>
    </div>

    {/* Corner accents */}
    <span className="absolute left-3 top-3 h-2 w-2 bg-[#ff5a12]" />
    <span className="absolute right-3 bottom-3 h-2 w-2 bg-[#ff5a12]" />
  </div>
</Tile>




          {/* Partners row */}
          <div className="col-span-12 grid grid-cols-2 md:grid-cols-4 gap-0">
          {PARTNERS.map((p) => (
            // <Tile key={p.name} className="col-span-12 sm:col-span-6 md:col-span-3 min-h-[90px] md:min-h-[120px]">
            //   <div className="flex h-full items-center justify-center gap-3 px-4">
            //     <span className="grid h-10 w-10 place-items-center rounded-xl border border-black/25 bg-white/45 text-[18px]">
            //       {p.mark}
            //     </span>
            //     <div className="text-[20px] font-black text-black/80">{p.name}</div>
            //   </div>
            // </Tile>

            <Tile key={p.name} className="min-h-[90px] md:min-h-[120px]">
      <div className="flex h-full items-center justify-center gap-3 px-4">
        <span className="grid h-10 w-10 place-items-center rounded-xl border border-black/25 bg-white/45 text-[18px]">
          {p.mark}
        </span>
        <div className="text-[20px] font-black text-black/80">{p.name}</div>
      </div>
    </Tile>
          ))}
          </div>
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
