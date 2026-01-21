
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import gsap from "gsap";

// const cn = (...a) => a.filter(Boolean).join(" ");

// const DEFAULT_TRACKS = [
//   {
//     id: "t1",
//     title: "Product Build",
//     desc: "From idea → MVP → v1 with clean UI, scalable architecture, and performance.",
//     tags: ["MVP", "Architecture", "UX"],
//   },
//   {
//     id: "t2",
//     title: "Platform Scale",
//     desc: "Optimize reliability, speed, security, and rollout systems for growth.",
//     tags: ["Scale", "Security", "DevOps"],
//   },
//   {
//     id: "t3",
//     title: "Design Studio",
//     desc: "Brand identity, UI systems, motion, and product polish for launch.",
//     tags: ["Brand", "UI System", "Motion"],
//   },
// ];

// export default function IncubationModal({
//   open,
//   onClose,
//   onSubmit,
//   tracks = DEFAULT_TRACKS,
// }) {
//   const rootRef = useRef(null);
//   const panelRef = useRef(null);
//   const tlRef = useRef(null);

//   const trackList = useMemo(() => tracks, [tracks]);

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     company: "",
//     website: "",
//     stage: "MVP",
//     track: trackList?.[0]?.title || "Product Build",
//     budget: "Under ₹1L",
//     message: "",
//   });

//   // init GSAP once
//   useEffect(() => {
//     const root = rootRef.current;
//     const panel = panelRef.current;
//     if (!root || !panel) return;

//     const backdrop = root.querySelector("[data-inc-backdrop]");
//     const items = panel.querySelectorAll("[data-inc-item]");
//     const chips = panel.querySelectorAll("[data-inc-chip]");

//     gsap.set(root, { autoAlpha: 0, pointerEvents: "none" });
//     gsap.set(backdrop, { autoAlpha: 0 });
//     gsap.set(panel, { y: 18, autoAlpha: 0 });
//     gsap.set([items, chips], { y: 10, autoAlpha: 0 });

//     const tl = gsap.timeline({
//       paused: true,
//       defaults: { ease: "power3.out" },
//       onReverseComplete: () => gsap.set(root, { pointerEvents: "none" }),
//     });

//     tl.set(root, { autoAlpha: 1, pointerEvents: "auto" }, 0)
//       .to(backdrop, { autoAlpha: 1, duration: 0.18 }, 0)
//       .to(panel, { y: 0, autoAlpha: 1, duration: 0.22 }, 0.03)
//       .to(items, { y: 0, autoAlpha: 1, duration: 0.2, stagger: 0.03 }, 0.09)
//       .to(chips, { y: 0, autoAlpha: 1, duration: 0.16, stagger: 0.012 }, 0.13);

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

//   if (!open) return null;

//   const set = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

//   const submit = (e) => {
//     e.preventDefault();
//     const payload = { ...form, createdAt: new Date().toISOString() };
//     onSubmit?.(payload);
//     onClose?.();
//   };

//   return (
//     <div ref={rootRef} className="fixed inset-0 z-[999]">
//       {/* Backdrop */}
//       <button
//         data-inc-backdrop
//         aria-label="Close incubation modal"
//         onClick={onClose}
//         className="absolute inset-0 bg-black/35"
//       />

//       {/* Panel wrapper */}
//       <div className="absolute inset-x-0 top-[74px] md:top-[86px] mx-auto w-full max-w-[980px] px-3 sm:px-4">
//         <div
//           ref={panelRef}
//           role="dialog"
//           aria-modal="true"
//           aria-label="Incubation"
//           className={cn(
//             "relative border border-black/25 bg-[#d9d9d9] overflow-hidden",
//             // ✅ IMPORTANT: make panel a column layout with fixed header/footer
//             "max-h-[calc(100vh-92px)]"
//           )}
//         >
//           {/* subtle internal grid */}
//           <div
//             className="pointer-events-none absolute inset-0 opacity-[0.18]
//             [background-image:linear-gradient(to_right,rgba(0,0,0,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.16)_1px,transparent_1px)]
//             [background-size:220px_220px]"
//           />

