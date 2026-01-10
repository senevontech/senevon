// import React, { useEffect, useRef } from "react";
// import "../styles/about.css";

// /**
//  * WaterInteractionSection
//  * - Dark background section
//  * - Centered orange card
//  * - WebGL canvas with interactive ripple distortion
//  *
//  * No external libs (pure WebGL).
//  */
// export default function WaterInteractionSection() {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     // ---------- WebGL helpers ----------
//     const gl =
//       canvas.getContext("webgl", { antialias: true, alpha: true }) ||
//       canvas.getContext("experimental-webgl", { antialias: true, alpha: true });

//     if (!gl) {
//       console.warn("WebGL not supported");
//       return;
//     }

//     const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

//     const createShader = (type, src) => {
//       const sh = gl.createShader(type);
//       gl.shaderSource(sh, src);
//       gl.compileShader(sh);
//       if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
//         console.error(gl.getShaderInfoLog(sh));
//         gl.deleteShader(sh);
//         return null;
//       }
//       return sh;
//     };

//     const createProgram = (vsSrc, fsSrc) => {
//       const vs = createShader(gl.VERTEX_SHADER, vsSrc);
//       const fs = createShader(gl.FRAGMENT_SHADER, fsSrc);
//       if (!vs || !fs) return null;

//       const pr = gl.createProgram();
//       gl.attachShader(pr, vs);
//       gl.attachShader(pr, fs);
//       gl.linkProgram(pr);

//       if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) {
//         console.error(gl.getProgramInfoLog(pr));
//         gl.deleteProgram(pr);
//         return null;
//       }
//       return pr;
//     };

//     // ---------- Shaders ----------
//     // Fullscreen quad
//     const VS = `
//       attribute vec2 aPos;
//       varying vec2 vUv;
//       void main(){
//         vUv = (aPos + 1.0) * 0.5;
//         gl_Position = vec4(aPos, 0.0, 1.0);
//       }
//     `;

//     // Procedural ripple field using a small list of ripples
//     // Each ripple: xy center, z startTime, w strength
//     const MAX_RIPPLES = 24;

//     const FS = `
//       precision mediump float;
//       varying vec2 vUv;

//       uniform sampler2D uTex;
//       uniform vec2 uRes;
//       uniform float uTime;

//       uniform int uRippleCount;
//       uniform vec4 uRipples[${MAX_RIPPLES}];

//       // cheap vignette
//       float vignette(vec2 uv) {
//         float d = distance(uv, vec2(0.5));
//         return smoothstep(0.9, 0.35, d);
//       }

//       void main(){
//         vec2 uv = vUv;

//         // build displacement
//         vec2 disp = vec2(0.0);
//         float amp = 0.016;       // overall displacement amount
//         float freq = 38.0;       // ripple frequency
//         float speed = 1.65;      // ripple travel speed
//         float falloff = 8.5;     // spatial falloff
//         float decay = 1.3;       // time decay

//         for(int i=0; i<${MAX_RIPPLES}; i++){
//           if(i >= uRippleCount) break;

//           vec4 r = uRipples[i];
//           vec2 c = r.xy;
//           float startT = r.z;
//           float strength = r.w;

//           float t = max(0.0, uTime - startT);
//           float d = distance(uv, c);

//           // ring wave traveling outwards
//           float wave = sin((d * freq) - (t * speed * freq));
//           // envelope: strong near ring, fading over distance/time
//           float env = exp(-d * falloff) * exp(-t * decay);
//           float w = wave * env * strength;

//           vec2 dir = normalize(uv - c + 1e-5);
//           disp += dir * w;
//         }

//         vec2 uv2 = uv + disp * amp;

//         // sample
//         vec4 col = texture2D(uTex, uv2);

//         // subtle highlight + vignette for that premium "glass water" vibe
//         float vig = vignette(uv);
//         col.rgb *= (0.92 + 0.12 * vig);

//         gl_FragColor = col;
//       }
//     `;

//     const program = createProgram(VS, FS);
//     if (!program) return;

//     gl.useProgram(program);

//     // ---------- Fullscreen quad geometry ----------
//     const quad = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, quad);
//     gl.bufferData(
//       gl.ARRAY_BUFFER,
//       new Float32Array([
//         -1, -1,
//         1, -1,
//         -1,  1,
//         -1,  1,
//         1, -1,
//         1,  1,
//       ]),
//       gl.STATIC_DRAW
//     );

