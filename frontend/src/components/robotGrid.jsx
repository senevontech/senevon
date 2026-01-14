// spline model 
// import React, { Suspense, useEffect, useMemo, useRef } from "react";
// import { Canvas, useFrame } from "@react-three/fiber";
// import { useGLTF } from "@react-three/drei";
// import gsap from "gsap";
// import ScrollTrigger from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);



// function Model({ url, modelScaleRef, modelRotRef }) {
//   const group = useRef(null);
//   const { scene } = useGLTF(url);

//   // ✅ Base rotation offset (90° on Y axis)
//   const BASE_Y = -Math.PI / 2;

//   useEffect(() => {
//     if (!group.current) return;
//     group.current.rotation.set(0, BASE_Y, 0); // ✅ start rotated
//   }, []);

//   useFrame(() => {
//     if (!group.current) return;

//     // apply scroll-driven refs
//     const s = modelScaleRef.current;
//     group.current.scale.set(s, s, s);

//     // ✅ keep X tilt, but add Y tilt on top of base rotation
//     group.current.rotation.x = modelRotRef.current.x;
//     group.current.rotation.y = BASE_Y + modelRotRef.current.y;
//   });

//   return <primitive ref={group} object={scene} />;
// }


// export default function GltfScrollTile({
//   url = "/models/robot.glb",
//   className = "",
// }) {
//   const wrapRef = useRef(null);

//   // refs driven by ScrollTrigger (super cheap per frame)
//   const modelScaleRef = useRef(1);
//   const modelRotRef = useRef({ x: 0, y: 0 });

//   useEffect(() => {
//     const el = wrapRef.current;
//     if (!el) return;

//     const reduceMotion =
//       typeof window !== "undefined" &&
//       window.matchMedia &&
//       window.matchMedia("(prefers-reduced-motion: reduce)").matches;

//     // baseline values
//     modelScaleRef.current = 1;
//     modelRotRef.current = { x: 0, y: 0 };

//     if (reduceMotion) return;

//     // Smooth setters (no re-render)
//     const setScale = gsap.quickTo(modelScaleRef, "current", {
//       duration: 0.35,
//       ease: "power3.out",
//     });

//     // We can't quickTo nested object keys directly; use a proxy
//     const rotProxy = { x: 0, y: 0 };
//     const setRotX = gsap.quickTo(rotProxy, "x", {
//       duration: 0.35,
//       ease: "power3.out",
//     });
//     const setRotY = gsap.quickTo(rotProxy, "y", {
//       duration: 0.35,
//       ease: "power3.out",
//     });

//     const st = ScrollTrigger.create({
//       trigger: el,
//       start: "top 90%",
//       end: "bottom 10%",
//       scrub: 0.8,
//       onUpdate: (self) => {
//         // progress 0..1
//         const p = self.progress;

//         // scroll zoom in/out (front faced)
//         // keep range subtle and premium
//         const scale = 0.92 + p * 0.38; // 0.92 -> 1.30
//         setScale(scale);

//         // micro tilt for depth (optional but unique)
//         // very small so it doesn't feel like a toy
//         setRotX(-0.06 + p * 0.12); // -0.06 -> +0.06
//         setRotY(-0.10 + p * 0.20); // -0.10 -> +0.10

//         // write back to refs (used in useFrame)
//         modelRotRef.current = { x: rotProxy.x, y: rotProxy.y };
//       },
//     });

//     return () => {
//       st.kill();
//     };
//   }, []);

//   const dpr = useMemo(() => {
//     // clamp for mobile smoothness
//     if (typeof window === "undefined") return 1;
//     return Math.min(1.75, window.devicePixelRatio || 1);
//   }, []);

//   return (
//     <div ref={wrapRef} className={"relative h-full w-full " + className}>
//       <Canvas
//         dpr={dpr}
//         camera={{ position: [0, 0, 3.2], fov: 35 }}
//         gl={{
//           antialias: true,
//           alpha: true,
//           powerPreference: "high-performance",
//         }}
//       >
//         <Suspense fallback={null}>
//           {/* lighting: clean + product-like */}
//           <ambientLight intensity={0.7} />
//           <directionalLight position={[2, 3, 4]} intensity={1.1} />
//           <directionalLight position={[-3, 1, 2]} intensity={0.55} />

