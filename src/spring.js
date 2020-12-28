export default class Spring {
    constructor(type, a, b, rest) {
      this.type = type; // index into SpringConstants -- probably should just store k value here...
      this.rest = rest;
      this.a = a;
      this.b = b;
      this.iab = -1;
      this.iba = -1;
    }}
