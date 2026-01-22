import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { createClient } from "@supabase/supabase-js";
import { FaTimes } from "react-icons/fa";

const cn = (...a) => a.filter(Boolean).join(" ");

/* ----------------------------- Supabase Client ----------------------------- */
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL || "", SUPABASE_ANON_KEY || "");

/* ----------------------------- Helpers ----------------------------- */
function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => (document.documentElement.style.overflow = prev);
  }, [locked]);
}

function useEscape(onEscape, enabled) {
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e) => e.key === "Escape" && onEscape?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onEscape, enabled]);
}

function usePortalTarget() {
  return useMemo(() => {
    if (typeof document === "undefined") return null;
    const el = document.getElementById("modal-root");
    if (el) return el;
    const created = document.createElement("div");
    created.id = "modal-root";
    document.body.appendChild(created);
    return created;
  }, []);
}

/* ----------------------------- UI Bits ----------------------------- */
const Label = ({ children }) => (
  <label className="block text-[12px] font-black tracking-widest text-white/95 uppercase">
    {children}
  </label>
);

const inputBase = cn(
  "w-full h-10 px-3 text-[13px] font-semibold tracking-wide outline-none",
  "bg-white/95 text-slate-900 placeholder:text-slate-400",
  "border border-white/80 focus:border-white focus:ring-2 focus:ring-white/30"
);

const textAreaBase = cn(
  "w-full px-3 py-2 text-[13px] font-semibold tracking-wide outline-none",
  "bg-white/95 text-slate-900 placeholder:text-slate-400",
  "border border-white/80 focus:border-white focus:ring-2 focus:ring-white/30",
  "resize-none"
);

function CornerSendButton({ children, disabled, ...props }) {
  return (
    <button
      disabled={disabled}
      {...props}
      className={cn(
        "relative inline-flex items-center justify-center",
        "h-11 px-10",
        "bg-white text-orange-600",
        "text-[12px] font-black tracking-[0.25em] uppercase",
        "border border-white/70",
        "active:translate-y-[1px] disabled:opacity-70 disabled:cursor-not-allowed",
        props.className
      )}
    >
      {/* corner brackets */}
      <span className="pointer-events-none absolute left-2 top-2 h-3 w-3 border-l-2 border-t-2 border-black/90" />
      <span className="pointer-events-none absolute right-2 top-2 h-3 w-3 border-r-2 border-t-2 border-black/90" />
      <span className="pointer-events-none absolute left-2 bottom-2 h-3 w-3 border-l-2 border-b-2 border-black/90" />
      <span className="pointer-events-none absolute right-2 bottom-2 h-3 w-3 border-r-2 border-b-2 border-black/90" />
      {children}
    </button>
  );
}

/* ----------------------------- Modal Shell (Orange like screenshot) ----------------------------- */
function OrangeModal({ open, onClose, title = "Start a project", children }) {
  useLockBodyScroll(open);
  useEscape(onClose, open);

  const portalTarget = usePortalTarget();
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      const first = panelRef.current?.querySelector("input, textarea, button");
      first?.focus?.();
    }, 30);
    return () => clearTimeout(t);
  }, [open]);

  if (!open || !portalTarget) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      {/* backdrop */}
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 w-full h-full bg-black/35"
      />

      {/* container */}
      <div className="absolute inset-0 flex items-end sm:items-center justify-center p-0 sm:p-6">
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          className={cn(
            "w-full sm:w-[820px]",
            "rounded-none", 
            "bg-[#ff5a12]", 
            "shadow-2xl shadow-black/25",
            "border border-black/15",
            "max-h-[92vh] sm:max-h-[86vh] overflow-hidden"
          )}
        >
          {/* header */}
          <div className="flex items-center justify-between px-6 py-5">
            <h2 className="text-white text-[26px] sm:text-[30px] font-black tracking-tight">
              {title}
            </h2>

            <button
              type="button"
              onClick={onClose}
              className={cn(
                "grid place-items-center h-10 w-10",
                "bg-white/20 hover:bg-white/30",
                "border border-white/30",
                "text-white"
              )}
              aria-label="Close modal"
            >
              <FaTimes />
            </button>
          </div>

          {/* body */}
          <div className="px-6 pb-6 overflow-y-auto max-h-[calc(92vh-92px)] sm:max-h-[calc(86vh-92px)]">
            {children}
          </div>
        </div>
      </div>
    </div>,
    portalTarget
  );
}

