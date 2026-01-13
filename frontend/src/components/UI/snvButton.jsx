import React from "react";
import "./snvButton.css";

/**
 * SenevonButton (Global UI Button)
 * - Mobile-first sizing (not huge on phones)
 * - Corner brackets like your reference
 * - Unique hover: grid 3D flip overlay
 * - Accessible: focus-visible, disabled, supports <button> or <a>
 */
export default function SenevonButton({
  as: Comp = "button",
  children,
  className = "",
  variant = "accent", // accent | ghost
  size = "md", // sm | md | lg
  ...props
}) {
  const v =
    variant === "ghost"
      ? "snv-btn--ghost"
      : variant === "accent"
      ? "snv-btn--accent"
      : "snv-btn--accent";

  const s = size === "sm" ? "snv-btn--sm" : size === "lg" ? "snv-btn--lg" : "snv-btn--md";

  return (
    <Comp className={`snv-btn ${v} ${s} ${className}`} {...props}>
      <span className="snv-btn__flip" aria-hidden="true" />
      <span className="snv-btn__corner tl" aria-hidden="true" />
      <span className="snv-btn__corner tr" aria-hidden="true" />
      <span className="snv-btn__corner bl" aria-hidden="true" />
      <span className="snv-btn__corner br" aria-hidden="true" />
      <span className="snv-btn__label">{children}</span>
    </Comp>
  );
}
