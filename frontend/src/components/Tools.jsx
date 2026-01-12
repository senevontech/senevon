import React, { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import "./Tools.css";

import {
    // Languages
    SiJavascript,
    SiTypescript,
    SiPython,
    SiGo,
    SiRust,
    SiCplusplus,
    SiPhp,
    SiRuby,
    SiKotlin,
    SiSwift,
    SiDotnet,

    // Frameworks / Tech
    SiReact,
    SiNextdotjs,
    SiVite,
    SiTailwindcss,
    SiRedux,
    SiFramer,
    SiNodedotjs,
    SiExpress,
    SiMongodb,
    SiPostgresql,
    SiMysql,
    SiPrisma,
    SiDocker,
    SiNginx,
    SiGraphql,
    SiApollographql,
    SiGithub,
    SiFirebase,
    SiAmazon,
    SiVercel,
    SiNetlify,

    // Data Science
    SiNumpy,
    SiPandas,
    SiJupyter,

    SiTensorflow,
    SiPytorch,

    SiStreamlit,

    
    SiOpenai,

    // Design Tools
    SiFigma,
    SiAdobephotoshop,
    SiAdobeillustrator,
    SiAdobeaftereffects,
    SiAdobepremierepro,
    SiBlender,
    SiCanva,
} from "react-icons/si";

import {
    FaJava,
    FaChartLine,
    FaChartBar,
    FaDatabase,
    FaBrain,

} from "react-icons/fa";

/* ---------- split text into spans for GSAP ---------- */
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

/* ---------- safe icon render (prevents crashes) ---------- */
function SafeIcon({ Icon }) {
    if (!Icon) return <span className="ts-fallbackIcon">◆</span>;
    return <Icon />;
}

/* ---------- one chip ---------- */
function Chip({ icon: Icon, label }) {
    return (
        <div className="ts-chip">
            <span className="ts-chipIcon" aria-hidden="true">
                <SafeIcon Icon={Icon} />
            </span>
            <span className="ts-chipText">{label}</span>
        </div>
    );
}

/* ---------- marquee row (seamless loop) ---------- */
function MarqueeRow({ title, subtitle, items, dir = "rtl", speed = 26 }) {
    const doubled = useMemo(() => [...items, ...items], [items]);

    return (
        <div className="ts-row">
            <div className="ts-rowHead">
                <div className="ts-rowTitle">{title}</div>
                <div className="ts-rowSub">{subtitle}</div>
            </div>

            <div
                className="ts-marquee"
                data-dir={dir}
                style={{ ["--ts-speed"]: `${speed}s` }}
            >
                <div className="ts-track">
                    {doubled.map((it, idx) => (
                        <Chip key={`${it.label}-${idx}`} icon={it.icon} label={it.label} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function ToolsStackSection({
    title = "TECHNOLOGIES",
    subtitle = "• The stack we ship with — fast, scalable, production-ready",
}) {
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const subRef = useRef(null);

    const titleSpans = useMemo(() => splitToSpans(title, "ts-letter"), [title]);
    const subtitleSpans = useMemo(
        () => splitToSpans(subtitle, "ts-subLetter"),
        [subtitle]
    );

    const rows = useMemo(
        () => [
            {
                title: "LANGUAGES",
                subtitle: "Core languages we build with",
                dir: "rtl",
                speed: 28,
                items: [
                    { icon: SiJavascript, label: "JavaScript" },
                    { icon: SiTypescript, label: "TypeScript" },
                    { icon: SiPython, label: "Python" },
                    { icon: FaJava, label: "Java" },
                    { icon: SiCplusplus, label: "C++" },
                    { icon: SiDotnet, label: "C#" },
                    { icon: SiGo, label: "Go" },
                    { icon: SiRust, label: "Rust" },
                    { icon: SiPhp, label: "PHP" },
                    { icon: SiRuby, label: "Ruby" },
                    { icon: SiKotlin, label: "Kotlin" },
                    { icon: SiSwift, label: "Swift" },
                ],
            },
            {
                title: "TECHNOLOGIES",
                subtitle: "Frameworks, backend, infra & tooling",
                dir: "ltr",
                speed: 26,
                items: [
                    { icon: SiReact, label: "React" },
                    { icon: SiNextdotjs, label: "Next.js" },
                    { icon: SiVite, label: "Vite" },
                    { icon: SiTailwindcss, label: "Tailwind" },
                    { icon: SiRedux, label: "Redux" },
                    { icon: SiFramer, label: "Framer Motion" },
                    { icon: SiNodedotjs, label: "Node.js" },
                    { icon: SiExpress, label: "Express" },
                    { icon: SiMongodb, label: "MongoDB" },
                    { icon: SiPostgresql, label: "PostgreSQL" },
                    { icon: SiMysql, label: "MySQL" },
                    { icon: SiPrisma, label: "Prisma" },
                    { icon: SiDocker, label: "Docker" },
                    { icon: SiNginx, label: "Nginx" },
                    { icon: SiGraphql, label: "GraphQL" },
                    { icon: SiApollographql, label: "Apollo" },
                    { icon: SiGithub, label: "GitHub" },
                    { icon: SiFirebase, label: "Firebase" },
                    { icon: SiAmazon, label: "AWS" },
                    { icon: SiVercel, label: "Vercel" },
                    { icon: SiNetlify, label: "Netlify" },
                ],
            },
            {
                title: "DATA SCIENCE",
                subtitle: "Analytics, ML, dashboards & pipelines",
                dir: "rtl",
                speed: 30,
                items: [
                    { icon: SiPython, label: "Python" },
                    { icon: SiNumpy, label: "NumPy" },
                    { icon: SiPandas, label: "Pandas" },
                    { icon: SiJupyter, label: "Jupyter" },

                    { icon: FaBrain, label: "Machine Learning" },
                    { icon: SiTensorflow, label: "TensorFlow" },
                    { icon: SiPytorch, label: "PyTorch" },

                    { icon: FaChartLine, label: "Data Visualization" },
                    { icon: SiStreamlit, label: "Streamlit" },
                    { icon: FaChartBar, label: "BI Dashboards" },
                    { icon: FaDatabase, label: "Data Warehousing" },

                    { icon: SiOpenai, label: "OpenAI" },
                ],
            },

            {
                title: "DESIGN TOOLS",
                subtitle: "UI, brand, motion & 3D workflow",
                dir: "ltr",
                speed: 24,
                items: [
                    { icon: SiFigma, label: "Figma" },
                    { icon: SiAdobephotoshop, label: "Photoshop" },
                    { icon: SiAdobeillustrator, label: "Illustrator" },
                    { icon: SiAdobeaftereffects, label: "After Effects" },
                    { icon: SiAdobepremierepro, label: "Premiere Pro" },
                    { icon: SiBlender, label: "Blender" },
                    { icon: SiCanva, label: "Canva" },
                ],
            },
        ],
        []
    );

    // GSAP reveal on enter
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        const io = new IntersectionObserver(
            (entries) => {
                const ent = entries[0];
                if (!ent?.isIntersecting) return;

                const tLetters = titleRef.current?.querySelectorAll(".ts-letter");
                const sLetters = subRef.current?.querySelectorAll(".ts-subLetter");
                const blocks = el.querySelectorAll(".ts-row");

                gsap.set([tLetters, sLetters], { opacity: 0, y: 18, rotateX: 55 });
                gsap.set(blocks, { opacity: 0, y: 16 });

                const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
                tl.to(tLetters, {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    duration: 0.7,
                    stagger: 0.03,
                })
                    .to(
                        sLetters,
                        {
                            opacity: 1,
                            y: 0,
                            rotateX: 0,
                            duration: 0.45,
                            stagger: 0.012,
                        },
                        "-=0.28"
                    )
                    .to(
                        blocks,
                        { opacity: 1, y: 0, duration: 0.45, stagger: 0.08 },
                        "-=0.12"
                    );

                io.disconnect();
            },
            { threshold: 0.22 }
        );

        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="ts-wrap">
            <div className="ts-bgGrid" />

            <div className="ts-shell">
                <div className="ts-grid">
                    <div className="ts-tile ts-headerLeft">
                        <span className="ts-accentDot" />
                        <h2 ref={titleRef} className="ts-title">
                            {titleSpans}
                        </h2>
                    </div>

                    <div className="ts-tile ts-headerRight">
                        <p ref={subRef} className="ts-subtitle">
                            {subtitleSpans}
                        </p>

                        <div className="ts-note">
                            <span className="ts-noteDot" />
                            <span>Hover any row to pause the flow</span>
                        </div>
                    </div>

                    <div className="ts-tile ts-rowsCol">
                        <div className="ts-rows">
                            {rows.map((r) => (
                                <MarqueeRow
                                    key={r.title}
                                    title={r.title}
                                    subtitle={r.subtitle}
                                    items={r.items}
                                    dir={r.dir}
                                    speed={r.speed}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="ts-tile ts-footer">
                        <div>
                            <div className="ts-footKicker">STACK POLICY</div>
                            <div className="ts-footText">
                                We choose tools that scale, stay maintainable, and keep shipping velocity high.
                            </div>
                        </div>

                        <div className="ts-footBtns">
                            <button className="ts-btnPrimary">DISCUSS YOUR STACK</button>
                            <button className="ts-btnGhost">REQUEST CAPABILITIES</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
