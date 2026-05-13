import { useEffect, useRef, useState } from "react";

import Logo from "../assets/logo/logo-black.png";
import ContactModal from "../components/UI/ContactModal";
import { Link, useLocation } from "react-router-dom";
import Team from "../components/UI/teamModal";
import ServicesModal from "../components/UI/ServicesModal";
import UIGridFlipButton from "./UI/UIGridFlipButton";

export default function Header() {
  const [open, setOpen] = useState(false);

  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const backdropRef = useRef(null);

  // contact modal
  const [contactOpen, setContactOpen] = useState(false);

  const [teamOpen, setTeamOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const location = useLocation();

  const NAV = [
    { label: "Home", to: "/" },
    { label: "Products", to: "/products" },
    { label: "Services", to: "/services", opensModal: true },
    { label: "About Us", to: "/about" },
    { label: "Career", to: "/#careers" },
    { label: "FAQ", to: "/faq" },
  ];

  const isActiveRoute = (to) => {
    if (!to) return false;
    if (to.includes("#")) return false;

    const path = (location?.pathname || "/").toLowerCase();
    const target = String(to).toLowerCase();

    if (target === "/") return path === "/";

    if (target === "/services") {
      return path === "/services" || path.startsWith("/services/");
    }

    return path === target;
  };

  const openServicesFromMenu = () => {
    setOpen(false);
    setServicesOpen(true);
  };

  // Set initial "closed" state once
  useEffect(() => {
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    if (!panel || !backdrop) return;

    panel.style.height = "0px";
    panel.style.overflow = "hidden";
    panel.style.opacity = "1";

    backdrop.style.opacity = "0";
    backdrop.style.visibility = "hidden";
    backdrop.style.pointerEvents = "none";

    return () => {
      panel.style.height = "";
      panel.style.overflow = "";
      panel.style.opacity = "";

      backdrop.style.opacity = "";
      backdrop.style.visibility = "";
      backdrop.style.pointerEvents = "";
    };
  }, []);

  // Open/close with CSS transitions + body lock
  useEffect(() => {
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    if (!panel || !backdrop) return;

    panel.style.transition = "height 340ms ease";
    backdrop.style.transition = "opacity 180ms ease";

    if (open) {
      backdrop.style.visibility = "visible";
      backdrop.style.pointerEvents = "auto";
      backdrop.style.opacity = "1";

      panel.style.height = "auto";
      const target = panel.scrollHeight;
      panel.style.height = "0px";
      panel.offsetHeight; // eslint-disable-line no-unused-expressions
      panel.style.height = `${target}px`;

      document.documentElement.style.overflow = "hidden";
    } else {
      const current = panel.scrollHeight;
      panel.style.height = `${current}px`;
      panel.offsetHeight; // eslint-disable-line no-unused-expressions
      panel.style.height = "0px";

      backdrop.style.opacity = "0";
      backdrop.style.pointerEvents = "none";

      document.documentElement.style.overflow = "";
    }

    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  // After open transition, set height to auto so content changes won't break it
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const onEnd = (e) => {
      if (e.propertyName !== "height") return;
      if (open) panel.style.height = "auto";
    };

    panel.addEventListener("transitionend", onEnd);
    return () => panel.removeEventListener("transitionend", onEnd);
  }, [open]);

  // ESC close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const close = () => setOpen(false);
  const toggle = () => setOpen((s) => !s);

  return (
    <header
      ref={rootRef}
      className="sticky top-0 z-50 w-full border-b border-black/25 bg-[#d9d9d9]"
    >
      {/* ===== Mobile Header (sm) ===== */}
      <div className="md:hidden">
        <div className="flex h-[70px] items-stretch">
          {/* left */}
          <div className="flex flex-1 items-left px-0">
            <div className="flex h-full items-center">
              <img
                src={Logo}
                alt="Senevon Tech Logo"
                className="
                  max-h-[85%]
                  w-auto
                  object-contain
                  scale-[0.6]
                "
                draggable={false}
              />
            </div>
          </div>

          {/* right */}
          <div className="flex items-center gap-3 px-4">
            <UIGridFlipButton
              variant="primary"
              size="sm"
              onClick={() => {
                setOpen(false);
                setContactOpen(true);
              }}
            >
              Contact
            </UIGridFlipButton>

            <button
              onClick={toggle}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="group grid h-11 w-11 place-items-center  border-black/25  shadow-[0_10px_22px_rgba(0,0,0,0.05)]"
            >
              <HamburgerIcon open={open} />
            </button>
          </div>
        </div>

        {/* Backdrop */}
        <button
          ref={backdropRef}
          aria-label="Close menu backdrop"
          onClick={close}
          className="fixed inset-0 z-40 cursor-default bg-black/30"
          style={{ pointerEvents: open ? "auto" : "none" }}
        />

        {/* Slide panel */}
        <div
          className="relative z-50 overflow-hidden border-t border-black/25 bg-[#ff5a12]"
          ref={panelRef}
        >
          {/* subtle grid only inside panel */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.18]
            [background-image:linear-gradient(to_right,rgba(0,0,0,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.16)_1px,transparent_1px)]
            [background-size:220px_220px]"
          />

          <div className="relative p-4">
            {/* ecosystem chip */}
            <div className="mb-4 flex flex-wrap gap-2">
              <a
                data-chip
                href="/ecosystem"
                onClick={close}
                className="inline-flex items-center  gap-2 border border-black/25 bg-white/45 px-4 py-2 text-[11px] font-black tracking-widest text-black/70 hover:bg-white/70"
              >
                <span className="grid h-5 w-5 place-items-center border border-black/25 bg-white/40">
                  <span className="h-1.5 w-1.5 bg-[#ff5a12]" />
                </span>
                OUR ECOSYSTEM
              </a>
            </div>

            {/* nav links */}
            <nav className="grid gap-2">
              {NAV.map((item) => {
                const active = isActiveRoute(item.to);

                if (item.opensModal) {
                  return (
                    <button
                      key={item.label}
                      data-mnav
                      type="button"
                      onClick={openServicesFromMenu}
                      className={[
                        "group flex items-center justify-between border border-black/20 bg-black/80 px-4 py-3 text-[13px] font-semibold tracking-wide text-white/75 hover:bg-white/70 hover:text-white",
                        active ? "text-black" : "",
                      ].join(" ")}
                    >
                      <span className="flex items-center gap-2">
                        <span className="relative grid h-4 w-4 place-items-center">
                          <span
                            className={[
                              "h-1.5 w-1.5",
                              active ? "bg-[#ff5a12]" : "bg-black/20",
                            ].join(" ")}
                          />
                        </span>
                        {item.label}
                      </span>
                    </button>
                  );
                }

                if (item.label === "Team") {
                  return (
                    <button
                      key={item.label}
                      data-mnav
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        setTeamOpen(true);
                      }}
                      className="group flex items-center justify-between border border-black/20 bg-white px-4 py-3 text-[13px] font-semibold tracking-wide text-black/75 hover:bg-white/70 hover:text-black"
                    >
                      <span className="flex items-center gap-2">
                        <span className="relative grid h-4 w-4 place-items-center">
                          <span className="h-1.5 w-1.5 bg-transparent" />
                        </span>
                        {item.label}
                      </span>

                      <span className="text-[#ff5a12] opacity-70 transition group-hover:opacity-100">

                      </span>
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    data-mnav
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={[
                      "group flex items-center justify-between border border-black/20 bg-black/80 px-4 py-3 text-[13px] font-semibold tracking-wide text-white/75 hover:bg-white/70 hover:text-white",
                      active ? "text-black" : "",
                    ].join(" ")}
                  >
                    <span className="flex items-center gap-2">
                      <span className="relative grid h-4 w-4 place-items-center">
                        <span
                          className={[
                            "h-1.5 w-1.5",
                            active ? "bg-[#ff5a12]" : "bg-black/20",
                          ].join(" ")}
                        />
                      </span>
                      {item.label}
                    </span>

                    <span className="text-[#ff5a12] opacity-70 transition group-hover:opacity-100">

                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* micro meta */}
            <div data-cta className="mt-4 flex items-center justify-between">
              <span className="text-[11px] font-black tracking-[0.22em] text-black/55">
                MOBILE MENU
              </span>
              <span className="text-[11px] font-semibold text-black/55">
                Tap outside to close
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Desktop Header (md+) ===== */}
      <div className="hidden md:block">
        <div className="grid h-[74px] grid-cols-[280px_1fr_260px] items-stretch">
          <div className="flex h-full items-center gap-3 border-r border-black/25 px-6">
            <img
              src={Logo}
              alt="Senevon Tech Logo"
              className="h-[45px] w-auto object-contain"
              draggable={false}
            />
            <p className="font-[invers] text-[33px]">SENEVON</p>
          </div>

          {/* Center: nav */}
          <nav className="flex items-center justify-center gap-10 border-r border-black/25 px-6 text-[13px] font-medium tracking-wide text-black/70">
            {NAV.map((item) => {
              const active = isActiveRoute(item.to);

              if (item.opensModal) {
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={openServicesFromMenu}
                    className={[
                      "relative transition-colors hover:text-black",
                      active ? "text-black" : "",
                    ].join(" ")}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={[
                        "pointer-events-none absolute left-0 -bottom-[10px] h-[2px] w-full bg-[#ff5a12] transition-opacity",
                        active ? "opacity-100" : "opacity-0",
                      ].join(" ")}
                    />
                  </button>
                );
              }

              if (item.label === "Team") {
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setTeamOpen(true)}
                    className="relative transition-colors hover:text-black"
                  >
                    {item.label}
                  </button>
                );
              }

              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={[
                    "relative transition-colors hover:text-black",
                    active ? "text-black" : "",
                  ].join(" ")}
                >
                  {item.label}

                  {/* Active indicator (underline bar) */}
                  <span
                    aria-hidden="true"
                    className={[
                      "pointer-events-none absolute left-0 -bottom-[10px] h-[2px] w-full bg-[#ff5a12] transition-opacity",
                      active ? "opacity-100" : "opacity-0",
                    ].join(" ")}
                  />
                </Link>
              );
            })}

            <a
              href="/ecosystem"
              className="group flex items-center gap-2 text-black/80 hover:text-black"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full border border-black/25 bg-white/40">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff5a12]" />
              </span>
              Our Ecosystem
            </a>
          </nav>

          {/* Right: CTA */}
          <div className="flex items-center justify-end px-6">
            <UIGridFlipButton
              variant="primary"
              size="sm"
              onClick={() => setContactOpen(true)}
            >
              Contact
            </UIGridFlipButton>
            <ContactModal
              open={contactOpen}
              onClose={() => setContactOpen(false)}
            />
          </div>
        </div>
      </div>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
      <ServicesModal open={servicesOpen} onClose={() => setServicesOpen(false)} />

      <Team open={teamOpen} onClose={() => setTeamOpen(false)} />
    </header>
  );
}

function HamburgerIcon({ open }) {
  return (
    <div className="relative h-5 w-6">
      <span
        className={[
          "absolute left-0 top-0 h-[2px] w-6 rounded-full bg-black/80 transition-transform duration-300 ease-out",
          open ? "translate-y-[9px] rotate-45" : "",
        ].join(" ")}
      />
      <span
        className={[
          "absolute left-0 top-[9px] h-[2px] w-6 rounded-full bg-black/70 transition-all duration-250 ease-out",
          open ? "opacity-0" : "opacity-100",
        ].join(" ")}
      />
      <span
        className={[
          "absolute left-0 top-[18px] h-[2px] w-6 rounded-full bg-black/80 transition-transform duration-300 ease-out",
          open ? "translate-y-[-9px] -rotate-45" : "",
        ].join(" ")}
      />
    </div>
  );
}
