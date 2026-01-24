

// import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
// import gsap from "gsap";
// import ScrollTrigger from "gsap/ScrollTrigger";
// import "./careers.css";
// import { supabase } from "../lib/supabaseClient";


// gsap.registerPlugin(ScrollTrigger);

// const TEAMS = [
//   { key: "all", label: "All" },
//   { key: "engineering", label: "Engineering" },
//   { key: "design", label: "Design" },
//   { key: "data", label: "Data Science" },
//   { key: "marketing", label: "Marketing" },
// ];

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

// export default function CareersSection({
//   title = "CAREERS",
//   subtitle = "• Join us to build premium systems at scale",
//   teams = TEAMS,
//   roles = ROLES,
// }) {
//   const sectionRef = useRef(null);

//   const [team, setTeam] = useState("all");
//   const [query, setQuery] = useState("");
//   const [activeRole, setActiveRole] = useState(null);

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

//   /* ----------------------- Viewport animations (smooth + mobile) ----------------------- */
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

//       // C) Cards reveal (batched)
//       const cards = gsap.utils.toArray(scope.querySelectorAll(".cr-card"));
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

//   /* Small animation when filter changes (FAST) */
//   useLayoutEffect(() => {
//     const scope = sectionRef.current;
//     if (!scope) return;

//     const reduceMotion =
//       typeof window !== "undefined" &&
//       window.matchMedia &&
//       window.matchMedia("(prefers-reduced-motion: reduce)").matches;

//     if (reduceMotion) return;

//     const cards = scope.querySelectorAll(".cr-card");
//     if (!cards.length) return;

//     gsap.fromTo(
//       cards,
//       { opacity: 0, y: 10 },
//       { opacity: 1, y: 0, duration: 0.28, stagger: 0.03, ease: "power2.out" }
//     );
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
//       {/* background grid (outside block) */}
//       <div
//         className="pointer-events-none absolute inset-0 -z-10 opacity-[0.24]
//         [background-image:linear-gradient(to_right,rgba(255,255,255,0.55)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.55)_1px,transparent_1px)]
//         [background-size:220px_220px]"
//       />

//       <div className="relative mx-auto w-full max-w-[1600px] px-3 py-10 md:px-6">
//         {/* ✅ mask grid inside main block */}
//         <div className="relative overflow-hidden">
//           <div className="pointer-events-none absolute inset-0 bg-[#ff5a12]" />

//           <div className="relative z-10 grid grid-cols-12 gap-0 border border-white/35 bg-transparent">
//             {/* Title tile */}
//             <Tile className="col-span-12 md:col-span-7 min-h-[170px]">
//               <div className="relative h-full p-6 md:p-10">
//                 <span className="absolute left-6 top-6 h-3 w-3 bg-white/95" />
//                 <h2
//                   data-animate="text"
//                   className="cr-title text-[40px] font-black tracking-[0.14em] text-white md:text-[72px]"
//                 >
//                   {title}
//                 </h2>
//               </div>
//             </Tile>

//             {/* Subtitle + Search */}
//             <Tile className="col-span-12 md:col-span-5 min-h-[170px]">
//               <div className="flex h-full flex-col justify-between gap-6 p-6 md:p-10">
//                 <p
//                   data-animate="text"
//                   className="cr-sub font-mono text-[15px] leading-relaxed text-white/90"
//                 >
//                   {subtitle}
//                 </p>

//                 <div className="flex items-center gap-3">
//                   <div className="flex-1 rounded-xl border border-white/40 bg-white/16 px-4 py-3">
//                     <input
//                       value={query}
//                       onChange={(e) => setQuery(e.target.value)}
//                       placeholder="Search roles, tags…"
//                       className="w-full bg-transparent text-[13px] font-semibold text-white/90 outline-none placeholder:text-white/60"
//                     />
//                   </div>
//                   <button
//                     data-animate="text"
//                     onClick={() => setQuery("")}
//                     className="rounded-xl border border-white/40 bg-white/16 px-4 py-3 text-[12px] font-black tracking-widest text-white/90 hover:bg-white/25"
//                   >
//                     CLEAR
//                   </button>
//                 </div>
//               </div>
//             </Tile>

