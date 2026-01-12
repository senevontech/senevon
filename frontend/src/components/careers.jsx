// import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
// import gsap from "gsap";
// import "./careers.css";

// const TEAMS = [
//   { key: "all", label: "All" },
//   { key: "engineering", label: "Engineering" },
//   { key: "design", label: "Design" },
//   { key: "data", label: "Data Science" },
//   { key: "marketing", label: "Marketing" },
// ];

// /** Replace with your real open roles (extensible) */
// const ROLES = [
//   {
//     id: "r1",
//     team: "engineering",
//     title: "Frontend Engineer",
//     type: "Full-time",
//     location: "Remote / India",
//     level: "Mid–Senior",
//     tags: ["React", "Next.js", "Tailwind"],
//     desc:
//       "Build premium UI systems, interactive sections, and production-ready dashboards with performance-first patterns.",
//   },
//   {
//     id: "r2",
//     team: "engineering",
//     title: "Backend Engineer",
//     type: "Full-time",
//     location: "Remote",
//     level: "Senior",
//     tags: ["Node.js", "MongoDB", "Security"],
//     desc:
//       "Design APIs, role-based access, payments, and scalable backend architecture for real-world products.",
//   },
//   {
//     id: "r3",
//     team: "design",
//     title: "UI/UX Designer",
//     type: "Contract",
//     location: "Remote",
//     level: "Mid",
//     tags: ["Figma", "Design Systems", "Mobile-first"],
//     desc:
//       "Design grid-based UI systems, prototypes, and production-ready components with consistent interaction patterns.",
//   },
//   {
//     id: "r4",
//     team: "data",
//     title: "Data Science Engineer",
//     type: "Full-time",
//     location: "Remote",
//     level: "Mid",
//     tags: ["Python", "Pandas", "ML"],
//     desc:
//       "Build analytical models, dashboards, and pipelines for retail insights, forecasting, and vendor prioritization.",
//   },
//   {
//     id: "r5",
//     team: "marketing",
//     title: "Content + Growth Associate",
//     type: "Intern / Part-time",
//     location: "Remote",
//     level: "Entry",
//     tags: ["SEO", "Social", "Copywriting"],
//     desc:
//       "Own product storytelling, landing content, and distribution strategy for premium tech products.",
//   },
// ];

// /** Split text into spans for GSAP */
// function splitToSpans(text) {
//   return Array.from(text).map((ch, i) => {
//     if (ch === " ") return <span key={i}>&nbsp;</span>;
//     return (
//       <span key={i} className="cr-letter">
//         {ch}
//       </span>
//     );
//   });
// }

// export default function CareersSection({
//   title = "CAREERS",
//   subtitle = "• Join us to build premium systems at scale",
//   teams = TEAMS,
//   roles = ROLES,
// }) {
//   const sectionRef = useRef(null);
//   const titleRef = useRef(null);
//   const subRef = useRef(null);

//   const [team, setTeam] = useState("all");
//   const [query, setQuery] = useState("");
//   const [activeRole, setActiveRole] = useState(null);

//   const titleSpans = useMemo(() => splitToSpans(title), [title]);
//   const subtitleSpans = useMemo(() => splitToSpans(subtitle), [subtitle]);

//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     return roles
//       .filter((r) => (team === "all" ? true : r.team === team))
//       .filter((r) => {
//         if (!q) return true;
//         return (
//           r.title.toLowerCase().includes(q) ||
//           r.desc.toLowerCase().includes(q) ||
//           r.location.toLowerCase().includes(q) ||
//           r.type.toLowerCase().includes(q) ||
//           (r.tags || []).some((t) => String(t).toLowerCase().includes(q))
//         );
//       });
//   }, [roles, team, query]);

//   // ✅ GSAP reveal on enter
//   useEffect(() => {
//     const el = sectionRef.current;
//     if (!el) return;

//     const io = new IntersectionObserver(
//       (entries) => {
//         const ent = entries[0];
//         if (!ent?.isIntersecting) return;

//         const titleLetters = titleRef.current?.querySelectorAll(".cr-letter");
//         const subLetters = subRef.current?.querySelectorAll(".cr-letter");
//         const cards = el.querySelectorAll(".cr-card");