//     const aPos = gl.getAttribLocation(program, "aPos");
//     gl.enableVertexAttribArray(aPos);
//     gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

//     // ---------- Uniforms ----------
//     const uTex = gl.getUniformLocation(program, "uTex");
//     const uRes = gl.getUniformLocation(program, "uRes");
//     const uTime = gl.getUniformLocation(program, "uTime");
//     const uRippleCount = gl.getUniformLocation(program, "uRippleCount");
//     const uRipples = gl.getUniformLocation(program, "uRipples[0]");

//     // ---------- Create a texture from an offscreen canvas (orange UI card image) ----------
//     // This lets you render any UI (text/logo/etc.) and distort it in WebGL.
//     const sourceCanvas = document.createElement("canvas");
//     const sctx = sourceCanvas.getContext("2d");

//     const makeSourceTexture = (w, h) => {
//       sourceCanvas.width = w;
//       sourceCanvas.height = h;

//       // orange background like reference
//       const g = sctx.createLinearGradient(0, 0, w, h);
//       g.addColorStop(0, "#FF6A1A");
//       g.addColorStop(1, "#F25A0F");
//       sctx.fillStyle = g;
//       sctx.fillRect(0, 0, w, h);

//       // Top nav-like hints (subtle)
//       sctx.globalAlpha = 0.55;
//       sctx.fillStyle = "#fff";
//       sctx.font = `${Math.max(12, w * 0.018)}px Inter, system-ui, Arial`;
//       sctx.fillText("gentlerain", w * 0.04, h * 0.09);
//       sctx.fillText("Product", w * 0.23, h * 0.09);
//       sctx.fillText("Concept", w * 0.33, h * 0.09);
//       sctx.fillText("For business", w * 0.43, h * 0.09);
//       sctx.globalAlpha = 1;

//       // Big hero word (wavy in reference, here we keep solid)
//       sctx.fillStyle = "rgba(255,255,255,0.85)";
//       sctx.font = `900 ${Math.max(56, w * 0.14)}px Inter, system-ui, Arial`;
//       sctx.fillText("gentlerain", w * 0.07, h * 0.34);

//       // Center icon
//       sctx.globalAlpha = 0.9;
//       sctx.beginPath();
//       sctx.arc(w * 0.5, h * 0.55, Math.max(16, w * 0.035), 0, Math.PI * 2);
//       sctx.fillStyle = "rgba(255,255,255,0.2)";
//       sctx.fill();
//       sctx.globalAlpha = 1;

//       // Bottom-left tagline
//       sctx.fillStyle = "rgba(255,255,255,0.95)";
//       sctx.font = `600 ${Math.max(14, w * 0.024)}px Inter, system-ui, Arial`;
//       sctx.fillText(
//         "Leverage AI to grow valuable skills through",
//         w * 0.06,
//         h * 0.86
//       );
//       sctx.fillText(
//         "immersive realistic role play scenarios",
//         w * 0.06,
//         h * 0.91
//       );

//       // Bottom-right button
//       const btnW = w * 0.22;
//       const btnH = h * 0.08;
//       const bx = w * 0.72;
//       const by = h * 0.84;
//       sctx.strokeStyle = "rgba(255,255,255,0.8)";
//       sctx.lineWidth = 2;
//       roundRect(sctx, bx, by, btnW, btnH, btnH * 0.5);
//       sctx.stroke();
//       sctx.fillStyle = "rgba(255,255,255,0.92)";
//       sctx.font = `700 ${Math.max(12, w * 0.02)}px Inter, system-ui, Arial`;
//       sctx.fillText("Contact Sales", bx + btnW * 0.22, by + btnH * 0.62);
//     };

//     function roundRect(ctx, x, y, w, h, r) {
//       const rr = Math.min(r, w / 2, h / 2);
//       ctx.beginPath();
//       ctx.moveTo(x + rr, y);
//       ctx.arcTo(x + w, y, x + w, y + h, rr);
//       ctx.arcTo(x + w, y + h, x, y + h, rr);
//       ctx.arcTo(x, y + h, x, y, rr);
//       ctx.arcTo(x, y, x + w, y, rr);
//       ctx.closePath();
//     }

