
// import React, { useEffect, useMemo, useRef } from "react";
// import gsap from "gsap";
// import "./Footer.css";

// function splitToSpans(text, cls, keyPrefix = "") {
//   return Array.from(text).map((ch, i) => {
//     const k = `${keyPrefix}${i}`;
//     if (ch === " ") return <span key={k}>&nbsp;</span>;
//     return (
//       <span key={k} className={cls}>
//         {ch}
//       </span>
//     );
//   });
// }

// export default function Footer({ brand = "SENEVON", year = new Date().getFullYear() }) {
//   const sectionRef = useRef(null);
//   const bigRef = useRef(null);

//   const bigWord = "SNV7";
//   const bigSpans = useMemo(() => splitToSpans(bigWord, "ft-bigLetter", "b-"), [bigWord]);

//   // ✅ GSAP reveal only (no cursor/ghost/blob effects)
//   useEffect(() => {
//     const el = sectionRef.current;
//     if (!el) return;

//     const io = new IntersectionObserver(
//       (entries) => {
//         const ent = entries[0];
//         if (!ent?.isIntersecting) return;

//         const headings = el.querySelectorAll(".ft-animHead .ft-letter");
//         const links = el.querySelectorAll(".ft-link .ft-letter");
//         const pills = el.querySelectorAll(".ft-pill");
//         const meta = el.querySelectorAll(".ft-meta");
//         const bigLetters = bigRef.current?.querySelectorAll(".ft-bigLetter");

//         gsap.set([headings, links], {
//           opacity: 0,
//           y: 10,
//           rotateX: 45,
//           transformPerspective: 800,
//         });
//         gsap.set(pills, { opacity: 0, y: 8, scale: 0.985 });
//         gsap.set(meta, { opacity: 0, y: 8 });
//         gsap.set(bigLetters, { opacity: 0, y: 12, filter: "blur(4px)" });

//         const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

//         tl.to(headings, { opacity: 1, y: 0, rotateX: 0, duration: 0.32, stagger: 0.012 })
//           .to(links, { opacity: 1, y: 0, rotateX: 0, duration: 0.26, stagger: 0.006 }, "-=0.14")
//           .to(pills, { opacity: 1, y: 0, scale: 1, duration: 0.26, stagger: 0.04 }, "-=0.14")
//           .to(meta, { opacity: 1, y: 0, duration: 0.22, stagger: 0.06 }, "-=0.12")
//           .to(bigLetters, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.42, stagger: 0.02 }, "-=0.1");

//         io.disconnect();
//       },
//       { threshold: 0.2 }
//     );

//     io.observe(el);
//     return () => io.disconnect();
//   }, []);

//   const mkLetters = (text) => splitToSpans(text, "ft-letter");

//   return (
//     <footer ref={sectionRef} className="ft-wrap">
//       <div className="ft-bgGrid" aria-hidden="true" />

//       <div className="ft-shell">
//         <div className="ft-grid">
//           {/* Brand tile */}
//           <div className="ft-tile ft-brandTile">
//             <div className="ft-brandTop">
//               <span className="ft-accentDot" />
//               <div className="ft-brandName">{brand}</div>
//             </div>

//             <div className="ft-pills">
//               <a className="ft-pill" href="#ai">AI</a>
//               <a className="ft-pill" href="#web">Web</a>
//               <a className="ft-pill" href="#data">Data</a>
//               <a className="ft-pill" href="#design">Design</a>
//             </div>
//           </div>

//           {/* Column 1 */}
//           <div className="ft-tile ft-col">
//             <div >
//               <div className="ft-animHead ft-head">{mkLetters("PRODUCTS")}</div>
//             </div>
//             <div className="ft-links">
//               <a className="ft-link" href="#product-1">{mkLetters("Senevon AI")}</a>
//               <a className="ft-link" href="#product-2">{mkLetters("Senevon Studio")}</a>
//               <a className="ft-link" href="#product-3">{mkLetters("Senevon Ops")}</a>
//             </div>
//           </div>

//           {/* Column 2 */}
//           <div className="ft-tile ft-col">
//             <div >
//               <div className="ft-animHead ft-head">{mkLetters("COMPANY")}</div>
//             </div>
//             <div className="ft-links">
//               <a className="ft-link" href="#home">{mkLetters("Home")}</a>
//               <a className="ft-link" href="#works">{mkLetters("Our Works")}</a>
//               <a className="ft-link" href="#careers">{mkLetters("Careers")}</a>
//               <a className="ft-link" href="#contact">{mkLetters("Contact")}</a>
//             </div>
//           </div>

//           {/* Column 3 */}
//           <div className="ft-tile ft-col">
//             <div >
//               <div className="ft-animHead ft-head">{mkLetters("LEGAL")}</div>
//             </div>
//             <div className="ft-links">
//               <a className="ft-link" href="#privacy">{mkLetters("Privacy Policy")}</a>
//               <a className="ft-link" href="#cookie">{mkLetters("Cookie Policy")}</a>
//               <a className="ft-link" href="#terms">{mkLetters("Terms of Service")}</a>
//             </div>
//           </div>

//           {/* Column 4 */}
//           <div className="ft-tile ft-col ft-socialCol">
//             <div >
//               <div className="ft-animHead ft-head">{mkLetters("SOCIAL")}</div>
//             </div>
//             <div className="ft-links">
//               <a className="ft-link" href="#x">{mkLetters("X / TWITTER ↗")}</a>
//               <a className="ft-link" href="#linkedin">{mkLetters("LINKEDIN ↗")}</a>
//               <a className="ft-link" href="#medium">{mkLetters("MEDIUM ↗")}</a>
//             </div>
//           </div>

