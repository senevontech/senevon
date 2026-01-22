
// import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
// import gsap from "gsap";
// import ScrollTrigger from "gsap/ScrollTrigger";
// import "./ourWorks.css";

// gsap.registerPlugin(ScrollTrigger);

// /** ✅ Add categories later easily */
// const CATEGORIES = [
//   { key: "websites", label: "Websites" },
//   { key: "webapps", label: "Webapps" },
//   { key: "datascience", label: "Data Science" },
//   { key: "graphics", label: "Graphics Designs" },
// ];

// /** ✅ Demo data (replace with your real works) */
// const WORKS = [
//   {
//     id: "w1",
//     category: "websites",
//     title: "Senevon",
//     subtitle: "Futuristic marketing site",
//     tags: ["Next.js", "Tailwind", "GSAP"],
//     image:
//       "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1600&q=60",
//   },
//   {
//     id: "w2",
//     category: "websites",
//     title: " Glm+",
//     subtitle: "Product + services web presence",
//     tags: ["React", "UI System", "SEO"],
//     image:
//       "https://images.unsplash.com/photo-1519222970733-f546218fa6d7?auto=format&fit=crop&w=1600&q=60",
//   },
//   {
//     id: "w3",
//     category: "webapps",
//     title: "SPorty",
//     subtitle: "Sports management system",
//     tags: ["MERN", "Role-based", "Analytics"],
//     image:
//       "https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&w=1600&q=60",
//   },
//   {
//     id: "w4",
//     category: "webapps",
//     title: "Hsuit Platform",
//     subtitle: "HR + payroll SaaS",
//     tags: ["React", "Node", "Subscriptions"],
//     image:
//       "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1600&q=60",
//   },
//   {
//     id: "w5",
//     category: "datascience",
//     title: "Vendor Priority Model",
//     subtitle: "Minimal-column ranking engine",
//     tags: ["Python", "Pandas", "ML"],
//     image:
//       "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1600&q=60",
//   },
//   {
//     id: "w6",
//     category: "datascience",
//     title: "Retail KPI Analytics",
//     subtitle: "Conversion + anomaly insights",
//     tags: ["Time-series", "Dashboards", "Reports"],
//     image:
//       "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=60",
//   },
//   {
//     id: "w7",
//     category: "graphics",
//     title: "Brand Identity Pack",
//     subtitle: "Logo + brand kit + UI kit",
//     tags: ["Figma", "Branding", "Design"],
//     image:
//       "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1600&q=60",
//   },
//   {
//     id: "w8",
//     category: "graphics",
//     title: "Social Creatives",
//     subtitle: "Campaign posters and banners",
//     tags: ["Ads", "Visuals", "Export-ready"],
//     image:
//       "https://images.unsplash.com/photo-1526481280695-3c687fd643ed?auto=format&fit=crop&w=1600&q=60",
//   },
// ];

// /* ----------------------------- Word Splitter (FAST) ----------------------------- */
// function splitWords(el, { maxWords = 70 } = {}) {
//   if (!el) return { words: [], skipped: true };
//   if (el.dataset.splitWords === "1") {
//     return { words: Array.from(el.querySelectorAll(".gsap-word")), skipped: false };
//   }

//   const original = el.textContent || "";
//   const trimmed = original.trim();
//   if (!trimmed) return { words: [], skipped: true };

//   const tokens = original.match(/(\S+|\s+)/g) || [];
//   const wordCount = tokens.filter((t) => !/^\s+$/.test(t)).length;
//   if (wordCount > maxWords) return { words: [], skipped: true };

//   el.dataset.splitWords = "1";
//   el.dataset.originalText = original;

//   const html = tokens
//     .map((t) => {
//       if (/^\s+$/.test(t)) {
//         return t.replace(/ /g, "&nbsp;").replace(/\n/g, "<br/>");
//       }
//       return `<span class="gsap-word">${t}</span>`;
//     })
//     .join("");

//   el.innerHTML = html;
//   return { words: Array.from(el.querySelectorAll(".gsap-word")), skipped: false };
// }

// export default function WorksSection({
//   title = "OUR WORKS",
//   subtitle = "• Built with clarity, shipped with quality",
//   categories = CATEGORIES,
//   works = WORKS,
// }) {
//   const sectionRef = useRef(null);