//           {/* Model (front faced) */}
//           <group position={[0, -0.9, 2]}>
//             <Model
//               url={url}
//               modelScaleRef={modelScaleRef}
//               modelRotRef={modelRotRef}
//             />
//           </group>
//         </Suspense>
//       </Canvas>

//       {/* subtle overlay sheen like your UI */}
//       <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(420px_200px_at_50%_35%,rgba(255,255,255,0.55),transparent_62%)]" />
//     </div>
//   );
// }

// // Preload helps reduce pop-in
// useGLTF.preload("/models/yourModel.glb");




































// blender model 
// import React, { Suspense, useEffect, useMemo, useRef } from "react";
// import { Canvas, useFrame } from "@react-three/fiber";
// import { useGLTF, Environment, ContactShadows } from "@react-three/drei";
// import gsap from "gsap";
// import ScrollTrigger from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// /**
//  * GLTF that reacts to scroll + mouse:
//  * - scroll => zoom in/out + subtle tilt
//  * - mouse => smooth parallax rotation + light follow
//  * - realistic lighting using HDRI Environment (no postprocessing)
//  * - mobile-friendly + optimized (dpr clamp, no heavy effects)
//  */

// function Model({
//   url,
//   modelScaleRef,
//   modelRotRef,
//   mouseRotRef,     // ✅ NEW
//   lightPosRef,     // ✅ NEW
// }) {
//   const group = useRef(null);
//   const dirLight = useRef(null);
//   const { scene } = useGLTF(url);

//   // ✅ Base rotation offset (-90° on Y axis)
//   const BASE_Y = -Math.PI / 2;

//   useEffect(() => {
//     if (!group.current) return;
//     group.current.rotation.set(0, BASE_Y, 0);
//   }, []);

//   useFrame(() => {
//     if (!group.current) return;

//     // scale from scroll
//     const s = modelScaleRef.current;
//     group.current.scale.set(s, s, s);

//     // ✅ combine: scroll tilt + mouse parallax (mouse is very subtle)
//     group.current.rotation.x = modelRotRef.current.x + mouseRotRef.current.x;
//     group.current.rotation.y =
//       BASE_Y + modelRotRef.current.y + mouseRotRef.current.y;

//     // ✅ light follows cursor slightly (realistic specular movement)
//     if (dirLight.current) {
//       const lp = lightPosRef.current;
//       dirLight.current.position.set(lp.x, lp.y, lp.z);
//     }
//   });

//   return (
//     <>
//       {/* ✅ cursor-follow key light */}
//       <directionalLight
//         ref={dirLight}
//         position={[2.5, 3.5, 4.5]}
//         intensity={1.35}
//         castShadow
//         shadow-mapSize-width={1024}
//         shadow-mapSize-height={1024}
//         shadow-camera-near={0.1}
//         shadow-camera-far={20}
//         shadow-camera-left={-5}
//         shadow-camera-right={5}
//         shadow-camera-top={5}
//         shadow-camera-bottom={-5}
//       />

//       <primitive ref={group} object={scene} />
//     </>
//   );
// }

// export default function GltfScrollTile({
//   url = "/models/robot.glb",
//   className = "",
// }) {
//   const wrapRef = useRef(null);

//   // refs driven by ScrollTrigger (cheap)
//   const modelScaleRef = useRef(1);
//   const modelRotRef = useRef({ x: 0, y: 0 });

//   // ✅ NEW: mouse interactivity refs (no re-render)
//   const mouseRotRef = useRef({ x: 0, y: 0 });
//   const lightPosRef = useRef({ x: 2.5, y: 3.5, z: 4.5 });

//   useEffect(() => {
//     const el = wrapRef.current;
//     if (!el) return;

//     const reduceMotion =
//       typeof window !== "undefined" &&
//       window.matchMedia &&
//       window.matchMedia("(prefers-reduced-motion: reduce)").matches;

//     // baseline values
//     modelScaleRef.current = 1;
//     modelRotRef.current = { x: 0, y: 0 };
//     mouseRotRef.current = { x: 0, y: 0 };
//     lightPosRef.current = { x: 2.5, y: 3.5, z: 4.5 };