//         gsap.set([titleLetters, subLetters], { opacity: 0, y: 18, rotateX: 55 });
//         gsap.set(cards, { opacity: 0, y: 14 });

//         const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
//         tl.to(titleLetters, { opacity: 1, y: 0, rotateX: 0, duration: 0.65, stagger: 0.03 })
//           .to(subLetters, { opacity: 1, y: 0, rotateX: 0, duration: 0.45, stagger: 0.012 }, "-=0.25")
//           .to(cards, { opacity: 1, y: 0, duration: 0.45, stagger: 0.05 }, "-=0.15");

//         io.disconnect();
//       },
//       { threshold: 0.22 }
//     );

//     io.observe(el);
//     return () => io.disconnect();
//   }, []);

//   // small animation when filter changes
//   useLayoutEffect(() => {
//     const el = sectionRef.current;
//     if (!el) return;
//     const cards = el.querySelectorAll(".cr-card");
//     gsap.fromTo(cards, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.32, stagger: 0.035, ease: "power2.out" });
//   }, [team, query]);

//   // close modal with ESC
//   useEffect(() => {
//     const onKey = (e) => {
//       if (e.key === "Escape") setActiveRole(null);
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, []);

//   return (
//     <section ref={sectionRef} className="relative w-full bg-[#ff5a12]">
//       {/* subtle white grid lines */}
//       <div
//         className="pointer-events-none absolute inset-0 opacity-[0.24]
//         [background-image:linear-gradient(to_right,rgba(255,255,255,0.55)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.55)_1px,transparent_1px)]
//         [background-size:220px_220px]"
//       />

//       <div className="relative mx-auto w-full max-w-[1600px] px-3 py-10 md:px-6">
//         <div className="grid grid-cols-12 gap-0 border border-white/35 bg-transparent">
//           {/* Title tile */}
//           <Tile className="col-span-12 md:col-span-7 min-h-[170px]">
//             <div className="relative h-full p-6 md:p-10">
//               <span className="absolute left-6 top-6 h-3 w-3 bg-white/95" />
//               <h2
//                 ref={titleRef}
//                 className="cr-title text-[40px] font-black tracking-[0.14em] text-white md:text-[72px]"
//               >
//                 {titleSpans}
//               </h2>
//             </div>
//           </Tile>

//           {/* Subtitle + Search */}
//           <Tile className="col-span-12 md:col-span-5 min-h-[170px]">
//             <div className="flex h-full flex-col justify-between gap-6 p-6 md:p-10">
//               <p ref={subRef} className="cr-sub font-mono text-[15px] leading-relaxed text-white/90">
//                 {subtitleSpans}
//               </p>

//               <div className="flex items-center gap-3">
//                 <div className="flex-1 rounded-xl border border-white/40 bg-white/16 px-4 py-3">
//                   <input
//                     value={query}
//                     onChange={(e) => setQuery(e.target.value)}
//                     placeholder="Search roles, tags…"
//                     className="w-full bg-transparent text-[13px] font-semibold text-white/90 outline-none placeholder:text-white/60"
//                   />
//                 </div>
//                 <button
//                   onClick={() => setQuery("")}
//                   className="rounded-xl border border-white/40 bg-white/16 px-4 py-3 text-[12px] font-black tracking-widest text-white/90 hover:bg-white/25"
//                 >
//                   CLEAR
//                 </button>
//               </div>
//             </div>
//           </Tile>

//           {/* Team filter bar */}
//           <Tile className="col-span-12">
//             <div className="flex items-center gap-3 overflow-x-auto px-4 py-4 md:px-6">
//               {teams.map((t) => {
//                 const on = t.key === team;
//                 return (
//                   <button
//                     key={t.key}
//                     onClick={() => setTeam(t.key)}
//                     className={[
//                       "shrink-0 rounded-full border px-4 py-2 text-[12px] font-black tracking-widest transition",
//                       on
//                         ? "border-white/70 bg-white text-[#ff5a12] shadow-[0_18px_36px_rgba(255,255,255,0.18)]"
//                         : "border-white/40 bg-white/14 text-white/90 hover:bg-white/22",
//                     ].join(" ")}
//                   >
//                     {t.label}
//                   </button>
//                 );
//               })}

