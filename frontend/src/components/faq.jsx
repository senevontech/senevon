import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Header from "../components/Header";

gsap.registerPlugin(ScrollTrigger);

/* ------------------- helpers: split into words (safe) ------------------- */
function splitWords(el) {
  if (!el) return [];
  if (!el.dataset.originalText) el.dataset.originalText = el.textContent || "";
  if (el.dataset.splitWords === "1") return el.querySelectorAll(".gsap-word");

  const text = el.dataset.originalText || "";
  const words = text.trim().split(/\s+/);

  el.dataset.splitWords = "1";
  el.innerHTML = words
    .map((w) => `<span class="gsap-word">${w}&nbsp;</span>`)
    .join("");
  return el.querySelectorAll(".gsap-word");
}

/* ------------------- FAQ DATA ------------------- */
const FAQS = [
  {
    q: "What is SENEVON?",
    a: "SENEVON is an IT startup providing end-to-end digital solutions, including custom software development, business platforms, and creative design services. We help businesses build, scale, and modernize their digital presence.",
  },
  {
    q: "What services does SENEVON offer?",
    a: `We offer a wide range of technology and design services, including:
• E-Commerce Development
• ERP (Enterprise Resource Planning) Solutions
• LMS (Learning Management Systems)
• Logo Design & Branding
• Graphic Design & Creative Services`,
  },
  {
    q: "Do you provide custom or ready-made solutions?",
    a: "We primarily focus on custom-built solutions tailored to your business requirements. However, for faster delivery, we can also adapt pre-built modules when suitable.",
  },
  {
    q: "Which industries do you work with?",
    a: `We work with clients across multiple industries, including:
• Retail & E-Commerce
• Education & Training
• Healthcare
• Startups & Enterprises
• Service-based businesses
Our solutions are industry-agnostic and scalable.`,
  },
  {
    q: "Can SENEVON build scalable enterprise-level systems?",
    a: "Yes. Our architecture is designed with scalability, performance, and security in mind. We build systems that support future growth, high traffic, and large datasets.",
  },
  {
    q: "Do you provide ERP and LMS as cloud-based solutions?",
    a: `Yes. Our ERP and LMS solutions can be deployed as:
• Cloud-based systems
• On-premise solutions
• Hybrid models
depending on your business needs.`,
  },
  {
    q: "Will I get post-deployment support and maintenance?",
    a: `Absolutely. We offer:
• Ongoing maintenance
• Performance monitoring
• Feature upgrades
• Bug fixes and security updates
Support plans can be customized based on your requirements.`,
  },
  {
    q: "How long does it take to complete a project?",
    a: `Project timelines depend on scope and complexity:
• Small projects: 2–4 weeks
• Medium projects: 1–3 months
• Large platforms (ERP/LMS/E-Commerce): 3–6+ months
We provide a clear timeline before starting.`,
  },
  {
    q: "Do you offer UI/UX and graphic design separately?",
    a: `Yes. You can hire us specifically for:
• Logo design & brand identity
• UI/UX design
• Marketing graphics
• Social media creatives
Design services are available as standalone or bundled packages.`,
  },
  {
    q: "How secure are your applications?",
    a: `Security is a top priority. We implement:
• Secure authentication & authorization
• Role-based access control
• Data encryption
• Best coding and security practices`,
  },
  {
    q: "Can SENEVON integrate third-party tools and APIs?",
    a: `Yes. We integrate:
• Payment gateways
• CRM tools
• Analytics platforms
• Logistics & notification services
• Custom third-party APIs`,
  },
  {
    q: "How can I get started with SENEVON?",
    a: `You can contact us through our website to:
• Share your requirements
• Get a free consultation
• Receive a proposal & timeline
• Start your project with a dedicated team`,
  },
];