//   const [active, setActive] = useState(categories?.[0]?.key || "websites");
//   const [query, setQuery] = useState("");

//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     return works
//       .filter((w) => w.category === active)
//       .filter((w) => {
//         if (!q) return true;
//         return (
//           w.title.toLowerCase().includes(q) ||
//           w.subtitle.toLowerCase().includes(q) ||
//           (w.tags || []).some((t) => String(t).toLowerCase().includes(q))
//         );
//       });
//   }, [works, active, query]);

//   /* ----------------------- Viewport animations (industry + smooth) ----------------------- */
//   useEffect(() => {
//     const scope = sectionRef.current;
//     if (!scope) return;

//     const reduceMotion =
//       typeof window !== "undefined" &&
//       window.matchMedia &&
//       window.matchMedia("(prefers-reduced-motion: reduce)").matches;

//     if (reduceMotion) return;

//     gsap.defaults({ overwrite: "auto" });

//     const ctx = gsap.context(() => {
//       // A) Tiles reveal (batched)
//       const tiles = gsap.utils.toArray(scope.querySelectorAll("[data-tile]"));
//       gsap.set(tiles, { opacity: 0, y: 16 });

//       ScrollTrigger.batch(tiles, {
//         start: "top 92%",
//         once: true,
//         onEnter: (batch) =>
//           gsap.to(batch, {
//             opacity: 1,
//             y: 0,
//             duration: 0.55,
//             ease: "power3.out",
//             stagger: 0.06,
//           }),
//       });

//       // B) Text: word-by-word for marked elements
//       const textEls = gsap.utils.toArray(scope.querySelectorAll('[data-animate="text"]'));
//       const splitTargets = [];
//       const simpleTargets = [];

//       textEls.forEach((el) => {
//         const { words, skipped } = splitWords(el, { maxWords: 70 });
//         if (!skipped && words.length) splitTargets.push({ el, words });
//         else simpleTargets.push(el);
//       });

//       splitTargets.forEach(({ words }) => gsap.set(words, { opacity: 0, y: 12 }));

//       ScrollTrigger.batch(
//         splitTargets.map((x) => x.el),
//         {
//           start: "top 88%",
//           once: true,
//           onEnter: (batch) => {
//             batch.forEach((el) => {
//               const item = splitTargets.find((x) => x.el === el);
//               if (!item) return;
//               gsap.to(item.words, {
//                 opacity: 1,
//                 y: 0,
//                 duration: 0.5,
//                 ease: "power3.out",
//                 stagger: 0.02,
//               });
//             });
//           },
//         }
//       );

//       if (simpleTargets.length) {
//         gsap.set(simpleTargets, { opacity: 0, y: 10 });
//         ScrollTrigger.batch(simpleTargets, {
//           start: "top 88%",
//           once: true,
//           onEnter: (batch) =>
//             gsap.to(batch, {
//               opacity: 1,
//               y: 0,
//               duration: 0.45,
//               ease: "power3.out",
//               stagger: 0.04,
//             }),
//         });
//       }

//       // C) Cards reveal (batched) — keeps scroll smooth
//       const cards = gsap.utils.toArray(scope.querySelectorAll(".wk-card"));
//       gsap.set(cards, { opacity: 0, y: 14 });

//       ScrollTrigger.batch(cards, {
//         start: "top 92%",
//         once: true,
//         onEnter: (batch) =>
//           gsap.to(batch, {
//             opacity: 1,
//             y: 0,
//             duration: 0.5,
//             ease: "power3.out",
//             stagger: 0.06,
//           }),
//       });

//       ScrollTrigger.refresh();
//     }, sectionRef);

//     return () => ctx.revert();
//   }, []);

//   /* Small animation when category/search changes (FAST + minimal) */
//   useLayoutEffect(() => {
//     const scope = sectionRef.current;
//     if (!scope) return;

//     const reduceMotion =
//       typeof window !== "undefined" &&
//       window.matchMedia &&
//       window.matchMedia("(prefers-reduced-motion: reduce)").matches;

//     if (reduceMotion) return;