/* ----------------------------- Main: Start Project (same orange contact style) ----------------------------- */
export default function StartProjectModalOrange() {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const errors = useMemo(() => {
    const e = {};
    const emailOk = /^\S+@\S+\.\S+$/.test((form.email || "").trim());
    const phoneOk = (form.phone || "").trim().length >= 10;

    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!emailOk) e.email = "Enter a valid email.";
    if (form.phone.trim() && !phoneOk) e.phone = "Enter a valid phone (10+ digits).";
    if (!form.message.trim()) e.message = "Message is required.";

    return e;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;
  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const markTouched = (k) => setTouched((p) => ({ ...p, [k]: true }));

  const reset = () => {
    setForm({ fullName: "", email: "", phone: "", message: "" });
    setTouched({});
    setSubmitting(false);
    setDone(false);
    setSubmitError("");
  };

  const close = () => {
    setOpen(false);
    setTimeout(reset, 200);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setTouched({ fullName: true, email: true, phone: true, message: true });

    if (!isValid) return;

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      setSubmitError("Supabase is not configured. Missing env variables.");
      return;
    }

    try {
      setSubmitting(true);

      // ✅ Insert into your table (NO bucket)
      // Change table/columns if needed
      const payload = {
        name: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        message: form.message.trim(),

        // optional: helpful metadata
        source: "start_project_modal",
        status: "new",
      };

      const { error } = await supabase.from("project_requests").insert(payload);
      if (error) throw error;

      setDone(true);
    } catch (err) {
      console.error(err);
      setSubmitError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      {/* Trigger button (keep your existing styling if you want) */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center gap-2",
          "border border-orange-500/70 bg-orange-500/10",
          "px-4 py-2.5 text-[12px] font-black tracking-widest uppercase",
          "text-orange-700",
          "hover:bg-orange-500/15 active:translate-y-[1px]"
        )}
      >
        Start Project <span>→</span>
      </button>

      <OrangeModal open={open} onClose={close} title="Start a project">
        {done ? (
          <div className="bg-white/15 border border-white/25 p-5">
            <div className="text-white text-[14px] font-black tracking-widest uppercase">
              Sent successfully
            </div>
            <p className="text-white/90 text-[13px] mt-2">
              Thanks! We received your message and will contact you soon.
            </p>

            <div className="mt-5">
              <CornerSendButton onClick={close}>Close</CornerSendButton>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-5">
            {submitError ? (
              <div className="bg-black/15 border border-white/25 px-4 py-3 text-[12px] font-semibold text-white">
                {submitError}
              </div>
            ) : null}

            {/* Full Name */}
            <div className="space-y-2">
              <Label>Full Name</Label>
              <input
                value={form.fullName}
                onChange={(e) => setField("fullName", e.target.value)}
                onBlur={() => markTouched("fullName")}
                placeholder=""
                className={inputBase}
              />
              {touched.fullName && errors.fullName ? (
                <div className="text-[12px] font-semibold text-white/95">{errors.fullName}</div>
              ) : null}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label>Email Address</Label>
              <input
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                onBlur={() => markTouched("email")}
                type="email"
                placeholder=""
                className={inputBase}
              />
              {touched.email && errors.email ? (
                <div className="text-[12px] font-semibold text-white/95">{errors.email}</div>
              ) : null}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <input
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                onBlur={() => markTouched("phone")}
                type="tel"
                placeholder=""
                className={inputBase}
              />
              {touched.phone && errors.phone ? (
                <div className="text-[12px] font-semibold text-white/95">{errors.phone}</div>
              ) : null}
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label>Message</Label>
              <textarea
                value={form.message}
                onChange={(e) => setField("message", e.target.value)}
                onBlur={() => markTouched("message")}
                rows={5}
                placeholder=""
                className={textAreaBase}
              />
              {touched.message && errors.message ? (
                <div className="text-[12px] font-semibold text-white/95">{errors.message}</div>
              ) : null}
            </div>

            {/* Send */}
            <div className="pt-2">
              <CornerSendButton type="submit" disabled={submitting}>
                {submitting ? "SENDING" : "SEND"}
              </CornerSendButton>
            </div>
          </form>
        )}
      </OrangeModal>
    </div>
  );
}