/* ------------------- PAGE ------------------- */
export default function FaqsPage() {
  const scopeRef = useRef(null);
  const [openId, setOpenId] = useState(FAQS[0]?.q || "");

  const items = useMemo(() => FAQS, []);

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // Words
      const wordTargets = scope.querySelectorAll('[data-animate="words"]');
      wordTargets.forEach((el) => {
        const words = splitWords(el);
        if (!words?.length) return;

        gsap.set(words, { opacity: 0, y: 14, filter: "blur(8px)" });

        if (reduceMotion) {
          gsap.set(words, { opacity: 1, y: 0, filter: "blur(0px)" });
          return;
        }

        gsap.to(words, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.03,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            end: "top 55%",
            toggleActions: "play none none reverse",
          },
        });
      });

      // FAQ rows (batch)
      const rows = gsap.utils.toArray(scope.querySelectorAll("[data-faq-row]"));
      if (!rows.length) return;

      if (reduceMotion) {
        gsap.set(rows, { opacity: 1, y: 0 });
        return;
      }

      ScrollTrigger.batch(rows, {
        start: "top 88%",
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
              stagger: 0.06,
              overwrite: true,
            }
          );
        },
      });
    }, scopeRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={scopeRef} className="min-h-screen bg-[#ff5a12] text-black">
        <Header />
      {/* Orange grid background */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.22]
        [background-image:linear-gradient(to_right,rgba(0,0,0,0.22)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.22)_1px,transparent_1px)]
        [background-size:220px_220px]"
      />

      <main className="relative mx-auto w-full max-w-[1600px] px-3 py-4 sm:px-4 sm:py-6">
        <div className="grid grid-cols-12 gap-0 border border-black/30 bg-[#ff5a12]">
          {/* Left icon tile */}
          <Tile className="col-span-12 md:col-span-1 min-h-[70px] md:min-h-[84px]" variant="orange">
            <div className="flex h-full items-center justify-start px-4">
              <div className="grid h-10 w-10 place-items-center border border-black/30 bg-white/35">
                ✕
              </div>
            </div>
          </Tile>

          {/* Title tile */}
          <Tile className="col-span-12 md:col-span-11 min-h-[200px] sm:min-h-[240px] md:min-h-[320px]" variant="orange">
            <div className="relative h-full">
              <AccentDot className="left-6 top-6" />
              <AccentDot className="right-6 bottom-6" />

              <div className="flex h-full items-center justify-center px-5 sm:px-8">
                <h1
                  data-animate="words"
                  className="text-center font-black tracking-[0.18em] text-black text-[34px] sm:text-[54px] md:text-[96px] lg:text-[120px] font-[tron]"
                >
                  FAQ
                </h1>
              </div>

              <div className="absolute left-6 bottom-4 hidden items-center gap-6 md:flex">
                <span className="inline-flex items-center gap-2 text-[11px] font-black tracking-[0.22em] text-black/80">
                  <span className="h-2 w-2 bg-black" />
                  SENEVON
                </span>
                <span className="text-[11px] font-black tracking-[0.22em] text-black/70">
                  ANSWERS • CLARITY • DELIVERY
                </span>
              </div>
            </div>
          </Tile>

          {/* Intro tile */}
          <Tile className="col-span-12 md:col-span-4 min-h-[240px] md:min-h-[320px]" variant="orange">
            <div className="h-full p-5 sm:p-6">
              <div
                data-animate="words"
                className="text-[11px] font-black tracking-[0.22em] text-black/85"
              >
                FREQUENTLY ASKED
              </div>

              <p
                data-animate="words"
                className="mt-5 max-w-[460px] font-mono text-[13.5px] leading-relaxed text-black/80"
              >
                Everything you need to know about how SENEVON works — from solutions and timelines
                to scalability, security, and ongoing support.
              </p>

              <div className="mt-6 border-t border-black/25 pt-4">
                <div className="text-[11px] font-black tracking-[0.22em] text-black/80">
                  QUICK NOTES
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Chip>PRODUCT + SERVICES</Chip>
                  <Chip>ENTERPRISE READY</Chip>
                  <Chip>UI/UX + BRAND</Chip>
                  <Chip>SUPPORT PLANS</Chip>
                </div>
              </div>

              <div className="mt-6">
                <CornerButton className="w-full justify-center">
                  REQUEST CONSULTATION
                </CornerButton>
              </div>
            </div>
          </Tile>

          {/* FAQ list tile */}
          <Tile className="col-span-12 md:col-span-8 min-h-[240px] md:min-h-[320px]" variant="orange">
            <div className="relative h-full p-5 sm:p-6 overflow-hidden">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(680px_280px_at_50%_35%,rgba(255, 255, 255, 0),transparent_62%)]" />
              <div className="pointer-events-none absolute inset-0 opacity-[0.25] [background:linear-gradient(180deg,rgba(255,255,255,0),rgba(0,0,0,0.10))]" />

              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div
                      data-animate="words"
                      className="text-[11px] font-black tracking-[0.22em] text-black/80"
                    >
                      FAQ DIRECTORY
                    </div>
                    <p
                      data-animate="words"
                      className="mt-3 max-w-[720px] text-[13.5px] font-semibold leading-relaxed text-black/75"
                    >
                      Tap a question to expand. Built mobile-first with sharp edges and clean structure.
                    </p>
                  </div>

                  <div className="hidden sm:block border border-black/30 bg-white/28 px-3 py-2 text-[10px] font-black tracking-[0.22em] text-black/80">
                    UPDATED
                  </div>
                </div>

                {/* Accordions */}
                <div className="mt-6 grid gap-2">
                  {items.map((f, idx) => {
                    const id = f.q;
                    const isOpen = openId === id;
                    return (
                      <div
                        key={id}
                        data-faq-row
                        className="border border-black/30 bg-white/22"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenId((cur) => (cur === id ? "" : id))}
                          className="group flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                          aria-expanded={isOpen}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-3">
                              <span className="grid h-7 w-7 place-items-center border border-black/30 bg-white/35 text-[11px] font-black text-black/80">
                                {String(idx + 1).padStart(2, "0")}
                              </span>
                              <div
                                data-animate="words"
                                className="text-[13px] sm:text-[14px] font-black tracking-[0.10em] text-black/85"
                              >
                                {f.q}
                              </div>
                            </div>
                          </div>

                          <span
                            className={[
                              "shrink-0 grid h-9 w-9 place-items-center border border-black/30 bg-white/28 transition",
                              isOpen ? "bg-black/10" : "group-hover:bg-white/40",
                            ].join(" ")}
                            aria-hidden="true"
                          >
                            <span
                              className={[
                                "block h-[2px] w-4 bg-black/80 transition-transform",
                                isOpen ? "rotate-0" : "rotate-0",
                              ].join(" ")}
                            />
                            <span
                              className={[
                                "absolute block h-4 w-[2px] bg-black/80 transition-transform",
                                isOpen ? "scale-y-0" : "scale-y-100",
                              ].join(" ")}
                            />
                          </span>
                        </button>

                        {/* Answer */}
                        <div
                          className={[
                            "grid transition-[grid-template-rows] duration-300 ease-out",
                            isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                          ].join(" ")}
                        >
                          <div className="overflow-hidden">
                            <div className="border-t border-black/20 px-4 py-3">
                              <p className="whitespace-pre-line font-mono text-[13px] leading-relaxed text-black/80">
                                {f.a}
                              </p>

                              <div className="mt-3 flex items-center justify-between border-t border-black/15 pt-3">
                                <span className="text-[10px] font-black tracking-[0.22em] text-black/70">
                                  SUPPORT
                                </span>
                                <button
                                  type="button"
                                  className="border border-black/30 bg-white/30 px-3 py-2 text-[10px] font-black tracking-widest text-black/80 hover:bg-white/45 active:translate-y-[1px] transition"
                                >
                                  CONTACT ↗
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom meta */}
                <div className="mt-6 border border-black/30 bg-white/22 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-black tracking-[0.22em] text-black/80">
                      NEXT STEP
                    </div>
                    <div className="text-[11px] font-black tracking-[0.22em] text-black/75">
                      LIVE <span className="ml-2 inline-block h-2 w-2 bg-black" />
                    </div>
                  </div>
                  <p className="mt-3 font-mono text-[13px] leading-relaxed text-black/80">
                    Share your requirement → get a free consultation → receive proposal & timeline → start with a dedicated team.
                  </p>
                </div>
              </div>
            </div>
          </Tile>
        </div>
      </main>

      {/* minimal styling for GSAP split words */}
      <style>{`
        .gsap-word{ display:inline-block; will-change:transform,opacity,filter; transform:translateZ(0); }
      `}</style>
    </section>
  );
}

