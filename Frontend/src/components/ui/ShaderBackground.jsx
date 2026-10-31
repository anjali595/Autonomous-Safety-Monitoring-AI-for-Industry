// ShaderBackground.jsx — Optimized WebGL2 shader with visibility-aware rendering
"use client"

import { useEffect, useRef } from "react"

const vertSrc = `#version 300 es
precision highp float;
layout(location=0) in vec2 a_pos;
void main(){ gl_Position = vec4(a_pos,0.0,1.0); }`

// Reduced loop iterations from 50 → 30 for much better GPU perf
// Visuals remain nearly identical since outer iterations contribute minimally
const fragSrc = `#version 300 es
precision mediump float;
out vec4 fragColor;

uniform vec2  u_res;
uniform float u_time;

float tanh1(float x){ float e = exp(2.0*x); return (e-1.0)/(e+1.0); }
vec4 tanh4(vec4 v){ return vec4(tanh1(v.x), tanh1(v.y), tanh1(v.z), tanh1(v.w)); }

void main(){
  vec3 FC = vec3(gl_FragCoord.xy, 0.0);
  vec3 r  = vec3(u_res, max(u_res.x, u_res.y));
  float t = u_time;

  vec4 o = vec4(0.0);
  vec3 p = vec3(0.0);
  vec3 v = vec3(1.0, 2.0, 6.0);
  float i = 0.0, z = 1.0, d = 1.0, f = 1.0;

  for ( ; i++ < 30.0;
        o.rgb += (cos((p.x + z + v) * 0.1) + 1.0) / d / f / z )
  {
    p = z * normalize(FC * 2.0 - r.xyy);
    vec4 m = cos((p + sin(p)).y * 0.4 + vec4(0.0, 33.0, 11.0, 0.0));
    p.xz = mat2(m) * p.xz;
    p.x += t / 0.2;
    z += ( d = length(cos(p / v) * v + v.zxx / 7.0) /
           ( f = 2.0 + d / exp(p.y * 0.2) ) );
  }

  o = tanh4(0.2 * o);

  vec3 c = o.rgb;
  c = pow(c, vec3(2.2));
  float lum = dot(c, vec3(0.299, 0.587, 0.114));
  float mask = smoothstep(0.008, 0.06, lum);
  c *= mask;
  c *= 2.8;
  float bloom = smoothstep(0.03, 0.25, lum);
  c += c * bloom * 1.5;
  c.b += bloom * 0.15;
  c.g += bloom * 0.06;
  c = clamp(c, 0.0, 1.0);

  fragColor = vec4(c, 1.0);
}`

export default function ShaderBackground({ className = "", style = {} }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    const gl = canvas.getContext("webgl2", {
      premultipliedAlpha: false,
      antialias: false,        // save GPU — not needed for fullscreen quad
      powerPreference: "high-performance",
    })
    if (!gl) return

    const compile = (type, src) => {
      const sh = gl.createShader(type)
      gl.shaderSource(sh, src)
      gl.compileShader(sh)
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh))
        return null
      }
      return sh
    }

    const link = (vs, fs) => {
      const p = gl.createProgram()
      const vShader = compile(gl.VERTEX_SHADER, vs)
      const fShader = compile(gl.FRAGMENT_SHADER, fs)
      if (!vShader || !fShader) return null
      gl.attachShader(p, vShader)
      gl.attachShader(p, fShader)
      gl.linkProgram(p)
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(p))
        return null
      }
      return p
    }

    const prog = link(vertSrc, fragSrc)
    if (!prog) return

    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ]), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, "u_res")
    const uTime = gl.getUniformLocation(prog, "u_time")

    // ── Render at reduced resolution (max 1.0 DPR) to cut GPU load 4x on retina ──
    const resize = () => {
      const dpr = Math.min(1, window.devicePixelRatio || 1)
      const w = Math.floor((canvas.clientWidth || window.innerWidth) * dpr)
      const h = Math.floor((canvas.clientHeight || window.innerHeight) * dpr)
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      gl.viewport(0, 0, w, h)
      gl.uniform2f(uRes, w, h)
    }

    window.addEventListener("resize", resize, { passive: true })
    resize()

    // ── Visibility-aware rendering: pause when canvas is off-screen ──
    let isVisible = true
    const visObs = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting },
      { threshold: 0 }
    )
    visObs.observe(canvas)

    // Also pause when tab is hidden
    const handleVisChange = () => {
      if (document.hidden) isVisible = false
    }
    document.addEventListener("visibilitychange", handleVisChange)

    let raf = 0
    const t0 = performance.now()
    const draw = () => {
      raf = requestAnimationFrame(draw)
      if (!isVisible) return // skip GPU work when not visible
      const t = (performance.now() - t0) / 1000
      gl.uniform1f(uTime, t)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      document.removeEventListener("visibilitychange", handleVisChange)
      visObs.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={ref}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        background: "#000",
        willChange: "auto",
        ...style,
      }}
    />
  )
}