//     const cards = scope.querySelectorAll(".wk-card");
//     if (!cards.length) return;

//     gsap.fromTo(
//       cards,
//       { opacity: 0, y: 10 },
//       { opacity: 1, y: 0, duration: 0.28, stagger: 0.03, ease: "power2.out" }
//     );
//   }, [active, query]);

//   return (
//     <section ref={sectionRef} className="relative w-full bg-[#d9d9d9]">
//       {/* grid background */}
//       <div
//         className="pointer-events-none absolute inset-0 opacity-[0.55]
//         [background-image:linear-gradient(to_right,rgba(0,0,0,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.18)_1px,transparent_1px)]
//         [background-size:220px_220px]"
//       />

//       <div className="relative mx-auto w-full max-w-[1600px] px-3 py-10 md:px-6">
//         <div className="grid grid-cols-12 gap-0 border border-black/25 bg-[#d9d9d9]">
//           {/* Title tile */}
//           <Tile className="col-span-12 md:col-span-7 min-h-[170px]">
//             <div className="relative h-full p-6 md:p-10">
//               <span className="absolute left-6 top-6 h-3 w-3 bg-[#ff5a12]" />
//               <h2
//                 data-animate="text"
//                 className="wk-title text-[40px] font-black tracking-[0.14em] text-black md:text-[72px]"
//               >
//                 {title}
//               </h2>
//             </div>
//           </Tile>

//           {/* Subtitle + Search tile */}
//           <Tile className="col-span-12 md:col-span-5 min-h-[170px]">
//             <div className="flex h-full flex-col justify-between gap-6 p-6 md:p-10">
//               <p
//                 data-animate="text"
//                 className="wk-sub font-mono text-[15px] leading-relaxed text-black/80"
//               >
//                 {subtitle}
//               </p>

//               <div className="flex items-center gap-3">
//                 <div className="flex-1 rounded-xl border border-black/25 bg-white/25 px-4 py-3">
//                   <input
//                     value={query}
//                     onChange={(e) => setQuery(e.target.value)}
//                     placeholder="Search projects, tags…"
//                     className="w-full bg-transparent text-[13px] font-semibold text-black/75 outline-none placeholder:text-black/35"
//                   />
//                 </div>
//                 <button
//                   data-animate="text"
//                   onClick={() => setQuery("")}
//                   className="rounded-xl border border-black/25 bg-white/25 px-4 py-3 text-[12px] font-black tracking-widest text-black/60 hover:bg-white/60"
//                 >
//                   CLEAR
//                 </button>
//               </div>
//             </div>
//           </Tile>

//           {/* Category bar */}
//           <Tile className="col-span-12">
//             <div className="flex items-center gap-3 overflow-x-auto px-4 py-4 md:px-6">
//               {categories.map((c) => {
//                 const on = c.key === active;
//                 return (
//                   <button
//                     key={c.key}
//                     onClick={() => setActive(c.key)}
//                     className={[
//                       "shrink-0  border px-4 py-2 text-[12px] font-black tracking-widest transition",
//                       on
//                         ? "border-black/40 bg-[#ff5a12] text-white shadow-[0_16px_30px_rgba(255,90,18,0.25)]"
//                         : "border-black/25 bg-white/20 text-black/70 hover:bg-white/55",
//                     ].join(" ")}
//                   >
//                     <span data-animate="text">{c.label}</span>
//                   </button>
//                 );
//               })}

//               <div className="ml-auto hidden items-center gap-2 md:flex">
//                 <span className="h-3 w-3 bg-[#ff5a12]" />
//                 <span
//                   data-animate="text"
//                   className="text-[12px] font-black tracking-[0.22em] text-black/60"
//                 >
//                   FILTERED: {filtered.length}
//                 </span>
//               </div>
//             </div>
//           </Tile>

//           {/* Cards grid */}
//           <div className="col-span-12">
//             <div className="grid grid-cols-12 gap-0">
//               {filtered.map((w) => (
//                 <Tile
//                   key={w.id}
//                   className="col-span-12 sm:col-span-6 lg:col-span-4 min-h-[520px]"
//                 >
//                   <WorkCard work={w} />
//                 </Tile>
//               ))}

