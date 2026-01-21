// import React, { useEffect, useMemo, useRef, useState } from "react";
// import gsap from "gsap";
// import ScrollTrigger from "gsap/ScrollTrigger";
// import { supabase } from "../lib/supabaseClient";

// gsap.registerPlugin(ScrollTrigger);

// const cn = (...a) => a.filter(Boolean).join(" ");

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
//       if (/^\s+$/.test(t)) return t.replace(/ /g, "&nbsp;").replace(/\n/g, "<br/>");
//       return `<span class="gsap-word">${t}</span>`;
//     })
//     .join("");

//   el.innerHTML = html;
//   return { words: Array.from(el.querySelectorAll(".gsap-word")), skipped: false };
// }

// const Stars = React.memo(function Stars({ value = 5 }) {
//   const v = Math.max(1, Math.min(5, Number(value || 5)));
//   return (
//     <div className="flex items-center gap-1" aria-label={`${v} out of 5`}>
//       {Array.from({ length: 5 }).map((_, i) => (
//         <span
//           key={i}
//           className={cn("text-[14px] leading-none", i < v ? "text-[#ff5a12]" : "text-black/15")}
//           aria-hidden="true"
//         >
//           ★
//         </span>
//       ))}
//     </div>
//   );
// });

// function Tile({ className = "", children }) {
//   return (
//     <div data-tile className={cn("relative overflow-hidden border border-white/35 bg-transparent", className)}>
//       <div className="pointer-events-none absolute inset-0 bg-white/0" />
//       {children}
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

// export default function TestimonialsSection({
//   title = "TESTIMONIALS",
//   subtitle = "• Reviews shared by users — instantly visible",
//   limit = 18,
// }) {
//   const sectionRef = useRef(null);

//   const [items, setItems] = useState([]);
//   const [fetchState, setFetchState] = useState({ loading: true, error: "" });

//   const [form, setForm] = useState({
//     name: "",
//     role: "",
//     company: "",
//     rating: 5,
//     message: "",
//   });

//   const [submitState, setSubmitState] = useState({ loading: false, ok: "", err: "" });

//   const update = (key) => (e) => setForm((s) => ({ ...s, [key]: e.target.value }));

//   const canSubmit = useMemo(() => {
//     const nameOk = form.name.trim().length >= 2;
//     const msgOk = form.message.trim().length >= 8;
//     const ratingOk = Number(form.rating) >= 1 && Number(form.rating) <= 5;
//     return nameOk && msgOk && ratingOk && !submitState.loading;
//   }, [form.name, form.message, form.rating, submitState.loading]);

//   const fetchTestimonials = async () => {
//     setFetchState({ loading: true, error: "" });
//     try {
//       const { data, error } = await supabase
//         .from("testimonials")
//         .select("id,name,role,company,rating,message,created_at")
//         .order("created_at", { ascending: false })
//         .limit(limit);

//       if (error) throw error;
//       setItems(data || []);
//       setFetchState({ loading: false, error: "" });
//     } catch (e) {
//       setItems([]);
//       setFetchState({ loading: false, error: e?.message || "Failed to load testimonials." });
//     }
//   };

//   useEffect(() => {
//     fetchTestimonials();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [limit]);

//   // animations (same approach, lightweight)
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
//       const tiles = gsap.utils.toArray(scope.querySelectorAll("[data-tile]"));
//       gsap.set(tiles, { opacity: 0, y: 14 });

//       ScrollTrigger.batch(tiles, {
//         start: "top 92%",
//         once: true,
//         onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out", stagger: 0.06 }),
//       });

//       const textEls = gsap.utils.toArray(scope.querySelectorAll('[data-animate="text"]'));
//       const splitTargets = [];
//       const simpleTargets = [];

//       textEls.forEach((el) => {
//         const { words, skipped } = splitWords(el, { maxWords: 70 });
//         if (!skipped && words.length) splitTargets.push({ el, words });
//         else simpleTargets.push(el);
//       });

//       splitTargets.forEach(({ words }) => gsap.set(words, { opacity: 0, y: 10 }));
//       if (simpleTargets.length) gsap.set(simpleTargets, { opacity: 0, y: 10 });

