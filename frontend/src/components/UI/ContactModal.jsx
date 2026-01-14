// import React, { useEffect, useRef } from "react";
// import { createPortal } from "react-dom";


// export default function ContactModal({ open, onClose }) {
//   const panelRef = useRef(null);

//   // ESC close + scroll lock
//   useEffect(() => {
//     if (!open) return;

//     const onKey = (e) => {
//       if (e.key === "Escape") onClose?.();
//     };

//     window.addEventListener("keydown", onKey);
//     const prev = document.documentElement.style.overflow;
//     document.documentElement.style.overflow = "hidden";

//     // focus the modal
//     setTimeout(() => panelRef.current?.focus(), 0);

//     return () => {
//       window.removeEventListener("keydown", onKey);
//       document.documentElement.style.overflow = prev;
//     };
//   }, [open, onClose]);

//   if (!open) return null;

//   return createPortal(
//     <div className="fixed inset-0 z-[999]">
//       {/* Backdrop */}
//       <button
//         aria-label="Close contact modal"
//         onClick={onClose}
//         className="absolute inset-0 bg-black/40"
//       />

//       {/* Modal wrapper */}
//       <div className="relative z-[1000] flex min-h-full items-center justify-center p-4 sm:p-6">
//         <div
//           ref={panelRef}
//           tabIndex={-1}
//           role="dialog"
//           aria-modal="true"
//           aria-labelledby="contact-title"
//           className="
//             relative w-full max-w-[680px]
//             bg-[#ff5a12]
//             shadow-[0_30px_90px_rgba(0,0,0,0.25)]
//             outline-none
//           "
//         >
//           {/* Corner Brackets (like your reference) */}
//           <span className="pointer-events-none absolute -left-3 -top-3 h-6 w-6 border-l-2 border-t-2 border-black/80" />
//           <span className="pointer-events-none absolute -right-3 -top-3 h-6 w-6 border-r-2 border-t-2 border-black/80" />
//           <span className="pointer-events-none absolute -left-3 -bottom-3 h-6 w-6 border-l-2 border-b-2 border-black/80" />
//           <span className="pointer-events-none absolute -right-3 -bottom-3 h-6 w-6 border-r-2 border-b-2 border-black/80" />

//           {/* Inner layout */}
//           <div className="p-5 sm:p-8">
//             {/* Header */}
//             <div className="mb-5 flex items-start justify-between gap-4">
//               <h2
//                 id="contact-title"
//                 className="text-xl sm:text-2xl font-black tracking-wide text-white"
//               >
//                 Contact Us
//               </h2>

//               <button
//                 onClick={onClose}
//                 aria-label="Close"
//                 className="
//                   grid h-9 w-9 place-items-center
//                   bg-white/20 text-white
//                   hover:bg-white/30 transition
//                 "
//               >
//                 ✕
//               </button>
//             </div>

//             {/* Form */}
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 // hook your API here
//                 onClose?.();
//               }}
//               className="grid gap-4"
//             >
//               <Field label="Full Name" name="name" type="text" />
//               <Field label="Email Address" name="email" type="email" />
//               <Field label="Phone Number" name="phone" type="tel" />
//               <Field label="Message" name="message" type="text" />

//               {/* Send button (same bracket style) */}
//               <div className="pt-2">
//                 <button
//                   type="submit"
//                   className="
//                     relative inline-flex items-center justify-center bg-white px-8 py-2.5
//                     text-[12px] font-black tracking-widest text-[#ff5a12]
//                     shadow-[0_14px_24px_rgba(0,0,0,0.12)]
//                     transition-all duration-300 ease-out
//                     hover:brightness-[1.02]
//                     active:translate-y-[1px]
//                     overflow-hidden

//                     before:absolute before:top-1.5 before:left-1.5
//                     before:h-3 before:w-3 before:border-l-2 before:border-t-2
//                     before:border-black before:content-['']
//                     before:transition-all before:duration-300

//                     after:absolute after:bottom-1.5 after:right-1.5
//                     after:h-3 after:w-3 after:border-r-2 after:border-b-2
//                     after:border-black after:content-['']
//                     after:transition-all after:duration-300

//                     hover:before:-translate-x-0.5 hover:before:-translate-y-0.5
//                     hover:after:translate-x-0.5 hover:after:translate-y-0.5
//                   "
//                 >
//                   Send
//                 </button>
//               </div>
//             </form>
//           </div>

//           {/* Subtle inner border */}
//           <div className="pointer-events-none absolute inset-0 ring-1 ring-black/15" />
//         </div>
//       </div>
//     </div>,
//     document.body
//   );
// }

// function Field({ label, name, type = "text" }) {
//   const isMessage = name === "message";

//   return (
//     <label className="grid gap-1.5">
//       <span className="text-[12px] font-semibold tracking-wide text-white/95">
//         {label}
//       </span>

//       {isMessage ? (
//         <textarea
//           name={name}
//           rows={3}
//           className="
//             w-full 
//             bg-white/95
//             px-3 py-2
//             text-[13px] text-black/85
//             outline-none
//             ring-1 ring-black/20
//             focus:ring-2 focus:ring-black/40
//             resize-none
//           "
//           placeholder=""
//         />
//       ) : (
//         <input
//           name={name}
//           type={type}
//           className="
//             w-full
//             bg-white/95
//             px-3 py-2
//             text-[13px] text-black/85
//             outline-none
//             ring-1 ring-black/20
//             focus:ring-2 focus:ring-black/40
//           "
//           placeholder=""
//         />
//       )}
//     </label>
//   );
// }















































