export default class BigVec3D {
    constructor(initSize, tight = true) {
      this.size = initSize;
      this.data = new Float32Array(initSize * 3);
    }

    nanCheck() {
      if (DEBUG) {
        for (let i = 0; i < this.size * 3; ++i) {
          let x = this.data[i];
          if (+x !== x) {console.assert("NaNCheck failed");debugger;}
        }
      }
    }

    copy(other) {
      console.assert(this.size === other.size);
      for (let i = 0; i < this.size * 3; ++i) {
        this.data[i] = other.data[i];
      }
    }

    forEach(fn, self) {
      for (let i = 0, ii = 0; i < this.size; ++i, ii += 3) {
        fn.call(self, this.data[ii], this.data[ii + 1], this.data[ii + 2], i, this);
      }
    }

    init(x, y, z) {
      for (let i = 0; i < this.data.length; i += 3) {
        this.data[i + 0] = x;
        this.data[i + 1] = y;
        this.data[i + 2] = z;
      }
    }

    zero() {
      for (let i = 0, l = this.size * 3; i < l; ++i) {
        this.data[i] = 0.0;
      }
    }}