//       ScrollTrigger.batch(
//         splitTargets.map((x) => x.el),
//         {
//           start: "top 88%",
//           once: true,
//           onEnter: (batch) => {
//             batch.forEach((el) => {
//               const item = splitTargets.find((x) => x.el === el);
//               if (!item) return;
//               gsap.to(item.words, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.02 });
//             });
//           },
//         }
//       );

//       if (simpleTargets.length) {
//         ScrollTrigger.batch(simpleTargets, {
//           start: "top 88%",
//           once: true,
//           onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.42, ease: "power3.out", stagger: 0.04 }),
//         });
//       }

//       ScrollTrigger.refresh();
//     }, sectionRef);

//     return () => ctx.revert();
//   }, []);

//   const submit = async (e) => {
//     e.preventDefault();
//     if (!canSubmit) return;

//     setSubmitState({ loading: true, ok: "", err: "" });

//     // optimistic card (instant UI)
//     const optimistic = {
//       id: `tmp-${Date.now()}`,
//       name: form.name.trim(),
//       role: form.role.trim() || null,
//       company: form.company.trim() || null,
//       rating: Number(form.rating || 5),
//       message: form.message.trim(),
//       created_at: new Date().toISOString(),
//       __optimistic: true,
//     };

//     setItems((prev) => [optimistic, ...prev].slice(0, limit));

//     try {
//       const payload = {
//         name: optimistic.name,
//         role: optimistic.role,
//         company: optimistic.company,
//         rating: optimistic.rating,
//         message: optimistic.message,
//       };

//       const { data, error } = await supabase.from("testimonials").insert([payload]).select().single();
//       if (error) throw error;

//       // replace optimistic with real row
//       setItems((prev) => {
//         const next = prev.map((x) => (x.id === optimistic.id ? data : x));
//         // keep newest first
//         next.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
//         return next.slice(0, limit);
//       });

//       setSubmitState({ loading: false, ok: "Thanks! Your review is now live.", err: "" });
//       setForm({ name: "", role: "", company: "", rating: 5, message: "" });
//     } catch (err) {
//       // rollback optimistic
//       setItems((prev) => prev.filter((x) => x.id !== optimistic.id));
//       setSubmitState({ loading: false, ok: "", err: err?.message || "Failed to submit review." });
//     }
//   };

//   return (
//     <section ref={sectionRef} className="relative w-full bg-[#ff5a12]">
//       {/* background grid */}
//       <div
//         className="pointer-events-none absolute inset-0 -z-10 opacity-[0.24]
//         [background-image:linear-gradient(to_right,rgba(255,255,255,0.55)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.55)_1px,transparent_1px)]
//         [background-size:220px_220px]"
//       />

//       <div className="relative mx-auto w-full max-w-[1600px] px-3 py-10 md:px-6">
//         <div className="relative overflow-hidden">
//           <div className="pointer-events-none absolute inset-0 bg-[#ff5a12]" />

//           <div className="relative z-10 grid grid-cols-12 gap-0 border border-white/35 bg-transparent">
//             {/* Title */}
//             <Tile className="col-span-12 md:col-span-7 min-h-[170px]">
//               <div className="relative h-full p-6 md:p-10">
//                 <span className="absolute left-6 top-6 h-3 w-3 bg-white/95" />
//                 <h2 data-animate="text" className="text-[40px] font-black tracking-[0.14em] text-white md:text-[72px]">
//                   {title}
//                 </h2>
//               </div>
//             </Tile>

//             {/* Subtitle + Refresh */}
//             <Tile className="col-span-12 md:col-span-5 min-h-[170px]">
//               <div className="flex h-full flex-col justify-between gap-6 p-6 md:p-10">
//                 <p data-animate="text" className="font-mono text-[15px] leading-relaxed text-white/90">
//                   {subtitle}
//                 </p>

//                 <div className="flex items-center gap-3">
//                   <button
//                     data-animate="text"
//                     onClick={fetchTestimonials}
//                     className=" border border-white/40 bg-white/16 px-4 py-3 text-[12px] font-black tracking-widest text-white/90 hover:bg-white/25 active:translate-y-[1px]"
//                   >
//                     REFRESH
//                   </button>