//           {/* ✅ NEW: column layout container */}
//           <div className="relative flex max-h-[calc(100vh-92px)] flex-col">
//             {/* Header row (fixed) */}
//             <div className="relative border-b border-black/20 px-4 py-4 sm:px-5">
//               <div className="flex items-start justify-between gap-3">
//                 <div>
//                   <div className="text-[11px] font-black tracking-[0.22em] text-black/70">
//                     SENEVON
//                   </div>
//                   <div className="mt-1 text-[18px] sm:text-[20px] font-black tracking-[0.12em] text-black/85">
//                     INCUBATION
//                   </div>
//                   <div className="mt-1 text-[12px] font-semibold text-black/60">
//                     Apply to build, scale, and ship with a dedicated team.
//                   </div>
//                 </div>

//                 <button
//                   data-inc-item
//                   onClick={onClose}
//                   className="grid h-10 w-10 place-items-center border border-black/25 bg-white/45 hover:bg-white/70 transition"
//                   aria-label="Close"
//                   type="button"
//                 >
//                   ✕
//                 </button>
//               </div>

//               {/* micro chips */}
//               <div className="mt-4 flex flex-wrap gap-2">
//                 {["Product", "Systems", "Design Studio", "Delivery"].map((t) => (
//                   <span
//                     key={t}
//                     data-inc-chip
//                     className="border border-black/25 bg-white/45 px-3 py-2 text-[10px] sm:text-[11px] font-black tracking-widest text-black/70"
//                   >
//                     {t.toUpperCase()}
//                   </span>
//                 ))}
//               </div>
//             </div>

//             {/* ✅ Body (scrolls) */}
//             <div className="relative flex-1 overflow-y-auto">
//               <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-5 gap-4">
//                 {/* Left: Tracks */}
//                 <div className="lg:col-span-2">
//                   <div
//                     data-inc-item
//                     className="text-[11px] font-black tracking-[0.22em] text-black/65"
//                   >
//                     TRACKS
//                   </div>

//                   <div className="mt-3 grid gap-3">
//                     {trackList.map((t) => (
//                       <button
//                         key={t.id}
//                         type="button"
//                         data-inc-item
//                         onClick={() => setForm((s) => ({ ...s, track: t.title }))}
//                         className={cn(
//                           "text-left border border-black/25 bg-white/40 px-4 py-3 transition",
//                           "hover:bg-white/60 active:translate-y-[1px]",
//                           form.track === t.title
//                             ? "shadow-[0_14px_30px_rgba(0,0,0,0.08)]"
//                             : ""
//                         )}
//                       >
//                         <div className="flex items-start justify-between gap-3">
//                           <div>
//                             <div className="text-[13px] font-black text-black/85">
//                               {t.title}
//                             </div>
//                             <div className="mt-1 text-[12px] text-black/65 leading-relaxed">
//                               {t.desc}
//                             </div>
//                           </div>

//                           <span className="mt-1 inline-flex h-2 w-2 bg-[#ff5a12]" />
//                         </div>

//                         <div className="mt-2 flex flex-wrap gap-2">
//                           {t.tags.map((tag) => (
//                             <span
//                               key={tag}
//                               className="border border-black/20 bg-white/55 px-2.5 py-1 text-[10px] font-black tracking-[0.18em] text-black/60"
//                             >
//                               {tag.toUpperCase()}
//                             </span>
//                           ))}
//                         </div>
//                       </button>
//                     ))}
//                   </div>

//                   <div
//                     data-inc-item
//                     className="mt-4 border border-black/20 bg-white/35 px-4 py-3"
//                   >
//                     <div className="text-[10px] font-black tracking-[0.22em] text-black/60">
//                       WHAT YOU GET
//                     </div>
//                     <ul className="mt-2 space-y-1 text-[12px] text-black/65">
//                       <li>• Dedicated build team + weekly check-ins</li>
//                       <li>• UI/UX system + component library</li>
//                       <li>• Performance + security best practices</li>
//                     </ul>
//                   </div>
//                 </div>

//                 {/* Right: Form */}
//                 <div className="lg:col-span-3">
//                   <div
//                     data-inc-item
//                     className="text-[11px] font-black tracking-[0.22em] text-black/65"
//                   >
//                     APPLICATION
//                   </div>