/* ---------------- UI helpers ---------------- */

function Tile({ className = "", children, variant = "orange" }) {
  const base =
    variant === "orange"
      ? "bg-[#ff5a12]"
      : "bg-[#d9d9d9]";

  return (
    <div className={"relative border border-black/30 overflow-hidden " + base + " " + className}>
      <div className="pointer-events-none absolute inset-0 bg-white/10" />
      {children}
    </div>
  );
}

function AccentDot({ className = "" }) {
  return <span className={"absolute h-3 w-3 bg-black " + className} />;
}

function Chip({ children }) {
  return (
    <div className="border border-black/30 bg-white/25 px-3 py-2 text-[10px] font-black tracking-widest text-black/85">
      {children}
    </div>
  );
}

/**
 * Sharp-corner bracket button (no rounding)
 */
function CornerButton({ className = "", children }) {
  return (
    <button
      className={[
        "group relative inline-flex items-center justify-center bg-black px-5 py-2.5",
        "text-[12px] font-black tracking-widest text-white",
        "shadow-[0_18px_34px_rgba(0,0,0,0.20)]",
        "hover:brightness-[1.05] active:translate-y-[1px] transition",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-black/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#ff5a12]",
        className,
      ].join(" ")}
      type="button"
    >
      {/* corner brackets */}
      <span className="pointer-events-none absolute -left-2 -top-2 h-4 w-4 border-l-2 border-t-2 border-black/90" />
      <span className="pointer-events-none absolute -right-2 -top-2 h-4 w-4 border-r-2 border-t-2 border-black/90" />
      <span className="pointer-events-none absolute -left-2 -bottom-2 h-4 w-4 border-l-2 border-b-2 border-black/90" />
      <span className="pointer-events-none absolute -right-2 -bottom-2 h-4 w-4 border-r-2 border-b-2 border-black/90" />

      <span className="relative z-10">{children}</span>
    </button>
  );
}