//               <div className="ml-auto hidden items-center gap-2 md:flex">
//                 <span className="h-3 w-3 bg-[#d9d9d9]" />
//                 <span className="text-[12px] font-black tracking-[0.22em] text-white/90">
//                   OPEN ROLES: {filtered.length}
//                 </span>
//               </div>
//             </div>
//           </Tile>

//           {/* Role cards */}
//           <div className="col-span-12">
//             <div className="grid grid-cols-12 gap-0">
//               {filtered.map((r) => (
//                 <Tile key={r.id} className="col-span-12 sm:col-span-6 lg:col-span-4 min-h-[520px] bg-[#d9d9d9]">
//                   <RoleCard role={r} onApply={() => setActiveRole(r)} />
//                 </Tile>
//               ))}

//               {filtered.length === 0 && (
//                 <Tile className="col-span-12 min-h-[240px] ">
//                   <div className="grid h-full place-items-center p-10 text-center ">
//                     <div>
//                       <div className="text-[16px] font-black text-white">
//                         No roles found.
//                       </div>
//                       <div className="mt-2 text-[13px] text-white/80">
//                         Try a different keyword or clear search.
//                       </div>
//                     </div>
//                   </div>
//                 </Tile>
//               )}
//             </div>
//           </div>

//           {/* Footer CTA */}
//           <Tile className="col-span-12">
//             <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-8">
//               <div>
//                 <div className="text-[12px] font-black tracking-[0.24em] text-white/90">
//                   DIDN’T FIND A MATCH?
//                 </div>
//                 <div className="mt-2 text-[18px] font-black text-white">
//                   Send your profile — we’ll reach out when a role opens.
//                 </div>
//               </div>

//               <div className="flex gap-3">
//                 <button className="rounded-xl bg-white px-6 py-3 text-[12px] font-black tracking-widest text-[#ff5a12] shadow-[0_18px_34px_rgba(255,255,255,0.18)] hover:brightness-[1.02] active:translate-y-[1px]">
//                   SEND CV
//                 </button>
//                 <button className="rounded-xl border border-white/55 bg-white/16 px-6 py-3 text-[12px] font-black tracking-widest text-white hover:bg-white/24 active:translate-y-[1px]">
//                   EMAIL US
//                 </button>
//               </div>
//             </div>
//           </Tile>
//         </div>
//       </div>

//       {/* Apply modal */}
//       {activeRole && (
//         <ApplyModal role={activeRole} onClose={() => setActiveRole(null)} />
//       )}
//     </section>
//   );
// }

// function Tile({ className = "", children }) {
//   return (
//     <div className={`relative overflow-hidden border border-white/35 bg-transparent ${className}`}>
//       {/* keep subtle inner tint */}
//       <div className="pointer-events-none absolute inset-0 bg-white/0" />
//       {children}
//     </div>
//   );
// }


// function RoleCard({ role, onApply }) {
//   return (
//     <article className="cr-card flex h-full flex-col bg-white/10">
//       {/* top */}
//       <div className="border-b border-[#ff5a12]/25 bg-white px-5 py-4">
//         <div className="cr-jitter text-[16px] font-black tracking-wide text-[#ff5a12]">
//           {role.title}
//         </div>
//         <div className="mt-1 text-[12px] font-semibold text-[#ff5a12]/75">
//           {role.team.toUpperCase()} • {role.level}
//         </div>
//       </div>

//       {/* middle */}
//       <div className="flex-1 p-5">
//         <div className="cr-meta fx-scan rounded-2xl border border-[#ff5a12]/25 bg-white p-4">
//           <div className="flex flex-wrap gap-2">
//             <Pill>{role.type}</Pill>
//             <Pill>{role.location}</Pill>
//           </div>

//           <p className="mt-4 text-[13px] leading-relaxed text-[#ff5a12]/85">
//             {role.desc}
//           </p>

//           <div className="mt-4 flex flex-wrap gap-2">
//             {(role.tags || []).slice(0, 4).map((t) => (
//               <span key={t} className="cr-tag">
//                 {t}
//               </span>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* bottom */}
//       <div className="mt-auto flex items-center justify-between border-t border-[#ff5a12]/25 bg-white px-5 py-4">
//         <div className="text-[12px] font-black tracking-[0.22em] text-[#ff5a12]/70">
//           APPLY
//         </div>

