import { GeometryBuffers } from "./attribute_buffers/GeometryBuffers";
import { Geometry } from "./geometry/Geometry";
import { GeometryBuilder } from "./geometry/GeometryBuilder";
import { UnlitRenderPipeline } from "./render_pipelines/UnlitRenderPipeline";

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

  const unlitPipeline = new UnlitRenderPipeline(device);
  const geometry = new GeometryBuilder().createQuadGeometry();
  const geometryBuffers = new GeometryBuffers(device, geometry);

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
    });

    // DRAW HERE

    unlitPipeline.draw(renderPassEncoder, geometryBuffers);

    renderPassEncoder.end();

    device.queue.submit([commandEncoder.finish()]);
    requestAnimationFrame(draw);
  };

  draw();
}

init();