//             {/* Team filter bar */}
//             <Tile className="col-span-12">
//               <div className="flex items-center gap-3 overflow-x-auto px-4 py-4 md:px-6">
//                 {teams.map((t) => {
//                   const on = t.key === team;
//                   return (
//                     <button
//                       key={t.key}
//                       onClick={() => setTeam(t.key)}
//                       className={[
//                         "shrink-0 rounded-full border px-4 py-2 text-[12px] font-black tracking-widest transition",
//                         on
//                           ? "border-white/70 bg-white text-[#ff5a12] shadow-[0_18px_36px_rgba(255,255,255,0.18)]"
//                           : "border-white/40 bg-white/14 text-white/90 hover:bg-white/22",
//                       ].join(" ")}
//                     >
//                       <span data-animate="text">{t.label}</span>
//                     </button>
//                   );
//                 })}

//                 <div className="ml-auto hidden items-center gap-2 md:flex">
//                   <span className="h-3 w-3 bg-[#d9d9d9]" />
//                   <span
//                     data-animate="text"
//                     className="text-[12px] font-black tracking-[0.22em] text-white/90"
//                   >
//                     OPEN ROLES: {filtered.length}
//                   </span>
//                 </div>
//               </div>
//             </Tile>

//             {/* Role cards */}
//             <div className="col-span-12">
//               <div className="grid grid-cols-12 gap-0">
//                 {filtered.map((r) => (
//                   <Tile
//                     key={r.id}
//                     className="col-span-12 sm:col-span-6 lg:col-span-4 min-h-[520px]"
//                   >
//                     <RoleCard role={r} onApply={() => setActiveRole(r)} />
//                   </Tile>
//                 ))}

//                 {filtered.length === 0 && (
//                   <Tile className="col-span-12 min-h-[240px]">
//                     <div className="grid h-full place-items-center p-10 text-center">
//                       <div>
//                         <div data-animate="text" className="text-[16px] font-black text-white">
//                           No roles found.
//                         </div>
//                         <div data-animate="text" className="mt-2 text-[13px] text-white/80">
//                           Try a different keyword or clear search.
//                         </div>
//                       </div>
//                     </div>
//                   </Tile>
//                 )}
//               </div>
//             </div>

//             {/* Footer CTA */}
//             <Tile className="col-span-12">
//               <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-8">
//                 <div>
//                   <div data-animate="text" className="text-[12px] font-black tracking-[0.24em] text-white/90">
//                     DIDN’T FIND A MATCH?
//                   </div>
//                   <div data-animate="text" className="mt-2 text-[18px] font-black text-white">
//                     Send your profile — we’ll reach out when a role opens.
//                   </div>
//                 </div>

//                 <div className="flex gap-3">


//                   <button
//                     data-animate="text"
//                     className="
//     relative
//     bg-white
//     px-6 py-3
//     text-[12px] font-black tracking-widest text-[#ff5a12]
//     shadow-[0_18px_34px_rgba(255,255,255,0.18)]
//     overflow-hidden
//     transition-all duration-300 ease-out
//     hover:brightness-[1.02]
//     active:translate-y-[1px]

//     /* CORNER BRACKETS */
//     before:absolute before:top-2 before:left-2
//     before:h-3 before:w-3
//     before:border-l-2 before:border-t-2
//     before:border-black
//     before:content-['']
//     before:transition-all before:duration-300

//     after:absolute after:bottom-2 after:right-2
//     after:h-3 after:w-3
//     after:border-r-2 after:border-b-2
//     after:border-black
//     after:content-['']
//     after:transition-all after:duration-300

//     /* UNIQUE HOVER: subtle orange sweep */
//     hover:before:-translate-x-0.5 hover:before:-translate-y-0.5
//     hover:after:translate-x-0.5 hover:after:translate-y-0.5
//   "
//                     style={{
//                       backgroundImage:
//                         "linear-gradient(120deg, rgba(255,90,18,0) 0%, rgba(255,90,18,0) 45%, rgba(255,90,18,0.10) 55%, rgba(255,90,18,0) 70%)",
//                       backgroundSize: "220% 100%",
//                       backgroundPosition: "100% 0",
//                     }}
//                     onMouseEnter={(e) => (e.currentTarget.style.backgroundPosition = "0% 0")}
//                     onMouseLeave={(e) => (e.currentTarget.style.backgroundPosition = "100% 0")}
//                   >
//                     SEND CV
//                   </button>



