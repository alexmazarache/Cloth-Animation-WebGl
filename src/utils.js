import vsSource from './shaders/vertex.glsl';
import fsSource from './shaders/fragment.glsl';

export default class Utils {

  
    static dot(a, b) {
        let r = 0.0,sz = a.size;
        console.assert(a.size === b.size);
        for (let i = 0, size = a.size * 3; i < size; ++i) r += a.data[i] * b.data[i];
        return r;
      }

      
    static mul(out, mat, vec) {
        if (!out) out = new BigVec3D(v.size);
        else out.init(0, 0, 0);
        let m = mat.data, v = vec.data, o = out.data;
        for (let i = 0, sz = mat.size; i < sz; i++) {
            let r = mat.posns[i*2+0], c = mat.posns[i*2+1];
            let mi = (i * 9) >>> 0, vr = (r * 3) >>> 0, vc = (c * 3) >>> 0;
          let mxx = +m[mi+0], mxy = +m[mi+1], mxz = +m[mi+2];
          let myx = +m[mi+3], myy = +m[mi+4], myz = +m[mi+5];
          let mzx = +m[mi+6], mzy = +m[mi+7], mzz = +m[mi+8];
          let vx = +v[vr+0], vy = +v[vr+1], vz = +v[vr+2];
          o[vc+0] += vx*mxx + vy*myx + vz*mzx;
          o[vc+1] += vx*mxy + vy*myy + vz*mzy;
          o[vc+2] += vx*mxz + vy*myz + vz*mzz;
        }
        return out;
      }
      
      static  foreach2d(w, h, fn) {
        for (let i = 0; i < h; ++i) {
          for (let j = 0; j < w; ++j) {
            fn(i, j);
          }
        }
      }


  static createVertexShader(gl) {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    
    gl.shaderSource(vertexShader, vsSource)
    gl.compileShader(vertexShader)

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      alert('vertex compilation failed: ' + gl.getShaderInfoLog(vertexShader));
      gl.deleteShader(vertexShader);
      return null;
    }

    return vertexShader
  }

  static createFragmentShader(gl) {
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fsSource);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      alert('fragment compilation failed: ' + gl.getShaderInfoLog(fragmentShader));
      gl.deleteShader(fragmentShader);
      return null;
    }

    return fragmentShader
  }

  static createShaderProgram(gl) {

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, Utils.createVertexShader(gl));
    gl.attachShader(shaderProgram, Utils.createFragmentShader(gl));
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert('Unable to link the shader program: ' + gl.getProgramInfoLog(shaderProgram));
      return null;
    }

    return shaderProgram;
  }
}