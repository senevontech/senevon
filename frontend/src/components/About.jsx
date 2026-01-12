

// import React, { useEffect, useRef } from "react";
// import "../styles/about.css";

// export default function About() {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

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

//     const VS = `
//       attribute vec2 aPos;
//       varying vec2 vUv;
//       void main(){
//         vUv = (aPos + 1.0) * 0.5;
//         gl_Position = vec4(aPos, 0.0, 1.0);
//       }
//     `;

//     const MAX_RIPPLES = 24;

//     // ✅ FIX: flip y ONLY in shader so Canvas2D looks correct (no upside-down text)
//     const FS = `
//       precision mediump float;
//       varying vec2 vUv;

//       uniform sampler2D uTex;
//       uniform float uTime;

//       uniform int uRippleCount;
//       uniform vec4 uRipples[${MAX_RIPPLES}];

//       float vignette(vec2 uv) {
//         float d = distance(uv, vec2(0.5));
//         return smoothstep(0.95, 0.35, d);
//       }

//       void main(){
//         // ✅ Flip vUv.y so texture matches Canvas2D orientation
//         vec2 uv = vec2(vUv.x, 1.0 - vUv.y);

//         vec2 disp = vec2(0.0);
//         float amp = 0.017;
//         float freq = 38.0;
//         float speed = 1.65;
//         float falloff = 8.5;
//         float decay = 1.25;

//         for(int i=0; i<${MAX_RIPPLES}; i++){
//           if(i >= uRippleCount) break;

//           vec4 r = uRipples[i];
//           vec2 c = r.xy;
//           float startT = r.z;
//           float strength = r.w;

//           float t = max(0.0, uTime - startT);
//           float d = distance(uv, c);

//           float wave = sin((d * freq) - (t * speed * freq));
//           float env = exp(-d * falloff) * exp(-t * decay);
//           float w = wave * env * strength;

//           vec2 dir = normalize(uv - c + 1e-5);
//           disp += dir * w;
//         }

//         vec2 uv2 = uv + disp * amp;

//         vec4 col = texture2D(uTex, uv2);

//         float vig = vignette(uv);
//         col.rgb *= (0.93 + 0.12 * vig);

//         gl_FragColor = col;
//       }
//     `;

//     const program = createProgram(VS, FS);
//     if (!program) return;

//     gl.useProgram(program);

//     // Fullscreen quad
//     const quad = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, quad);
//     gl.bufferData(
//       gl.ARRAY_BUFFER,
//       new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
//       gl.STATIC_DRAW
//     );

//     const aPos = gl.getAttribLocation(program, "aPos");
//     gl.enableVertexAttribArray(aPos);
//     gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

//     const uTex = gl.getUniformLocation(program, "uTex");
//     const uTime = gl.getUniformLocation(program, "uTime");
//     const uRippleCount = gl.getUniformLocation(program, "uRippleCount");
//     const uRipples = gl.getUniformLocation(program, "uRipples[0]");

//     // Offscreen source canvas (draw UI here -> ripple distorts it)
//     const sourceCanvas = document.createElement("canvas");
//     const sctx = sourceCanvas.getContext("2d");

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

//     const makeSourceTexture = (w, h) => {
//       sourceCanvas.width = w;
//       sourceCanvas.height = h;

//       const g = sctx.createLinearGradient(0, 0, w, h);
//       g.addColorStop(0, "#FF6A1A");
//       g.addColorStop(1, "#F25A0F");
//       sctx.fillStyle = g;
//       sctx.fillRect(0, 0, w, h);

//       // Top nav
//       sctx.globalAlpha = 0.6;
//       sctx.fillStyle = "#fff";
//       sctx.font = `${Math.max(12, w * 0.018)}px Inter, system-ui, Arial`;
//       sctx.fillText("SENEVONTECH", w * 0.04, h * 0.09);
//       sctx.fillText("Product", w * 0.23, h * 0.09);
//       sctx.fillText("Concept", w * 0.33, h * 0.09);
//       sctx.fillText("For business", w * 0.43, h * 0.09);
//       sctx.globalAlpha = 1;

//       // Big word (✅ will not be flipped now)
//       sctx.fillStyle = "rgba(255,255,255,0.88)";
//       sctx.font = `900 ${Math.max(56, w * 0.14)}px Inter, system-ui, Arial`;
//       sctx.fillText("Senevon", w * 0.07, h * 0.34);