//                   <form onSubmit={submit} className="mt-3 grid gap-3">
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                       <Field
//                         label="Full Name"
//                         value={form.name}
//                         onChange={set("name")}
//                         placeholder="Your name"
//                         required
//                       />
//                       <Field
//                         label="Email"
//                         value={form.email}
//                         onChange={set("email")}
//                         placeholder="you@company.com"
//                         type="email"
//                         required
//                       />
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                       <Field
//                         label="Company / Project"
//                         value={form.company}
//                         onChange={set("company")}
//                         placeholder="Senevon Labs"
//                       />
//                       <Field
//                         label="Website (optional)"
//                         value={form.website}
//                         onChange={set("website")}
//                         placeholder="https://"
//                       />
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                       <Select
//                         label="Stage"
//                         value={form.stage}
//                         onChange={set("stage")}
//                         options={["Idea", "MVP", "Growth", "Enterprise"]}
//                       />
//                       <Select
//                         label="Track"
//                         value={form.track}
//                         onChange={set("track")}
//                         options={trackList.map((t) => t.title)}
//                       />
//                       <Select
//                         label="Budget"
//                         value={form.budget}
//                         onChange={set("budget")}
//                         options={["Under ₹1L", "₹1L – ₹3L", "₹3L – ₹8L", "₹8L+"]}
//                       />
//                     </div>

//                     <TextArea
//                       label="What do you want to build?"
//                       value={form.message}
//                       onChange={set("message")}
//                       placeholder="Describe scope, timeline, features, users, etc."
//                       rows={4}
//                       required
//                     />

//                     {/* ✅ IMPORTANT: keep a hidden submit for Enter key */}
//                     <button type="submit" className="hidden" />
//                   </form>

//                   <div data-inc-item className="mt-3 text-[12px] text-black/55">
//                     Tip: If you have docs, send them after submission via email reply.
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* ✅ NEW: Sticky footer (always visible on mobile) */}
//             <div
//               className={cn(
//                 "relative border-t border-black/15 bg-[#d9d9d9]",
//                 "px-4 sm:px-5 py-3",
//                 // safe-area support (iOS)
//                 "pb-[calc(12px+env(safe-area-inset-bottom))]"
//               )}
//             >
//               <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
//                 <div className="text-[11px] font-black tracking-[0.22em] text-black/55">
//                   RESPONSE IN 24–48H
//                 </div>

//                 <div className="flex gap-3 justify-end">
//                   <button
//                     type="button"
//                     onClick={onClose}
//                     className="border border-black/25 bg-white/55 px-4 py-2.5 text-[11px] font-black tracking-widest text-black/70 hover:bg-white/80 active:translate-y-[1px] transition"
//                   >
//                     CLOSE
//                   </button>

//                   <button
//                     type="button"
//                     onClick={() => {
//                       // manually trigger form submit
//                       const evt = new Event("submit", { cancelable: true, bubbles: true });
//                       panelRef.current?.querySelector("form")?.dispatchEvent(evt);
//                     }}
//                     className="bg-[#ff5a12] px-5 py-2.5 text-[11px] font-black tracking-widest text-white shadow-[0_16px_34px_rgba(255,90,18,0.24)] hover:brightness-[1.03] active:translate-y-[1px] transition"
//                   >
//                     SUBMIT ↗
//                   </button>
//                 </div>
//               </div>
//             </div>
//             {/* ✅ footer end */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ---------------- UI bits ---------------- */

// function Field({ label, value, onChange, placeholder, type = "text", required = false }) {
//   return (
//     <label className="grid gap-1.5">
//       <span className="text-[10px] font-black tracking-[0.22em] text-black/60">
//         {label.toUpperCase()}
//       </span>
//       <input
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         type={type}
//         required={required}
//         className="h-11 border border-black/25 bg-white/45 px-3 text-[13px] text-black/80 outline-none placeholder:text-black/35 focus:bg-white/70 focus:ring-2 focus:ring-black/25"
//       />
//     </label>
//   );
// }

// function Select({ label, value, onChange, options }) {
//   return (
//     <label className="grid gap-1.5">
//       <span className="text-[10px] font-black tracking-[0.22em] text-black/60">
//         {label.toUpperCase()}
//       </span>
//       <select
//         value={value}
//         onChange={onChange}
//         className="h-11 border border-black/25 bg-white/45 px-3 text-[13px] text-black/80 outline-none focus:bg-white/70 focus:ring-2 focus:ring-black/25"
//       >
//         {options.map((o) => (
//           <option key={o} value={o}>
//             {o}
//           </option>
//         ))}
//       </select>
//     </label>
//   );
// }

