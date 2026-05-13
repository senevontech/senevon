import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { supabase } from "../../lib/supabaseClient";

const BUDGET_OPTIONS = [
  "Under $500",
  "$500 - $2,000",
  "$2,000 - $5,000",
  "$5,000 - $10,000",
  "$10,000+",
];

const TIMELINE_OPTIONS = [
  "ASAP",
  "1-2 weeks",
  "2-4 weeks",
  "1-2 months",
  "Flexible",
];

export default function DesignRequestModal({ open, onClose, context }) {
  const panelRef = useRef(null);
  const honeypotRef = useRef("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    budget: BUDGET_OPTIONS[2],
    timeline: TIMELINE_OPTIONS[2],
    brief: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

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

  useEffect(() => {
    if (!open) return;
    setStatus({ type: "", message: "" });
  }, [open]);

  const update = (key) => (e) => setForm((s) => ({ ...s, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setStatus({ type: "", message: "" });
    setLoading(true);

    try {
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        throw new Error("Supabase env missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
      }

      if (honeypotRef.current && honeypotRef.current.trim().length > 0) {
        setStatus({ type: "success", message: "Request sent!" });
        return;
      }

      const serviceTitle = context?.serviceTitle || "Unknown service";
      const categoryTitle = context?.categoryTitle || "Unknown category";
      const workTitle = context?.workTitle || "General request";
      const workCaption = context?.workCaption || "";
      const detailLines = [
        "[Design This Request]",
        `Service: ${serviceTitle}`,
        `Category: ${categoryTitle}`,
        `Selected Work: ${workTitle}`,
        workCaption ? `Work Note: ${workCaption}` : "",
        `Company/Brand: ${form.company.trim() || "-"}`,
        `Budget: ${form.budget}`,
        `Timeline: ${form.timeline}`,
        "",
        "Brief:",
        form.brief.trim(),
      ].filter(Boolean);

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        message: detailLines.join("\n"),
        source: `design-request:${window.location.pathname}`,
        user_agent: navigator.userAgent,
      };

      const { error } = await supabase.from("contact_messages").insert([payload]);
      if (error) throw new Error(error.message || "Failed to send request.");

      setStatus({ type: "success", message: "Request sent!" });
      setForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        budget: BUDGET_OPTIONS[2],
        timeline: TIMELINE_OPTIONS[2],
        brief: "",
      });
    } catch (err) {
      setStatus({ type: "error", message: err?.message || "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999]">
      <button aria-label="Close design request modal" onClick={onClose} className="absolute inset-0 bg-black/45" />

      <div className="relative z-[1000] flex min-h-full items-center justify-center p-3 sm:p-6">
        <div
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="design-request-title"
          className="relative w-full max-w-[760px] border border-black/25 bg-[#ff5a12] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.25)] outline-none sm:p-6"
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 id="design-request-title" className="text-xl font-black tracking-wide text-white sm:text-2xl">
                Design This Request
              </h2>
              <p className="mt-1 text-[12px] font-semibold text-white/85">
                Service and category are auto-selected for admin.
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="grid h-9 w-9 place-items-center bg-white/20 text-white transition hover:bg-white/30"
            >
              ×
            </button>
          </div>

          <div className="mb-4 grid gap-2 sm:grid-cols-2">
            <ReadOnlyField label="Service" value={context?.serviceTitle || "-"} />
            <ReadOnlyField label="Category" value={context?.categoryTitle || "-"} />
            <ReadOnlyField label="Selected Work" value={context?.workTitle || "-"} className="sm:col-span-2" />
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

          <form onSubmit={submit} className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Full Name" type="text" value={form.name} onChange={update("name")} required />
              <Field label="Email Address" type="email" value={form.email} onChange={update("email")} required />
              <Field label="Phone Number" type="tel" value={form.phone} onChange={update("phone")} required />
              <Field label="Company / Brand" type="text" value={form.company} onChange={update("company")} />
              <SelectField label="Budget Range" value={form.budget} onChange={update("budget")} options={BUDGET_OPTIONS} />
              <SelectField label="Timeline" value={form.timeline} onChange={update("timeline")} options={TIMELINE_OPTIONS} />
            </div>

            <Field
              as="textarea"
              label="Project Brief"
              value={form.brief}
              onChange={update("brief")}
              placeholder="Tell us what you need (example: business card design with minimalist brand style)."
              required
            />

            <input
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
              value={honeypotRef.current}
              onChange={(e) => {
                honeypotRef.current = e.target.value;
              }}
            />

            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center bg-white px-7 py-2.5 text-[12px] font-black tracking-widest text-[#ff5a12] transition hover:brightness-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "SENDING..." : "SEND REQUEST"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}

function baseInputClasses() {
  return "w-full bg-white/95 px-3 py-2 text-[13px] text-black/85 outline-none ring-1 ring-black/20 focus:ring-2 focus:ring-black/40";
}

function Field({ label, as = "input", required = false, ...props }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[12px] font-semibold tracking-wide text-white/95">
        {label}
        {required ? " *" : ""}
      </span>
      {as === "textarea" ? (
        <textarea rows={4} className={`${baseInputClasses()} resize-none`} required={required} {...props} />
      ) : (
        <input className={baseInputClasses()} required={required} {...props} />
      )}
    </label>
  );
}

function SelectField({ label, options, ...props }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[12px] font-semibold tracking-wide text-white/95">{label}</span>
      <select className={baseInputClasses()} {...props}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function ReadOnlyField({ label, value, className = "" }) {
  return (
    <div className={`border border-black/20 bg-white/15 px-3 py-2 ${className}`}>
      <div className="text-[10px] font-black tracking-[0.2em] text-white/80">{label}</div>
      <div className="mt-1 text-[13px] font-black text-white">{value}</div>
    </div>
  );
}