//     // ✅ Mouse parallax (works on desktop + touch)
//     // keep subtle + premium
//     const rotProxy = { x: 0, y: 0 };
//     const lightProxy = { x: 2.5, y: 3.5, z: 4.5 };

//     const setMouseX = gsap.quickTo(rotProxy, "x", {
//       duration: 0.35,
//       ease: "power3.out",
//     });
//     const setMouseY = gsap.quickTo(rotProxy, "y", {
//       duration: 0.35,
//       ease: "power3.out",
//     });

//     const setLightX = gsap.quickTo(lightProxy, "x", {
//       duration: 0.35,
//       ease: "power3.out",
//     });
//     const setLightY = gsap.quickTo(lightProxy, "y", {
//       duration: 0.35,
//       ease: "power3.out",
//     });

//     const getNormalized = (clientX, clientY) => {
//       const r = el.getBoundingClientRect();
//       const nx = (clientX - r.left) / r.width; // 0..1
//       const ny = (clientY - r.top) / r.height; // 0..1
//       return { nx, ny };
//     };

//     const onMove = (e) => {
//       if (reduceMotion) return;

//       const p = "touches" in e ? e.touches?.[0] : e;
//       if (!p) return;

//       const { nx, ny } = getNormalized(p.clientX, p.clientY);

//       // map to -1..+1
//       const mx = (nx - 0.5) * 2;
//       const my = (ny - 0.5) * 2;

//       // ✅ subtle rotation
//       // x: tilt up/down, y: tilt left/right
//       setMouseX(-my * 0.10); // max ~0.10 rad
//       setMouseY(mx * 0.14);  // max ~0.14 rad

//       // ✅ light follows cursor a bit (makes materials look real)
//       setLightX(2.5 + mx * 1.8);
//       setLightY(3.5 + -my * 1.2);

//       // write back
//       mouseRotRef.current = { x: rotProxy.x, y: rotProxy.y };
//       lightPosRef.current = { x: lightProxy.x, y: lightProxy.y, z: lightProxy.z };
//     };

//     const onLeave = () => {
//       if (reduceMotion) return;
//       setMouseX(0);
//       setMouseY(0);
//       setLightX(2.5);
//       setLightY(3.5);

//       mouseRotRef.current = { x: 0, y: 0 };
//       lightPosRef.current = { x: 2.5, y: 3.5, z: 4.5 };
//     };

//     // ✅ attach to tile only (not whole page)
//     el.addEventListener("mousemove", onMove, { passive: true });
//     el.addEventListener("mouseleave", onLeave, { passive: true });

//     // touch support
//     el.addEventListener("touchstart", onMove, { passive: true });
//     el.addEventListener("touchmove", onMove, { passive: true });
//     el.addEventListener("touchend", onLeave, { passive: true });
//     el.addEventListener("touchcancel", onLeave, { passive: true });

//     // ---------------- ScrollTrigger (existing behavior) ----------------
//     if (reduceMotion) return;

//     const setScale = gsap.quickTo(modelScaleRef, "current", {
//       duration: 0.35,
//       ease: "power3.out",
//     });

//     const scrollRotProxy = { x: 0, y: 0 };
//     const setRotX = gsap.quickTo(scrollRotProxy, "x", {
//       duration: 0.35,
//       ease: "power3.out",
//     });
//     const setRotY = gsap.quickTo(scrollRotProxy, "y", {
//       duration: 0.35,
//       ease: "power3.out",
//     });

//     const st = ScrollTrigger.create({
//       trigger: el,
//       start: "top 90%",
//       end: "bottom 10%",
//       scrub: 0.8,
//       onUpdate: (self) => {
//         const p = self.progress;

//         const scale = 0.92 + p * 0.38; // 0.92 -> 1.30
//         setScale(scale);

//         setRotX(-0.06 + p * 0.12);
//         setRotY(-0.10 + p * 0.20);

//         modelRotRef.current = { x: scrollRotProxy.x, y: scrollRotProxy.y };
//       },
//     });

//     return () => {
//       st.kill();

//       el.removeEventListener("mousemove", onMove);
//       el.removeEventListener("mouseleave", onLeave);

