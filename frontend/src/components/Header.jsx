// import React from "react";

// export default function Header() {
//   return (
//     <header className="sticky top-0 z-50 w-full border-b border-black/25 bg-[#d9d9d9]">
//       <div className="grid h-[74px] grid-cols-[280px_1fr_260px] items-stretch">
//         {/* Left: logo block */}
//         <div className="flex items-center gap-3 border-r border-black/25 px-6">
//           <div className="grid h-10 w-10 place-items-center rounded-md bg-[#ff5a12] shadow-[0_10px_22px_rgba(255,90,18,0.25)]">
//             <span className="text-lg font-black text-white">⌁</span>
//           </div>
//           <div className="leading-none">
//             <div className="text-[12px] font-semibold tracking-wide text-black/70">
//               SENEVON
//             </div>
//             <div className="text-[20px] font-black tracking-[0.16em] text-black">
//               Tech
//             </div>
//           </div>
//         </div>

//         {/* Center: nav */}
//         <nav className="hidden items-center justify-center gap-10 border-r border-black/25 px-6 text-[13px] font-medium tracking-wide text-black/70 md:flex">
//           {["Our Programs", "Portfolio", "Media", "Reviews", "Team", "FAQ", "Blog"].map(
//             (t) => (
//               <a
//                 key={t}
//                 href="#"
//                 className="hover:text-black transition-colors"
//               >
//                 {t}
//               </a>
//             )
//           )}

//           <a
//             href="#"
//             className="group flex items-center gap-2 text-black/80 hover:text-black"
//           >
//             <span className="grid h-6 w-6 place-items-center rounded-md border border-black/25 bg-white/40">
//               <span className="h-1.5 w-1.5 rounded-full bg-[#ff5a12]" />
//             </span>
//             Our Ecosystem
//           </a>
//         </nav>

//         {/* Right: CTA */}
//         <div className="flex items-center justify-end px-6">
//           <button className="rounded-xl bg-[#ff5a12] px-6 py-2.5 text-[12px] font-black tracking-widest text-white shadow-[0_16px_32px_rgba(255,90,18,0.25)] hover:brightness-[1.03] active:translate-y-[1px]">
//             Contact Us
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// }





























import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * Mobile-first Header with GSAP hamburger menu
 * - Keeps your desktop grid layout (md+)
 * - Adds a premium mobile header + slide-down panel (sm < md)
 * - Smooth GSAP open/close, staggered links, body scroll lock
 * - ESC + outside click to close
 */