//               {filtered.length === 0 && (
//                 <Tile className="col-span-12 min-h-[240px]">
//                   <div className="grid h-full place-items-center p-10 text-center">
//                     <div>
//                       <div data-animate="text" className="text-[16px] font-black text-black/80">
//                         No matches found.
//                       </div>
//                       <div data-animate="text" className="mt-2 text-[13px] text-black/60">
//                         Try a different keyword or clear search.
//                       </div>
//                     </div>
//                   </div>
//                 </Tile>
//               )}
//             </div>
//           </div>

//           {/* Footer CTA tile */}
//           <Tile className="col-span-12">
//             <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-8">
//               <div>
//                 <div data-animate="text" className="text-[12px] font-black tracking-[0.24em] text-black/60">
//                   WANT SOMETHING SIMILAR?
//                 </div>
//                 <div data-animate="text" className="mt-2 text-[18px] font-black text-black/85">
//                   Let’s build your next product with the same system.
//                 </div>
//               </div>

//               <div className="flex gap-3">
//                 <button
//   data-animate="text"
//   className="
//     relative
    
//     bg-[#ff5a12]
//     px-6 py-3
//     text-[12px] font-black tracking-widest text-white
//     shadow-[0_16px_30px_rgba(255,90,18,0.24)]
//     overflow-hidden
//     transition-all duration-300 ease-out
//     hover:brightness-[1.04]
//     active:translate-y-[1px]

//     /* TOP-LEFT CORNER */
//     before:absolute before:top-2 before:left-2
//     before:h-3 before:w-3
//     before:border-l-2 before:border-t-2
//     before:border-black
//     before:content-['']
//     before:transition-all before:duration-300

//     /* BOTTOM-RIGHT CORNER */
//     after:absolute after:bottom-2 after:right-2
//     after:h-3 after:w-3
//     after:border-r-2 after:border-b-2
//     after:border-black
//     after:content-['']
//     after:transition-all after:duration-300

//     /* COMPACT HOVER MOTION */
//     hover:before:-translate-x-0.5 hover:before:-translate-y-0.5
//     hover:after:translate-x-0.5 hover:after:translate-y-0.5
//   "
// >
//   START A PROJECT
// </button>


//                 <button
//                   data-animate="text"
//                   className=" border border-black/25 bg-white/25 px-6 py-3 text-[12px] font-black tracking-widest text-black/70 hover:bg-white/60 active:translate-y-[1px]"
//                 >
//                   REQUEST DEMO
//                 </button>
//               </div>
//             </div>
//           </Tile>
//         </div>
//       </div>
//     </section>
//   );
// }

// function Tile({ className = "", children }) {
//   return (
//     <div data-tile className={`relative overflow-hidden border border-black/25 bg-[#d9d9d9] ${className}`}>
//       <div className="pointer-events-none absolute inset-0 bg-white/15" />
//       {children}
//     </div>
//   );
// }

// function WorkCard({ work }) {
//   return (
//     <article className="wk-card flex h-full flex-col">
//       <div className="wk-top border-b border-black/20 bg-white/18 px-5 py-4">
//         <div data-animate="text" className="wk-glitch wk-titleClamp text-[16px] font-black tracking-wide text-black">
//           {work.title}
//         </div>
//         <div data-animate="text" className="wk-subClamp mt-1 text-[12px] font-semibold text-black/65">
//           {work.subtitle}
//         </div>
//       </div>

//       <div className="px-5 py-5">
//         <div className="wk-mediaWrap">
//           <div className="wk-media fx-pixelate overflow-hidden border border-black/25 bg-black/10">
//             <img src={work.image} alt={work.title} className="wk-img" loading="lazy" />
//             <span className="wk-corner tl" />
//             <span className="wk-corner tr" />
//             <span className="wk-corner bl" />
//             <span className="wk-corner br" />

