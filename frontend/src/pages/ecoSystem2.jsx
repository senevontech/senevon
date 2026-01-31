// src/pages/EcosystemPage.jsx
import React, { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";

const cn = (...a) => a.filter(Boolean).join(" ");

const SectionCard = ({ logoSrc, logoAlt, title, items, index }) => {
  return (
    <section
      data-card
      className={cn(
        "relative overflow-hidden",
        "rounded-2xl border border-black/20",
        "bg-[#d7d7d7]", // matches your grey board
        "shadow-[0_18px_40px_rgba(0,0,0,0.12)]",
        "will-change-transform"
      )}
    >
      {/* inner grid line feel */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.65]">
        <div className="absolute inset-0 [background:linear-gradient(to_right,rgba(0,0,0,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.10)_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      {/* header (logo row) */}
      <div className="relative flex items-center justify-center px-6 py-7">
        <img
          data-logo
          src={logoSrc}
          alt={logoAlt}
          className="h-10 sm:h-11 md:h-12 w-auto object-contain"
          loading="lazy"
          draggable="false"
        />
      </div>

      {/* divider line like the mock */}
      <div className="relative h-px w-full bg-black/25" />

      {/* body */}
      <div className="relative px-6 py-9 sm:py-10">
        <ul className="mx-auto flex max-w-[340px] flex-col gap-4">
          {items.map((t, i) => (
            <li key={`${index}-${i}`} data-item>
              <div
                className={cn(
                  "group relative",
                  "rounded-[10px] border border-black/15",
                  "bg-[#e6c7bf]", // peach tile
                  "px-4 py-3",
                  "shadow-[0_10px_18px_rgba(0,0,0,0.10)]",
                  "transition-transform duration-300 ease-out",
                  "hover:-translate-y-[2px] active:translate-y-[0px]"
                )}
              >
                {/* tiny square bullet icon */}
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  <span className="grid h-4 w-4 place-items-center rounded-[4px] border border-black/20 bg-white/35">
                    <span className="h-1.5 w-1.5 rounded-[2px] bg-[#f05a14]" />
                  </span>
                </span>

                <div className="pl-7 text-center">
                  <p className="text-[13px] font-semibold tracking-wide text-black/75 sm:text-[14px]">
                    {t}
                  </p>
                </div>

                {/* hover sheen */}
                <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[10px]">
                  <span className="absolute -left-1/2 top-0 h-full w-1/2 -skew-x-12 bg-white/25 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default function EcosystemPage() {
  const rootRef = useRef(null);

  const data = useMemo(
    () => [
      {
        key: "tech",
        logoSrc: "/logo/tech.png", // ✅ put your image path
        logoAlt: "Senevon Tech",
        items: ["IT Solutions", "IT Services", "Consultacy"],
      },
      {
        key: "studio",
        logoSrc: "/logo/studio.png", // ✅ put your image path
        logoAlt: "Senevon Studio",
        items: ["Games Studio", "3D Studio", "Graphics Design", "Logo & Branding"],
      },
      {
        key: "labs",
        logoSrc: "/logo/labs.png", // ✅ put your image path
        logoAlt: "Senevon Labs",
        items: ["AI & Automation", "Collaboration", "Web3 experiments", "Prototypes"],
      },
    ],
    []
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // initial states (GPU-friendly)
      gsap.set("[data-hero]", { opacity: 0, y: 14 });
      gsap.set("[data-card]", { opacity: 0, y: 18, scale: 0.985, transformOrigin: "50% 50%" });
      gsap.set("[data-logo]", { opacity: 0, y: 10 });
      gsap.set("[data-item]", { opacity: 0, y: 10 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 0.7 },
      });

      tl.to("[data-hero]", { opacity: 1, y: 0, duration: 0.75 })
        .to(
          "[data-card]",
          { opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 0.75 },
          "-=0.35"
        )
        .to(
          "[data-logo]",
          { opacity: 1, y: 0, stagger: 0.08, duration: 0.6 },
          "-=0.55"
        )
        .to(
          "[data-item]",
          { opacity: 1, y: 0, stagger: 0.03, duration: 0.45 },
          "-=0.55"
        );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={rootRef}
      className={cn(
        "min-h-screen w-full",
        "bg-[#cfcfcf] text-black",
        "overflow-x-hidden"
      )}
    >
      {/* TOP BOARD (like your mock) */}
      <header
        data-hero
        className={cn(
          "mx-auto w-full max-w-6xl",
          "px-4 sm:px-6",
          "pt-6 sm:pt-8"
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden",
            "rounded-2xl border border-black/25",
            "bg-[#d7d7d7]",
            "shadow-[0_20px_44px_rgba(0,0,0,0.14)]"
          )}
        >
          {/* grid lines */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.65]">
            <div className="absolute inset-0 [background:linear-gradient(to_right,rgba(0,0,0,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.10)_1px,transparent_1px)] [background-size:52px_52px]" />
          </div>

          <div className="relative flex flex-col items-center justify-center py-10 sm:py-12">
            {/* MAIN LOGO IMAGE */}
            <img
              src="/images/logos/senevon-main.png" // ✅ put your main logo image path
              alt="Senevon Inc"
              className="h-14 sm:h-16 md:h-[74px] w-auto object-contain"
              loading="eager"
              draggable="false"
            />

            <p className="mt-3 text-[13px] font-semibold tracking-widest text-[#f05a14]">
              senevon.in
            </p>
          </div>

          {/* bottom divider */}
          <div className="relative h-px w-full bg-black/25" />
        </div>
      </header>

      {/* THREE PANELS */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-10 pt-6 sm:px-6 sm:pb-14 sm:pt-8">
        <div
          className={cn(
            "grid gap-5 sm:gap-6",
            "grid-cols-1",
            "md:grid-cols-3"
          )}
        >
          {data.map((s, idx) => (
            <SectionCard
              key={s.key}
              index={idx}
              logoSrc={s.logoSrc}
              logoAlt={s.logoAlt}
              title={s.key}
              items={s.items}
            />
          ))}
        </div>

        {/* subtle footer spacing like board */}
        <div className="mt-7 h-px w-full bg-black/20" />
      </section>
    </main>
  );
}