//     // Create GL texture
//     const tex = gl.createTexture();
//     gl.activeTexture(gl.TEXTURE0);
//     gl.bindTexture(gl.TEXTURE_2D, tex);
//     gl.uniform1i(uTex, 0);

//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

//     // ---------- Ripple storage ----------
//     const ripples = []; // {x,y,start,strength}
//     const pushRipple = (x, y, strength = 1.0) => {
//       // normalize to UV space (0..1)
//       const uvx = clamp(x, 0, 1);
//       const uvy = clamp(1 - y, 0, 1); // flip Y for shader UV

//       ripples.unshift({
//         x: uvx,
//         y: uvy,
//         start: performance.now() / 1000,
//         strength,
//       });

//       if (ripples.length > MAX_RIPPLES) ripples.length = MAX_RIPPLES;
//     };

//     // ---------- Resize ----------
//     const resize = () => {
//       const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
//       const rect = canvas.getBoundingClientRect();
//       const w = Math.max(2, Math.floor(rect.width * dpr));
//       const h = Math.max(2, Math.floor(rect.height * dpr));

//       canvas.width = w;
//       canvas.height = h;
//       gl.viewport(0, 0, w, h);
//       gl.uniform2f(uRes, w, h);

//       // Rebuild source texture to match aspect (use lower res for speed)
//       const sw = Math.floor(rect.width * 1.2);
//       const sh = Math.floor(rect.height * 1.2);
//       makeSourceTexture(Math.max(400, sw), Math.max(240, sh));
//       gl.bindTexture(gl.TEXTURE_2D, tex);
//       gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourceCanvas);
//     };

//     resize();
//     const onResize = () => resize();
//     window.addEventListener("resize", onResize);

//     // ---------- Pointer interaction ----------
//     const onMove = (e) => {
//       const r = canvas.getBoundingClientRect();
//       const x = (e.clientX - r.left) / r.width;
//       const y = (e.clientY - r.top) / r.height;
//       pushRipple(x, y, 0.9);
//     };

//     const onDown = (e) => {
//       const r = canvas.getBoundingClientRect();
//       const x = (e.clientX - r.left) / r.width;
//       const y = (e.clientY - r.top) / r.height;
//       pushRipple(x, y, 1.25);
//     };

//     canvas.addEventListener("pointermove", onMove, { passive: true });
//     canvas.addEventListener("pointerdown", onDown, { passive: true });

//     // ---------- Render loop ----------
//     let raf = 0;
//     const draw = () => {
//       raf = requestAnimationFrame(draw);

//       const now = performance.now() / 1000;
//       gl.uniform1f(uTime, now);

//       // decay ripples (remove old ones)
//       for (let i = ripples.length - 1; i >= 0; i--) {
//         if (now - ripples[i].start > 2.2) ripples.splice(i, 1);
//       }

//       // pack to vec4 array: (x,y,start,strength)
//       const packed = new Float32Array(MAX_RIPPLES * 4);
//       for (let i = 0; i < ripples.length; i++) {
//         const r = ripples[i];
//         packed[i * 4 + 0] = r.x;
//         packed[i * 4 + 1] = r.y;
//         packed[i * 4 + 2] = r.start;
//         packed[i * 4 + 3] = r.strength;
//       }

//       gl.uniform1i(uRippleCount, ripples.length);
//       gl.uniform4fv(uRipples, packed);

//       gl.drawArrays(gl.TRIANGLES, 0, 6);
//     };

//     draw();

//     return () => {
//       cancelAnimationFrame(raf);
//       window.removeEventListener("resize", onResize);
//       canvas.removeEventListener("pointermove", onMove);
//       canvas.removeEventListener("pointerdown", onDown);
//       gl.deleteTexture(tex);
//       gl.deleteProgram(program);
//       gl.deleteBuffer(quad);
//     };
//   }, []);

//   return (
//     <section className="water-sec">
//       <div className="water-shell">
//         <div className="water-card">
//           <canvas ref={canvasRef} className="water-canvas" />
//           <div className="water-badge">Water Interaction WebGL</div>
//         </div>
//       </div>
//     </section>
//   );
// }










































import React, { useEffect, useRef } from "react";
import "../styles/about.css";

