// UIGridFlipButton.jsx
import React, { forwardRef, useMemo } from "react";
import "./UiFlipButton.css";

/**
 * UIGridFlipButton
 * - Matches the reference (orange rect + bracket corners)
 * - Hover: 3D box-grid flip overlay
 * - Mobile-first: hover only on hover-capable devices, touch-safe
 * - Optimized: CSS transforms/opacity only (GPU), no listeners, no GSAP
 *
 * Usage:
 * <UIGridFlipButton>CONTACT</UIGridFlipButton>
 * <UIGridFlipButton variant="ghost">VIEW WORK</UIGridFlipButton>
 * <UIGridFlipButton as="a" href="#work">VIEW WORK</UIGridFlipButton>
 */

const cn = (...a) => a.filter(Boolean).join(" ");

const VARIANT = {
  primary: "uiBtn--primary",
  ghost: "uiBtn--ghost",
  light: "uiBtn--light",
};

const SIZE = {
  sm: "uiBtn--sm",
  md: "uiBtn--md",
  lg: "uiBtn--lg",
};

// stable seed -> unique grid timing per label (no runtime work)
function hashString(s = "") {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function seeded(n) {
  let t = n + 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), 1 | t);
  t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

const UIGridFlipButton = forwardRef(function UIGridFlipButton(
  {
    as,
    href,
    type,
    onClick,
    children,
    className = "",
    variant = "primary",
    size = "md",
    disabled = false,
    corners = true, // bracket corners ON by default
    grid = { cols: 10, rows: 3 }, // feel like "boxes"
    ...rest
  },
  ref
) {
  const Comp = as || (href ? "a" : "button");
  const seed = useMemo(() => hashString(String(children ?? "")), [children]);

  const cols = grid.cols ?? 10;
  const rows = grid.rows ?? 3;

  const cells = useMemo(() => {
    const out = [];
    const total = cols * rows;
    for (let i = 0; i < total; i++) out.push(seeded(seed + i));
    return out;
  }, [seed, cols, rows]);

  return (
    <Comp
      ref={ref}
      href={href}
      type={Comp === "button" ? type || "button" : undefined}
      onClick={disabled ? undefined : onClick}
      aria-disabled={disabled ? "true" : undefined}
      tabIndex={disabled ? -1 : undefined}
      {...rest}
      className={cn(
        "uiBtn",
        VARIANT[variant] || VARIANT.primary,
        SIZE[size] || SIZE.md,
        disabled ? "uiBtn--disabled" : "",
        className
      )}
      style={{ WebkitTapHighlightColor: "transparent", ...rest.style }}
    >
      {/* label */}
      <span className="uiBtn__label">{children}</span>

      {/* bracket corners */}
      {corners && (
        <>
          <span className="uiBtn__corner uiBtn__corner--tl" aria-hidden="true" />
          <span className="uiBtn__corner uiBtn__corner--tr" aria-hidden="true" />
          <span className="uiBtn__corner uiBtn__corner--bl" aria-hidden="true" />
          <span className="uiBtn__corner uiBtn__corner--br" aria-hidden="true" />
        </>
      )}

      {/* grid flip overlay */}
      <span className="uiBtn__overlay" aria-hidden="true">
        <span
          className="uiBtn__grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          }}
        >
          {cells.map((v, idx) => (
            <span
              key={idx}
              className="uiBtn__cell"
              style={{ transitionDelay: `${Math.round(v * 110)}ms` }}
            />
          ))}
        </span>
      </span>
    </Comp>
  );
});

export default UIGridFlipButton;