//                   <button
//                     data-animate="text"
//                     className="border border-white/55 bg-white/16 px-6 py-3 text-[12px] font-black tracking-widest text-white hover:bg-white/24 active:translate-y-[1px]"
//                   >
//                     EMAIL US
//                   </button>
//                 </div>
//               </div>
//             </Tile>
//           </div>
//         </div>
//       </div>

//       {activeRole && (
//         <ApplyModal role={activeRole} onClose={() => setActiveRole(null)} />
//       )}
//     </section>
//   );
// }

// function Tile({ className = "", children }) {
//   return (
//     <div data-tile className={`relative overflow-hidden border border-white/35 bg-transparent ${className}`}>
//       <div className="pointer-events-none absolute inset-0 bg-white/0" />
//       {children}
//     </div>
//   );
// }

// function RoleCard({ role, onApply }) {
//   return (
//     <article className="cr-card flex h-full flex-col bg-white">
//       {/* top */}
//       <div className="border-b border-[#ff5a12]/15 bg-white px-5 py-4">
//         <div data-animate="text" className="cr-jitter text-[16px] font-black tracking-wide text-[#ff5a12]">
//           {role.title}
//         </div>
//         <div data-animate="text" className="mt-1 text-[12px] font-semibold text-[#ff5a12]/75">
//           {role.team.toUpperCase()} • {role.level}
//         </div>
//       </div>

//       {/* middle */}
//       <div className="flex-1 p-5">
//         <div className="cr-meta fx-scan rounded-2xl bg-white p-4 shadow-[0_18px_40px_rgba(255,90,18,0.18)]">
//           <div className="flex flex-wrap gap-2">
//             <Pill><span data-animate="text">{role.type}</span></Pill>
//             <Pill><span data-animate="text">{role.location}</span></Pill>
//           </div>

//           <p data-animate="text" className="mt-4 text-[13px] leading-relaxed text-[#ff5a12]/85">
//             {role.desc}
//           </p>

//           <div className="mt-4 flex flex-wrap gap-2">
//             {(role.tags || []).slice(0, 4).map((t) => (
//               <span key={t} className="cr-tag">
//                 <span data-animate="text">{t}</span>
//               </span>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* bottom */}
//       <div className="mt-auto flex items-center justify-between border-t border-[#ff5a12]/15 bg-white px-5 py-4">
//         <div data-animate="text" className="text-[12px] font-black tracking-[0.22em] text-[#ff5a12]/70">
//           APPLY
//         </div>

//         <button
//           onClick={onApply}
//           className="cr-btnWhite bg-[#ff5a12] px-4 py-2 text-[12px] font-black tracking-widest text-[white] active:translate-y-[1px]"
//         >
//           <span data-animate="text">APPLY NOW</span>
//         </button>
//       </div>
//     </article>
//   );
// }

// function Pill({ children }) {
//   return (
//     <span className="rounded-full bg-[#ff5a12]/10 px-3 py-1 text-[11px] font-black tracking-widest text-[#ff5a12]/85">
//       {children}
//     </span>
//   );
// }






// function ApplyModal({ role, onClose }) {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     portfolio: "",
//     location: "",
//     message: "",
//   });

//   const [resumeFile, setResumeFile] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const [status, setStatus] = useState({ type: "", message: "" });

//   const update = (key) => (e) => {
//     setForm((s) => ({ ...s, [key]: e.target.value }));
//   };

//   // optional: animate modal content (lightweight)
//   useEffect(() => {
//     const reduceMotion =
//       typeof window !== "undefined" &&
//       window.matchMedia &&
//       window.matchMedia("(prefers-reduced-motion: reduce)").matches;
//     if (reduceMotion) return;

//     const root = document.querySelector("[data-career-modal]");
//     if (!root) return;

//     const textEls = root.querySelectorAll('[data-animate="text"]');
//     const splitTargets = [];
//     const simpleTargets = [];

