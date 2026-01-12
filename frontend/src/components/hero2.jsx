import React, { useEffect, useMemo, useRef, useState } from "react";

export default function ChainLabsHero() {
  const wrapRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: -6, ry: 10, tx: 0, ty: 0 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width; // 0..1
      const py = (e.clientY - r.top) / r.height; // 0..1

      // nice cinematic tilt
      const ry = (px - 0.5) * 22;
      const rx = (0.5 - py) * 14;

      // subtle translate for depth
      const tx = (px - 0.5) * 18;
      const ty = (py - 0.5) * 12;

      setTilt({ rx, ry, tx, ty });
    };

    const onLeave = () => {
      setTilt({ rx: -6, ry: 10, tx: 0, ty: 0 });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const transform = useMemo(() => {
    return `perspective(1400px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translate3d(${tilt.tx}px, ${tilt.ty}px, 0)`;
  }, [tilt]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#efeee9]">
      {/* ---------- background: studio + industrial orange set ---------- */}
      <div className="absolute inset-0">
        {/* soft studio vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_55%_30%,rgba(255,255,255,0.92),rgba(239,238,233,0.85)_55%,rgba(225,223,216,0.9))]" />

        {/* left orange rack (holes) */}
        <div className="absolute left-0 top-0 h-full w-[210px] bg-[#ff5a12] shadow-[20px_0_50px_rgba(0,0,0,0.18)]">
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, rgba(0,0,0,0.38) 0 2px, transparent 2px 26px), radial-gradient(circle at 44px 44px, rgba(0,0,0,0.35) 0 6px, transparent 6px 28px)",
              backgroundSize: "100% 28px, 88px 88px",
            }}
          />
        </div>

        {/* bottom orange grate */}
        <div className="absolute bottom-0 left-0 right-0 h-[210px]">
          <div className="absolute inset-0 bg-[#ff5a12]" />
          <div
            className="absolute inset-0 opacity-[0.55]"
            style={{
              backgroundImage:
                "repeating-linear-gradient( to right, rgba(0,0,0,0.55) 0 2px, transparent 2px 10px )",
            }}
          />
          <div className="absolute inset-0 shadow-[0_-40px_80px_rgba(0,0,0,0.35)_inset]" />
        </div>

        {/* right black slatted shelf */}
        <div className="absolute right-0 top-[140px] h-[380px] w-[520px] rotate-[-6deg]">
          <div className="absolute inset-0 bg-[#0b0b0f] shadow-2xl" />
          <div
            className="absolute inset-0 opacity-[0.55]"
            style={{
              backgroundImage:
                "repeating-linear-gradient( to right, rgba(255,255,255,0.22) 0 2px, transparent 2px 12px )",
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent,rgba(255,90,18,0.15))]" />
        </div>

        {/* orange diagonal beam on right */}
        <div className="absolute right-[120px] top-[210px] h-[320px] w-[420px] rotate-[-18deg] bg-[#ff5a12] shadow-[0_40px_70px_rgba(0,0,0,0.35)] opacity-[0.95]" />
      </div>

      {/* ---------- hero content ---------- */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1400px] items-center justify-center px-6">
        <div
          ref={wrapRef}
          className="relative w-[min(1100px,92vw)]"
          style={{ transform, transition: "transform 140ms ease-out" }}
        >
          {/* floating board */}
          <div className="relative overflow-hidden rounded-[34px] bg-[#f7f6f2] shadow-[0_40px_120px_rgba(0,0,0,0.35)] ring-1 ring-black/10">
            {/* subtle inner border */}
            <div className="pointer-events-none absolute inset-0 rounded-[34px] ring-1 ring-black/10" />

            {/* grid lines */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.35]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(0,0,0,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.22) 1px, transparent 1px)",
                backgroundSize: "25% 50%",
              }}
            />

            {/* corner markers */}
            <CornerMarker x="6%" y="18%" />
            <CornerMarker x="6%" y="82%" />
            <CornerMarker x="94%" y="18%" />
            <CornerMarker x="94%" y="82%" />

            {/* top nav strip */}
            <div className="flex items-center justify-between px-8 py-6">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#ff5a12] shadow-[0_10px_20px_rgba(255,90,18,0.35)]">
                  <span className="text-[15px] font-black text-white">⌁</span>
                </div>
                <div className="leading-none">
                  <div className="text-[12px] font-semibold tracking-wide text-black/70">
                    ChainGPT
                  </div>
                  <div className="text-[18px] font-black tracking-[0.08em] text-black">
                    LABS
                  </div>
                </div>
              </div>

              <div className="hidden items-center gap-8 text-[13px] font-medium text-black/60 md:flex">
                <span className="hover:text-black/80">Portfolio</span>
                <span className="hover:text-black/80">Blog</span>
                <span className="flex items-center gap-2 hover:text-black/80">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#ff5a12]" />
                  Our Ecosystem
                </span>
              </div>

              <button className="rounded-xl bg-[#ff5a12] px-4 py-2 text-[12px] font-bold tracking-wide text-white shadow-[0_12px_25px_rgba(255,90,18,0.35)] hover:brightness-[1.03] active:translate-y-[1px]">
                APPLY NOW
              </button>
            </div>

            {/* main grid content */}
            <div className="grid grid-cols-12 gap-0 px-8 pb-8">
              {/* left big icon panel */}
              <div className="col-span-12 md:col-span-4">
                <div className="relative h-[260px] md:h-[300px]">
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="grid h-[150px] w-[150px] place-items-center rounded-[28px] bg-white shadow-[0_25px_60px_rgba(0,0,0,0.10)] ring-1 ring-black/10">
                      <div className="grid h-[96px] w-[96px] place-items-center rounded-[26px] bg-[#ff5a12]">
                        <PixelSmile />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* right message panel */}
              <div className="col-span-12 md:col-span-8">
                <div className="relative h-[260px] md:h-[300px] px-2 pt-4 md:pt-10">
                  <div className="text-[34px] font-black tracking-[0.08em] text-black md:text-[44px]">
                    THANK YOU
                  </div>
                  <p className="mt-3 max-w-[520px] text-[13px] leading-relaxed text-black/60">
                    We’ll get back to you as soon as possible. Meanwhile, do you
                    know of a product or startup that could benefit from being
                    incubated by ChainGPT Labs? Please share this form with them!
                  </p>

                  <button className="mt-8 rounded-full border border-[#ff5a12] bg-white px-8 py-3 text-[12px] font-bold tracking-widest text-black shadow-[0_18px_45px_rgba(0,0,0,0.10)] hover:bg-[#ff5a12] hover:text-white">
                    BACK TO HOMEPAGE
                  </button>
                </div>
              </div>

              {/* bottom giant letters */}
              <div className="col-span-12 mt-2 grid grid-cols-4 gap-0 pb-2">
                {["L", "A", "B", "S"].map((ch, i) => (
                  <div
                    key={ch}
                    className="relative flex h-[210px] items-end justify-center md:h-[240px]"
                  >
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-black/15" />
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-black/15" />
                    {i === 3 ? null : (
                      <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-black/15" />
                    )}

                    <div className="select-none pb-6 text-[140px] font-black leading-none text-black drop-shadow-[0_24px_30px_rgba(0,0,0,0.25)] md:text-[160px]">
                      {ch}
                    </div>

                    {/* tiny orange squares like the reference */}
                    <div className="absolute left-4 top-4 h-3 w-3 bg-[#ff5a12]" />
                    <div className="absolute left-4 bottom-4 h-3 w-3 bg-[#ff5a12]" />
                    <div className="absolute right-4 top-4 h-3 w-3 bg-[#ff5a12]" />
                    <div className="absolute right-4 bottom-4 h-3 w-3 bg-[#ff5a12]" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* extra depth shadow under board */}
          <div className="pointer-events-none absolute -inset-x-10 -bottom-10 h-24 blur-2xl opacity-60 [background:radial-gradient(60%_100%_at_50%_50%,rgba(0,0,0,0.45),transparent_70%)]" />
        </div>
      </div>

      {/* tiny cinematic motion */}
      <style>{`
        @keyframes floaty {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        section > div.relative.z-10 > div > div { animation: floaty 6s ease-in-out infinite; }
      `}</style>
    </section>
  );
}

/* ------------------ helpers ------------------ */

function CornerMarker({ x, y }) {
  return (
    <div
      className="pointer-events-none absolute h-3 w-3 bg-[#ff5a12]"
      style={{ left: x, top: y, transform: "translate(-50%,-50%)" }}
    />
  );
}

function PixelSmile() {
  return (
    <svg width="62" height="62" viewBox="0 0 62 62" fill="none">
      <rect x="10" y="10" width="8" height="8" fill="white" opacity="0.95" />
      <rect x="44" y="10" width="8" height="8" fill="white" opacity="0.95" />
      <rect x="14" y="34" width="34" height="8" rx="4" fill="white" opacity="0.95" />
      <rect x="18" y="26" width="6" height="6" fill="white" opacity="0.95" />
      <rect x="38" y="26" width="6" height="6" fill="white" opacity="0.95" />
    </svg>
  );
}