//       // Center icon
//       sctx.globalAlpha = 0.9;
//       sctx.beginPath();
//       sctx.arc(w * 0.5, h * 0.55, Math.max(16, w * 0.035), 0, Math.PI * 2);
//       sctx.fillStyle = "rgba(255,255,255,0.2)";
//       sctx.fill();
//       sctx.globalAlpha = 1;

//       // Bottom-left text
//       sctx.fillStyle = "rgba(255,255,255,0.95)";
//       sctx.font = `600 ${Math.max(14, w * 0.024)}px Inter, system-ui, Arial`;
//       sctx.fillText("Leverage AI to grow valuable skills through", w * 0.06, h * 0.86);
//       sctx.fillText("immersive realistic role play scenarios", w * 0.06, h * 0.91);

//       // Button
//       const btnW = w * 0.22;
//       const btnH = h * 0.08;
//       const bx = w * 0.72;
//       const by = h * 0.84;

//       sctx.strokeStyle = "rgba(255,255,255,0.85)";
//       sctx.lineWidth = 2;
//       roundRect(sctx, bx, by, btnW, btnH, btnH * 0.5);
//       sctx.stroke();

//       sctx.fillStyle = "rgba(255,255,255,0.95)";
//       sctx.font = `700 ${Math.max(12, w * 0.02)}px Inter, system-ui, Arial`;
//       sctx.fillText("Contact Sales", bx + btnW * 0.22, by + btnH * 0.62);
//     };

//     // GL texture
//     const tex = gl.createTexture();
//     gl.activeTexture(gl.TEXTURE0);
//     gl.bindTexture(gl.TEXTURE_2D, tex);
//     gl.uniform1i(uTex, 0);

//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

//     // Ripples
//     const ripples = [];
//     const pushRipple = (x, y, strength = 1.0) => {
//       // ✅ FIX: DO NOT flip Y here. Shader already flipped.
//       const uvx = clamp(x, 0, 1);
//       const uvy = clamp(y, 0, 1);

//       ripples.unshift({
//         x: uvx,
//         y: uvy,
//         start: performance.now() / 1000,
//         strength,
//       });

//       if (ripples.length > MAX_RIPPLES) ripples.length = MAX_RIPPLES;
//     };

//     const resize = () => {
//       const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
//       const rect = canvas.getBoundingClientRect();
//       const w = Math.max(2, Math.floor(rect.width * dpr));
//       const h = Math.max(2, Math.floor(rect.height * dpr));

//       canvas.width = w;
//       canvas.height = h;
//       gl.viewport(0, 0, w, h);

//       // source texture resolution
//       const sw = Math.max(900, Math.floor(rect.width * 1.3));
//       const sh = Math.max(520, Math.floor(rect.height * 1.3));
//       makeSourceTexture(sw, sh);

//       gl.bindTexture(gl.TEXTURE_2D, tex);
//       gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourceCanvas);
//     };

//     resize();
//     const onResize = () => resize();
//     window.addEventListener("resize", onResize);

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

//     let raf = 0;
//     const draw = () => {
//       raf = requestAnimationFrame(draw);

//       const now = performance.now() / 1000;
//       gl.uniform1f(uTime, now);

//       for (let i = ripples.length - 1; i >= 0; i--) {
//         if (now - ripples[i].start > 2.2) ripples.splice(i, 1);
//       }

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



// return (
//   <section className="water-sec">
//     <canvas ref={canvasRef} className="water-canvas" />
//   </section>
// );
// }




