//             <div className="wk-hover-overlay">
//               <div className="wk-tags">
//                 {(work.tags || []).slice(0, 3).map((t) => (
//                   <span key={t} className="wk-tag">
//                     <span data-animate="text">{t}</span>
//                   </span>
//                 ))}
//               </div>
//               <button className="wk-view">
//                 <span data-animate="text">
//                   VIEW <span className="wk-plus">+</span>
//                 </span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="mt-auto flex items-center justify-between border-t border-black/20 bg-white/18 px-5 py-4">
//         <div data-animate="text" className="text-[12px] font-black tracking-[0.22em] text-black/55">
//           CASE STUDY
//         </div>
//         <div data-animate="text" className="flex items-center gap-2 text-[12px] font-black text-black/70">
//           Open <span className="text-[#ff5a12]">↗</span>
//         </div>
//       </div>
//     </article>
//   );
// }
















































































import React, { useMemo, useRef, useState } from "react";
import "./ourWorks.css";
import ContactModal from "../components/UI/ContactModal";


/** ✅ Add categories later easily */
const CATEGORIES = [
  { key: "websites", label: "Websites" },
  { key: "webapps", label: "Webapps" },
  { key: "datascience", label: "Data Science" },
  { key: "graphics", label: "Graphics Designs" },
];

// works 
const WORKS = [
  {
    id: "w1",
    category: "websites",
    title: "Portfolios",
    subtitle: "Futuristic Portfolio sites",
    tags: ["Next.js", "Tailwind", "GSAP"],
    image:
      "https://res.cloudinary.com/dktixqoek/image/upload/v1769063204/85427_ngd0pl.jpg",
  },
  {
    id: "w2",
    category: "websites",
    title: "Toolit",
    subtitle: "Online Tool system",
    tags: ["Image compressor", "converters", "GSAP"],
    image:
      "https://res.cloudinary.com/dktixqoek/image/upload/v1769063205/85843_uzprdv.png",
  },
  {
    id: "w3",
    category: "websites",
    title: "Travar",
    subtitle: "Tour and travel management system",
    tags: ["React", "UI System", "Mongo db"],
    image:
      "https://res.cloudinary.com/dktixqoek/image/upload/v1769063204/85493_ethtct.jpg",
  },
  {
    id: "w4",
    category: "webapps",
    title: "Moon Walk",
    subtitle: "E-commerce platform",
    tags: ["MERN", "Role-based", "Analytics"],
    image:
      "https://res.cloudinary.com/dktixqoek/image/upload/v1769075047/85895_mynmro.png",
  },
  {
    id: "w5",
    category: "webapps",
    title: "Resturang",
    subtitle: "Resturent website",
    tags: ["MERN", "Role-based", "Analytics"],
    image:
      "https://res.cloudinary.com/dktixqoek/image/upload/v1769063204/85426_lylyfg.jpg",
  },
  {
    id: "w6",
    category: "webapps",
    title: "Codemist",
    subtitle: "Cloud Code editor",
    tags: ["React", "Node", "SaaS"],
    image:
      " https://res.cloudinary.com/dktixqoek/image/upload/v1769063209/85844_a2nyje.png",
  },
  {
    id: "w7",
    category: "datascience",
    title: "Vendor Priority Model",
    subtitle: "Minimal-column ranking engine",
    tags: ["Python", "Pandas", "ML"],
    image:
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1600&q=60",
  },
  {
    id: "w8",
    category: "datascience",
    title: "Retail KPI Analytics",
    subtitle: "Conversion + anomaly insights",
    tags: ["Time-series", "Dashboards", "Reports"],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=60",
  },
  {
    id: "w9",
    category: "graphics",
    title: "Brand Identity Pack",
    subtitle: "Logo + brand kit + UI kit",
    tags: ["Figma", "Branding", "Design"],
    image:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1600&q=60",
  },
  {
    id: "w10",
    category: "graphics",
    title: "Social Creatives",
    subtitle: "Campaign posters and banners",
    tags: ["Ads", "Visuals", "Export-ready"],
    image:
      "https://images.unsplash.com/photo-1526481280695-3c687fd643ed?auto=format&fit=crop&w=1600&q=60",
  },
];

/* ----------------------------- Word Splitter (FAST) ----------------------------- */


