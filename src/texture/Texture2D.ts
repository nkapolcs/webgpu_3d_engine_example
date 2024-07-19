export class Texture2D {
  public texture!: GPUTexture;
  public sampler!: GPUSampler;

  constructor(private device: GPUDevice, texture: GPUTexture | null = null) {
    if (texture) {
      this.texture = texture;
    }
  }

  public static async create(device: GPUDevice, image: HTMLImageElement) {
    const texture = new Texture2D(device);
    await texture.initialize(image);
    return texture;
  }

  public static createEmpty(device: GPUDevice) {
    const texture = new Texture2D(device);
    texture.initializeFromData(new Uint8Array([255, 255, 255, 255]), 1, 1);
    return texture;
  }

  public static createDepthTexture(device: GPUDevice, width: number, height: number) {
    const depthTexture = device.createTexture({
      label: "Depth Texture",
      size: {
        width: width,
        height: height,
      },
      format: "depth32float",
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });

    return new Texture2D(device, depthTexture);
  }

  public static createShadowTexture(device: GPUDevice, width: number, height: number) {
    const depthTexture = device.createTexture({
      label: "Shadow Map Depth Texture",
      size: {
        width: width,
        height: height,
      },
      format: "depth32float",
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_DST | GPUTextureUsage.TEXTURE_BINDING,
    });

    const tex = new Texture2D(device, depthTexture);

    tex.sampler = device.createSampler({
      compare: "less-equal",
    });

    return tex;
  }

  private createTextureAndSampler(width: number, height: number) {
    this.texture = this.device.createTexture({
      size: { width, height },
      format: "rgba8unorm",
      usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT,
    });

    this.sampler = this.device.createSampler({
      magFilter: "linear",
      minFilter: "linear",
      addressModeU: "repeat",
      addressModeV: "repeat",
    });
  }

  public async initialize(image: HTMLImageElement) {
    this.createTextureAndSampler(image.width, image.height);

    const imageBitmap = await createImageBitmap(image);

    this.device.queue.copyExternalImageToTexture(
      {
        source: imageBitmap,
      },
      {
        texture: this.texture,
      },
      { width: image.width, height: image.height }
    );
  }

  public async initializeFromData(data: ArrayBuffer, width: number, height: number) {
    this.createTextureAndSampler(width, height);

    this.device.queue.writeTexture(
      {
        texture: this.texture,
      },
      data,
      {},
      { width, height }
    );
  }
}