export default function Header() {
  const [open, setOpen] = useState(false);

  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const backdropRef = useRef(null);
  const tlRef = useRef(null);

  const NAV = [
    "Our Programs",
    "Portfolio",
    "Media",
    "Reviews",
    "Team",
    "FAQ",
    "Blog",
  ];

  // init timeline once
  useEffect(() => {
    const root = rootRef.current;
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    if (!root || !panel || !backdrop) return;

    const links = panel.querySelectorAll("[data-mnav]");
    const chips = panel.querySelectorAll("[data-chip]");
    const cta = panel.querySelectorAll("[data-cta]");

    gsap.set(panel, { height: 0, opacity: 1 });
    gsap.set(backdrop, { autoAlpha: 0 });
    gsap.set([links, chips, cta], { autoAlpha: 0, y: 10 });

    const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });

    tl.to(backdrop, { autoAlpha: 1, duration: 0.18 }, 0)
      .to(
        panel,
        {
          height: "auto",
          duration: 0.34,
        },
        0
      )
      .to(
        links,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.18,
          stagger: 0.035,
        },
        0.09
      )
      .to(
        chips,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.16,
          stagger: 0.03,
        },
        0.12
      )
      .to(
        cta,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.16,
          stagger: 0.04,
        },
        0.14
      );

    tlRef.current = tl;

    return () => {
      tl.kill();
      tlRef.current = null;
    };
  }, []);

  // open/close animation + body lock
  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;

    if (open) {
      tl.play(0);
      document.documentElement.style.overflow = "hidden";
    } else {
      tl.reverse();
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  // ESC close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const close = () => setOpen(false);
  const toggle = () => setOpen((s) => !s);

  return (
    <header
      ref={rootRef}
      className="sticky top-0 z-50 w-full border-b border-black/25 bg-[#d9d9d9]"
    >
      {/* ===== Mobile Header (sm) ===== */}
      <div className="md:hidden">
        <div className="flex h-[70px] items-stretch">
          {/* left */}
          <div className="flex flex-1 items-center gap-3 px-4">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-[#ff5a12] shadow-[0_10px_22px_rgba(255,90,18,0.25)]">
              <span className="text-lg font-black text-white">⌁</span>
            </div>
            <div className="leading-none">
              <div className="text-[11px] font-semibold tracking-wide text-black/70">
                SENEVON
              </div>
              <div className="text-[18px] font-black tracking-[0.14em] text-black">
                Tech
              </div>
            </div>
          </div>

          {/* right */}
          <div className="flex items-center gap-3 px-4">
            <button
              className="rounded-xl bg-[#ff5a12] px-4 py-2 text-[11px] font-black tracking-widest text-white shadow-[0_14px_28px_rgba(255,90,18,0.22)] active:translate-y-[1px]"
              onClick={() => {
                // keep your routing later
                setOpen(false);
              }}
            >
              Contact
            </button>

            <button
              onClick={toggle}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="group grid h-11 w-11 place-items-center rounded-xl border border-black/25 bg-white/45 shadow-[0_10px_22px_rgba(0,0,0,0.05)]"
            >
              <HamburgerIcon open={open} />
            </button>
          </div>
        </div>

        {/* Backdrop */}
        <button
          ref={backdropRef}
          aria-label="Close menu backdrop"
          onClick={close}
          className="fixed inset-0 z-40 cursor-default bg-black/30"
          style={{ pointerEvents: open ? "auto" : "none" }}
        />

        {/* Slide panel */}
        <div
          className="relative z-50 overflow-hidden border-t border-black/25 bg-[#d9d9d9]"
          ref={panelRef}
        >
          {/* subtle grid only inside panel */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.18]
            [background-image:linear-gradient(to_right,rgba(0,0,0,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.16)_1px,transparent_1px)]
            [background-size:220px_220px]"
          />

          <div className="relative p-4">
            {/* ecosystem chip */}
            <div className="mb-4 flex flex-wrap gap-2">
              <a
                data-chip
                href="#ecosystem"
                onClick={close}
                className="inline-flex items-center gap-2 rounded-full border border-black/25 bg-white/45 px-4 py-2 text-[11px] font-black tracking-widest text-black/70 hover:bg-white/70"
              >
                <span className="grid h-5 w-5 place-items-center rounded-md border border-black/25 bg-white/55">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#ff5a12]" />
                </span>
                OUR ECOSYSTEM
              </a>
            </div>

            {/* nav links */}
            <nav className="grid gap-2">
              {NAV.map((t) => (
                <a
                  key={t}
                  data-mnav
                  href="#"
                  onClick={close}
                  className="group flex items-center justify-between rounded-2xl border border-black/20 bg-white/35 px-4 py-3 text-[13px] font-semibold tracking-wide text-black/75 hover:bg-white/70 hover:text-black"
                >
                  <span>{t}</span>
                  <span className="text-[#ff5a12] opacity-70 transition group-hover:opacity-100">
                    ↗
                  </span>
                </a>
              ))}
            </nav>

            {/* bottom CTA row */}
            <div className="mt-4 grid gap-3">
              <button
                data-cta
                onClick={() => {
                  // hook to router later
                  close();
                }}
                className="rounded-2xl bg-[#ff5a12] px-5 py-3 text-[12px] font-black tracking-widest text-white shadow-[0_16px_34px_rgba(255,90,18,0.25)] hover:brightness-[1.03] active:translate-y-[1px]"
              >
                APPLY NOW
              </button>

              <button
                data-cta
                onClick={() => {
                  // hook to router later
                  close();
                }}
                className="rounded-2xl border border-black/25 bg-white/55 px-5 py-3 text-[12px] font-black tracking-widest text-black/70 hover:bg-white/80 active:translate-y-[1px]"
              >
                REQUEST DEMO
              </button>
            </div>

            {/* micro meta */}
            <div data-cta className="mt-4 flex items-center justify-between">
              <span className="text-[11px] font-black tracking-[0.22em] text-black/55">
                MOBILE MENU
              </span>
              <span className="text-[11px] font-semibold text-black/55">
                Tap outside to close
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Desktop Header (md+) ===== */}
      <div className="hidden md:block">
        <div className="grid h-[74px] grid-cols-[280px_1fr_260px] items-stretch">
          {/* Left: logo block */}
          <div className="flex items-center gap-3 border-r border-black/25 px-6">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-[#ff5a12] shadow-[0_10px_22px_rgba(255,90,18,0.25)]">
              <span className="text-lg font-black text-white">⌁</span>
            </div>
            <div className="leading-none">
              <div className="text-[12px] font-semibold tracking-wide text-black/70">
                SENEVON
              </div>
              <div className="text-[20px] font-black tracking-[0.16em] text-black">
                Tech
              </div>
            </div>
          </div>

          {/* Center: nav */}
          <nav className="flex items-center justify-center gap-10 border-r border-black/25 px-6 text-[13px] font-medium tracking-wide text-black/70">
            {NAV.map((t) => (
              <a key={t} href="#" className="transition-colors hover:text-black">
                {t}
              </a>
            ))}

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
            <button className="bg-[#ff5a12] px-6 py-2.5 text-[12px] font-black tracking-widest text-white shadow-[0_16px_32px_rgba(255,90,18,0.25)] hover:brightness-[1.03] active:translate-y-[1px]">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function HamburgerIcon({ open }) {
  return (
    <div className="relative h-5 w-6">
      <span
        className={[
          "absolute left-0 top-0 h-[2px] w-6 rounded-full bg-black/80 transition-transform duration-300 ease-out",
          open ? "translate-y-[9px] rotate-45" : "",
        ].join(" ")}
      />
      <span
        className={[
          "absolute left-0 top-[9px] h-[2px] w-6 rounded-full bg-black/70 transition-all duration-250 ease-out",
          open ? "opacity-0" : "opacity-100",
        ].join(" ")}
      />
      <span
        className={[
          "absolute left-0 top-[18px] h-[2px] w-6 rounded-full bg-black/80 transition-transform duration-300 ease-out",
          open ? "translate-y-[-9px] -rotate-45" : "",
        ].join(" ")}
      />
    </div>
  );
}