//         <button
//           onClick={onApply}
//           className="cr-btnWhite rounded-xl bg-[#ff5a12] px-4 py-2 text-[12px] font-black tracking-widest text-[#d9d9d9] active:translate-y-[1px]"
//         >
//           APPLY NOW
//         </button>
//       </div>
//     </article>
//   );
// }


// function Pill({ children }) {
//   return (
//     <span className="rounded-full border border-[#ff5a12]/25 bg-white px-3 py-1 text-[11px] font-black tracking-widest text-[#ff5a12]/80">
//       {children}
//     </span>
//   );
// }


// function ApplyModal({ role, onClose }) {
//   return (
//     <div
//       className="fixed inset-0 z-[999] grid place-items-center p-4"
//       role="dialog"
//       aria-modal="true"
//       aria-label="Apply for role"
//       onMouseDown={(e) => {
//         // close when clicking backdrop
//         if (e.target === e.currentTarget) onClose();
//       }}
//     >
//       <div className="absolute inset-0 bg-black/50" />

//       <div className="relative w-full max-w-[720px] overflow-hidden rounded-3xl border border-white/30 bg-[#ff5a12] shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
//         {/* top bar */}
//         <div className="flex items-start justify-between border-b border-white/25 bg-white/10 px-6 py-5">
//           <div>
//             <div className="text-[12px] font-black tracking-[0.24em] text-white/90">
//               APPLYING FOR
//             </div>
//             <div className="mt-2 text-[20px] font-black text-white">
//               {role.title}
//             </div>
//             <div className="mt-1 text-[13px] text-white/85">
//               {role.type} • {role.location} • {role.level}
//             </div>
//           </div>

//           <button
//             onClick={onClose}
//             className="grid h-11 w-11 place-items-center rounded-2xl border border-white/30 bg-white/12 text-white/90 hover:bg-white/22"
//             aria-label="Close"
//           >
//             ✕
//           </button>
//         </div>

//         {/* form */}
//         <form
//           className="grid gap-4 p-6 md:grid-cols-2"
//           onSubmit={(e) => {
//             e.preventDefault();
//             // ✅ Connect to API later
//             alert("Application submitted (demo). Connect to backend next.");
//             onClose();
//           }}
//         >
//           <Field label="Full Name">
//             <input className="cr-input" required placeholder="Your name" />
//           </Field>

//           <Field label="Email">
//             <input className="cr-input" type="email" required placeholder="you@email.com" />
//           </Field>

//           <Field label="Portfolio / LinkedIn">
//             <input className="cr-input" placeholder="https://…" />
//           </Field>

//           <Field label="Location">
//             <input className="cr-input" placeholder="City, Country" />
//           </Field>

//           <div className="md:col-span-2">
//             <Field label="Message">
//               <textarea className="cr-input min-h-[120px] resize-none" placeholder="Why are you a fit for this role?" />
//             </Field>
//           </div>

//           <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:justify-end">
//             <button
//               type="button"
//               onClick={onClose}
//               className="rounded-xl border border-white/50 bg-white/12 px-6 py-3 text-[12px] font-black tracking-widest text-white hover:bg-white/22"
//             >
//               CANCEL
//             </button>
//             <button
//               type="submit"
//               className="rounded-xl bg-white px-6 py-3 text-[12px] font-black tracking-widest text-[#ff5a12] shadow-[0_18px_34px_rgba(255,255,255,0.18)] hover:brightness-[1.02]"
//             >
//               SUBMIT
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// function Field({ label, children }) {
//   return (
//     <label className="block">
//       <div className="mb-2 text-[12px] font-black tracking-[0.24em] text-white/90">
//         {label}
//       </div>
//       {children}
//     </label>
//   );
// }
















































































import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import "./careers.css";

const TEAMS = [
  { key: "all", label: "All" },
  { key: "engineering", label: "Engineering" },
  { key: "design", label: "Design" },
  { key: "data", label: "Data Science" },
  { key: "marketing", label: "Marketing" },
];

