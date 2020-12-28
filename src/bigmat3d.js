export default class BigMat3D {
    constructor(diagSize) {
      this.size = diagSize;
      this.data = new Float32Array(Math.max(diagSize, 16) * 9);
      this.posns = new Uint16Array(Math.max(diagSize, 16) * 2);
      for (let i = 0, j = 0; i < diagSize; ++i, j += 2) {
        this.posns[j] = this.posns[j + 1] = i;
      }
    }

    initDiag(f) {
      for (let i = 0, pi = 0, mi = 0; i < this.size; ++i, pi += 2, mi += 9) {
        let d = this.posns[pi] === this.posns[pi + 1] ? f : 0.0;
        for (let r = 0; r < 3; ++r) {
          for (let c = 0; c < 3; ++c) {
            this.data[mi + r * 3 + c] = r === c ? d : 0.0;
          }
        }
      }
    }

    zero() {
      for (let i = 0, l = this.size * 9; i < l; ++i) {
        this.data[i] = 0.0;
      }
    }

    capacity() {
      return Math.floor(this.data.length / 9);
    }

    grow_() {
      let nextData = new Float32Array(this.data.length * 2);
      for (let i = 0; i < this.data.length; ++i) {nextData[i] = this.data[i];}
      this.data = nextData;
      let nextPosns = new Uint16Array(this.posns.length * 2);
      for (let i = 0; i < this.posns.length; ++i) {nextPosns[i] = this.posns[i];}
      this.posns = nextPosns;
    }

    push(r, c) {
      if (this.size + 1 >= this.capacity()) {this.grow_();}
      let nextIdx = this.size * 9;
      let nextPosIdx = this.size * 2;
      this.posns[nextPosIdx + 0] = r;
      this.posns[nextPosIdx + 1] = c;
      this.data[nextIdx + 0] = 0.0;this.data[nextIdx + 1] = 0.0;this.data[nextIdx + 2] = 0.0;
      this.data[nextIdx + 3] = 0.0;this.data[nextIdx + 4] = 0.0;this.data[nextIdx + 5] = 0.0;
      this.data[nextIdx + 6] = 0.0;this.data[nextIdx + 7] = 0.0;this.data[nextIdx + 8] = 0.0;
      ++this.size;
      return nextIdx;
    }

    forEach(fn, self) {
      for (let i = 0, ii = 0, pi = 0; i < this.size; ++i, ii += 9, pi += 2) {
        fn.call(self, ii, this.posns[pi], this.posns[pi + 1], i, this);
      }
    }

    nanCheck() {
      if (DEBUG) {
        for (let i = 0; i < this.size * 9; ++i) {
          let x = this.data[i];
          if (+x !== x) {console.assert("NaNCheck failed");debugger;}
        }
      }
    }

    pushFront(r, c) {
      if (this.size + 1 >= this.capacity()) {
        this.grow_();
      }
      this.size++;
      for (let totalSize = this.size * 9, i = totalSize - 1; i >= 9; --i) {
        this.data[i] = this.data[i - 9];
      }

      for (let i = this.size * 2 - 1; i >= 2; --i) {
        this.posns[i] = this.posns[i - 2];
      }

      for (let i = 0; i < 9; ++i) {
        this.data[i] = 0.0;
      }

      this.posns[0] = r;
      this.posns[1] = c;
      return 0;
    }

    clearRow(index) {
      let j = 0;
      for (let i = 0, l = this.size; i < l; ++i) {
        if (this.posns[i * 2] !== index) {
          this.posns[j * 2 + 0] = this.posns[i * 2 + 0];
          this.posns[j * 2 + 1] = this.posns[i * 2 + 1];
          let mi = i * 9,mj = j * 9;
          for (let mii = 0; mii < 9; ++mii) {
            this.data[mj + mii] = this.data[mi + mii];
          }
          j++;
        }
      }
      this.size = j;
    }}