//     textEls.forEach((el) => {
//       const { words, skipped } = splitWords(el, { maxWords: 55 });
//       if (!skipped && words.length) splitTargets.push({ el, words });
//       else simpleTargets.push(el);
//     });

//     splitTargets.forEach(({ words }) => gsap.set(words, { opacity: 0, y: 10 }));
//     if (simpleTargets.length) gsap.set(simpleTargets, { opacity: 0, y: 10 });

//     gsap.to(root, { opacity: 1, duration: 0.18, ease: "linear" });

//     splitTargets.forEach(({ words }, i) => {
//       gsap.to(words, {
//         opacity: 1,
//         y: 0,
//         duration: 0.42,
//         ease: "power3.out",
//         stagger: 0.018,
//         delay: 0.05 + i * 0.03,
//       });
//     });

//     if (simpleTargets.length) {
//       gsap.to(simpleTargets, {
//         opacity: 1,
//         y: 0,
//         duration: 0.35,
//         ease: "power3.out",
//         stagger: 0.03,
//         delay: 0.08,
//       });
//     }
//   }, []);

//   const submit = async (e) => {
//     e.preventDefault();
//     if (loading) return;

//     setStatus({ type: "", message: "" });
//     setLoading(true);

//     try {
//       // ✅ optional: upload resume to Supabase Storage
//       let resume_url = null;

      

 



//       if (resumeFile) {
//   // ✅ validate first
//   if (resumeFile.size > 5 * 1024 * 1024) {
//     throw new Error("Resume must be under 5MB.");
//   }

//   const allowedExt = ["pdf", "doc", "docx"];
//   const ext = (resumeFile.name.split(".").pop() || "").toLowerCase();
//   if (!allowedExt.includes(ext)) {
//     throw new Error("Only PDF / DOC / DOCX allowed.");
//   }

//   const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
//   const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

//   if (!cloudName || !preset) {
//     throw new Error("Cloudinary env missing. Set CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET.");
//   }

//   const safeBase = `${Date.now()}-${Math.allowRandomValues ? crypto.getRandomValues(new Uint32Array(1))[0] : Math.random().toString(16).slice(2)}`;
//   const publicId = `${role?.id || "role"}-${safeBase}`; // no extension here

//   const fd = new FormData();
//   fd.append("file", resumeFile);
//   fd.append("upload_preset", preset);
//   fd.append("folder", "senevon/careers");
//   fd.append("public_id", publicId);

//   // Optional: helps Cloudinary keep original name metadata
//   fd.append("filename_override", resumeFile.name);

//   const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
//     method: "POST",
//     body: fd,
//   });

//   const data = await res.json();

//   if (!res.ok) {
//     // Cloudinary returns useful error message here
//     throw new Error(data?.error?.message || "Resume upload failed.");
//   }

//   // ✅ Save secure URL in DB
//   resume_url = data.secure_url;
// }










//       // ✅ insert into DB
//       const { error } = await supabase.from("career_applications").insert([
//         {
//           role_id: role?.id || null,
//           role_title: role?.title || null,
//           team: role?.team || null,

//           name: form.name,
//           email: form.email,
//           portfolio: form.portfolio || null,
//           location: form.location || null,
//           message: form.message || null,

//           resume_url,
//           source: window.location.pathname,
//           user_agent: navigator.userAgent,
//         },
//       ]);

//       if (error) throw error;

//       setStatus({ type: "success", message: "Application submitted successfully!" });
//       setForm({ name: "", email: "", portfolio: "", location: "", message: "" });
//       setResumeFile(null);

//       // Close like your original flow
//       setTimeout(() => onClose(), 600);
//     } catch (err) {
//       setStatus({ type: "error", message: err?.message || "Failed to submit application." });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       data-career-modal
//       className="fixed inset-0 z-[999] grid place-items-center p-4"
//       role="dialog"
//       aria-modal="true"
//       aria-label="Apply for role"
//       onMouseDown={(e) => {
//         if (e.target === e.currentTarget) onClose();
//       }}
//       style={{ opacity: 0 }}
//     >
//       <div className="absolute inset-0 bg-black/50" />