const ROLES = [
  {
    id: "r1",
    team: "engineering",
    title: "Frontend Engineer",
    type: "Full-time",
    location: "Remote / India",
    level: "Mid–Senior",
    tags: ["React", "Next.js", "Tailwind"],
    desc:
      "Build premium UI systems, interactive sections, and production-ready dashboards with performance-first patterns.",
  },
  {
    id: "r2",
    team: "engineering",
    title: "Backend Engineer",
    type: "Full-time",
    location: "Remote",
    level: "Senior",
    tags: ["Node.js", "MongoDB", "Security"],
    desc:
      "Design APIs, role-based access, payments, and scalable backend architecture for real-world products.",
  },
  {
    id: "r3",
    team: "design",
    title: "UI/UX Designer",
    type: "Contract",
    location: "Remote",
    level: "Mid",
    tags: ["Figma", "Design Systems", "Mobile-first"],
    desc:
      "Design grid-based UI systems, prototypes, and production-ready components with consistent interaction patterns.",
  },
  {
    id: "r4",
    team: "data",
    title: "Data Science Engineer",
    type: "Full-time",
    location: "Remote",
    level: "Mid",
    tags: ["Python", "Pandas", "ML"],
    desc:
      "Build analytical models, dashboards, and pipelines for retail insights, forecasting, and vendor prioritization.",
  },
  {
    id: "r5",
    team: "marketing",
    title: "Content + Growth Associate",
    type: "Intern / Part-time",
    location: "Remote",
    level: "Entry",
    tags: ["SEO", "Social", "Copywriting"],
    desc:
      "Own product storytelling, landing content, and distribution strategy for premium tech products.",
  },
];

function splitToSpans(text) {
  return Array.from(text).map((ch, i) => {
    if (ch === " ") return <span key={i}>&nbsp;</span>;
    return (
      <span key={i} className="cr-letter">
        {ch}
      </span>
    );
  });
}

