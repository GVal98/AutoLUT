import type { LutPreset } from './types'

const VERT = `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = vec2(a_pos.x * 0.5 + 0.5, 0.5 - a_pos.y * 0.5);
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`

const FRAG = `#version 300 es
precision highp float;
precision highp sampler3D;
in vec2 v_uv;
uniform sampler2D u_image;
uniform sampler3D u_lut;
uniform float u_lutSize;
uniform float u_intensity;
out vec4 fragColor;
void main() {
  vec4 color = texture(u_image, v_uv);
  float scale = (u_lutSize - 1.0) / u_lutSize;
  float offset = 0.5 / u_lutSize;
  vec3 lutCoord = color.rgb * scale + offset;
  vec3 mapped = texture(u_lut, lutCoord).rgb;
  fragColor = vec4(mix(color.rgb, mapped, u_intensity), color.a);
}
`

export class LutEngine {
  private gl: WebGL2RenderingContext
  private program: WebGLProgram
  private vao: WebGLVertexArrayObject
  private imageTex: WebGLTexture | null = null
  private lutTex: WebGLTexture | null = null
  private identityLut: WebGLTexture
  private uImage: WebGLUniformLocation
  private uLut: WebGLUniformLocation
  private uLutSize: WebGLUniformLocation
  private uIntensity: WebGLUniformLocation
  private _lutSize = 0
  private _disposed = false

  readonly canvas: HTMLCanvasElement

