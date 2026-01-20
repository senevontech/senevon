
// supabase backend 
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { supabase } from "../../lib/supabaseClient"; // ✅ adjust path if needed

export default function ContactModal({ open, onClose }) {
  const panelRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // ✅ optional: lightweight anti-spam honeypot (doesn't change UI)
  const honeypotRef = useRef("");

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

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
      // ✅ basic guard
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        throw new Error("Supabase env missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
      }

      // ✅ silent anti-spam (if a bot fills hidden field)
      if (honeypotRef.current && honeypotRef.current.trim().length > 0) {
        // pretend success (don’t teach bots)
        setStatus({ type: "success", message: "Message sent!" });
        setForm({ name: "", email: "", phone: "", message: "" });
        return;
      }

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        message: form.message.trim(),
        source: window.location.pathname,
        user_agent: navigator.userAgent,
      };

      // ✅ Supabase insert
      const { error } = await supabase.from("contact_messages").insert([payload]);

      if (error) {
        throw new Error(error.message || "Failed to send message.");
      }

      setStatus({ type: "success", message: "Message sent!" });
      setForm({ name: "", email: "", phone: "", message: "" });
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
      <button
        aria-label="Close contact modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

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
                className="grid h-9 w-9 place-items-center bg-white/20 text-white hover:bg-white/30 transition"
              >
                ✕
              </button>
            </div>

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

            <form onSubmit={submit} className="grid gap-4">
              <Field label="Full Name" name="name" type="text" value={form.name} onChange={update("name")} />
              <Field label="Email Address" name="email" type="email" value={form.email} onChange={update("email")} />
              <Field label="Phone Number" name="phone" type="tel" value={form.phone} onChange={update("phone")} />
              <Field label="Message" name="message" value={form.message} onChange={update("message")} />

              {/* ✅ invisible honeypot (no UI change) */}
              <input
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "-9999px",
                  width: "1px",
                  height: "1px",
                  opacity: 0,
                }}
                value={honeypotRef.current}
                onChange={(e) => (honeypotRef.current = e.target.value)}
              />

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
                    after:h-3 after:w-3 before:rounded-none
                    after:border-r-2 after:border-b-2
                    after:border-black after:content-['']
                    after:transition-all after:duration-300

                    hover:before:-translate-x-0.5 hover:before:-translate-y-0.5
                    hover:after:translate-x-0.5 hover:after:translate-y-0.5
                  "
                >
                  {loading ? "SENDING..." : "SEND"}
                </button>
              </div>

              {/* same place as your API line (kept minimal) */}
              {/* <div className="text-[11px] font-semibold text-white/80">
                Storage: <span className="font-black">Supabase</span>
              </div> */}
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