export default function CareersSection({
  title = "CAREERS",
  subtitle = "• Join us to build premium systems at scale",
  teams = TEAMS,
  roles = ROLES,
}) {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subRef = useRef(null);

  const [team, setTeam] = useState("all");
  const [query, setQuery] = useState("");
  const [activeRole, setActiveRole] = useState(null);

  const titleSpans = useMemo(() => splitToSpans(title), [title]);
  const subtitleSpans = useMemo(() => splitToSpans(subtitle), [subtitle]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return roles
      .filter((r) => (team === "all" ? true : r.team === team))
      .filter((r) => {
        if (!q) return true;
        return (
          r.title.toLowerCase().includes(q) ||
          r.desc.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q) ||
          r.type.toLowerCase().includes(q) ||
          (r.tags || []).some((t) => String(t).toLowerCase().includes(q))
        );
      });
  }, [roles, team, query]);

  // GSAP reveal on enter
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const ent = entries[0];
        if (!ent?.isIntersecting) return;

        const titleLetters = titleRef.current?.querySelectorAll(".cr-letter");
        const subLetters = subRef.current?.querySelectorAll(".cr-letter");
        const cards = el.querySelectorAll(".cr-card");

        gsap.set([titleLetters, subLetters], {
          opacity: 0,
          y: 18,
          rotateX: 55,
        });
        gsap.set(cards, { opacity: 0, y: 14 });

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.to(titleLetters, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.65,
          stagger: 0.03,
        })
          .to(
            subLetters,
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              duration: 0.45,
              stagger: 0.012,
            },
            "-=0.25"
          )
          .to(
            cards,
            { opacity: 1, y: 0, duration: 0.45, stagger: 0.05 },
            "-=0.15"
          );

        io.disconnect();
      },
      { threshold: 0.22 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  // small animation when filter changes
  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const cards = el.querySelectorAll(".cr-card");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.32, stagger: 0.035, ease: "power2.out" }
    );
  }, [team, query]);

  // close modal with ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setActiveRole(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full bg-[#ff5a12]">
      {/* background grid (outside block) */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.24]
        [background-image:linear-gradient(to_right,rgba(255,255,255,0.55)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.55)_1px,transparent_1px)]
        [background-size:220px_220px]"
      />

      <div className="relative mx-auto w-full max-w-[1600px] px-3 py-10 md:px-6">
        {/* ✅ mask grid inside main block */}
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[#ff5a12]" />

          <div className="relative z-10 grid grid-cols-12 gap-0 border border-white/35 bg-transparent">
            {/* Title tile */}
            <Tile className="col-span-12 md:col-span-7 min-h-[170px]">
              <div className="relative h-full p-6 md:p-10">
                <span className="absolute left-6 top-6 h-3 w-3 bg-white/95" />
                <h2
                  ref={titleRef}
                  className="cr-title text-[40px] font-black tracking-[0.14em] text-white md:text-[72px]"
                >
                  {titleSpans}
                </h2>
              </div>
            </Tile>

            {/* Subtitle + Search */}
            <Tile className="col-span-12 md:col-span-5 min-h-[170px]">
              <div className="flex h-full flex-col justify-between gap-6 p-6 md:p-10">
                <p
                  ref={subRef}
                  className="cr-sub font-mono text-[15px] leading-relaxed text-white/90"
                >
                  {subtitleSpans}
                </p>

                <div className="flex items-center gap-3">
                  <div className="flex-1 rounded-xl border border-white/40 bg-white/16 px-4 py-3">
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search roles, tags…"
                      className="w-full bg-transparent text-[13px] font-semibold text-white/90 outline-none placeholder:text-white/60"
                    />
                  </div>
                  <button
                    onClick={() => setQuery("")}
                    className="rounded-xl border border-white/40 bg-white/16 px-4 py-3 text-[12px] font-black tracking-widest text-white/90 hover:bg-white/25"
                  >
                    CLEAR
                  </button>
                </div>
              </div>
            </Tile>

            {/* Team filter bar */}
            <Tile className="col-span-12">
              <div className="flex items-center gap-3 overflow-x-auto px-4 py-4 md:px-6">
                {teams.map((t) => {
                  const on = t.key === team;
                  return (
                    <button
                      key={t.key}
                      onClick={() => setTeam(t.key)}
                      className={[
                        "shrink-0 rounded-full border px-4 py-2 text-[12px] font-black tracking-widest transition",
                        on
                          ? "border-white/70 bg-white text-[#ff5a12] shadow-[0_18px_36px_rgba(255,255,255,0.18)]"
                          : "border-white/40 bg-white/14 text-white/90 hover:bg-white/22",
                      ].join(" ")}
                    >
                      {t.label}
                    </button>
                  );
                })}

                <div className="ml-auto hidden items-center gap-2 md:flex">
                  <span className="h-3 w-3 bg-[#d9d9d9]" />
                  <span className="text-[12px] font-black tracking-[0.22em] text-white/90">
                    OPEN ROLES: {filtered.length}
                  </span>
                </div>
              </div>
            </Tile>

            {/* Role cards */}
            <div className="col-span-12">
              <div className="grid grid-cols-12 gap-0">
                {filtered.map((r) => (
                  <Tile
                    key={r.id}
                    className="col-span-12 sm:col-span-6 lg:col-span-4 min-h-[520px]"
                  >
                    <RoleCard role={r} onApply={() => setActiveRole(r)} />
                  </Tile>
                ))}

                {filtered.length === 0 && (
                  <Tile className="col-span-12 min-h-[240px]">
                    <div className="grid h-full place-items-center p-10 text-center">
                      <div>
                        <div className="text-[16px] font-black text-white">
                          No roles found.
                        </div>
                        <div className="mt-2 text-[13px] text-white/80">
                          Try a different keyword or clear search.
                        </div>
                      </div>
                    </div>
                  </Tile>
                )}
              </div>
            </div>

            {/* Footer CTA */}
            <Tile className="col-span-12">
              <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-8">
                <div>
                  <div className="text-[12px] font-black tracking-[0.24em] text-white/90">
                    DIDN’T FIND A MATCH?
                  </div>
                  <div className="mt-2 text-[18px] font-black text-white">
                    Send your profile — we’ll reach out when a role opens.
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="rounded-xl bg-white px-6 py-3 text-[12px] font-black tracking-widest text-[#ff5a12] shadow-[0_18px_34px_rgba(255,255,255,0.18)] hover:brightness-[1.02] active:translate-y-[1px]">
                    SEND CV
                  </button>
                  <button className="rounded-xl border border-white/55 bg-white/16 px-6 py-3 text-[12px] font-black tracking-widest text-white hover:bg-white/24 active:translate-y-[1px]">
                    EMAIL US
                  </button>
                </div>
              </div>
            </Tile>
          </div>
        </div>
      </div>

      {activeRole && (
        <ApplyModal role={activeRole} onClose={() => setActiveRole(null)} />
      )}
    </section>
  );
}