//       <div className="relative w-full max-w-[720px] overflow-hidden border border-white/30 bg-[#ff5a12] shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
//         <div className="flex items-start justify-between border-b border-white/25 bg-white/10 px-6 py-5">
//           <div>
//             <div data-animate="text" className="text-[12px] font-black tracking-[0.24em] text-white/90">
//               APPLYING FOR
//             </div>
//             <div data-animate="text" className="mt-2 text-[20px] font-black text-white">
//               {role.title}
//             </div>
//             <div data-animate="text" className="mt-1 text-[13px] text-white/85">
//               {role.type} • {role.location} • {role.level}
//             </div>
//           </div>

//           <button
//             onClick={onClose}
//             className="grid h-11 w-11 place-items-center border border-white/30 bg-white/12 text-white/90 hover:bg-white/22"
//             aria-label="Close"
//           >
//             ✕
//           </button>
//         </div>

//         {/* ✅ form submit now goes to Supabase */}
//         <form className="grid gap-4 p-6 md:grid-cols-2" onSubmit={submit}>
//           <Field label="Full Name">
//             <input
//               className="cr-input"
//               required
//               placeholder="Your name"
//               value={form.name}
//               onChange={update("name")}
//             />
//           </Field>

//           <Field label="Email">
//             <input
//               className="cr-input"
//               type="email"
//               required
//               placeholder="you@email.com"
//               value={form.email}
//               onChange={update("email")}
//             />
//           </Field>

//           <Field label="Portfolio / LinkedIn">
//             <input
//               className="cr-input"
//               placeholder="https://…"
//               value={form.portfolio}
//               onChange={update("portfolio")}
//             />
//           </Field>

//           <Field label="Location">
//             <input
//               className="cr-input"
//               placeholder="City, Country"
//               value={form.location}
//               onChange={update("location")}
//             />
//           </Field>

//           <div className="md:col-span-2">
//             <Field label="Message">
//               <textarea
//                 className="cr-input min-h-[120px] resize-none"
//                 placeholder="Why are you a fit for this role?"
//                 value={form.message}
//                 onChange={update("message")}
//               />
//             </Field>
//           </div>

//           {/* ✅ OPTIONAL resume upload (no design changes, minimal field) */}
//           <div className="md:col-span-2">
//             <Field label="Resume (optional)">
//               <input
//                 className="cr-input"
//                 type="file"
//                 accept=".pdf,.doc,.docx"
//                 onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
//               />
//             </Field>
//           </div>

//           {/* status */}
//           {status.message ? (
//             <div className="md:col-span-2 border border-white/35 bg-white/10 px-4 py-3 text-[12px] font-semibold text-white/90">
//               {status.message}
//             </div>
//           ) : null}

//           <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:justify-end">
//             <button
//               type="button"
//               onClick={onClose}
//               disabled={loading}
//               className=" border border-white/50 bg-white/12 px-6 py-3 text-[12px] font-black tracking-widest text-white hover:bg-white/22 disabled:opacity-60"
//             >
//               <span data-animate="text">CANCEL</span>
//             </button>

//             <button
//               type="submit"
//               disabled={loading}
//               className=" bg-white px-6 py-3 text-[12px] font-black tracking-widest text-[#ff5a12] shadow-[0_18px_34px_rgba(255,255,255,0.18)] hover:brightness-[1.02] disabled:opacity-60"
//             >
//               <span data-animate="text">{loading ? "SUBMITTING..." : "SUBMIT"}</span>
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
//       <div data-animate="text" className="mb-2 text-[12px] font-black tracking-[0.24em] text-white/90">
//         {label}
//       </div>
//       {children}
//     </label>
//   );
// }


















































































import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import "./careers.css";
import { supabase } from "../lib/supabaseClient";

/* ----------------------------- DATA ----------------------------- */
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