//       el.removeEventListener("touchstart", onMove);
//       el.removeEventListener("touchmove", onMove);
//       el.removeEventListener("touchend", onLeave);
//       el.removeEventListener("touchcancel", onLeave);
//     };
//   }, []);

//   const dpr = useMemo(() => {
//     if (typeof window === "undefined") return 1;
//     return Math.min(1.75, window.devicePixelRatio || 1);
//   }, []);

//   return (
//     <div ref={wrapRef} className={"relative h-full w-full " + className}>
//       <Canvas
//         dpr={dpr}
//         camera={{ position: [0, 0, 3.2], fov: 35 }}
//         gl={{
//           antialias: true,
//           alpha: true,
//           powerPreference: "high-performance",
//         }}
//         shadows
//       >
//         <Suspense fallback={null}>
//           {/* ✅ realistic base light */}
//           <ambientLight intensity={0.35} />

//           {/* ✅ HDRI environment for realistic reflections */}
//           <Environment preset="city" intensity={0.9} />

//           {/* ✅ soft fill (helps on darker models) */}
//           <directionalLight position={[-3.5, 2.0, 2.5]} intensity={0.45} />

//           {/* Model */}
//           <group position={[0, -0.9, 2]}>
//             <Model
//               url={url}
//               modelScaleRef={modelScaleRef}
//               modelRotRef={modelRotRef}
//               mouseRotRef={mouseRotRef}
//               lightPosRef={lightPosRef}
//             />
//           </group>

//           {/* ✅ subtle grounding shadow */}
//           <ContactShadows
//             position={[0, -1.25, 0]}
//             opacity={0.35}
//             scale={8}
//             blur={2.2}
//             far={6}
//           />
//         </Suspense>
//       </Canvas>

//       {/* subtle overlay sheen like your UI */}
//       <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(420px_200px_at_50%_35%,rgba(255,255,255,0.55),transparent_62%)]" />
//     </div>
//   );
// }

// // Preload helps reduce pop-in
// useGLTF.preload("/models/yourModel.glb");






























































// optimised+transperent 
import React, { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Model({ url, modelScaleRef, modelRotRef, mouseRotRef, lightPosRef }) {
  const group = useRef(null);
  const dirLight = useRef(null);
  const { scene } = useGLTF(url);

  // ✅ Base rotation offset (-90° on Y axis)
  const BASE_Y = -Math.PI / 2;

  useEffect(() => {
    if (!group.current) return;
    group.current.rotation.set(0, BASE_Y, 0);

    // ✅ small optimization: frustum culling + shadows off per mesh (optional)
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.frustumCulled = true;
        obj.castShadow = false;
        obj.receiveShadow = false;
      }
    });
  }, [scene]);

  useFrame(() => {
    if (!group.current) return;

    const s = modelScaleRef.current;
    group.current.scale.set(s, s, s);

    group.current.rotation.x = modelRotRef.current.x + mouseRotRef.current.x;
    group.current.rotation.y = BASE_Y + modelRotRef.current.y + mouseRotRef.current.y;

    if (dirLight.current) {
      const lp = lightPosRef.current;
      dirLight.current.position.set(lp.x, lp.y, lp.z);
    }
  });

  return (
    <>
      {/* ✅ cursor-follow key light */}
      <directionalLight
        ref={dirLight}
        position={[2.5, 3.5, 4.5]}
        intensity={1.15}
      />
      <primitive ref={group} object={scene} />
    </>
  );
}