// function TextArea({ label, value, onChange, placeholder, rows = 4, required }) {
//   return (
//     <label className="grid gap-1.5">
//       <span className="text-[10px] font-black tracking-[0.22em] text-black/60">
//         {label.toUpperCase()}
//       </span>
//       <textarea
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         rows={rows}
//         required={required}
//         className="min-h-[120px] resize-none border border-black/25 bg-white/45 px-3 py-2 text-[13px] leading-relaxed text-black/80 outline-none placeholder:text-black/35 focus:bg-white/70 focus:ring-2 focus:ring-black/25"
//       />
//     </label>
//   );
// }






















































import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { createClient } from "@supabase/supabase-js";

const cn = (...a) => a.filter(Boolean).join(" ");

// ✅ Supabase client (Vite env)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create only if env is present (prevents crash in dev if missing)
const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

// ✅ Default table name (you can change in Supabase)
const DEFAULT_TABLE = "incubation_applications";

const DEFAULT_TRACKS = [
  {
    id: "t1",
    title: "Product Build",
    desc: "From idea → MVP → v1 with clean UI, scalable architecture, and performance.",
    tags: ["MVP", "Architecture", "UX"],
  },
  {
    id: "t2",
    title: "Platform Scale",
    desc: "Optimize reliability, speed, security, and rollout systems for growth.",
    tags: ["Scale", "Security", "DevOps"],
  },
  {
    id: "t3",
    title: "Design Studio",
    desc: "Brand identity, UI systems, motion, and product polish for launch.",
    tags: ["Brand", "UI System", "Motion"],
  },
];

