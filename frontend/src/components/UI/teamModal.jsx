// import React, { useEffect, useMemo, useRef } from "react";
// import gsap from "gsap";

// const TEAM = [
//   {
//     id: "t1",
//     name: "Aarav Sen",
//     role: "Founder",
//     bio: "Product-first builder. Systems, UI, performance, and delivery discipline.",
//     tags: ["Product", "Architecture", "Strategy"],
//   },
//   {
//     id: "t2",
//     name: "Ishita Roy",
//     role: "Co-Founder",
//     bio: "Design + engineering bridge. Turns complex workflows into sharp experiences.",
//     tags: ["Design", "UX Systems", "Ops"],
//   },
//   {
//     id: "t3",
//     name: "Kabir Mehta",
//     role: "Engineering Lead",
//     bio: "Scalable frontends + clean backend foundations. Performance obsessed.",
//     tags: ["Frontend", "APIs", "Scale"],
//   },
//   {
//     id: "t4",
//     name: "Naina Kapoor",
//     role: "Design Studio Lead",
//     bio: "Visual systems, brand motion, and product polish across web and mobile.",
//     tags: ["Brand", "Motion", "UI"],
//   },
//   {
//     id: "t5",
//     name: "Rohan Das",
//     role: "Partnerships",
//     bio: "Go-to-market support, launches, and partner coordination across ecosystem.",
//     tags: ["GTM", "Launch", "Alliances"],
//   },
// ];

// export default function TeamModal({ open, onClose }) {
//   const rootRef = useRef(null);
//   const panelRef = useRef(null);
//   const tlRef = useRef(null);

//   const people = useMemo(() => TEAM, []);

//   // init timeline once
//   useEffect(() => {
//     const root = rootRef.current;
//     const panel = panelRef.current;
//     if (!root || !panel) return;

//     const backdrop = root.querySelector("[data-team-backdrop]");
//     const items = panel.querySelectorAll("[data-team-card]");
//     const chips = panel.querySelectorAll("[data-team-chip]");

//     gsap.set(root, { autoAlpha: 0, pointerEvents: "none" });
//     gsap.set(backdrop, { autoAlpha: 0 });
//     gsap.set(panel, { y: 18, autoAlpha: 0 });
//     gsap.set([items, chips], { y: 10, autoAlpha: 0 });

//     const tl = gsap.timeline({
//       paused: true,
//       defaults: { ease: "power3.out" },
//       onReverseComplete: () => {
//         gsap.set(root, { pointerEvents: "none" });
//       },
//     });

//     tl.set(root, { autoAlpha: 1, pointerEvents: "auto" }, 0)
//       .to(backdrop, { autoAlpha: 1, duration: 0.18 }, 0)
//       .to(panel, { y: 0, autoAlpha: 1, duration: 0.22 }, 0.03)
//       .to(
//         items,
//         { y: 0, autoAlpha: 1, duration: 0.22, stagger: 0.05 },
//         0.09
//       )
//       .to(chips, { y: 0, autoAlpha: 1, duration: 0.18, stagger: 0.015 }, 0.16);

//     tlRef.current = tl;

//     return () => {
//       tl.kill();
//       tlRef.current = null;
//     };
//   }, []);

//   // open/close + body lock
//   useEffect(() => {
//     const tl = tlRef.current;
//     if (!tl) return;

//     if (open) {
//       tl.play(0);
//       document.documentElement.style.overflow = "hidden";
//     } else {
//       tl.reverse();
//       document.documentElement.style.overflow = "";
//     }
//     return () => {
//       document.documentElement.style.overflow = "";
//     };
//   }, [open]);

//   // ESC close
//   useEffect(() => {
//     const onKey = (e) => {
//       if (e.key === "Escape" && open) onClose?.();
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [open, onClose]);

//   if (!open) {
//     // keep DOM light when closed
//     return null;
//   }

//   return (
//     <div ref={rootRef} className="fixed inset-0 z-[999]">
//       {/* Backdrop */}
//       <button
//         data-team-backdrop
//         aria-label="Close team modal"
//         onClick={onClose}
//         className="absolute inset-0 bg-black/35"
//       />

