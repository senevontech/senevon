import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { SERVICE_ITEMS } from "../../data/servicesCatalog";

export default function ServicesModal({ open, onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return undefined;

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const goToService = (slug) => {
    onClose?.();
    navigate(`/services/${slug}`);
  };

  return createPortal(
    <div className="fixed inset-0 z-[1200]">
      <button
        type="button"
        aria-label="Close services modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/45"
      />

      <div className="relative z-[1201] mx-auto flex min-h-full w-full max-w-[1200px] items-center justify-center p-4 sm:p-6">
        <div className="relative w-full border border-black/25 bg-[#d9d9d9] shadow-[0_30px_90px_rgba(0,0,0,0.22)]">
          <span className="pointer-events-none absolute -left-2 -top-2 h-5 w-5 border-l-2 border-t-2 border-black/80" />
          <span className="pointer-events-none absolute -right-2 -top-2 h-5 w-5 border-r-2 border-t-2 border-black/80" />
          <span className="pointer-events-none absolute -left-2 -bottom-2 h-5 w-5 border-l-2 border-b-2 border-black/80" />
          <span className="pointer-events-none absolute -right-2 -bottom-2 h-5 w-5 border-r-2 border-b-2 border-black/80" />

          <div className="flex items-center justify-between border-b border-black/20 px-4 py-4 sm:px-6">
            <div>
              <p className="text-[11px] font-black tracking-[0.22em] text-black/60">SERVICES</p>
              <h2 className="text-[24px] font-black tracking-[0.05em] text-black sm:text-[30px]">Choose A Service</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid h-10 w-10 place-items-center border border-black/20 bg-white/50 text-black/80 hover:bg-white"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="grid gap-3 p-4 sm:grid-cols-3 sm:p-6">
            {SERVICE_ITEMS.map((service) => (
              <button
                key={service.slug}
                type="button"
                onClick={() => goToService(service.slug)}
                className="group relative border border-[#e04e0a] bg-[#ff5a12] p-4 text-left transition hover:bg-[#e04e0a]"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <h3 className="text-[18px] font-black text-white">{service.title}</h3>
                  <span className="h-3 w-3 bg-white/70" />
                </div>
                <p className="text-[13px] font-semibold leading-relaxed text-white/80">{service.summary}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-[11px] font-black tracking-[0.2em] text-white/90">
                  OPEN PAGE <span className="transition group-hover:translate-x-0.5">→</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