function Tile({ className = "", children }) {
  return (
    <div
      className={`relative overflow-hidden border border-white/35 bg-transparent ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-white/0" />
      {children}
    </div>
  );
}

function RoleCard({ role, onApply }) {
  return (
    <article className="cr-card flex h-full flex-col bg-white">
      {/* top */}
      <div className="border-b border-[#ff5a12]/15 bg-white px-5 py-4">
        <div className="cr-jitter text-[16px] font-black tracking-wide text-[#ff5a12]">
          {role.title}
        </div>
        <div className="mt-1 text-[12px] font-semibold text-[#ff5a12]/75">
          {role.team.toUpperCase()} • {role.level}
        </div>
      </div>

      {/* middle */}
      <div className="flex-1 p-5">
        {/* ✅ no border, soft orange shadow */}
        <div className="cr-meta fx-scan rounded-2xl bg-white p-4 shadow-[0_18px_40px_rgba(255,90,18,0.18)]">
          <div className="flex flex-wrap gap-2">
            <Pill>{role.type}</Pill>
            <Pill>{role.location}</Pill>
          </div>

          <p className="mt-4 text-[13px] leading-relaxed text-[#ff5a12]/85">
            {role.desc}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {(role.tags || []).slice(0, 4).map((t) => (
              <span key={t} className="cr-tag">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* bottom */}
      <div className="mt-auto flex items-center justify-between border-t border-[#ff5a12]/15 bg-white px-5 py-4">
        <div className="text-[12px] font-black tracking-[0.22em] text-[#ff5a12]/70">
          APPLY
        </div>

        {/* ✅ white button + orange shadow */}
        <button
          onClick={onApply}
          className="cr-btnWhite rounded-xl bg-white px-4 py-2 text-[12px] font-black tracking-widest text-[#ff5a12] active:translate-y-[1px]"
        >
          APPLY NOW
        </button>
      </div>
    </article>
  );
}

function Pill({ children }) {
  return (
    <span className="rounded-full bg-[#ff5a12]/10 px-3 py-1 text-[11px] font-black tracking-widest text-[#ff5a12]/85">
      {children}
    </span>
  );
}

function ApplyModal({ role, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[999] grid place-items-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Apply for role"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative w-full max-w-[720px] overflow-hidden rounded-3xl border border-white/30 bg-[#ff5a12] shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
        <div className="flex items-start justify-between border-b border-white/25 bg-white/10 px-6 py-5">
          <div>
            <div className="text-[12px] font-black tracking-[0.24em] text-white/90">
              APPLYING FOR
            </div>
            <div className="mt-2 text-[20px] font-black text-white">
              {role.title}
            </div>
            <div className="mt-1 text-[13px] text-white/85">
              {role.type} • {role.location} • {role.level}
            </div>
          </div>

          <button
            onClick={onClose}
            className="grid h-11 w-11 place-items-center rounded-2xl border border-white/30 bg-white/12 text-white/90 hover:bg-white/22"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form
          className="grid gap-4 p-6 md:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Application submitted (demo). Connect to backend next.");
            onClose();
          }}
        >
          <Field label="Full Name">
            <input className="cr-input" required placeholder="Your name" />
          </Field>

          <Field label="Email">
            <input
              className="cr-input"
              type="email"
              required
              placeholder="you@email.com"
            />
          </Field>

          <Field label="Portfolio / LinkedIn">
            <input className="cr-input" placeholder="https://…" />
          </Field>

          <Field label="Location">
            <input className="cr-input" placeholder="City, Country" />
          </Field>

          <div className="md:col-span-2">
            <Field label="Message">
              <textarea
                className="cr-input min-h-[120px] resize-none"
                placeholder="Why are you a fit for this role?"
              />
            </Field>
          </div>

          <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/50 bg-white/12 px-6 py-3 text-[12px] font-black tracking-widest text-white hover:bg-white/22"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="rounded-xl bg-white px-6 py-3 text-[12px] font-black tracking-widest text-[#ff5a12] shadow-[0_18px_34px_rgba(255,255,255,0.18)] hover:brightness-[1.02]"
            >
              SUBMIT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="mb-2 text-[12px] font-black tracking-[0.24em] text-white/90">
        {label}
      </div>
      {children}
    </label>
  );
}