//       {/* Panel */}
//       <div className="absolute inset-x-0 top-[74px] md:top-[86px] mx-auto w-full max-w-[980px] px-3 sm:px-4">
//         <div
//           ref={panelRef}
//           className="relative border border-black/25 bg-[#d9d9d9]"
//           role="dialog"
//           aria-modal="true"
//           aria-label="Team"
//         >
//           {/* subtle internal grid */}
//           <div
//             className="pointer-events-none absolute inset-0 opacity-[0.18]
//             [background-image:linear-gradient(to_right,rgba(0,0,0,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.16)_1px,transparent_1px)]
//             [background-size:220px_220px]"
//           />

//           {/* Header row */}
//           <div className="relative border-b border-black/20 px-4 py-4 sm:px-5">
//             <div className="flex items-start justify-between gap-3">
//               <div>
//                 <div className="text-[11px] font-black tracking-[0.22em] text-black/70">
//                   SENEVON
//                 </div>
//                 <div className="mt-1 text-[18px] sm:text-[20px] font-black tracking-[0.12em] text-black/85">
//                   TEAM
//                 </div>
//                 <div className="mt-1 text-[12px] font-semibold text-black/60">
//                   Builders behind products, systems, and delivery.
//                 </div>
//               </div>

//               <button
//                 onClick={onClose}
//                 className="grid h-10 w-10 place-items-center border border-black/25 bg-white/45 hover:bg-white/70 transition"
//                 aria-label="Close"
//                 type="button"
//               >
//                 ✕
//               </button>
//             </div>

//             {/* micro chips */}
//             <div className="mt-4 flex flex-wrap gap-2">
//               {["Product + Services", "Web", "Software", "Apps", "Games", "Design Studio"].map(
//                 (t) => (
//                   <span
//                     key={t}
//                     data-team-chip
//                     className="border border-black/25 bg-white/45 px-3 py-2 text-[11px] font-black tracking-widest text-black/70"
//                   >
//                     {t.toUpperCase()}
//                   </span>
//                 )
//               )}
//             </div>
//           </div>

//           {/* Content */}
//           <div className="relative p-4 sm:p-5">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//               {people.map((p) => (
//                 <div
//                   key={p.id}
//                   data-team-card
//                   className="relative border border-black/25 bg-white/40 p-4 overflow-hidden"
//                 >
//                   <span className="pointer-events-none absolute left-3 top-3 h-2 w-2 bg-[#ff5a12]" />
//                   <span className="pointer-events-none absolute right-3 bottom-3 h-2 w-2 bg-[#ff5a12]" />

//                   <div className="flex items-start justify-between gap-3">
//                     <div>
//                       <div className="text-[16px] font-black text-black/85">
//                         {p.name}
//                       </div>
//                       <div className="mt-1 text-[11px] font-black tracking-[0.22em] text-black/60">
//                         {p.role.toUpperCase()}
//                       </div>
//                     </div>

//                     {/* pixel avatar placeholder */}
//                     <div className="h-12 w-12 border border-black/25 bg-[#d9d9d9] grid place-items-center">
//                       <div className="h-7 w-7 bg-black/20" />
//                     </div>
//                   </div>

//                   <p className="mt-3 font-mono text-[13px] leading-relaxed text-black/70">
//                     {p.bio}
//                   </p>

//                   <div className="mt-3 flex flex-wrap gap-2">
//                     {p.tags.map((tag) => (
//                       <span
//                         key={tag}
//                         className="border border-black/20 bg-white/55 px-2.5 py-1 text-[10px] font-black tracking-[0.18em] text-black/60"
//                       >
//                         {tag.toUpperCase()}
//                       </span>
//                     ))}
//                   </div>

//                   <div className="mt-4 border-t border-black/15 pt-3 flex items-center justify-between">
//                     <span className="text-[10px] font-black tracking-[0.22em] text-black/55">
//                       PROFILE
//                     </span>
//                     <button
//                       type="button"
//                       className="border border-black/25 bg-white/55 px-3 py-2 text-[10px] font-black tracking-widest text-black/70 hover:bg-white/80 active:translate-y-[1px] transition"
//                     >
//                       VIEW ↗
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Footer row */}
//             <div className="mt-4 border-t border-black/15 pt-4 flex items-center justify-between">
//               <div className="text-[11px] font-black tracking-[0.22em] text-black/55">
//                 NEED A TEAM FOR YOUR BUILD?
//               </div>