export default function WorksSection({
  title = "OUR WORKS",
  subtitle = "• Built with clarity, shipped with quality",
  categories = CATEGORIES,
  works = WORKS,
}) {
  const sectionRef = useRef(null);

  const [active, setActive] = useState(categories?.[0]?.key || "websites");
  const [query, setQuery] = useState("");

  const [contactOpen, setContactOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return works
      .filter((w) => w.category === active)
      .filter((w) => {
        if (!q) return true;
        return (
          w.title.toLowerCase().includes(q) ||
          w.subtitle.toLowerCase().includes(q) ||
          (w.tags || []).some((t) => String(t).toLowerCase().includes(q))
        );
      });
  }, [works, active, query]);

  /* ----------------------- Viewport animations (industry + smooth) ----------------------- */
 

  /* Small animation when category/search changes (FAST + minimal) */


  return (
    <section id="works" ref={sectionRef} className="relative w-full bg-[#d9d9d9]">
      {/* grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.55]
        [background-image:linear-gradient(to_right,rgba(0,0,0,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.18)_1px,transparent_1px)]
        [background-size:220px_220px]"
      />

      <div className="relative mx-auto w-full max-w-[1600px] px-3 py-10 md:px-6">
        <div className="grid grid-cols-12 gap-0 border border-black/25 bg-[#d9d9d9]">
          {/* Title tile */}
          <Tile className="col-span-12 md:col-span-7 min-h-[170px]">
            <div className="relative h-full p-6 md:p-10">
              <span className="absolute left-6 top-6 h-3 w-3 bg-[#ff5a12]" />
              <h2
                data-animate="text"
                className="wk-title text-[40px] font-black tracking-[0.14em] text-black md:text-[72px]"
              >
                {title}
              </h2>
            </div>
          </Tile>

          {/* Subtitle + Search tile */}
          <Tile className="col-span-12 md:col-span-5 min-h-[170px]">
            <div className="flex h-full flex-col justify-between gap-6 p-6 md:p-10">
              <p
                data-animate="text"
                className="wk-sub font-mono text-[15px] leading-relaxed text-black/80"
              >
                {subtitle}
              </p>

              <div className="flex items-center gap-3">
                <div className="flex-1 rounded-xl border border-black/25 bg-white/25 px-4 py-3">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search projects, tags…"
                    className="w-full bg-transparent text-[13px] font-semibold text-black/75 outline-none placeholder:text-black/35"
                  />
                </div>
                <button
                  data-animate="text"
                  onClick={() => setQuery("")}
                  className="rounded-xl border border-black/25 bg-white/25 px-4 py-3 text-[12px] font-black tracking-widest text-black/60 hover:bg-white/60"
                >
                  CLEAR
                </button>
              </div>
            </div>
          </Tile>

          {/* Category bar */}
          <Tile className="col-span-12">
            <div className="flex items-center gap-3 overflow-x-auto px-4 py-4 md:px-6">
              {categories.map((c) => {
                const on = c.key === active;
                return (
                  <button
                    key={c.key}
                    onClick={() => setActive(c.key)}
                    className={[
                      "shrink-0  border px-4 py-2 text-[12px] font-black tracking-widest transition",
                      on
                        ? "border-black/40 bg-[#ff5a12] text-white shadow-[0_16px_30px_rgba(255,90,18,0.25)]"
                        : "border-black/25 bg-white/20 text-black/70 hover:bg-white/55",
                    ].join(" ")}
                  >
                    <span data-animate="text">{c.label}</span>
                  </button>
                );
              })}

              <div className="ml-auto hidden items-center gap-2 md:flex">
                <span className="h-3 w-3 bg-[#ff5a12]" />
                <span
                  data-animate="text"
                  className="text-[12px] font-black tracking-[0.22em] text-black/60"
                >
                  FILTERED: {filtered.length}
                </span>
              </div>
            </div>
          </Tile>

          {/* Cards grid */}
          <div className="col-span-12">
            <div className="grid grid-cols-12 gap-0">
              {filtered.map((w) => (
                <Tile
                  key={w.id}
                  className="col-span-12 sm:col-span-6 lg:col-span-4 min-h-[520px]"
                >
                  <WorkCard work={w} />
                </Tile>
              ))}

              {filtered.length === 0 && (
                <Tile className="col-span-12 min-h-[240px]">
                  <div className="grid h-full place-items-center p-10 text-center">
                    <div>
                      <div data-animate="text" className="text-[16px] font-black text-black/80">
                        No matches found.
                      </div>
                      <div data-animate="text" className="mt-2 text-[13px] text-black/60">
                        Try a different keyword or clear search.
                      </div>
                    </div>
                  </div>
                </Tile>
              )}
            </div>
          </div>

          {/* Footer CTA tile */}
          <Tile className="col-span-12">
            <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-8">
              <div>
                <div data-animate="text" className="text-[12px] font-black tracking-[0.24em] text-black/60">
                  WANT SOMETHING SIMILAR?
                </div>
                <div data-animate="text" className="mt-2 text-[18px] font-black text-black/85">
                  Let’s build your next product with the same system.
                </div>
              </div>

              <div className="flex gap-3">
                <button
  data-animate="text"
  className="
    relative
    
    bg-[#ff5a12]
    px-6 py-3
    text-[12px] font-black tracking-widest text-white
    shadow-[0_16px_30px_rgba(255,90,18,0.24)]
    overflow-hidden
    transition-all duration-300 ease-out
    hover:brightness-[1.04]
    active:translate-y-[1px]

    /* TOP-LEFT CORNER */
    before:absolute before:top-2 before:left-2
    before:h-3 before:w-3
    before:border-l-2 before:border-t-2
    before:border-black
    before:content-['']
    before:transition-all before:duration-300

    /* BOTTOM-RIGHT CORNER */
    after:absolute after:bottom-2 after:right-2
    after:h-3 after:w-3
    after:border-r-2 after:border-b-2
    after:border-black
    after:content-['']
    after:transition-all after:duration-300

    /* COMPACT HOVER MOTION */
    hover:before:-translate-x-0.5 hover:before:-translate-y-0.5
    hover:after:translate-x-0.5 hover:after:translate-y-0.5
  "
  onClick={() => setContactOpen(true)}
>
  START A PROJECT
</button>


                <button
                  data-animate="text"
                  className=" border border-black/25 bg-white/25 px-6 py-3 text-[12px] font-black tracking-widest text-black/70 hover:bg-white/60 active:translate-y-[1px]"
                >
                  REQUEST DEMO
                </button>
              </div>
            </div>
          </Tile>
        </div>
      </div>
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </section>
  );
}

