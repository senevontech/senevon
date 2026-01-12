

// import React, { useEffect, useMemo, useRef } from "react";
// import gsap from "gsap";
// import "./Footer.css";

// function splitToSpans(text, cls, keyPrefix = "") {
//     return Array.from(text).map((ch, i) => {
//         const k = `${keyPrefix}${i}`;
//         if (ch === " ") return <span key={k}>&nbsp;</span>;
//         return (
//             <span key={k} className={cls}>
//                 {ch}
//             </span>
//         );
//     });
// }


// export default function Footer({
//     brand = "SENEVON",
//     year = new Date().getFullYear(),
// }) {
//     const sectionRef = useRef(null);
//     const bigRef = useRef(null);

//     const bigWord = "SNV7";
//     // const bigSpans = useMemo(() => splitToSpans(bigWord, "ft-bigLetter"), [bigWord]);
//     const bigSpansBase = useMemo(() => splitToSpans(bigWord, "ft-bigLetter", "b-"), [bigWord]);
//     const bigSpansG1 = useMemo(() => splitToSpans(bigWord, "ft-bigLetter", "g1-"), [bigWord]);
//     const bigSpansG2 = useMemo(() => splitToSpans(bigWord, "ft-bigLetter", "g2-"), [bigWord]);

//     useEffect(() => {
//         const el = sectionRef.current;
//         if (!el) return;

//         const io = new IntersectionObserver(
//             (entries) => {
//                 const ent = entries[0];
//                 if (!ent?.isIntersecting) return;

//                 const headings = el.querySelectorAll(".ft-animHead .ft-letter");
//                 const links = el.querySelectorAll(".ft-link .ft-letter");
//                 const pills = el.querySelectorAll(".ft-pill");
//                 const meta = el.querySelectorAll(".ft-meta");
//                 const bigLetters = bigRef.current?.querySelectorAll(".ft-bigLetter");

//                 gsap.set([headings, links], { opacity: 0, y: 10, rotateX: 45, transformPerspective: 800 });
//                 gsap.set(pills, { opacity: 0, y: 8, scale: 0.985 });
//                 gsap.set(meta, { opacity: 0, y: 8 });
//                 gsap.set(bigLetters, { opacity: 0, y: 12, filter: "blur(4px)" });

//                 // ✅ Faster timeline
//                 const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

//                 tl.to(headings, { opacity: 1, y: 0, rotateX: 0, duration: 0.32, stagger: 0.012 })
//                     .to(links, { opacity: 1, y: 0, rotateX: 0, duration: 0.26, stagger: 0.006 }, "-=0.14")
//                     .to(pills, { opacity: 1, y: 0, scale: 1, duration: 0.26, stagger: 0.04 }, "-=0.14")
//                     .to(meta, { opacity: 1, y: 0, duration: 0.22, stagger: 0.06 }, "-=0.12")
//                     .to(bigLetters, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.42, stagger: 0.045 }, "-=0.1");

//                 io.disconnect();
//             },
//             { threshold: 0.2 }
//         );

//         io.observe(el);
//         return () => io.disconnect();
//     }, []);

//     const mkLetters = (text) => splitToSpans(text, "ft-letter");

//     return (
//         <footer ref={sectionRef} className="ft-wrap">
//             <div className="ft-bgGrid" aria-hidden="true" />

//             <div className="ft-shell">
//                 <div className="ft-grid">
//                     {/* Brand tile */}
//                     <div className="ft-tile ft-brandTile">
//                         <div className="ft-brandTop">
//                             <span className="ft-accentDot" />
//                             <div className="ft-brandName">{brand}</div>
//                         </div>

//                         <div className="ft-pills">
//                             <a className="ft-pill" href="#ai">AI</a>
//                             <a className="ft-pill" href="#web">Web</a>
//                             <a className="ft-pill" href="#data">Data</a>
//                             <a className="ft-pill" href="#design">Design</a>
//                         </div>
//                     </div>

