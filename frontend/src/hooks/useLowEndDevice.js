import { useMemo } from "react";

const LOW_END_CORES = 4;
const LOW_END_MEMORY_GB = 4;

export default function useLowEndDevice() {
  return useMemo(() => {
    if (typeof window === "undefined") return false;

    const nav = navigator;
    const prefersReducedMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const lowCpu = Number.isFinite(nav.hardwareConcurrency) && nav.hardwareConcurrency <= LOW_END_CORES;
    const lowMemory = Number.isFinite(nav.deviceMemory) && nav.deviceMemory <= LOW_END_MEMORY_GB;

    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
    const saveData = Boolean(connection?.saveData);
    const slowNetwork = ["slow-2g", "2g"].includes(connection?.effectiveType);

    return prefersReducedMotion || lowCpu || lowMemory || saveData || slowNetwork;
  }, []);
}