//           {/* Meta row */}
//           <div className="ft-tile ft-metaRow">
//             <div className="ft-meta">© {year}</div>
//             <div className="ft-meta">ALL RIGHTS RESERVED BY {brand.toUpperCase()}.</div>
//           </div>

//           {/* Big row (CLEAN) */}
//           <div className="ft-tile ft-bigRow" ref={bigRef}>
//             <span className="ft-bigCorner tl" />
//             <span className="ft-bigCorner tr" />

//             <div className="ft-bigClean" aria-label={bigWord}>
//               <div className="ft-bigWord font-brand is-base">{bigSpans}</div>
//             </div>

//             <span className="ft-bigCorner bl" />
//             <span className="ft-bigCorner br" />
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }


























































import React, { useMemo, useRef } from "react";
import "./Footer.css";

function splitToSpans(text, cls, keyPrefix = "") {
  return Array.from(text).map((ch, i) => {
    const k = `${keyPrefix}${i}`;
    if (ch === " ") return <span key={k}>&nbsp;</span>;
    return (
      <span key={k} className={cls}>
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
  const bigSpans = useMemo(
    () => splitToSpans(bigWord, "ft-bigLetter", "b-"),
    [bigWord]
  );

  const mkLetters = (text) => splitToSpans(text, "ft-letter");

  return (
    <footer ref={sectionRef} className="ft-wrap">
      <div className="ft-bgGrid" aria-hidden="true" />

      <div className="ft-shell">
        <div className="ft-grid">
          {/* Brand tile */}
          <div className="ft-tile ft-brandTile">
            <div className="ft-brandTop">
              <span className="ft-accentDot" />
              <a href="/" className="ft-brandName">
                {brand}
              </a>
            </div>

            <div className="ft-pills">
              <a className="ft-pill" href="/services/ai">
                AI
              </a>
              <a className="ft-pill" href="/services/web">
                Web
              </a>
              <a className="ft-pill" href="/services/data">
                Data
              </a>
              <a className="ft-pill" href="/services/design">
                Design
              </a>
            </div>
          </div>

          {/* PRODUCTS */}
          <div className="ft-tile ft-col">
            <div>
              <div className="ft-animHead ft-head">
                {mkLetters("PRODUCTS")}
              </div>
            </div>
            <div className="ft-links">
              <a className="ft-link" href="/products/senevon-ai">
                {mkLetters("Senevon AI")}
              </a>
              <a className="ft-link" href="/products/senevon-studio">
                {mkLetters("Senevon Studio")}
              </a>
              <a className="ft-link" href="/products/senevon-ops">
                {mkLetters("Senevon Ops")}
              </a>
            </div>
          </div>

          {/* COMPANY */}
          <div className="ft-tile ft-col">
            <div>
              <div className="ft-animHead ft-head">
                {mkLetters("COMPANY")}
              </div>
            </div>
            <div className="ft-links">
              <a className="ft-link" href="/">
                {mkLetters("Home")}
              </a>
              <a className="ft-link" href="/#works">
                {mkLetters("Our Works")}
              </a>
              <a className="ft-link" href="/#careers">
                {mkLetters("Careers")}
              </a>
              {/* <a className="ft-link" href="/contact">
                {mkLetters("Contact")}
              </a> */}
            </div>
          </div>

          {/* LEGAL */}
          <div className="ft-tile ft-col">
            <div>
              <div className="ft-animHead ft-head">
                {mkLetters("LEGAL")}
              </div>
            </div>
            <div className="ft-links">
              <a className="ft-link" href="/legal/privacy-policy">
                {mkLetters("Privacy Policy")}
              </a>
              <a className="ft-link" href="/legal/cookie-policy">
                {mkLetters("Cookie Policy")}
              </a>
              <a className="ft-link" href="/legal/terms-of-service">
                {mkLetters("Terms of Service")}
              </a>
            </div>
          </div>

          {/* SOCIAL */}
          <div className="ft-tile ft-col ft-socialCol">
            <div>
              <div className="ft-animHead ft-head">
                {mkLetters("SOCIAL")}
              </div>
            </div>
            <div className="ft-links">

              <a
                className="ft-link"
                href="https://x.com/senevon_tech"
                target="_blank"
                rel="noopener noreferrer"
              >
                {mkLetters("X")}
              </a>

              <a
                className="ft-link"
                href="https://www.linkedin.com/company/senevon-tech/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {mkLetters("Linkedin")}
              </a>

              <a
                className="ft-link"
                href="https://www.facebook.com/profile.php?id=61585962131769"
                target="_blank"
                rel="noopener noreferrer"
              >
                {mkLetters("Facebook")}
              </a>

              <a
                className="ft-link"
                href="https://www.instagram.com/senevon_tech/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {mkLetters("Instagram")}
              </a>

            </div>
          </div>

          {/* Meta row */}
          <div className="ft-tile ft-metaRow">
            <div className="ft-meta">© {year}</div>
            <div className="ft-meta">
              ALL RIGHTS RESERVED BY {brand.toUpperCase()}.
            </div>
          </div>

          {/* Big branding row */}
          <div className="ft-tile ft-bigRow" ref={bigRef}>
            <span className="ft-bigCorner tl" />
            <span className="ft-bigCorner tr" />

            <div className="ft-bigClean" aria-label={bigWord}>
              <div className="ft-bigWord font-brand is-base">
                {bigSpans}
              </div>
            </div>

            <span className="ft-bigCorner bl" />
            <span className="ft-bigCorner br" />
          </div>
        </div>
      </div>
    </footer>
  );
}