export default function IncubationModal({
  open,
  onClose,
  onSubmit,
  tracks = DEFAULT_TRACKS,

  // ✅ optional: override table name without changing UI usage
  supabaseTable = DEFAULT_TABLE,
}) {
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const tlRef = useRef(null);

  const trackList = useMemo(() => tracks, [tracks]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    website: "",
    stage: "MVP",
    track: trackList?.[0]?.title || "Product Build",
    budget: "Under ₹1L",
    message: "",
  });

  const [submitStatus, setSubmitStatus] = useState(""); // "submitting" | "submitted" | "error" | ""


  // init GSAP once
  useEffect(() => {
    const root = rootRef.current;
    const panel = panelRef.current;
    if (!root || !panel) return;

    const backdrop = root.querySelector("[data-inc-backdrop]");
    const items = panel.querySelectorAll("[data-inc-item]");
    const chips = panel.querySelectorAll("[data-inc-chip]");

    gsap.set(root, { autoAlpha: 0, pointerEvents: "none" });
    gsap.set(backdrop, { autoAlpha: 0 });
    gsap.set(panel, { y: 18, autoAlpha: 0 });
    gsap.set([items, chips], { y: 10, autoAlpha: 0 });

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: "power3.out" },
      onReverseComplete: () => gsap.set(root, { pointerEvents: "none" }),
    });

    tl.set(root, { autoAlpha: 1, pointerEvents: "auto" }, 0)
      .to(backdrop, { autoAlpha: 1, duration: 0.18 }, 0)
      .to(panel, { y: 0, autoAlpha: 1, duration: 0.22 }, 0.03)
      .to(items, { y: 0, autoAlpha: 1, duration: 0.2, stagger: 0.03 }, 0.09)
      .to(chips, { y: 0, autoAlpha: 1, duration: 0.16, stagger: 0.012 }, 0.13);

    tlRef.current = tl;
    return () => {
      tl.kill();
      tlRef.current = null;
    };
  }, []);

  // open/close + body lock
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
      if (e.key === "Escape" && open) onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const set = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  // ✅ Supabase insert (no UI change; logs errors only)
  const saveToSupabase = async (payload) => {
    if (!supabase) {
      console.warn(
        "[IncubationModal] Supabase not configured. Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY"
      );
      return { ok: false, error: "Supabase not configured" };
    }

    const row = {
      name: payload.name,
      email: payload.email,
      company: payload.company,
      website: payload.website,
      stage: payload.stage,
      track: payload.track,
      budget: payload.budget,
      message: payload.message,
      created_at: payload.createdAt,
      source: "web",
    };

    const { error } = await supabase.from(supabaseTable).insert([row]);
    if (error) {
      console.error("[IncubationModal] Supabase insert error:", error);
      return { ok: false, error };
    }
    return { ok: true };
  };



  const submit = async (e) => {
    e.preventDefault();
    setSubmitStatus("submitting");

    const payload = { ...form, createdAt: new Date().toISOString() };

    const res = await saveToSupabase(payload);

    if (res.ok) {
      setSubmitStatus("submitted");
      onSubmit?.(payload);

      // keep message visible briefly, then close (still feels instant)
      setTimeout(() => {
        setSubmitStatus("");
        onClose?.();
      }, 900);
    } else {
      setSubmitStatus("error");
      // keep modal open so user doesn't lose data
    }
  };




  return (
    <div ref={rootRef} className="fixed inset-0 z-[999]">
      {/* Backdrop */}
      <button
        data-inc-backdrop
        aria-label="Close incubation modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/35"
      />

      {/* Panel wrapper */}
      <div className="absolute inset-x-0 top-[74px] md:top-[86px] mx-auto w-full max-w-[980px] px-3 sm:px-4">
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Incubation"
          className={cn(
            "relative border border-black/25 bg-[#d9d9d9] overflow-hidden",
            "max-h-[calc(100vh-92px)]"
          )}
        >
          {/* subtle internal grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.18]
            [background-image:linear-gradient(to_right,rgba(0,0,0,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.16)_1px,transparent_1px)]
            [background-size:220px_220px]"
          />

          {/* column layout container */}
          <div className="relative flex max-h-[calc(100vh-92px)] flex-col">
            {/* Header row (fixed) */}
            <div className="relative border-b border-black/20 px-4 py-4 sm:px-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[11px] font-black tracking-[0.22em] text-black/70">
                    SENEVON
                  </div>
                  <div className="mt-1 text-[18px] sm:text-[20px] font-black tracking-[0.12em] text-black/85">
                    INCUBATION
                  </div>
                  <div className="mt-1 text-[12px] font-semibold text-black/60">
                    Apply to build, scale, and ship with a dedicated team.
                  </div>
                </div>

                <button
                  data-inc-item
                  onClick={onClose}
                  className="grid h-10 w-10 place-items-center border border-black/25 bg-white/45 hover:bg-white/70 transition"
                  aria-label="Close"
                  type="button"
                >
                  ✕
                </button>
              </div>

              {/* micro chips */}
              <div className="mt-4 flex flex-wrap gap-2">
                {["Product", "Systems", "Design Studio", "Delivery"].map((t) => (
                  <span
                    key={t}
                    data-inc-chip
                    className="border border-black/25 bg-white/45 px-3 py-2 text-[10px] sm:text-[11px] font-black tracking-widest text-black/70"
                  >
                    {t.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            {/* Body (scrolls) */}
            <div className="relative flex-1 overflow-y-auto">
              <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* Left: Tracks */}
                <div className="lg:col-span-2">
                  <div
                    data-inc-item
                    className="text-[11px] font-black tracking-[0.22em] text-black/65"
                  >
                    TRACKS
                  </div>

                  <div className="mt-3 grid gap-3">
                    {trackList.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        data-inc-item
                        onClick={() =>
                          setForm((s) => ({ ...s, track: t.title }))
                        }
                        className={cn(
                          "text-left border border-black/25 bg-white/40 px-4 py-3 transition",
                          "hover:bg-white/60 active:translate-y-[1px]",
                          form.track === t.title
                            ? "shadow-[0_14px_30px_rgba(0,0,0,0.08)]"
                            : ""
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-[13px] font-black text-black/85">
                              {t.title}
                            </div>
                            <div className="mt-1 text-[12px] text-black/65 leading-relaxed">
                              {t.desc}
                            </div>
                          </div>

                          <span className="mt-1 inline-flex h-2 w-2 bg-[#ff5a12]" />
                        </div>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {t.tags.map((tag) => (
                            <span
                              key={tag}
                              className="border border-black/20 bg-white/55 px-2.5 py-1 text-[10px] font-black tracking-[0.18em] text-black/60"
                            >
                              {tag.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div
                    data-inc-item
                    className="mt-4 border border-black/20 bg-white/35 px-4 py-3"
                  >
                    <div className="text-[10px] font-black tracking-[0.22em] text-black/60">
                      WHAT YOU GET
                    </div>
                    <ul className="mt-2 space-y-1 text-[12px] text-black/65">
                      <li>• Dedicated build team + weekly check-ins</li>
                      <li>• UI/UX system + component library</li>
                      <li>• Performance + security best practices</li>
                    </ul>
                  </div>
                </div>

                {/* Right: Form */}
                <div className="lg:col-span-3">
                  <div
                    data-inc-item
                    className="text-[11px] font-black tracking-[0.22em] text-black/65"
                  >
                    APPLICATION
                  </div>

                  <form onSubmit={submit} className="mt-3 grid gap-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Field
                        label="Full Name"
                        value={form.name}
                        onChange={set("name")}
                        placeholder="Your name"
                        required
                      />
                      <Field
                        label="Email"
                        value={form.email}
                        onChange={set("email")}
                        placeholder="you@company.com"
                        type="email"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Field
                        label="Company / Project"
                        value={form.company}
                        onChange={set("company")}
                        placeholder="Senevon Labs"
                      />
                      <Field
                        label="Website (optional)"
                        value={form.website}
                        onChange={set("website")}
                        placeholder="https://"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <Select
                        label="Stage"
                        value={form.stage}
                        onChange={set("stage")}
                        options={["Idea", "MVP", "Growth", "Enterprise"]}
                      />
                      <Select
                        label="Track"
                        value={form.track}
                        onChange={set("track")}
                        options={trackList.map((t) => t.title)}
                      />
                      <Select
                        label="Budget"
                        value={form.budget}
                        onChange={set("budget")}
                        options={["Under ₹1L", "₹1L – ₹3L", "₹3L – ₹8L", "₹8L+"]}
                      />
                    </div>

                    <TextArea
                      label="What do you want to build?"
                      value={form.message}
                      onChange={set("message")}
                      placeholder="Describe scope, timeline, features, users, etc."
                      rows={4}
                      required
                    />

                    {/* keep a hidden submit for Enter key */}
                    <button type="submit" className="hidden" />
                  </form>

                  <div data-inc-item className="mt-3 text-[12px] text-black/55">
                    Tip: If you have docs, send them after submission via email
                    reply.
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky footer */}
            <div
              className={cn(
                "relative border-t border-black/15 bg-[#d9d9d9]",
                "px-4 sm:px-5 py-3",
                "pb-[calc(12px+env(safe-area-inset-bottom))]"
              )}
            >
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className="text-[11px] font-black tracking-[0.22em] text-black/55">
                  RESPONSE IN 24–48H
                </div>

                {submitStatus === "submitting" && (
                  <div className="text-[11px] font-black tracking-[0.18em] text-black/60">
                    SUBMITTING...
                  </div>
                )}
                {submitStatus === "submitted" && (
                  <div className="text-[11px] font-black tracking-[0.18em] text-green-700">
                    SUBMITTED ✓
                  </div>
                )}
                {submitStatus === "error" && (
                  <div className="text-[11px] font-black tracking-[0.18em] text-red-600">
                    NOT SUBMITTED — TRY AGAIN
                  </div>
                )}


                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="border border-black/25 bg-white/55 px-4 py-2.5 text-[11px] font-black tracking-widest text-black/70 hover:bg-white/80 active:translate-y-[1px] transition"
                  >
                    CLOSE
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const evt = new Event("submit", {
                        cancelable: true,
                        bubbles: true,
                      });
                      panelRef.current
                        ?.querySelector("form")
                        ?.dispatchEvent(evt);
                    }}
                    className="bg-[#ff5a12] px-5 py-2.5 text-[11px] font-black tracking-widest text-white shadow-[0_16px_34px_rgba(255,90,18,0.24)] hover:brightness-[1.03] active:translate-y-[1px] transition"
                  >
                    SUBMIT ↗
                  </button>
                </div>
              </div>
            </div>
            {/* footer end */}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- UI bits ---------------- */

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[10px] font-black tracking-[0.22em] text-black/60">
        {label.toUpperCase()}
      </span>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        required={required}
        className="h-11 border border-black/25 bg-white/45 px-3 text-[13px] text-black/80 outline-none placeholder:text-black/35 focus:bg-white/70 focus:ring-2 focus:ring-black/25"
      />
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[10px] font-black tracking-[0.22em] text-black/60">
        {label.toUpperCase()}
      </span>
      <select
        value={value}
        onChange={onChange}
        className="h-11 border border-black/25 bg-white/45 px-3 text-[13px] text-black/80 outline-none focus:bg-white/70 focus:ring-2 focus:ring-black/25"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextArea({ label, value, onChange, placeholder, rows = 4, required }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[10px] font-black tracking-[0.22em] text-black/60">
        {label.toUpperCase()}
      </span>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className="min-h-[120px] resize-none border border-black/25 bg-white/45 px-3 py-2 text-[13px] leading-relaxed text-black/80 outline-none placeholder:text-black/35 focus:bg-white/70 focus:ring-2 focus:ring-black/25"
      />
    </label>
  );
}
