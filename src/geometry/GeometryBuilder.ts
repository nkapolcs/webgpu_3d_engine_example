import { Geometry } from "./Geometry";

export class GeometryBuilder {
  public createQuadGeometry(): Geometry {
    // prettier-ignore
    let vertices = new Float32Array([
      // t1
      -0.5, -0.5, 0.0, // bottom left
      -0.5,  0.5, 0.0, // top left
       0.5, -0.5, 0.0, // bottom right
       0.5,  0.5, 0.0, // rop right
    ])

    // prettier-ignore
    let indices = new Uint16Array([
      0, 1, 2, // t1
      1, 3, 2  // t2
    ])

    // prettier-ignore
    let colors = new Float32Array([
      1,1,1,1,
      1,1,1,1,
      1,1,1,1,
      1,1,1,1
    ])

    // prettier-ignore
    let texCoord = new Float32Array([
      0,1, // bottom left
      0,0, // top left
      1,1, // bottom right
      1,0  // top right
    ])

    return new Geometry(vertices, indices, colors, texCoord);
  }
  public createCubeGeometry(): Geometry {
    // prettier-ignore
    let vertices = new Float32Array([
        // front
        -0.5,-0.5,-0.5, // bottom left
        -0.5, 0.5,-0.5, // top left
         0.5,-0.5,-0.5, // bottom right
         0.5, 0.5,-0.5, // top right
        // back
        -0.5,-0.5, 0.5, // bottom left
        -0.5, 0.5, 0.5, // top left
         0.5,-0.5, 0.5, // bottom right
         0.5, 0.5, 0.5, // top right

        // left
        -0.5,-0.5,-0.5, // bottom left
        -0.5, 0.5,-0.5, // top left
        -0.5,-0.5, 0.5, // bottom right
        -0.5, 0.5, 0.5, // top right

        // right
         0.5,-0.5,-0.5, // bottom left
         0.5, 0.5,-0.5, // top left
         0.5,-0.5, 0.5, // bottom right
         0.5, 0.5, 0.5, // top right

        // top
        -0.5, 0.5,-0.5, // bottom left
        -0.5, 0.5, 0.5, // top left
         0.5, 0.5,-0.5, // bottom right
         0.5, 0.5, 0.5, // top right

        // bottom
        -0.5,-0.5,-0.5, // bottom left
        -0.5,-0.5, 0.5, // top left
         0.5,-0.5,-0.5, // bottom right
         0.5,-0.5, 0.5, // top right
    ]);

    // prettier-ignore
    let indices = new Uint16Array([
        // front
        0, 1, 2,
        1, 3, 2,
        // back
        4, 6, 5,
        5, 6, 7,
        // left
        8, 9, 10,
        9, 11, 10,
        // right
        12, 14, 13,
        13, 14, 15,
        // top
        16, 18, 17,
        17, 18, 19,
        // bottom
        20, 21, 22,
        21, 23, 22
    ]);

    // prettier-ignore
    let colors = new Float32Array([
        // front
        1, 1, 1, 1,
        1, 1, 1, 1,
        1, 1, 1, 1,
        1, 1, 1, 1,
        // back
        1, 1, 1, 1,
        1, 1, 1, 1,
        1, 1, 1, 1,
        1, 1, 1, 1,
        // left
        1, 1, 1, 1,
        1, 1, 1, 1,
        1, 1, 1, 1,
        1, 1, 1, 1,
        // right
        1, 1, 1, 1,
        1, 1, 1, 1,
        1, 1, 1, 1,
        1, 1, 1, 1,
        // top
        1, 1, 1, 1,
        1, 1, 1, 1,
        1, 1, 1, 1,
        1, 1, 1, 1,
        // bottom
        1, 1, 1, 1,
        1, 1, 1, 1,
        1, 1, 1, 1,
        1, 1, 1, 1
    ]);

    // prettier-ignore
    let texCoords = new Float32Array([
        // front
        0, 1,
        0, 0,
        1, 1,
        1, 0,
        // back
        0, 1,
        0, 0,
        1, 1,
        1, 0,
        // left
        0, 1,
        0, 0,
        1, 1,
        1, 0,
        // right
        0, 1,
        0, 0,
        1, 1,
        1, 0,
        // top
        0, 1,
        0, 0,
        1, 1,
        1, 0,
        // bottom
        0, 1,
        0, 0,
        1, 1,
        1, 0
    ]);

    // prettier-ignore
    let normals = new Float32Array([
      // front
       0, 0,-1, // bottom left
       0, 0,-1, // top left
       0, 0,-1, // bottom right
       0, 0,-1, // top right
      // back
       0, 0, 1, // bottom left
       0, 0, 1, // top left
       0, 0, 1, // bottom right
       0, 0, 1, // top right

      // left
      -1, 0, 0, // bottom left
      -1, 0, 0, // top left
      -1, 0, 0, // bottom right
      -1, 0, 0, // top right

      // right
       1, 0, 0, // bottom left
       1, 0, 0, // top left
       1, 0, 0, // bottom right
       1, 0, 0, // top right

      // top
       0, 1, 0, // bottom left
       0, 1, 0, // top left
       0, 1, 0, // bottom right
       0, 1, 0, // top right

      // bottom
       0,-1, 0, // bottom left
       0,-1, 0, // top left
       0,-1, 0, // bottom right
       0,-1, 0, // top right
    ]);

    return new Geometry(vertices, indices, colors, texCoords, normals);
  }
}