export default function About() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext("webgl", { antialias: true, alpha: true }) ||
      canvas.getContext("experimental-webgl", { antialias: true, alpha: true });

    if (!gl) {
      console.warn("WebGL not supported");
      return;
    }

    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    const createShader = (type, src) => {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };

    const createProgram = (vsSrc, fsSrc) => {
      const vs = createShader(gl.VERTEX_SHADER, vsSrc);
      const fs = createShader(gl.FRAGMENT_SHADER, fsSrc);
      if (!vs || !fs) return null;

      const pr = gl.createProgram();
      gl.attachShader(pr, vs);
      gl.attachShader(pr, fs);
      gl.linkProgram(pr);

      if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(pr));
        gl.deleteProgram(pr);
        return null;
      }
      return pr;
    };

    const VS = `
      attribute vec2 aPos;
      varying vec2 vUv;
      void main(){
        vUv = (aPos + 1.0) * 0.5;
        gl_Position = vec4(aPos, 0.0, 1.0);
      }
    `;

    const MAX_RIPPLES = 24;

    // ✅ FIX: flip y ONLY in shader so Canvas2D looks correct (no upside-down text)
    const FS = `
      precision mediump float;
      varying vec2 vUv;

      uniform sampler2D uTex;
      uniform float uTime;

      uniform int uRippleCount;
      uniform vec4 uRipples[${MAX_RIPPLES}];

      float vignette(vec2 uv) {
        float d = distance(uv, vec2(0.5));
        return smoothstep(0.95, 0.35, d);
      }

      void main(){
        // ✅ Flip vUv.y so texture matches Canvas2D orientation
        vec2 uv = vec2(vUv.x, 1.0 - vUv.y);

        vec2 disp = vec2(0.0);
        float amp = 0.017;
        float freq = 38.0;
        float speed = 1.65;
        float falloff = 8.5;
        float decay = 1.25;

        for(int i=0; i<${MAX_RIPPLES}; i++){
          if(i >= uRippleCount) break;

          vec4 r = uRipples[i];
          vec2 c = r.xy;
          float startT = r.z;
          float strength = r.w;

          float t = max(0.0, uTime - startT);
          float d = distance(uv, c);

          float wave = sin((d * freq) - (t * speed * freq));
          float env = exp(-d * falloff) * exp(-t * decay);
          float w = wave * env * strength;

          vec2 dir = normalize(uv - c + 1e-5);
          disp += dir * w;
        }

        vec2 uv2 = uv + disp * amp;

        vec4 col = texture2D(uTex, uv2);

        float vig = vignette(uv);
        col.rgb *= (0.93 + 0.12 * vig);

        gl_FragColor = col;
      }
    `;

    const program = createProgram(VS, FS);
    if (!program) return;

    gl.useProgram(program);

    // Fullscreen quad
    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTex = gl.getUniformLocation(program, "uTex");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uRippleCount = gl.getUniformLocation(program, "uRippleCount");
    const uRipples = gl.getUniformLocation(program, "uRipples[0]");

    // Offscreen source canvas (draw UI here -> ripple distorts it)
    const sourceCanvas = document.createElement("canvas");
    const sctx = sourceCanvas.getContext("2d");

    function roundRect(ctx, x, y, w, h, r) {
      const rr = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + rr, y);
      ctx.arcTo(x + w, y, x + w, y + h, rr);
      ctx.arcTo(x + w, y + h, x, y + h, rr);
      ctx.arcTo(x, y + h, x, y, rr);
      ctx.arcTo(x, y, x + w, y, rr);
      ctx.closePath();
    }

    const makeSourceTexture = (w, h) => {
      sourceCanvas.width = w;
      sourceCanvas.height = h;

      const g = sctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#FF6A1A");
      g.addColorStop(1, "#F25A0F");
      sctx.fillStyle = g;
      sctx.fillRect(0, 0, w, h);

      // Top nav
      sctx.globalAlpha = 0.6;
      sctx.fillStyle = "#fff";
      sctx.font = `${Math.max(12, w * 0.018)}px Inter, system-ui, Arial`;
      sctx.fillText("gentlerain", w * 0.04, h * 0.09);
      sctx.fillText("Product", w * 0.23, h * 0.09);
      sctx.fillText("Concept", w * 0.33, h * 0.09);
      sctx.fillText("For business", w * 0.43, h * 0.09);
      sctx.globalAlpha = 1;

      // Big word (✅ will not be flipped now)
      sctx.fillStyle = "rgba(255,255,255,0.88)";
      sctx.font = `900 ${Math.max(56, w * 0.14)}px Inter, system-ui, Arial`;
      sctx.fillText("gentlerain", w * 0.07, h * 0.34);

      // Center icon
      sctx.globalAlpha = 0.9;
      sctx.beginPath();
      sctx.arc(w * 0.5, h * 0.55, Math.max(16, w * 0.035), 0, Math.PI * 2);
      sctx.fillStyle = "rgba(255,255,255,0.2)";
      sctx.fill();
      sctx.globalAlpha = 1;

      // Bottom-left text
      sctx.fillStyle = "rgba(255,255,255,0.95)";
      sctx.font = `600 ${Math.max(14, w * 0.024)}px Inter, system-ui, Arial`;
      sctx.fillText("Leverage AI to grow valuable skills through", w * 0.06, h * 0.86);
      sctx.fillText("immersive realistic role play scenarios", w * 0.06, h * 0.91);

      // Button
      const btnW = w * 0.22;
      const btnH = h * 0.08;
      const bx = w * 0.72;
      const by = h * 0.84;

      sctx.strokeStyle = "rgba(255,255,255,0.85)";
      sctx.lineWidth = 2;
      roundRect(sctx, bx, by, btnW, btnH, btnH * 0.5);
      sctx.stroke();

      sctx.fillStyle = "rgba(255,255,255,0.95)";
      sctx.font = `700 ${Math.max(12, w * 0.02)}px Inter, system-ui, Arial`;
      sctx.fillText("Contact Sales", bx + btnW * 0.22, by + btnH * 0.62);
    };

    // GL texture
    const tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.uniform1i(uTex, 0);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Ripples
    const ripples = [];
    const pushRipple = (x, y, strength = 1.0) => {
      // ✅ FIX: DO NOT flip Y here. Shader already flipped.
      const uvx = clamp(x, 0, 1);
      const uvy = clamp(y, 0, 1);

      ripples.unshift({
        x: uvx,
        y: uvy,
        start: performance.now() / 1000,
        strength,
      });

      if (ripples.length > MAX_RIPPLES) ripples.length = MAX_RIPPLES;
    };

    const resize = () => {
      const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(2, Math.floor(rect.width * dpr));
      const h = Math.max(2, Math.floor(rect.height * dpr));

      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);

      // source texture resolution
      const sw = Math.max(900, Math.floor(rect.width * 1.3));
      const sh = Math.max(520, Math.floor(rect.height * 1.3));
      makeSourceTexture(sw, sh);

      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourceCanvas);
    };

    resize();
    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      pushRipple(x, y, 0.9);
    };

    const onDown = (e) => {
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      pushRipple(x, y, 1.25);
    };

    canvas.addEventListener("pointermove", onMove, { passive: true });
    canvas.addEventListener("pointerdown", onDown, { passive: true });

    let raf = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);

      const now = performance.now() / 1000;
      gl.uniform1f(uTime, now);

      for (let i = ripples.length - 1; i >= 0; i--) {
        if (now - ripples[i].start > 2.2) ripples.splice(i, 1);
      }

      const packed = new Float32Array(MAX_RIPPLES * 4);
      for (let i = 0; i < ripples.length; i++) {
        const r = ripples[i];
        packed[i * 4 + 0] = r.x;
        packed[i * 4 + 1] = r.y;
        packed[i * 4 + 2] = r.start;
        packed[i * 4 + 3] = r.strength;
      }

      gl.uniform1i(uRippleCount, ripples.length);
      gl.uniform4fv(uRipples, packed);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      gl.deleteTexture(tex);
      gl.deleteProgram(program);
      gl.deleteBuffer(quad);
    };
  }, []);

//   return (
//     <section className="water-sec">
//       <div className="water-shell">
//         <div className="water-card">
//           <canvas ref={canvasRef} className="water-canvas" />
//           {/* <div className="water-badge">Water Interaction WebGL</div> */}
//         </div>
//       </div>
//     </section>
//   );

return (
  <section className="water-sec">
    <canvas ref={canvasRef} className="water-canvas" />
  </section>
);
}