//                   <div className="ml-auto hidden items-center gap-2 md:flex">
//                     <span className="h-3 w-3 bg-[#d9d9d9]" />
//                     <span data-animate="text" className="text-[12px] font-black tracking-[0.22em] text-white/90">
//                       {fetchState.loading ? "LOADING" : `${items.length} REVIEWS`}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </Tile>

//             {/* Cards */}
//             <div className="col-span-12">
//               <div className="grid grid-cols-12 gap-0">
//                 {fetchState.loading ? (
//                   Array.from({ length: 6 }).map((_, i) => (
//                     <Tile key={i} className="col-span-12 sm:col-span-6 lg:col-span-4 min-h-[360px]">
//                       <div className="h-full bg-white p-5">
//                         <div className="h-4 w-32 bg-black/10" />
//                         <div className="mt-4 h-3 w-44 bg-black/10" />
//                         <div className="mt-6 space-y-2">
//                           <div className="h-3 w-full bg-black/10" />
//                           <div className="h-3 w-[92%] bg-black/10" />
//                           <div className="h-3 w-[80%] bg-black/10" />
//                         </div>
//                       </div>
//                     </Tile>
//                   ))
//                 ) : fetchState.error ? (
//                   <Tile className="col-span-12 min-h-[240px]">
//                     <div className="grid h-full place-items-center p-10 text-center">
//                       <div>
//                         <div data-animate="text" className="text-[16px] font-black text-white">
//                           Couldn’t load reviews.
//                         </div>
//                         <div data-animate="text" className="mt-2 text-[13px] text-white/85">
//                           {fetchState.error}
//                         </div>
//                       </div>
//                     </div>
//                   </Tile>
//                 ) : items.length === 0 ? (
//                   <Tile className="col-span-12 min-h-[240px]">
//                     <div className="grid h-full place-items-center p-10 text-center">
//                       <div>
//                         <div data-animate="text" className="text-[16px] font-black text-white">
//                           No reviews yet.
//                         </div>
//                         <div data-animate="text" className="mt-2 text-[13px] text-white/80">
//                           Submit one below — it will show instantly.
//                         </div>
//                       </div>
//                     </div>
//                   </Tile>
//                 ) : (
//                   items.map((t) => (
//                     <Tile key={t.id} className="col-span-12 sm:col-span-6 lg:col-span-4 min-h-[360px]">
//                       <article className="flex h-full flex-col bg-white">
//                         <div className="border-b border-[#ff5a12]/15 bg-white px-5 py-4">
//                           <div className="flex items-start justify-between gap-3">
//                             <div>
//                               <div data-animate="text" className="text-[16px] font-black tracking-wide text-[#ff5a12]">
//                                 {t.name}
//                               </div>
//                               <div data-animate="text" className="mt-1 text-[12px] font-semibold text-black/55">
//                                 {(t.role || "User")}{t.company ? ` • ${t.company}` : ""}
//                                 {t.__optimistic ? <span className="ml-2 text-[#ff5a12]/70">• posting…</span> : null}
//                               </div>
//                             </div>
//                             <Stars value={t.rating} />
//                           </div>
//                         </div>

//                         <div className="flex-1 p-5">
//                           <div className=" bg-white p-4 shadow-[0_18px_40px_rgba(255,90,18,0.18)]">
//                             <p data-animate="text" className="text-[13px] leading-relaxed text-black/75">
//                               “{t.message}”
//                             </p>
//                           </div>
//                         </div>

//                         <div className="mt-auto border-t border-[#ff5a12]/15 bg-white px-5 py-4">
//                           <div className="text-[11px] font-black tracking-[0.22em] text-black/45">
//                             {t.created_at ? new Date(t.created_at).toLocaleDateString() : ""}
//                           </div>
//                         </div>
//                       </article>
//                     </Tile>
//                   ))
//                 )}
//               </div>
//             </div>