import React, { useEffect, useRef } from "react";

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
        // Flip Y so Canvas2D matches normal orientation
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

    // Offscreen source canvas
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

    // Draw your UI on an "artboard" that matches the device shape
    const drawUI = (w, h) => {
      sourceCanvas.width = w;
      sourceCanvas.height = h;

      // background gradient
      const g = sctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#FF6A1A");
      g.addColorStop(1, "#F25A0F");
      sctx.fillStyle = g;
      sctx.fillRect(0, 0, w, h);

      const isPortrait = h / w > 1.05;
      const pad = isPortrait ? w * 0.07 : w * 0.05;

      // top nav (hide items on very small widths)
      sctx.globalAlpha = 0.62;
      sctx.fillStyle = "#fff";
      sctx.textBaseline = "alphabetic";
      sctx.font = `${Math.max(12, w * 0.02)}px Inter, system-ui, Arial`;

      sctx.fillText("SENEVONTECH", pad, h * 0.085);

      if (w > 700) {
        sctx.fillText("Product", w * 0.26, h * 0.085);
        sctx.fillText("Concept", w * 0.36, h * 0.085);
        sctx.fillText("For business", w * 0.47, h * 0.085);
      } else {
        // mobile: keep it clean
        sctx.fillText("Product", pad, h * 0.12);
      }
      sctx.globalAlpha = 1;

      // big word
      sctx.fillStyle = "rgba(255,255,255,0.9)";
      const titleSize = isPortrait ? Math.max(52, w * 0.14) : Math.max(58, w * 0.11);
      sctx.font = `900 ${titleSize}px Inter, system-ui, Arial`;
      sctx.fillText("Senevon", pad, isPortrait ? h * 0.28 : h * 0.34);

      // center icon
      sctx.globalAlpha = 0.9;
      sctx.beginPath();
      sctx.arc(w * 0.5, h * 0.52, Math.max(16, w * 0.04), 0, Math.PI * 2);
      sctx.fillStyle = "rgba(255,255,255,0.2)";
      sctx.fill();
      sctx.globalAlpha = 1;

      // bottom copy
      sctx.fillStyle = "rgba(255,255,255,0.95)";
      const bodySize = isPortrait ? Math.max(14, w * 0.035) : Math.max(14, w * 0.026);
      sctx.font = `600 ${bodySize}px Inter, system-ui, Arial`;

      const textY1 = isPortrait ? h * 0.82 : h * 0.86;
      const textY2 = isPortrait ? h * 0.87 : h * 0.91;

      sctx.fillText("Leverage AI to grow valuable skills through", pad, textY1);
      sctx.fillText("immersive realistic role play scenarios", pad, textY2);

      // button (bigger on mobile)
      const btnW = isPortrait ? w * 0.44 : w * 0.22;
      const btnH = isPortrait ? h * 0.07 : h * 0.08;
      const bx = isPortrait ? w * 0.5 - btnW * 0.5 : w * 0.72;
      const by = isPortrait ? h * 0.90 - btnH : h * 0.84;

      sctx.strokeStyle = "rgba(255,255,255,0.85)";
      sctx.lineWidth = 2;
      roundRect(sctx, bx, by, btnW, btnH, btnH * 0.55);
      sctx.stroke();

      sctx.fillStyle = "rgba(255,255,255,0.95)";
      sctx.font = `700 ${Math.max(12, w * 0.026)}px Inter, system-ui, Arial`;
      sctx.fillText("Contact Sales", bx + btnW * 0.20, by + btnH * 0.63);
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
      const rect = canvas.getBoundingClientRect();

      // use "visual" DPR cap so mobile doesn’t go crazy
      const rawDpr = window.devicePixelRatio || 1;
      const dpr = Math.min(2, Math.max(1, rawDpr));

      const w = Math.max(2, Math.floor(rect.width * dpr));
      const h = Math.max(2, Math.floor(rect.height * dpr));

      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);

      // Choose an artboard based on aspect (THIS fixes the squeezed look)
      const aspect = rect.height / rect.width;
      const isPortrait = aspect > 1.05;

      // portrait texture for mobile, landscape for desktop
      const sw = isPortrait ? 900 : 1400;
      const sh = isPortrait ? 1600 : 800;

      drawUI(sw, sh);

      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourceCanvas);
    };

    resize();
    window.addEventListener("resize", resize);

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      pushRipple(x, y, 0.85);
    };

    const onDown = (e) => {
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      pushRipple(x, y, 1.2);
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
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      gl.deleteTexture(tex);
      gl.deleteProgram(program);
      gl.deleteBuffer(quad);
    };
  }, []);

  return (
    <section className="relative w-screen min-h-[100svh] overflow-hidden bg-[#0b0b0f]">
      {/* subtle backdrop so edges look premium */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_500px_at_50%_-10%,rgba(255,255,255,0.10),transparent_60%),radial-gradient(700px_350px_at_20%_30%,rgba(255,120,50,0.12),transparent_60%)]" />
      <canvas
        ref={canvasRef}
        className="relative block h-[100svh] w-screen touch-none"
      />
    </section>
  );
}
