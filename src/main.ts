import { Camera } from "./Camera/Camera";
import { GeometryBuffers } from "./attribute_buffers/GeometryBuffers";
import { GeometryBuilder } from "./geometry/GeometryBuilder";
import { Mat4x4 } from "./math/Mat4x4";
import { Vec2 } from "./math/Vec2";
import { Vec3 } from "./math/Vec3";
import { UnlitRenderPipeline } from "./render_pipelines/UnlitRenderPipeline";
import { Texture2D } from "./texture/Texture2D";
import { UniformBuffer } from "./uniform_buffers/UniformBuffer";

async function loadImage(path: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = path;
    image.onload = () => resolve(image);
    image.onerror = reject;
  });
}

let angle = 0;
let position = 0;

async function init() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const gpuContext = canvas.getContext("webgpu") as GPUCanvasContext;

  if (!gpuContext) {
    alert("WebGPU not supported!");
    return;
  }

  const adapter = await navigator.gpu.requestAdapter();
  const device = await adapter!.requestDevice();

  gpuContext.configure({
    device: device,
    format: navigator.gpu.getPreferredCanvasFormat(),
  });

  // DEPTH TEXTURE
  const depthTexture = device.createTexture({
    label: "Depth Texture",
    size: {
      width: canvas.width,
      height: canvas.height,
    },
    format: "depth32float",
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  });

  // TRANSFORMS BUFFER
  const transformsBuffer = new UniformBuffer(device, 100 * Mat4x4.BYTE_SIZE, "Transforms Buffer");
  const transformMatrix = Mat4x4.translation(0, 0, 3);
  transformsBuffer.update(transformMatrix, 0 * Mat4x4.BYTE_SIZE);

  const camera = new Camera(device);
  const view = Mat4x4.lookAt(new Vec3(0, 3, 0), new Vec3(0, 0, 3), new Vec3(0, 1, 0));
  // const view = Mat4x4.orthographic(-1, 1, -1, 1, 0, 1);
  const perspective = Mat4x4.perspective(60, canvas.width / canvas.height, 0.01, 10);
  camera.projectionView = Mat4x4.multiply(perspective, view);

  const unlitPipeline = new UnlitRenderPipeline(device, camera, transformsBuffer);
  const geometry = new GeometryBuilder().createCubeGeometry();
  const geometryBuffers = new GeometryBuffers(device, geometry);

  const image = await loadImage("assets/test_texture.jpeg");
  const diffuseTexture = await Texture2D.create(device, image);
  unlitPipeline.diffuseTexture = diffuseTexture;
  unlitPipeline.textureTilling = new Vec2(1, 1);

  const draw = () => {
    const commandEncoder = device.createCommandEncoder();

    const renderPassEncoder = commandEncoder.beginRenderPass({
      colorAttachments: [
        {
          view: gpuContext.getCurrentTexture().createView(),
          storeOp: "store",
          clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
          loadOp: "clear",
        },
      ],
      // CONFIGURE DEPTH
      depthStencilAttachment: {
        view: depthTexture.createView(),
        depthLoadOp: "clear",
        depthStoreOp: "store",
        depthClearValue: 1.0,
      },
    });

    // DRAW HERE
    position += 0.01;
    const view = Mat4x4.lookAt(new Vec3(position, 3, position), new Vec3(0, 0, 3), new Vec3(0, 1, 0));
    const perspective = Mat4x4.perspective(60, canvas.width / canvas.height, 0.01, 10);
    camera.projectionView = Mat4x4.multiply(perspective, view);

    unlitPipeline.draw(renderPassEncoder, geometryBuffers, 1);

    renderPassEncoder.end();

    device.queue.submit([commandEncoder.finish()]);
    requestAnimationFrame(draw);
  };

  draw();
}

init();