export default function RobotGrid({ url = "/models/robot.glb", className = "" }) {
  const wrapRef = useRef(null);

  const modelScaleRef = useRef(1);
  const modelRotRef = useRef({ x: 0, y: 0 });

  const mouseRotRef = useRef({ x: 0, y: 0 });
  const lightPosRef = useRef({ x: 2.5, y: 3.5, z: 4.5 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    modelScaleRef.current = 1;
    modelRotRef.current = { x: 0, y: 0 };
    mouseRotRef.current = { x: 0, y: 0 };
    lightPosRef.current = { x: 2.5, y: 3.5, z: 4.5 };

    const rotProxy = { x: 0, y: 0 };
    const lightProxy = { x: 2.5, y: 3.5, z: 4.5 };

    const setMouseX = gsap.quickTo(rotProxy, "x", { duration: 0.35, ease: "power3.out" });
    const setMouseY = gsap.quickTo(rotProxy, "y", { duration: 0.35, ease: "power3.out" });

    const setLightX = gsap.quickTo(lightProxy, "x", { duration: 0.35, ease: "power3.out" });
    const setLightY = gsap.quickTo(lightProxy, "y", { duration: 0.35, ease: "power3.out" });

    const getNormalized = (clientX, clientY) => {
      const r = el.getBoundingClientRect();
      const nx = (clientX - r.left) / r.width;
      const ny = (clientY - r.top) / r.height;
      return { nx, ny };
    };

    const onMove = (e) => {
      if (reduceMotion) return;
      const p = "touches" in e ? e.touches?.[0] : e;
      if (!p) return;

      const { nx, ny } = getNormalized(p.clientX, p.clientY);
      const mx = (nx - 0.5) * 2;
      const my = (ny - 0.5) * 2;

      setMouseX(-my * 0.10);
      setMouseY(mx * 0.14);

      setLightX(2.5 + mx * 1.4);
      setLightY(3.5 + -my * 0.9);

      mouseRotRef.current = { x: rotProxy.x, y: rotProxy.y };
      lightPosRef.current = { x: lightProxy.x, y: lightProxy.y, z: lightProxy.z };
    };

    const onLeave = () => {
      if (reduceMotion) return;
      setMouseX(0);
      setMouseY(0);
      setLightX(2.5);
      setLightY(3.5);
      mouseRotRef.current = { x: 0, y: 0 };
      lightPosRef.current = { x: 2.5, y: 3.5, z: 4.5 };
    };

    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave, { passive: true });

    el.addEventListener("touchstart", onMove, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: true });
    el.addEventListener("touchend", onLeave, { passive: true });
    el.addEventListener("touchcancel", onLeave, { passive: true });

    if (reduceMotion) return;

    const setScale = gsap.quickTo(modelScaleRef, "current", {
      duration: 0.35,
      ease: "power3.out",
    });

    const scrollRotProxy = { x: 0, y: 0 };
    const setRotX = gsap.quickTo(scrollRotProxy, "x", { duration: 0.35, ease: "power3.out" });
    const setRotY = gsap.quickTo(scrollRotProxy, "y", { duration: 0.35, ease: "power3.out" });

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      end: "bottom 10%",
      scrub: 0.8,
      onUpdate: (self) => {
        const p = self.progress;

        setScale(0.92 + p * 0.38);
        setRotX(-0.06 + p * 0.12);
        setRotY(-0.10 + p * 0.20);

        modelRotRef.current = { x: scrollRotProxy.x, y: scrollRotProxy.y };
      },
    });

    return () => {
      st.kill();
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("touchstart", onMove);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onLeave);
      el.removeEventListener("touchcancel", onLeave);
    };
  }, []);

  const dpr = useMemo(() => {
    if (typeof window === "undefined") return 1;
    return Math.min(1.5, window.devicePixelRatio || 1); // ✅ cheaper than 1.75
  }, []);

  return (
    <div ref={wrapRef} className={"relative h-full w-full " + className}>
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0, 3.2], fov: 35 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        // ✅ important: ensure transparent background
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color(0x000000), 0);
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.28} />

          {/* ✅ reflections without white “plate” */}
          <Environment preset="city" intensity={0.8} />

          <directionalLight position={[-3.5, 2.0, 2.5]} intensity={0.35} />

          <group position={[0, -0.9, 2]}>
            <Model
              url={url}
              modelScaleRef={modelScaleRef}
              modelRotRef={modelRotRef}
              mouseRotRef={mouseRotRef}
              lightPosRef={lightPosRef}
            />
          </group>

          {/* ✅ optional: keep shadow but it can look like a “white floor”.
              If you want FULL transparent look, remove this block entirely. */}
          <ContactShadows
            position={[0, -1.25, 0]}
            opacity={0.18}
            scale={7}
            blur={2.5}
            far={6}
          />
        </Suspense>
      </Canvas>

      {/* ✅ Removed the sheen overlay to avoid white-looking panel */}
      {/* <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(...)]" /> */}
    </div>
  );
}

useGLTF.preload("/models/yourModel.glb");


