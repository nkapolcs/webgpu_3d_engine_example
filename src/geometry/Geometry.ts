export class Geometry {
  constructor(
    public positions: Float32Array,
    public indices: Uint16Array = new Uint16Array(),
    public colors: Float32Array = new Float32Array(),
    public texCoord: Float32Array = new Float32Array(),
    public normals: Float32Array = new Float32Array()
  ) {}
}
