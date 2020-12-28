//import { vec3 } from 'gl-matrix'

export default class Camera {

    constructor() {
        //this.location = vec3.create(0.0, 0.0, -0.5);
        this.location = [0.0, 0.0, -5.0];
        this.fovy = (60 * 2.0 * 3.14159) / 360.0;
        this.aspect = 1.0;
        this.zNear = 0.1;
        this.zFar = 1000.0;
    }

    setAspect(width, height) {
        this.aspect = width / height;
    }
}