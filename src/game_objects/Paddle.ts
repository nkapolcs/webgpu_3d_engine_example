import { GeometryBuffersCollection } from "../attribute_buffers/GeometryBuffersCollection";
import { Camera } from "../Camera/Camera";
import { AmbientLight } from "../lights/AmbientLight";
import { DirectionalLight } from "../lights/DirectionalLight";
import { PointLightsCollection } from "../lights/PointLight";
import { Color } from "../math/Color";
import { Mat3x3 } from "../math/Mat3x3";
import { Mat4x4 } from "../math/Mat4x4";
import { Vec3 } from "../math/Vec3";
import { RenderPipeline } from "../render_pipelines/RenderPipeline";
import { UniformBuffer } from "../uniform_buffers/UniformBuffer";

export class Paddle {
  private pipeline: RenderPipeline;
  private transformBuffer: UniformBuffer;
  private normalMatrixBuffer: UniformBuffer;

  private transform = Mat4x4.identity();

  public scale = new Vec3(1, 5, 1);
  public position = new Vec3(0, 0, 0);

  public color = new Color(1, 1, 1, 1);

  private angle = 0.0;

  constructor(device: GPUDevice, camera: Camera, ambientLight: AmbientLight, directionalLight: DirectionalLight, pointLights: PointLightsCollection) {
    this.transformBuffer = new UniformBuffer(device, this.transform, "Paddle Transform");

    this.normalMatrixBuffer = new UniformBuffer(device, 16 * Float32Array.BYTES_PER_ELEMENT, "Paddle Normal Matrix");

    this.pipeline = new RenderPipeline(device, camera, this.transformBuffer, this.normalMatrixBuffer, ambientLight, directionalLight, pointLights);
  }

  public update() {
    this.angle += 0.01;
    const scale = Mat4x4.scale(this.scale.x, this.scale.y, this.scale.z);
    const rotation = Mat4x4.rotationZ(this.angle);
    const translate = Mat4x4.translation(this.position.x, this.position.y, this.position.z);

    this.transform = Mat4x4.multiply(translate, rotation);
    this.transform = Mat4x4.multiply(this.transform, scale);

    let normalMatrix = Mat3x3.fromMat4x4(this.transform);
    normalMatrix = Mat3x3.transpose(normalMatrix);
    normalMatrix = Mat3x3.inverse(normalMatrix);
    this.normalMatrixBuffer.update(Mat3x3.to16AlignedMat3x3(normalMatrix));

    this.transformBuffer.update(this.transform);
  }

  public draw(renderPassEncoder: GPURenderPassEncoder) {
    this.pipeline.diffuseColor = this.color;
    this.pipeline.draw(renderPassEncoder, GeometryBuffersCollection.cubeBuffers);
  }
}