/* ----------------------------- Word Splitter (TITLE ONLY) ----------------------------- */
function splitWords(el, { maxWords = 70 } = {}) {
  if (!el) return { words: [], skipped: true };

  // already split
  if (el.dataset.splitWords === "1") {
    return { words: Array.from(el.querySelectorAll(".gsap-word")), skipped: false };
  }

  const original = el.textContent || "";
  const trimmed = original.trim();
  if (!trimmed) return { words: [], skipped: true };

  const tokens = original.match(/(\S+|\s+)/g) || [];
  const wordCount = tokens.filter((t) => !/^\s+$/.test(t)).length;
  if (wordCount > maxWords) return { words: [], skipped: true };

  el.dataset.splitWords = "1";
  el.dataset.originalText = original;

  const html = tokens
    .map((t) => {
      if (/^\s+$/.test(t)) {
        return t.replace(/ /g, "&nbsp;").replace(/\n/g, "<br/>");
      }
      return `<span class="gsap-word">${t}</span>`;
    })
    .join("");

  el.innerHTML = html;
  return { words: Array.from(el.querySelectorAll(".gsap-word")), skipped: false };
}

export default function CareersSection({
  title = "CAREERS",
  subtitle = "• Join us to build premium systems at scale",
  teams = TEAMS,
  roles = ROLES,
}) {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);

  const [team, setTeam] = useState("all");
  const [query, setQuery] = useState("");
  const [activeRole, setActiveRole] = useState(null);

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

  // ✅ Simple mailto function (no backend needed)
