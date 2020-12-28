//import { vec3 } from 'gl-matrix'

export default class Pyramid {

    constructor() {
        //this.location = vec3.create(0.5, 0.6, 0.5)
        this.location = [0.5, 0.6, 0.5]
        this.vertexPositions_TRIANGLE = [
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            0.0, 1.0, 0.0,
            1.0, -1.0, 1.0,
            1.0, -1.0, -1.0,
            0.0, 1.0, 0.0,
            1.0, -1.0, -1.0,
            -1.0, -1.0, -1.0,
            0.0, 1.0, 0.0,
            -1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0,
            0.0, 1.0, 0.0,
            -1.0, -1.0, -1.0,
            1.0, -1.0, 1.0,
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0
        ];

        // coordonate de textură
        this.textureCoordinates_TRIANGLES = [
            0.0, 0.0,
            1.0, 0.0,
            0.5, 1.0,

            0.0, 0.0,
            1.0, 0.0,
            0.5, 1.0,

            0.0, 0.0,
            1.0, 0.0,
            0.5, 1.0,

            0.0, 0.0,
            1.0, 0.0,
            0.5, 1.0,

            // triunghurile bazei:
            0.5, 0.5,// aici e o greșală
            1.0, 1.0,
            0.0, 1.0,

            1.0, 1.0,
            0.0, 0.0,
            1.0, 0.0
        ];
    }

    getPositionsValues() {
        return this.vertexPositions
    }

    getTexturePositionValues() {
        return this.textureCoordinates_TRIANGLES
    }
}
