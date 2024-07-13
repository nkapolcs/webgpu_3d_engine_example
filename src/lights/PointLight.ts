import { Color } from "../math/Color";
import { Vec3 } from "../math/Vec3";
import { UniformBuffer } from "../uniform_buffers/UniformBuffer";

export class PointLight {
  public color = new Color(1, 1, 1, 1);
  public intensity = 1;
  public position = new Vec3(0, 0, 0);
}

export class PointLightsCollection {
  public buffer: UniformBuffer;
  public lights: PointLight[] = [new PointLight(), new PointLight(), new PointLight()];

  constructor(device: GPUDevice) {
    this.buffer = new UniformBuffer(device, 3 * 8 * Float32Array.BYTES_PER_ELEMENT, "Directional Light Buffer");
  }

  public update() {
    for (let i = 0; i < this.lights.length; i++) {
      const data = new Float32Array([
        this.lights[i].color.r,
        this.lights[i].color.g,
        this.lights[i].color.b,
        this.lights[i].intensity,
        this.lights[i].position.x,
        this.lights[i].position.y,
        this.lights[i].position.z,
        0,
      ]);
      this.buffer.update(data, i * 8 * Float32Array.BYTES_PER_ELEMENT);
    }
  }
}
