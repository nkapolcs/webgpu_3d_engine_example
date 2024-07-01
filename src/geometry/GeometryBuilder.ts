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
      1,0,0,1,
      0,1,0,1,
      0,0,1,1,
      1,1,0,1
    ])

    return new Geometry(vertices, indices, colors);
  }
}