import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || ""; 
// Example: https://your-backend.onrender.com
// If proxy/local, can be empty and you call "/api/contact"

export default function ContactModal({ open, onClose }) {
  const panelRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" }); // type: success|error

  // ESC close + scroll lock
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    setTimeout(() => panelRef.current?.focus(), 0);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev;
    };
  }, [open, onClose]);

  // reset when opening
  useEffect(() => {
    if (!open) return;
    setStatus({ type: "", message: "" });
  }, [open]);

  const update = (key) => (e) => {
    setForm((s) => ({ ...s, [key]: e.target.value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setStatus({ type: "", message: "" });
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          source: window.location.pathname, // optional
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Failed to send message.");
      }

      setStatus({ type: "success", message: data.message || "Message sent!" });
      setForm({ name: "", email: "", phone: "", message: "" });

      // optional: auto-close after success
      // setTimeout(() => onClose?.(), 800);
    } catch (err) {
      setStatus({
        type: "error",
        message: err?.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999]">
      {/* Backdrop */}
      <button
        aria-label="Close contact modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      {/* Modal wrapper */}
      <div className="relative z-[1000] flex min-h-full items-center justify-center p-4 sm:p-6">
        <div
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-title"
          className="
            relative w-full max-w-[680px]
            bg-[#ff5a12]
            shadow-[0_30px_90px_rgba(0,0,0,0.25)]
            outline-none
          "
        >
          {/* Corner Brackets */}
          <span className="pointer-events-none absolute -left-3 -top-3 h-6 w-6 border-l-2 border-t-2 border-black/80" />
          <span className="pointer-events-none absolute -right-3 -top-3 h-6 w-6 border-r-2 border-t-2 border-black/80" />
          <span className="pointer-events-none absolute -left-3 -bottom-3 h-6 w-6 border-l-2 border-b-2 border-black/80" />
          <span className="pointer-events-none absolute -right-3 -bottom-3 h-6 w-6 border-r-2 border-b-2 border-black/80" />

          <div className="p-5 sm:p-8">
            {/* Header */}
            <div className="mb-5 flex items-start justify-between gap-4">
              <h2
                id="contact-title"
                className="text-xl sm:text-2xl font-black tracking-wide text-white"
              >
                Contact Us
              </h2>

              <button
                onClick={onClose}
                aria-label="Close"
                className="
                  grid h-9 w-9 place-items-center
                  bg-white/20 text-white
                  hover:bg-white/30 transition
                "
              >
                ✕
              </button>
            </div>

            {/* Status */}
            {status.message ? (
              <div
                className={[
                  "mb-4 border px-3 py-2 text-[12px] font-semibold tracking-wide",
                  status.type === "success"
                    ? "border-black/25 bg-white/20 text-white"
                    : "border-black/25 bg-black/10 text-white",
                ].join(" ")}
              >
                {status.message}
              </div>
            ) : null}

            {/* Form */}
            <form onSubmit={submit} className="grid gap-4">
              <Field label="Full Name" name="name" type="text" value={form.name} onChange={update("name")} />
              <Field label="Email Address" name="email" type="email" value={form.email} onChange={update("email")} />
              <Field label="Phone Number" name="phone" type="tel" value={form.phone} onChange={update("phone")} />
              <Field label="Message" name="message" type="text" value={form.message} onChange={update("message")} />

              {/* Send button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="
                    relative inline-flex items-center justify-center bg-white px-8 py-2.5
                    text-[12px] font-black tracking-widest text-[#ff5a12]
                    shadow-[0_14px_24px_rgba(0,0,0,0.12)]
                    transition-all duration-300 ease-out
                    hover:brightness-[1.02]
                    active:translate-y-[1px]
                    overflow-hidden
                    disabled:opacity-60 disabled:cursor-not-allowed

                    before:absolute before:top-1.5 before:left-1.5
                    before:h-3 before:w-3 before:border-l-2 before:border-t-2
                    before:border-black before:content-['']
                    before:transition-all before:duration-300

                    after:absolute after:bottom-1.5 after:right-1.5
                    after:h-3 after:w-3 after:border-r-2 after:border-b-2
                    after:border-black after:content-['']
                    after:transition-all after:duration-300

                    hover:before:-translate-x-0.5 hover:before:-translate-y-0.5
                    hover:after:translate-x-0.5 hover:after:translate-y-0.5
                  "
                >
                  {loading ? "SENDING..." : "SEND"}
                </button>
              </div>
            </form>
          </div>

          <div className="pointer-events-none absolute inset-0 ring-1 ring-black/15" />
        </div>
      </div>
    </div>,
    document.body
  );
}

function Field({ label, name, type = "text", value, onChange }) {
  const isMessage = name === "message";

  return (
    <label className="grid gap-1.5">
      <span className="text-[12px] font-semibold tracking-wide text-white/95">
        {label}
      </span>

      {isMessage ? (
        <textarea
          name={name}
          rows={3}
          value={value}
          onChange={onChange}
          className="
            w-full bg-white/95 px-3 py-2
            text-[13px] text-black/85
            outline-none ring-1 ring-black/20
            focus:ring-2 focus:ring-black/40
            resize-none
          "
        />
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          className="
            w-full bg-white/95 px-3 py-2
            text-[13px] text-black/85
            outline-none ring-1 ring-black/20
            focus:ring-2 focus:ring-black/40
          "
        />
      )}
    </label>
  );
}
