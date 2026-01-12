import React, { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import "./Footer.css";

function splitToSpans(text, cls) {
  return Array.from(text).map((ch, i) => {
    if (ch === " ") return <span key={i}>&nbsp;</span>;
    return (
      <span key={i} className={cls}>
        {ch}
      </span>
    );
  });
}

export default function Footer({
  brand = "SENEVON",
  year = new Date().getFullYear(),
}) {
  const sectionRef = useRef(null);
  const bigRef = useRef(null);

  const bigWord = "SNV7";
  const bigSpans = useMemo(() => splitToSpans(bigWord, "ft-bigLetter"), [bigWord]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const ent = entries[0];
        if (!ent?.isIntersecting) return;

        const headings = el.querySelectorAll(".ft-animHead .ft-letter");
        const links = el.querySelectorAll(".ft-link .ft-letter");
        const pills = el.querySelectorAll(".ft-pill");
        const meta = el.querySelectorAll(".ft-meta");
        const bigLetters = bigRef.current?.querySelectorAll(".ft-bigLetter");

        gsap.set([headings, links], { opacity: 0, y: 14, rotateX: 55, transformPerspective: 800 });
        gsap.set(pills, { opacity: 0, y: 10, scale: 0.98 });
        gsap.set(meta, { opacity: 0, y: 10 });
        gsap.set(bigLetters, { opacity: 0, y: 18, filter: "blur(6px)" });

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.to(headings, { opacity: 1, y: 0, rotateX: 0, duration: 0.55, stagger: 0.02 })
          .to(links, { opacity: 1, y: 0, rotateX: 0, duration: 0.42, stagger: 0.008 }, "-=0.25")
          .to(pills, { opacity: 1, y: 0, scale: 1, duration: 0.42, stagger: 0.06 }, "-=0.25")
          .to(meta, { opacity: 1, y: 0, duration: 0.35, stagger: 0.08 }, "-=0.2")
          .to(bigLetters, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7, stagger: 0.06 }, "-=0.15");

        io.disconnect();
      },
      { threshold: 0.2 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const mkLetters = (text) => splitToSpans(text, "ft-letter");

  return (
    <footer ref={sectionRef} className="ft-wrap">
      {/* background grid (outside too) */}
      <div className="ft-bgGrid" aria-hidden="true" />

      <div className="ft-shell">
        <div className="ft-grid">
          {/* Brand tile */}
          <div className="ft-tile ft-brandTile">
            <div className="ft-brandTop">
              <span className="ft-accentDot" />
              <div className="ft-brandName">{brand}</div>
            </div>

            <div className="ft-pills">
              <a className="ft-pill" href="#ai">AI</a>
              <a className="ft-pill" href="#web">Web</a>
              <a className="ft-pill" href="#data">Data</a>
              <a className="ft-pill" href="#design">Design</a>
            </div>
          </div>

          {/* Column 1 */}
          <div className="ft-tile ft-col">
            <div className="ft-animHead ft-head">
              {mkLetters("PRODUCTS")}
            </div>

            <div className="ft-links">
              <a className="ft-link" href="#product-1">{mkLetters("Senevon AI")}</a>
              <a className="ft-link" href="#product-2">{mkLetters("Senevon Studio")}</a>
              <a className="ft-link" href="#product-3">{mkLetters("Senevon Ops")}</a>
            </div>
          </div>

          {/* Column 2 */}
          <div className="ft-tile ft-col">
            <div className="ft-animHead ft-head">
              {mkLetters("COMPANY")}
            </div>

            <div className="ft-links">
              <a className="ft-link" href="#home">{mkLetters("Home")}</a>
              <a className="ft-link" href="#works">{mkLetters("Our Works")}</a>
              <a className="ft-link" href="#careers">{mkLetters("Careers")}</a>
              <a className="ft-link" href="#contact">{mkLetters("Contact")}</a>
            </div>
          </div>

          {/* Column 3 */}
          <div className="ft-tile ft-col">
            <div className="ft-animHead ft-head">
              {mkLetters("LEGAL")}
            </div>

            <div className="ft-links">
              <a className="ft-link" href="#privacy">{mkLetters("Privacy Policy")}</a>
              <a className="ft-link" href="#cookie">{mkLetters("Cookie Policy")}</a>
              <a className="ft-link" href="#terms">{mkLetters("Terms of Service")}</a>
            </div>
          </div>

          {/* Column 4 (social) */}
          <div className="ft-tile ft-col ft-socialCol">
            <div className="ft-animHead ft-head">
              {mkLetters("SOCIAL")}
            </div>

            <div className="ft-links">
              <a className="ft-link" href="#x">{mkLetters("X / TWITTER ↗")}</a>
              <a className="ft-link" href="#linkedin">{mkLetters("LINKEDIN ↗")}</a>
              <a className="ft-link" href="#medium">{mkLetters("MEDIUM ↗")}</a>
            </div>
          </div>

          {/* Meta row */}
          <div className="ft-tile ft-metaRow">
            <div className="ft-meta">© {year}</div>
            <div className="ft-meta">ALL RIGHTS RESERVED BY {brand.toUpperCase()}.</div>
          </div>

          {/* Big word row */}
          <div className="ft-tile ft-bigRow" ref={bigRef}>
            <span className="ft-bigCorner tl" />
            <span className="ft-bigCorner tr" />

            <div className="ft-bigWord font-brand" aria-label="LABS">
              {bigSpans}
            </div>

            <span className="ft-bigCorner bl" />
            <span className="ft-bigCorner br" />
          </div>
        </div>
      </div>
    </footer>
  );
}