function Tile({ className = "", children }) {
  return (
    <div data-tile className={`relative overflow-hidden border border-black/25 bg-[#d9d9d9] ${className}`}>
      <div className="pointer-events-none absolute inset-0 bg-white/15" />
      {children}
    </div>
  );
}

function WorkCard({ work }) {
  return (
    <article className="wk-card flex h-full flex-col">
      <div className="wk-top border-b border-black/20 bg-white/18 px-5 py-4">
        <div data-animate="text" className="wk-glitch wk-titleClamp text-[16px] font-black tracking-wide text-black">
          {work.title}
        </div>
        <div data-animate="text" className="wk-subClamp mt-1 text-[12px] font-semibold text-black/65">
          {work.subtitle}
        </div>
      </div>

      <div className="px-5 py-5">
        <div className="wk-mediaWrap">
          <div className="wk-media fx-pixelate overflow-hidden border border-black/25 bg-black/10">
            <img src={work.image} alt={work.title} className="wk-img" loading="lazy" />
            <span className="wk-corner tl" />
            <span className="wk-corner tr" />
            <span className="wk-corner bl" />
            <span className="wk-corner br" />

            <div className="wk-hover-overlay">
              <div className="wk-tags">
                {(work.tags || []).slice(0, 3).map((t) => (
                  <span key={t} className="wk-tag">
                    <span data-animate="text">{t}</span>
                  </span>
                ))}
              </div>
              {/* <button className="wk-view">
                <span data-animate="text">
                  VIEW <span className="wk-plus">+</span>
                </span>
              </button> */}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-black/20 bg-white/18 px-5 py-4">
        <div data-animate="text" className="text-[12px] font-black tracking-[0.22em] text-black/55">
          CASE STUDY
        </div>
        <div data-animate="text" className="flex items-center gap-2 text-[12px] font-black text-black/70">
          Open <span className="text-[#ff5a12]">↗</span>
        </div>
      </div>
    </article>
  );
}