//             {/* Form */}
//             <Tile className="col-span-12">
//               <div className="p-6 md:p-8">
//                 <div>
//                   <div data-animate="text" className="text-[12px] font-black tracking-[0.24em] text-white/90">
//                     ADD A REVIEW
//                   </div>
//                   <div data-animate="text" className="mt-2 text-[18px] font-black text-white">
//                     Share your feedback (shows instantly)
//                   </div>
//                 </div>

//                 <form onSubmit={submit} className="mt-6 grid gap-4 md:grid-cols-2">
//                   <Field label="Full Name">
//                     <input
//                       className="w-full  border border-white/40 bg-white/16 px-4 py-3 text-[13px] font-semibold text-[#c24c11] outline-none placeholder:text-[#6b5e57]"
//                       placeholder="Your name"
//                       value={form.name}
//                       onChange={update("name")}
//                       required
//                     />
//                   </Field>

//                   <Field label="Rating">
//                     <select
//                       className="w-full  border border-white/40 bg-white/16 px-4 py-3 text-[13px] font-semibold text-[#c24c11] outline-none"
//                       value={form.rating}
//                       onChange={update("rating")}
//                     >
//                       <option value={5}>★★★★★ (5)</option>
//                       <option value={4}>★★★★☆ (4)</option>
//                       <option value={3}>★★★☆☆ (3)</option>
//                       <option value={2}>★★☆☆☆ (2)</option>
//                       <option value={1}>★☆☆☆☆ (1)</option>
//                     </select>
//                   </Field>

//                   <Field label="Role (optional)">
//                     <input
//                       className="w-full  border border-white/40 bg-white/16 px-4 py-3 text-[13px] font-semibold text-[#c24c11] outline-none placeholder:text-[#6b5e57]"
//                       placeholder="Founder / Engineer / Student…"
//                       value={form.role}
//                       onChange={update("role")}
//                     />
//                   </Field>

//                   <Field label="Company (optional)">
//                     <input
//                       className="w-full border border-white/40 bg-white/16 px-4 py-3 text-[13px] font-semibold text-[#c24c11] outline-none placeholder:text-[#6b5e57]"
//                       placeholder="Company name"
//                       value={form.company}
//                       onChange={update("company")}
//                     />
//                   </Field>

//                   <div className="md:col-span-2">
//                     <Field label="Message">
//                       <textarea
//                         className="w-full min-h-[140px] resize-none  border border-white/40 bg-white/16 px-4 py-3 text-[13px] font-semibold text-[#c24c11]outline-none placeholder:text-[#6b5e57]"
//                         placeholder="What did you like? What improved your workflow?"
//                         value={form.message}
//                         onChange={update("message")}
//                         required
//                       />
//                     </Field>
//                   </div>

//                   {(submitState.ok || submitState.err) ? (
//                     <div className="md:col-span-2 border border-white/35 bg-white/10 px-4 py-3 text-[12px] font-semibold text-white/90">
//                       {submitState.ok || submitState.err}
//                     </div>
//                   ) : null}

//                   <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:justify-end">
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setSubmitState({ loading: false, ok: "", err: "" });
//                         setForm({ name: "", role: "", company: "", rating: 5, message: "" });
//                       }}
//                       className="border border-white/50 bg-white/12 px-6 py-3 text-[12px] font-black tracking-widest text-white hover:bg-white/22 active:translate-y-[1px]"
//                     >
//                       CLEAR
//                     </button>

//                     <button
//                       type="submit"
//                       disabled={!canSubmit}
//                       className="bg-white px-6 py-3 text-[12px] font-black tracking-widest text-[#ff5a12] shadow-[0_18px_34px_rgba(255,255,255,0.18)] hover:brightness-[1.02] disabled:opacity-60 disabled:cursor-not-allowed active:translate-y-[1px]"
//                     >
//                       {submitState.loading ? "SUBMITTING..." : "SUBMIT"}
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </Tile>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }














































import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const cn = (...a) => a.filter(Boolean).join(" ");