//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="relative bg-[#ff5a12] px-5 py-2.5 text-[11px] font-black tracking-widest text-white shadow-[0_16px_34px_rgba(255,90,18,0.24)] hover:brightness-[1.03] active:translate-y-[1px] transition"
//               >
//                 CLOSE
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





































































import React, { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";

const TEAM = [
  {
    id: "t1",
    name: "Srijon Karmakar",
    role: "Co-Founder",
    bio: "Full-Stack Engineer, Systems, performance, and delivery discipline.",
    tags: ["Management", "Product", "Strategy"],
  },
  {
    id: "t2",
    name: "Dibyapriya Jana",
    role: "Co-Founder",
    bio: "Design + engineering bridge. Turns complex workflows into sharp experiences.",
    tags: ["Design", "UX Systems", "Ops"],
  },
  {
    id: "t3",
    name: "Santu Pramanik",
    role: "Co-founder",
    bio: "Scalable Products clean backend foundations. Performance obsessed.",
    tags: ["Frontend", "APIs", "Scale"],
  },
  {
    id: "t4",
    name: "Tushar Mondal",
    role: "Co-founder",
    bio: "Visual systems, brand motion, and product polish across web and mobile.",
    tags: ["Brand", "Motion", "UI"],
  },
  {
    id: "t5",
    name: "Steve berger",
    role: "Partnerships",
    bio: "Launches, Foreign Clients and partner coordination across ecosystem.",
    tags: ["GTM", "Launch", "Alliances"],
  },
];

export default function TeamModal({ open, onClose }) {
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const tlRef = useRef(null);

  const people = useMemo(() => TEAM, []);

  useEffect(() => {
    const root = rootRef.current;
    const panel = panelRef.current;
    if (!root || !panel) return;

    const backdrop = root.querySelector("[data-team-backdrop]");
    const items = panel.querySelectorAll("[data-team-card]");
    const chips = panel.querySelectorAll("[data-team-chip]");

    gsap.set(root, { autoAlpha: 0, pointerEvents: "none" });
    gsap.set(backdrop, { autoAlpha: 0 });
    gsap.set(panel, { y: 14, autoAlpha: 0 });
    gsap.set([items, chips], { y: 8, autoAlpha: 0 });

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: "power3.out" },
      onReverseComplete: () => gsap.set(root, { pointerEvents: "none" }),
    });

    tl.set(root, { autoAlpha: 1, pointerEvents: "auto" }, 0)
      .to(backdrop, { autoAlpha: 1, duration: 0.16 }, 0)
      .to(panel, { y: 0, autoAlpha: 1, duration: 0.18 }, 0.02)
      .to(items, { y: 0, autoAlpha: 1, duration: 0.18, stagger: 0.04 }, 0.07)
      .to(chips, { y: 0, autoAlpha: 1, duration: 0.14, stagger: 0.012 }, 0.12);

    tlRef.current = tl;

    return () => {
      tl.kill();
      tlRef.current = null;
    };
  }, []);

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

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && open) onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[999]"
      aria-hidden={!open}
      style={{ pointerEvents: open ? "auto" : "none" }}
    >
      {/* Backdrop */}
      <button
        data-team-backdrop
        aria-label="Close team modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/35"
      />

      {/* Panel wrapper */}
      <div className="absolute inset-x-0 top-[74px] md:top-[86px] mx-auto w-full max-w-[980px] px-3 sm:px-4">
        {/* ✅ Panel is the scroll container (most reliable on mobile) */}
        <div
          ref={panelRef}
          className={[
            "relative border border-black/25 bg-[#d9d9d9] bg-[#ff5a12] overflow-y-auto overflow-x-hidden",
            // viewport fitting
            "max-h-[calc(100dvh-92px)] md:max-h-[calc(100dvh-120px)]",
            // iOS smooth scroll
            "[-webkit-overflow-scrolling:touch]",
          ].join(" ")}
          role="dialog"
          aria-modal="true"
          aria-label="Team"
        >
          {/* subtle internal grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.18]
            [background-image:linear-gradient(to_right,rgba(0,0,0,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.16)_1px,transparent_1px)]
            [background-size:220px_220px]"
          />

          {/* Header row (compact) */}
          <div className="relative border-b border-black/20 px-3 py-3 sm:px-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[10px] sm:text-[11px] font-black tracking-[0.22em] text-black/70">
                  SENEVON
                </div>
                <div className="mt-1 text-[16px] sm:text-[18px] font-black tracking-[0.12em] text-black/85">
                  TEAM
                </div>
                <div className="mt-1 text-[11px] sm:text-[12px] font-semibold text-black/60">
                  Builders behind products, systems, and delivery.
                </div>
              </div>

              <button
                onClick={onClose}
                className="grid h-9 w-9 place-items-center border border-black/25 bg-white/45 hover:bg-white/70 transition"
                aria-label="Close"
                type="button"
              >
                ✕
              </button>
            </div>

            {/* micro chips (smaller) */}
            <div className="mt-3 flex flex-wrap gap-2">
              {["Product + Services", "Web", "Software", "Apps", "Games", "Design Studio"].map(
                (t) => (
                  <span
                    key={t}
                    data-team-chip
                    className="border border-black/25 bg-white/45 px-2.5 py-1.5 text-[10px] font-black tracking-widest text-black/70"
                  >
                    {t.toUpperCase()}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Content (compact padding) */}
          <div className="relative p-3 sm:p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {people.map((p) => (
                <div
                  key={p.id}
                  data-team-card
                  className="relative border border-black/25 bg-white/40 p-3 overflow-hidden"
                >
                  <span className="pointer-events-none absolute left-2 top-2 h-2 w-2 bg-[#ff5a12]" />
                  <span className="pointer-events-none absolute right-2 bottom-2 h-2 w-2 bg-[#ff5a12]" />

                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-[14px] sm:text-[15px] font-black text-black/85">
                        {p.name}
                      </div>
                      <div className="mt-1 text-[10px] font-black tracking-[0.22em] text-black/60">
                        {p.role.toUpperCase()}
                      </div>
                    </div>

                    {/* smaller avatar */}
                    <div className="h-10 w-10 border border-black/25 bg-[#d9d9d9] grid place-items-center shrink-0">
                      <div className="h-6 w-6 bg-black/20" />
                    </div>
                  </div>

                  <p className="mt-2 font-mono text-[12px] leading-relaxed text-black/70">
                    {p.bio}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-black/20 bg-white/55 px-2 py-1 text-[9px] font-black tracking-[0.18em] text-black/60"
                      >
                        {tag.toUpperCase()}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 border-t border-black/15 pt-2.5 flex items-center justify-between">
                    <span className="text-[9px] font-black tracking-[0.22em] text-black/55">
                      PROFILE
                    </span>
                    <button
                      type="button"
                      className="border border-black/25 bg-white/55 px-2.5 py-1.5 text-[9px] font-black tracking-widest text-black/70 hover:bg-white/80 active:translate-y-[1px] transition"
                    >
                      .
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer (compact, always visible by scroll) */}
            <div className="mt-3 border-t border-black/15 pt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="text-[10px] sm:text-[11px] font-black tracking-[0.22em] text-black/55">
                Your Technology Partner for What’s Next.
              </div>

              <button
                type="button"
                onClick={onClose}
                className="bg-[#d9d9d9] px-4 py-2 text-[10px] font-black tracking-widest text-black shadow-[0_16px_34px_rgba(255,90,18,0.24)] hover:brightness-[1.03] active:translate-y-[1px] transition"
              >
                CLOSE
              </button>
            </div>
          </div>

          {/* bottom fade to hint scroll */}
          <div className="pointer-events-none sticky bottom-0 left-0 right-0 h-5 bg-[linear-gradient(180deg,rgba(217,217,217,0),rgba(0, 0, 0, 1))]" />
        </div>
      </div>
    </div>
  );
}
