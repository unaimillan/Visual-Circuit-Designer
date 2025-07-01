import React, { useRef, useEffect } from "react";

const vertexShaderSource = `
  attribute vec3 aVertexPosition;
  void main(void) {
    gl_Position = vec4(aVertexPosition, 1.0);
  }
`;

const fragmentShaderSource = `
precision highp float;

uniform float iTime;
uniform vec2 iResolution;

vec4 sigmoid(vec4 x) {
  return 1.0 / (1.0 + exp(-x));
}

vec4 cppn_fn(vec2 uv, float t1, float t2, float t3) {
  vec4 buf[8];
  buf[0] = vec4(uv.x, uv.y, t1, 1.0);

  buf[1] = vec4(-2.5, 0.4, -1.2, 0.0);
  buf[2] = vec4(1.3, 0.02, -6.0, 0.0);
  buf[3] = vec4(0.57, 0.82, 0.02, 0.0);
  buf[4] = vec4(1.27, 1.71, 1.39, 0.0);
  buf[5] = vec4(4.19, 6.34, -1.76, 0.0);
  buf[6] = vec4(1.38, -0.80, -1.21, 0.0);
  buf[7] = vec4(5.06, 1.92, 5.32, 0.0);

  buf[0] = sigmoid(buf[0]);
  return vec4(buf[0].x, buf[0].y, buf[0].z, 1.0);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = fragCoord / iResolution.xy * 2.0 - 0.8;
  uv.y *= -1.0;
  fragColor = cppn_fn(uv, 0.4 * sin(0.3 * iTime), 0.3 * sin(0.69 * iTime), 0.3 * sin(0.44 * iTime));
}

void main() {
  vec4 color = vec4(0.0);
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}
`;

export function WebGLShaderCanvas() {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl");

    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    const compileShader = (source, type) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const vertices = new Float32Array([
      1, 1, 0,
      -1, 1, 0,
      1, -1, 0,
      -1, -1, 0,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "aVertexPosition");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    const iResolution = gl.getUniformLocation(program, "iResolution");
    const iTime = gl.getUniformLocation(program, "iTime");

    const render = (time) => {
      time *= 0.001;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(iResolution, canvas.width, canvas.height);
      gl.uniform1f(iTime, time);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}

export default WebGLShaderCanvas;