//                     {/* Column 1 */}
//                     <div className="ft-tile ft-col">
//                         {/* ✅ Pixel effect wrapper */}
//                         <div className="ft-pixelTitle">
//                             <div className="ft-animHead ft-head">{mkLetters("PRODUCTS")}</div>
//                         </div>

//                         <div className="ft-links">
//                             <a className="ft-link" href="#product-1">{mkLetters("Senevon AI")}</a>
//                             <a className="ft-link" href="#product-2">{mkLetters("Senevon Studio")}</a>
//                             <a className="ft-link" href="#product-3">{mkLetters("Senevon Ops")}</a>
//                         </div>
//                     </div>

//                     {/* Column 2 */}
//                     <div className="ft-tile ft-col">
//                         <div className="ft-pixelTitle">
//                             <div className="ft-animHead ft-head">{mkLetters("COMPANY")}</div>
//                         </div>

//                         <div className="ft-links">
//                             <a className="ft-link" href="#home">{mkLetters("Home")}</a>
//                             <a className="ft-link" href="#works">{mkLetters("Our Works")}</a>
//                             <a className="ft-link" href="#careers">{mkLetters("Careers")}</a>
//                             <a className="ft-link" href="#contact">{mkLetters("Contact")}</a>
//                         </div>
//                     </div>

//                     {/* Column 3 */}
//                     <div className="ft-tile ft-col">
//                         <div className="ft-pixelTitle">
//                             <div className="ft-animHead ft-head">{mkLetters("LEGAL")}</div>
//                         </div>

//                         <div className="ft-links">
//                             <a className="ft-link" href="#privacy">{mkLetters("Privacy Policy")}</a>
//                             <a className="ft-link" href="#cookie">{mkLetters("Cookie Policy")}</a>
//                             <a className="ft-link" href="#terms">{mkLetters("Terms of Service")}</a>
//                         </div>
//                     </div>

//                     {/* Column 4 */}
//                     <div className="ft-tile ft-col ft-socialCol">
//                         <div className="ft-pixelTitle">
//                             <div className="ft-animHead ft-head">{mkLetters("SOCIAL")}</div>
//                         </div>

//                         <div className="ft-links">
//                             <a className="ft-link" href="#x">{mkLetters("X / TWITTER ↗")}</a>
//                             <a className="ft-link" href="#linkedin">{mkLetters("LINKEDIN ↗")}</a>
//                             <a className="ft-link" href="#medium">{mkLetters("MEDIUM ↗")}</a>
//                         </div>
//                     </div>

//                     {/* Meta row */}
//                     <div className="ft-tile ft-metaRow">
//                         <div className="ft-meta">© {year}</div>
//                         <div className="ft-meta">ALL RIGHTS RESERVED BY {brand.toUpperCase()}.</div>
//                     </div>

//                     {/* Big row */}
//                     {/* <div className="ft-tile ft-bigRow" ref={bigRef}>
//             <span className="ft-bigCorner tl" />
//             <span className="ft-bigCorner tr" />

//             <div className="ft-bigWord font-brand" aria-label={bigWord}>
//               {bigSpans}
//             </div>

//             <span className="ft-bigCorner bl" />
//             <span className="ft-bigCorner br" />
//           </div> */}

//                     {/* Big row */}
//                     <div className="ft-tile ft-bigRow" ref={bigRef}>
//                         <span className="ft-bigCorner tl" />
//                         <span className="ft-bigCorner tr" />

//                         {/* ✅ Pixel-distortion wrapper */}
//                         <div className="ft-bigPixelWrap" aria-label={bigWord}>
//                             <div className="ft-bigWord font-brand">{bigSpansBase}</div>

//                             <div className="ft-bigWord font-brand ft-bigGhost ft-g1" aria-hidden="true">
//                                 {bigSpansG1}
//                             </div>

//                             <div className="ft-bigWord font-brand ft-bigGhost ft-g2" aria-hidden="true">
//                                 {bigSpansG2}
//                             </div>

//                             <div className="ft-pixelDust" aria-hidden="true" />
//                         </div>


//                         <span className="ft-bigCorner bl" />
//                         <span className="ft-bigCorner br" />
//                     </div>