const sendEmail = () => {
  const to = "careers@senevon.in"; // ✅ configured receiver email
  const subject = "CV Submission - SENEVON";
  const body = `Hi SENEVON Team,

I would like to submit my CV for consideration.

Name:
Phone:
Portfolio/LinkedIn:
Message:

Thanks,
`;

  const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  window.location.href = mailto;
};


  /* ----------------------------- GSAP: ONLY TITLE ----------------------------- */
  useLayoutEffect(() => {
    const el = titleRef.current;
    if (!el) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) return;

    // Split title words once
    const { words, skipped } = splitWords(el, { maxWords: 20 });
    if (skipped || !words.length) return;

    // Kill any previous tweens targeting these nodes
    gsap.killTweensOf(words);

    // Intro title animation (lightweight)
    gsap.set(words, { opacity: 0, y: 14 });
    gsap.to(words, {
      opacity: 1,
      y: 0,
      duration: 0.55,
      ease: "power3.out",
      stagger: 0.05,
      delay: 0.05,
    });

    return () => {
      gsap.killTweensOf(words);
    };
  }, [title]);

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
                  data-animate="text"
                  className="cr-title text-[40px] font-black tracking-[0.14em] text-white md:text-[72px]"
                >
                  {title}
                </h2>
              </div>
            </Tile>

            {/* Subtitle + Search */}
            <Tile className="col-span-12 md:col-span-5 min-h-[170px]">
              <div className="flex h-full flex-col justify-between gap-6 p-6 md:p-10">
                <p
                  data-animate="text"
                  className="cr-sub font-mono text-[15px] leading-relaxed text-white/90"
                >
                  {subtitle}
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
                    data-animate="text"
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
                      <span data-animate="text">{t.label}</span>
                    </button>
                  );
                })}

                <div className="ml-auto hidden items-center gap-2 md:flex">
                  <span className="h-3 w-3 bg-[#d9d9d9]" />
                  <span
                    data-animate="text"
                    className="text-[12px] font-black tracking-[0.22em] text-white/90"
                  >
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
                        <div data-animate="text" className="text-[16px] font-black text-white">
                          No roles found.
                        </div>
                        <div data-animate="text" className="mt-2 text-[13px] text-white/80">
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
                  <div data-animate="text" className="text-[12px] font-black tracking-[0.24em] text-white/90">
                    DIDN’T FIND A MATCH?
                  </div>
                  <div data-animate="text" className="mt-2 text-[18px] font-black text-white">
                    Send your profile — we’ll reach out when a role opens.
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    data-animate="text"
                    onClick={sendEmail}
                    className="
    relative
    bg-white
    px-6 py-3
    text-[12px] font-black tracking-widest text-[#ff5a12]
    shadow-[0_18px_34px_rgba(255,255,255,0.18)]
    overflow-hidden
    transition-all duration-300 ease-out
    hover:brightness-[1.02]
    active:translate-y-[1px]

    /* CORNER BRACKETS */
    before:absolute before:top-2 before:left-2
    before:h-3 before:w-3
    before:border-l-2 before:border-t-2
    before:border-black
    before:content-['']
    before:transition-all before:duration-300

    after:absolute after:bottom-2 after:right-2
    after:h-3 after:w-3
    after:border-r-2 after:border-b-2
    after:border-black
    after:content-['']
    after:transition-all after:duration-300

    /* UNIQUE HOVER: subtle orange sweep */
    hover:before:-translate-x-0.5 hover:before:-translate-y-0.5
    hover:after:translate-x-0.5 hover:after:translate-y-0.5
  "
                    style={{
                      backgroundImage:
                        "linear-gradient(120deg, rgba(255,90,18,0) 0%, rgba(255,90,18,0) 45%, rgba(255,90,18,0.10) 55%, rgba(255,90,18,0) 70%)",
                      backgroundSize: "220% 100%",
                      backgroundPosition: "100% 0",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundPosition = "0% 0")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundPosition = "100% 0")}
                  >
                    SEND CV
                  </button>

                  <button
                    data-animate="text"
                    onClick={sendEmail}
                    className="border border-white/55 bg-white/16 px-6 py-3 text-[12px] font-black tracking-widest text-white hover:bg-white/24 active:translate-y-[1px]"
                  >
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
    <div data-tile className={`relative overflow-hidden border border-white/35 bg-transparent ${className}`}>
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
        <div data-animate="text" className="cr-jitter text-[16px] font-black tracking-wide text-[#ff5a12]">
          {role.title}
        </div>
        <div data-animate="text" className="mt-1 text-[12px] font-semibold text-[#ff5a12]/75">
          {role.team.toUpperCase()} • {role.level}
        </div>
      </div>

      {/* middle */}
      <div className="flex-1 p-5">
        <div className="cr-meta fx-scan rounded-2xl bg-white p-4 shadow-[0_18px_40px_rgba(255,90,18,0.18)]">
          <div className="flex flex-wrap gap-2">
            <Pill><span data-animate="text">{role.type}</span></Pill>
            <Pill><span data-animate="text">{role.location}</span></Pill>
          </div>

          <p data-animate="text" className="mt-4 text-[13px] leading-relaxed text-[#ff5a12]/85">
            {role.desc}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {(role.tags || []).slice(0, 4).map((t) => (
              <span key={t} className="cr-tag">
                <span data-animate="text">{t}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* bottom */}
      <div className="mt-auto flex items-center justify-between border-t border-[#ff5a12]/15 bg-white px-5 py-4">
        <div data-animate="text" className="text-[12px] font-black tracking-[0.22em] text-[#ff5a12]/70">
          APPLY
        </div>

        <button
          onClick={onApply}
          className="cr-btnWhite bg-[#ff5a12] px-4 py-2 text-[12px] font-black tracking-widest text-[white] active:translate-y-[1px]"
        >
          <span data-animate="text">APPLY NOW</span>
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
  const [form, setForm] = useState({
    name: "",
    email: "",
    portfolio: "",
    location: "",
    message: "",
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const update = (key) => (e) => {
    setForm((s) => ({ ...s, [key]: e.target.value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setStatus({ type: "", message: "" });
    setLoading(true);

    try {
      // ✅ optional: upload resume to Cloudinary
      let resume_url = null;

      if (resumeFile) {
        // ✅ validate first
        if (resumeFile.size > 5 * 1024 * 1024) {
          throw new Error("Resume must be under 5MB.");
        }

        const allowedExt = ["pdf", "doc", "docx"];
        const ext = (resumeFile.name.split(".").pop() || "").toLowerCase();
        if (!allowedExt.includes(ext)) {
          throw new Error("Only PDF / DOC / DOCX allowed.");
        }

        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !preset) {
          throw new Error("Cloudinary env missing. Set CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET.");
        }

        const safeRand = (() => {
          try {
            if (typeof crypto !== "undefined" && crypto.getRandomValues) {
              const a = new Uint32Array(1);
              crypto.getRandomValues(a);
              return String(a[0]);
            }
          } catch {}
          return Math.random().toString(16).slice(2);
        })();

        const safeBase = `${Date.now()}-${safeRand}`;
        const publicId = `${role?.id || "role"}-${safeBase}`;

        const fd = new FormData();
        fd.append("file", resumeFile);
        fd.append("upload_preset", preset);
        fd.append("folder", "senevon/careers");
        fd.append("public_id", publicId);
        fd.append("filename_override", resumeFile.name);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
          method: "POST",
          body: fd,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error?.message || "Resume upload failed.");
        }

        resume_url = data.secure_url;
      }

      // ✅ insert into DB
      const { error } = await supabase.from("career_applications").insert([
        {
          role_id: role?.id || null,
          role_title: role?.title || null,
          team: role?.team || null,

          name: form.name,
          email: form.email,
          portfolio: form.portfolio || null,
          location: form.location || null,
          message: form.message || null,

          resume_url,
          source: window.location.pathname,
          user_agent: navigator.userAgent,
        },
      ]);

      if (error) throw error;

      setStatus({ type: "success", message: "Application submitted successfully!" });
      setForm({ name: "", email: "", portfolio: "", location: "", message: "" });
      setResumeFile(null);

      setTimeout(() => onClose(), 600);
    } catch (err) {
      setStatus({ type: "error", message: err?.message || "Failed to submit application." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      data-career-modal
      className="fixed inset-0 z-[999] grid place-items-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Apply for role"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{ opacity: 1 }} // ✅ was 0 and depended on GSAP; keep modal visible with no GSAP
    >
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative w-full max-w-[720px] overflow-hidden border border-white/30 bg-[#ff5a12] shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
        <div className="flex items-start justify-between border-b border-white/25 bg-white/10 px-6 py-0">
          <div>
            <div data-animate="text" className="text-[12px] font-black tracking-[0.24em] text-white/90">
              APPLYING FOR
            </div>
            <div data-animate="text" className="mt-2 text-[20px] font-black text-white">
              {role.title}
            </div>
            <div data-animate="text" className="mt-1 text-[13px] text-white/85">
              {role.type} • {role.location} • {role.level}
            </div>
          </div>

          <button
            onClick={onClose}
            className="grid h-11 w-11 place-items-center border border-white/30 bg-white/12 text-white/90 hover:bg-white/22"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form className="grid gap-4 p-6 md:grid-cols-2" onSubmit={submit}>
          <Field label="Full Name">
            <input
              className="cr-input text-[#ff5a12]"
              required
              placeholder="Your name"
              value={form.name}
              onChange={update("name")}
            />
          </Field>

          <Field label="Email">
            <input
              className="cr-input text-[#ff5a12]"
              type="email"
              required
              placeholder="you@email.com"
              value={form.email}
              onChange={update("email")}
            />
          </Field>

          <Field label="Portfolio / LinkedIn">
            <input
              className="cr-input text-[#ff5a12]"
              placeholder="https://…"
              value={form.portfolio}
              onChange={update("portfolio")}
            />
          </Field>

          <Field label="Location">
            <input
              className="cr-input text-[#ff5a12]"
              placeholder="City, Country"
              value={form.location}
              onChange={update("location")}
            />
          </Field>

          <div className="md:col-span-2">
            <Field label="Message">
              <textarea
                className="cr-input min-h-[120px] resize-none text-[#ff5a12]"
                placeholder="Why are you a fit for this role?"
                value={form.message}
                onChange={update("message")}
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="Resume (optional)">
              <input
                className="cr-input"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              />
            </Field>
          </div>

          {status.message ? (
            <div className="md:col-span-2 border border-white/35 bg-white/10 px-4 py-3 text-[12px] font-semibold text-white/90">
              {status.message}
            </div>
          ) : null}

          <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className=" border border-white/50 bg-white/12 px-6 py-3 text-[12px] font-black tracking-widest text-white hover:bg-white/22 disabled:opacity-60"
            >
              <span data-animate="text">CANCEL</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className=" bg-white px-6 py-3 text-[12px] font-black tracking-widest text-[#ff5a12] shadow-[0_18px_34px_rgba(255,255,255,0.18)] hover:brightness-[1.02] disabled:opacity-60"
            >
              <span data-animate="text">{loading ? "SUBMITTING..." : "SUBMIT"}</span>
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
      <div data-animate="text" className="mb-2 text-[12px] font-black tracking-[0.24em] text-white/90">
        {label}
      </div>
      {children}
    </label>
  );
}