  constructor(canvas?: HTMLCanvasElement) {
    this.canvas = canvas ?? document.createElement('canvas')
    const gl = this.canvas.getContext('webgl2', {
      premultipliedAlpha: false,
      preserveDrawingBuffer: true,
    })
    if (!gl) throw new Error('WebGL2 not supported')
    this.gl = gl

    // Compile shaders
    const vs = this.compileShader(gl.VERTEX_SHADER, VERT)
    const fs = this.compileShader(gl.FRAGMENT_SHADER, FRAG)
    this.program = gl.createProgram()!
    gl.attachShader(this.program, vs)
    gl.attachShader(this.program, fs)
    gl.linkProgram(this.program)
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(this.program) ?? 'Link failed')
    }
    gl.deleteShader(vs)
    gl.deleteShader(fs)

    // Fullscreen quad VAO
    this.vao = gl.createVertexArray()!
    gl.bindVertexArray(this.vao)
    const buf = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(this.program, 'a_pos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)
    gl.bindVertexArray(null)

    // Uniforms
    this.uImage = gl.getUniformLocation(this.program, 'u_image')!
    this.uLut = gl.getUniformLocation(this.program, 'u_lut')!
    this.uLutSize = gl.getUniformLocation(this.program, 'u_lutSize')!
    this.uIntensity = gl.getUniformLocation(this.program, 'u_intensity')!

    // 2x2x2 identity LUT so the shader always has a valid 3D texture to sample
    this.identityLut = this.createIdentityLut()
  }

  private createIdentityLut(): WebGLTexture {
    const gl = this.gl
    const size = 2
    const data = new Uint8Array(size * size * size * 4)
    for (let b = 0; b < size; b++) {
      for (let g = 0; g < size; g++) {
        for (let r = 0; r < size; r++) {
          const idx = (b * size * size + g * size + r) * 4
          data[idx] = r * 255
          data[idx + 1] = g * 255
          data[idx + 2] = b * 255
          data[idx + 3] = 255
        }
      }
    }
    const tex = gl.createTexture()!
    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_3D, tex)
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texImage3D(gl.TEXTURE_3D, 0, gl.RGBA8, size, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, data)
    return tex
  }

  private compileShader(type: number, source: string): WebGLShader {
    const gl = this.gl
    const shader = gl.createShader(type)!
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(shader)
      gl.deleteShader(shader)
      throw new Error(info ?? 'Shader compile failed')
    }
    return shader
  }

  setImage(source: TexImageSource, width: number, height: number): void {
    const gl = this.gl
    this.canvas.width = width
    this.canvas.height = height
    gl.viewport(0, 0, width, height)

    if (this.imageTex) gl.deleteTexture(this.imageTex)
    this.imageTex = gl.createTexture()!
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.imageTex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source)
  }

  setLut(preset: LutPreset | null): void {
    const gl = this.gl
    if (this.lutTex) gl.deleteTexture(this.lutTex)

    if (!preset) {
      this.lutTex = null
      this._lutSize = 0
      return
    }

    this._lutSize = preset.size
    this.lutTex = gl.createTexture()!
    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_3D, this.lutTex)
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    // Check if RGBA32F with LINEAR is supported, fallback to RGBA16F
    const ext = gl.getExtension('OES_texture_float_linear')
    const internalFormat = ext ? gl.RGBA32F : gl.RGBA16F
    const type = ext ? gl.FLOAT : gl.HALF_FLOAT

    if (type === gl.HALF_FLOAT) {
      // Convert Float32 to Uint16 half-float
      const halfData = float32ToHalf(preset.data)
      gl.texImage3D(gl.TEXTURE_3D, 0, internalFormat, preset.size, preset.size, preset.size, 0, gl.RGBA, type, halfData)
    } else {
      gl.texImage3D(gl.TEXTURE_3D, 0, internalFormat, preset.size, preset.size, preset.size, 0, gl.RGBA, type, preset.data)
    }
  }

  render(intensity = 1.0): void {
    const gl = this.gl
    if (!this.imageTex) return

    gl.useProgram(this.program)
    gl.bindVertexArray(this.vao)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.imageTex)
    gl.uniform1i(this.uImage, 0)

    gl.activeTexture(gl.TEXTURE1)
    if (this.lutTex) {
      gl.bindTexture(gl.TEXTURE_3D, this.lutTex)
      gl.uniform1f(this.uLutSize, this._lutSize)
      gl.uniform1f(this.uIntensity, intensity)
    } else {
      gl.bindTexture(gl.TEXTURE_3D, this.identityLut)
      gl.uniform1f(this.uLutSize, 2.0)
      gl.uniform1f(this.uIntensity, 0.0)
    }
    gl.uniform1i(this.uLut, 1)

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    gl.bindVertexArray(null)
  }

  toBlob(type = 'image/png', quality = 0.92): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this.canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))),
        type,
        quality,
      )
    })
  }

  dispose(): void {
    if (this._disposed) return
    this._disposed = true
    const gl = this.gl
    if (this.imageTex) gl.deleteTexture(this.imageTex)
    if (this.lutTex) gl.deleteTexture(this.lutTex)
    gl.deleteTexture(this.identityLut)
    gl.deleteProgram(this.program)
    gl.deleteVertexArray(this.vao)
    // Only force-lose context for offscreen canvases (not attached to DOM).
    // For on-screen canvases, loseContext() is permanent and breaks
    // StrictMode's remount cycle.
    if (!this.canvas.parentNode) {
      const ext = gl.getExtension('WEBGL_lose_context')
      ext?.loseContext()
    }
  }
}

function float32ToHalf(data: Float32Array): Uint16Array {
  const out = new Uint16Array(data.length)
  for (let i = 0; i < data.length; i++) {
    out[i] = toHalf(data[i])
  }
  return out
}

function toHalf(val: number): number {
  const floatView = new Float32Array(1)
  const int32View = new Int32Array(floatView.buffer)
  floatView[0] = val
  const x = int32View[0]
  let bits = (x >> 16) & 0x8000
  let m = (x >> 12) & 0x07ff
  const e = (x >> 23) & 0xff
  if (e < 103) return bits
  if (e > 142) {
    bits |= 0x7c00
    bits |= (e === 255 ? 0 : 1) && x & 0x007fffff
    return bits
  }
  if (e < 113) {
    m |= 0x0800
    bits |= (m >> (114 - e)) + ((m >> (113 - e)) & 1)
    return bits
  }
  bits |= ((e - 112) << 10) | (m >> 1)
  bits += m & 1
  return bits
}
