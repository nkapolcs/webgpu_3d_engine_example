import { Geometry } from "../geometry/Geometry";

export class GeometryBuffers {
  public readonly positionsBuffer: GPUBuffer;
  public readonly indicesBuffer?: GPUBuffer;
  public readonly colorsBuffer: GPUBuffer;
  public readonly texCoordsBuffer: GPUBuffer;
  public readonly normalsBuffer: GPUBuffer;

  public readonly vertextCount: number;
  public readonly indicesCount?: number;

  constructor(device: GPUDevice, geometry: Geometry) {
    // Positions
    this.positionsBuffer = device.createBuffer({
      label: "Positions Buffer",
      size: geometry.positions.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });

    device.queue.writeBuffer(this.positionsBuffer, 0, geometry.positions.buffer, 0, geometry.positions.byteLength);

    this.vertextCount = geometry.positions.length / 3; // (xyz)

    // Indices
    if (geometry.indices.length > 0) {
      this.indicesBuffer = device.createBuffer({
        label: "Indices Buffer",
        size: geometry.indices.byteLength,
        usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
      });

      device.queue.writeBuffer(this.indicesBuffer, 0, geometry.indices.buffer, 0, geometry.indices.byteLength);

      this.indicesCount = geometry.indices.length;
    }

    // Colors
    this.colorsBuffer = device.createBuffer({
      label: "Colors Buffer",
      size: geometry.colors.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });

    device.queue.writeBuffer(this.colorsBuffer, 0, geometry.colors.buffer, 0, geometry.colors.byteLength);

    // TexCoords
    this.texCoordsBuffer = device.createBuffer({
      label: "TexCoords Buffer",
      size: geometry.texCoord.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });

    device.queue.writeBuffer(this.texCoordsBuffer, 0, geometry.texCoord.buffer, 0, geometry.texCoord.byteLength);

    // Normals
    this.normalsBuffer = device.createBuffer({
      label: "Normals Buffer",
      size: geometry.normals.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });

    device.queue.writeBuffer(this.normalsBuffer, 0, geometry.normals.buffer, 0, geometry.normals.byteLength);
  }
}