//                 </div>
//             </div>
//         </footer>
//     );
// }

















import React, { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import "./Footer.css";

function splitToSpans(text, cls, keyPrefix = "") {
  return Array.from(text).map((ch, i) => {
    const k = `${keyPrefix}${i}`;
    if (ch === " ") return <span key={k}>&nbsp;</span>;

    // ✅ mark first character (S) for special styling
    const extra = i === 0 ? " ft-noGhost" : "";

    return (
      <span key={k} className={`${cls}${extra}`}>
        {ch}
      </span>
    );
  });
}


export default function Footer({ brand = "SENEVON", year = new Date().getFullYear() }) {
  const sectionRef = useRef(null);
  const bigRef = useRef(null);

  // ✅ NEW: pixel attraction refs
  const bigPixelWrapRef = useRef(null);
  const lettersRef = useRef([]); // nodes
  const centersRef = useRef([]); // cached centers
  const quickRef = useRef([]); // quickTo setters (x/y)
  const rafRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0, inside: false });
  const isTouchRef = useRef(false);

  const bigWord = "SNV7";
  const bigSpansBase = useMemo(() => splitToSpans(bigWord, "ft-bigLetter", "b-"), [bigWord]);
  const bigSpansG1 = useMemo(() => splitToSpans(bigWord, "ft-bigLetter", "g1-"), [bigWord]);
  const bigSpansG2 = useMemo(() => splitToSpans(bigWord, "ft-bigLetter", "g2-"), [bigWord]);

  // ---------- GSAP reveal (your existing logic, slightly faster) ----------
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

        gsap.set([headings, links], { opacity: 0, y: 10, rotateX: 45, transformPerspective: 800 });
        gsap.set(pills, { opacity: 0, y: 8, scale: 0.985 });
        gsap.set(meta, { opacity: 0, y: 8 });
        gsap.set(bigLetters, { opacity: 0, y: 12, filter: "blur(4px)" });

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.to(headings, { opacity: 1, y: 0, rotateX: 0, duration: 0.32, stagger: 0.012 })
          .to(links, { opacity: 1, y: 0, rotateX: 0, duration: 0.26, stagger: 0.006 }, "-=0.14")
          .to(pills, { opacity: 1, y: 0, scale: 1, duration: 0.26, stagger: 0.04 }, "-=0.14")
          .to(meta, { opacity: 1, y: 0, duration: 0.22, stagger: 0.06 }, "-=0.12")
          .to(bigLetters, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.42, stagger: 0.02 }, "-=0.1");

        io.disconnect();
      },
      { threshold: 0.2 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  // ---------- ✅ Pixel-attraction setup ----------
  useEffect(() => {
    // Touch detect
    isTouchRef.current =
      "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

    const wrap = bigPixelWrapRef.current;
    if (!wrap || isTouchRef.current) return;

    const collect = () => {
      const nodes = Array.from(wrap.querySelectorAll(".ft-bigWord.is-base .ft-bigLetter"));
      lettersRef.current = nodes;

      // quickTo setters (fast)
      quickRef.current = nodes.map((node) => ({
        x: gsap.quickTo(node, "x", { duration: 0.22, ease: "power3.out" }),
        y: gsap.quickTo(node, "y", { duration: 0.22, ease: "power3.out" }),
        r: gsap.quickTo(node, "rotation", { duration: 0.35, ease: "power3.out" }),
      }));

      // cache centers
      const rectWrap = wrap.getBoundingClientRect();
      centersRef.current = nodes.map((node) => {
        const r = node.getBoundingClientRect();
        return {
          cx: r.left - rectWrap.left + r.width / 2,
          cy: r.top - rectWrap.top + r.height / 2,
        };
      });
    };

    const resetAll = () => {
      const qs = quickRef.current;
      qs.forEach((q) => {
        q.x(0);
        q.y(0);
        q.r(0);
      });
    };

    const animate = () => {
      rafRef.current = 0;

      const wrapRect = wrap.getBoundingClientRect();
      const mx = mouseRef.current.x - wrapRect.left;
      const my = mouseRef.current.y - wrapRect.top;

      // Tunables (industry-feel)
      const radius = Math.max(220, Math.min(420, wrapRect.width * 0.45)); // influence range
      const strength = 26; // pull distance
      const twist = 6; // slight rotation for "pixel drag"

      const centers = centersRef.current;
      const qs = quickRef.current;

      for (let i = 0; i < centers.length; i++) {
        const { cx, cy } = centers[i];
        const dx = mx - cx;
        const dy = my - cy;
        const dist = Math.hypot(dx, dy);

        // falloff 0..1
        const t = Math.max(0, 1 - dist / radius);
        // ease the falloff for premium feel
        const fall = t * t;

        // direction-normalized
        const nx = dist ? dx / dist : 0;
        const ny = dist ? dy / dist : 0;

        const tx = nx * fall * strength;
        const ty = ny * fall * strength;

        // tiny rotational drag
        const rot = (nx * fall) * twist;

        qs[i].x(tx);
        qs[i].y(ty);
        qs[i].r(rot);
      }
    };

    const requestTick = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(animate);
    };

    const onMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      if (!mouseRef.current.inside) return;
      requestTick();
    };

    const onEnter = () => {
      mouseRef.current.inside = true;
      collect(); // ensure fresh centers
      requestTick();
    };

    const onLeave = () => {
      mouseRef.current.inside = false;
      resetAll();
    };

    // initial collect after mount
    collect();

    // listeners
    wrap.addEventListener("mouseenter", onEnter);
    wrap.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousemove", onMove, { passive: true });

    // resize: recompute centers
    const onResize = () => collect();
    window.addEventListener("resize", onResize);

    return () => {
      wrap.removeEventListener("mouseenter", onEnter);
      wrap.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

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
            <div className="ft-pixelTitle">
              <div className="ft-animHead ft-head">{mkLetters("PRODUCTS")}</div>
            </div>
            <div className="ft-links">
              <a className="ft-link" href="#product-1">{mkLetters("Senevon AI")}</a>
              <a className="ft-link" href="#product-2">{mkLetters("Senevon Studio")}</a>
              <a className="ft-link" href="#product-3">{mkLetters("Senevon Ops")}</a>
            </div>
          </div>

          {/* Column 2 */}
          <div className="ft-tile ft-col">
            <div className="ft-pixelTitle">
              <div className="ft-animHead ft-head">{mkLetters("COMPANY")}</div>
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
            <div className="ft-pixelTitle">
              <div className="ft-animHead ft-head">{mkLetters("LEGAL")}</div>
            </div>
            <div className="ft-links">
              <a className="ft-link" href="#privacy">{mkLetters("Privacy Policy")}</a>
              <a className="ft-link" href="#cookie">{mkLetters("Cookie Policy")}</a>
              <a className="ft-link" href="#terms">{mkLetters("Terms of Service")}</a>
            </div>
          </div>

          {/* Column 4 */}
          <div className="ft-tile ft-col ft-socialCol">
            <div className="ft-pixelTitle">
              <div className="ft-animHead ft-head">{mkLetters("SOCIAL")}</div>
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

          {/* Big row */}
          <div className="ft-tile ft-bigRow" ref={bigRef}>
            <span className="ft-bigCorner tl" />
            <span className="ft-bigCorner tr" />

            {/* ✅ Cursor-attraction wrapper */}
            <div className="ft-bigPixelWrap" ref={bigPixelWrapRef} aria-label={bigWord}>
              <div className="ft-bigWord font-brand is-base">{bigSpansBase}</div>

              {/* ghosts stay for “distortion depth” */}
              <div className="ft-bigWord font-brand ft-bigGhost ft-g1" aria-hidden="true">
                {bigSpansG1}
              </div>
              <div className="ft-bigWord font-brand ft-bigGhost ft-g2" aria-hidden="true">
                {bigSpansG2}
              </div>

              <div className="ft-pixelDust" aria-hidden="true" />
            </div>

            <span className="ft-bigCorner bl" />
            <span className="ft-bigCorner br" />
          </div>
        </div>
      </div>
    </footer>
  );
}
