const Stars = React.memo(function Stars({ value = 5 }) {
  const v = Math.max(1, Math.min(5, Number(value || 5)));
  return (
    <div className="flex items-center gap-1" aria-label={`${v} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={cn("text-[14px] leading-none", i < v ? "text-[#ff5a12]" : "text-black/15")}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </div>
  );
});

function Tile({ className = "", children }) {
  return (
    <div data-tile className={cn("relative overflow-hidden border border-white/35 bg-transparent", className)}>
      <div className="pointer-events-none absolute inset-0 bg-white/0" />
      {children}
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

export default function TestimonialsSection({
  title = "TESTIMONIALS",
  subtitle = "• Reviews shared by users — instantly visible",
  limit = 18,
}) {
  const sectionRef = useRef(null);

  const [items, setItems] = useState([]);
  const [fetchState, setFetchState] = useState({ loading: true, error: "" });

  const [form, setForm] = useState({
    name: "",
    role: "",
    company: "",
    rating: 5,
    message: "",
  });

  const [submitState, setSubmitState] = useState({ loading: false, ok: "", err: "" });

  const update = useCallback(
    (key) => (e) => {
      const val = e?.target?.value;
      setForm((s) => ({ ...s, [key]: val }));
    },
    []
  );

  const canSubmit = useMemo(() => {
    const nameOk = form.name.trim().length >= 2;
    const msgOk = form.message.trim().length >= 8;
    const ratingNum = Number(form.rating);
    const ratingOk = ratingNum >= 1 && ratingNum <= 5;
    return nameOk && msgOk && ratingOk && !submitState.loading;
  }, [form.name, form.message, form.rating, submitState.loading]);

  const fetchTestimonials = useCallback(async () => {
    setFetchState({ loading: true, error: "" });
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("id,name,role,company,rating,message,created_at")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;

      setItems(Array.isArray(data) ? data : []);
      setFetchState({ loading: false, error: "" });
    } catch (e) {
      setItems([]);
      setFetchState({ loading: false, error: e?.message || "Failed to load testimonials." });
    }
  }, [limit]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const submit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!canSubmit) return;

      setSubmitState({ loading: true, ok: "", err: "" });

      const optimistic = {
        id: `tmp-${Date.now()}`,
        name: form.name.trim(),
        role: form.role.trim() || null,
        company: form.company.trim() || null,
        rating: Number(form.rating || 5),
        message: form.message.trim(),
        created_at: new Date().toISOString(),
        __optimistic: true,
      };

      // optimistic card (instant UI)
      setItems((prev) => [optimistic, ...(Array.isArray(prev) ? prev : [])].slice(0, limit));

      try {
        const payload = {
          name: optimistic.name,
          role: optimistic.role,
          company: optimistic.company,
          rating: optimistic.rating,
          message: optimistic.message,
        };

        const { data, error } = await supabase.from("testimonials").insert([payload]).select().single();
        if (error) throw error;

        // replace optimistic with real row
        setItems((prev) => {
          const arr = Array.isArray(prev) ? prev : [];
          const next = arr.map((x) => (x.id === optimistic.id ? data : x));
          next.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          return next.slice(0, limit);
        });

        setSubmitState({ loading: false, ok: "Thanks! Your review is now live.", err: "" });
        setForm({ name: "", role: "", company: "", rating: 5, message: "" });
      } catch (err) {
        // rollback optimistic
        setItems((prev) => (Array.isArray(prev) ? prev.filter((x) => x.id !== optimistic.id) : []));
        setSubmitState({ loading: false, ok: "", err: err?.message || "Failed to submit review." });
      }
    },
    [canSubmit, form.name, form.role, form.company, form.rating, form.message, limit]
  );

  const clearForm = useCallback(() => {
    setSubmitState({ loading: false, ok: "", err: "" });
    setForm({ name: "", role: "", company: "", rating: 5, message: "" });
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full bg-[#ff5a12]">
      {/* background grid */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.24]
        [background-image:linear-gradient(to_right,rgba(255,255,255,0.55)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.55)_1px,transparent_1px)]
        [background-size:220px_220px]"
      />

      <div className="relative mx-auto w-full max-w-[1600px] px-3 py-10 md:px-6">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[#ff5a12]" />

          <div className="relative z-10 grid grid-cols-12 gap-0 border border-white/35 bg-transparent">
            {/* Title */}
            <Tile className="col-span-12 md:col-span-7 min-h-[170px]">
              <div className="relative h-full p-6 md:p-10">
                <span className="absolute left-6 top-6 h-3 w-3 bg-white/95" />
                <h2 data-animate="text" className="text-[40px] font-black tracking-[0.14em] text-white md:text-[72px]">
                  {title}
                </h2>
              </div>
            </Tile>

            {/* Subtitle + Refresh */}
            <Tile className="col-span-12 md:col-span-5 min-h-[170px]">
              <div className="flex h-full flex-col justify-between gap-6 p-6 md:p-10">
                <p data-animate="text" className="font-mono text-[15px] leading-relaxed text-white/90">
                  {subtitle}
                </p>

                <div className="flex items-center gap-3">
                  <button
                    data-animate="text"
                    onClick={fetchTestimonials}
                    className=" border border-white/40 bg-white/16 px-4 py-3 text-[12px] font-black tracking-widest text-white/90 hover:bg-white/25 active:translate-y-[1px]"
                  >
                    REFRESH
                  </button>

                  <div className="ml-auto hidden items-center gap-2 md:flex">
                    <span className="h-3 w-3 bg-[#d9d9d9]" />
                    <span data-animate="text" className="text-[12px] font-black tracking-[0.22em] text-white/90">
                      {fetchState.loading ? "LOADING" : `${items.length} REVIEWS`}
                    </span>
                  </div>
                </div>
              </div>
            </Tile>

            {/* Cards */}
            <div className="col-span-12">
              <div className="grid grid-cols-12 gap-0">
                {fetchState.loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <Tile key={i} className="col-span-12 sm:col-span-6 lg:col-span-4 min-h-[360px]">
                      <div className="h-full bg-white p-5">
                        <div className="h-4 w-32 bg-black/10" />
                        <div className="mt-4 h-3 w-44 bg-black/10" />
                        <div className="mt-6 space-y-2">
                          <div className="h-3 w-full bg-black/10" />
                          <div className="h-3 w-[92%] bg-black/10" />
                          <div className="h-3 w-[80%] bg-black/10" />
                        </div>
                      </div>
                    </Tile>
                  ))
                ) : fetchState.error ? (
                  <Tile className="col-span-12 min-h-[240px]">
                    <div className="grid h-full place-items-center p-10 text-center">
                      <div>
                        <div data-animate="text" className="text-[16px] font-black text-white">
                          Couldn’t load reviews.
                        </div>
                        <div data-animate="text" className="mt-2 text-[13px] text-white/85">
                          {fetchState.error}
                        </div>
                      </div>
                    </div>
                  </Tile>
                ) : items.length === 0 ? (
                  <Tile className="col-span-12 min-h-[240px]">
                    <div className="grid h-full place-items-center p-10 text-center">
                      <div>
                        <div data-animate="text" className="text-[16px] font-black text-white">
                          No reviews yet.
                        </div>
                        <div data-animate="text" className="mt-2 text-[13px] text-white/80">
                          Submit one below — it will show instantly.
                        </div>
                      </div>
                    </div>
                  </Tile>
                ) : (
                  items.map((t) => (
                    <Tile key={t.id} className="col-span-12 sm:col-span-6 lg:col-span-4 min-h-[360px]">
                      <article className="flex h-full flex-col bg-white">
                        <div className="border-b border-[#ff5a12]/15 bg-white px-5 py-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div data-animate="text" className="text-[16px] font-black tracking-wide text-[#ff5a12]">
                                {t.name}
                              </div>
                              <div data-animate="text" className="mt-1 text-[12px] font-semibold text-black/55">
                                {(t.role || "User")}
                                {t.company ? ` • ${t.company}` : ""}
                                {t.__optimistic ? <span className="ml-2 text-[#ff5a12]/70">• posting…</span> : null}
                              </div>
                            </div>
                            <Stars value={t.rating} />
                          </div>
                        </div>

                        <div className="flex-1 p-5">
                          <div className=" bg-white p-4 shadow-[0_18px_40px_rgba(255,90,18,0.18)]">
                            <p data-animate="text" className="text-[13px] leading-relaxed text-black/75">
                              “{t.message}”
                            </p>
                          </div>
                        </div>

                        <div className="mt-auto border-t border-[#ff5a12]/15 bg-white px-5 py-4">
                          <div className="text-[11px] font-black tracking-[0.22em] text-black/45">
                            {t.created_at ? new Date(t.created_at).toLocaleDateString() : ""}
                          </div>
                        </div>
                      </article>
                    </Tile>
                  ))
                )}
              </div>
            </div>

            {/* Form */}
            <Tile className="col-span-12">
              <div className="p-6 md:p-8">
                <div>
                  <div data-animate="text" className="text-[12px] font-black tracking-[0.24em] text-white/90">
                    ADD A REVIEW
                  </div>
                  <div data-animate="text" className="mt-2 text-[18px] font-black text-white">
                    Share your feedback (shows instantly)
                  </div>
                </div>

                <form onSubmit={submit} className="mt-6 grid gap-4 md:grid-cols-2">
                  <Field label="Full Name">
                    <input
                      className="w-full  border border-white/40 bg-white/16 px-4 py-3 text-[13px] font-semibold text-[#c24c11] outline-none placeholder:text-[#6b5e57]"
                      placeholder="Your name"
                      value={form.name}
                      onChange={update("name")}
                      required
                    />
                  </Field>

                  <Field label="Rating">
                    <select
                      className="w-full  border border-white/40 bg-white/16 px-4 py-3 text-[13px] font-semibold text-[#c24c11] outline-none"
                      value={form.rating}
                      onChange={update("rating")}
                    >
                      <option value={5}>★★★★★ (5)</option>
                      <option value={4}>★★★★☆ (4)</option>
                      <option value={3}>★★★☆☆ (3)</option>
                      <option value={2}>★★☆☆☆ (2)</option>
                      <option value={1}>★☆☆☆☆ (1)</option>
                    </select>
                  </Field>

                  <Field label="Role (optional)">
                    <input
                      className="w-full  border border-white/40 bg-white/16 px-4 py-3 text-[13px] font-semibold text-[#c24c11] outline-none placeholder:text-[#6b5e57]"
                      placeholder="Founder / Engineer / Student…"
                      value={form.role}
                      onChange={update("role")}
                    />
                  </Field>

                  <Field label="Company (optional)">
                    <input
                      className="w-full border border-white/40 bg-white/16 px-4 py-3 text-[13px] font-semibold text-[#c24c11] outline-none placeholder:text-[#6b5e57]"
                      placeholder="Company name"
                      value={form.company}
                      onChange={update("company")}
                    />
                  </Field>

                  <div className="md:col-span-2">
                    <Field label="Message">
                      <textarea
                        className="w-full min-h-[140px] resize-none  border border-white/40 bg-white/16 px-4 py-3 text-[13px] font-semibold text-[#c24c11]outline-none placeholder:text-[#6b5e57]"
                        placeholder="What did you like? What improved your workflow?"
                        value={form.message}
                        onChange={update("message")}
                        required
                      />
                    </Field>
                  </div>

                  {(submitState.ok || submitState.err) ? (
                    <div className="md:col-span-2 border border-white/35 bg-white/10 px-4 py-3 text-[12px] font-semibold text-white/90">
                      {submitState.ok || submitState.err}
                    </div>
                  ) : null}

                  <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={clearForm}
                      className="border border-white/50 bg-white/12 px-6 py-3 text-[12px] font-black tracking-widest text-white hover:bg-white/22 active:translate-y-[1px]"
                    >
                      CLEAR
                    </button>

                    <button
                      type="submit"
                      disabled={!canSubmit}
                      className="bg-white px-6 py-3 text-[12px] font-black tracking-widest text-[#ff5a12] shadow-[0_18px_34px_rgba(255,255,255,0.18)] hover:brightness-[1.02] disabled:opacity-60 disabled:cursor-not-allowed active:translate-y-[1px]"
                    >
                      {submitState.loading ? "SUBMITTING..." : "SUBMIT"}
                    </button>
                  </div>
                </form>
              </div>
            </Tile>
          </div>
        </div>
      </div>
    </section>
  );
}

