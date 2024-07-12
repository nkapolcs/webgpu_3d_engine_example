import { Camera } from "./Camera/Camera";
import { GeometryBuffersCollection } from "./attribute_buffers/GeometryBuffersCollection";
import { Ball } from "./game_objects/Ball";
import { Paddle } from "./game_objects/Paddle";
import { AmbientLight } from "./lights/AmbientLight";
import { DirectionalLight } from "./lights/DirectionalLight";
import { Color } from "./math/Color";
import { Vec3 } from "./math/Vec3";
import { Texture2D } from "./texture/Texture2D";

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

  GeometryBuffersCollection.initialize(device);

  // DEPTH TEXTURE
  const depthTexture = Texture2D.createDepthTexture(device, canvas.width, canvas.height);

  // LIGHTS
  const ambientLight = new AmbientLight(device);
  ambientLight.color = new Color(1, 1, 1, 1);
  ambientLight.intensity = 0.5;
  const directionalLight = new DirectionalLight(device);
  directionalLight.color = new Color(1, 1, 1, 1);
  directionalLight.intensity = 1;
  directionalLight.direction = new Vec3(0, 0, 1);

  // GAME OBJECTS
  const camera = new Camera(device, canvas.width / canvas.height);
  camera.eye = new Vec3(0, 0, -20);
  const paddle1 = new Paddle(device, camera, ambientLight, directionalLight);
  paddle1.position.x = -10;
  paddle1.color = new Color(1, 0, 0, 1);
  const paddle2 = new Paddle(device, camera, ambientLight, directionalLight);
  paddle2.position.x = 10;
  paddle2.color = new Color(0, 0, 1, 1);
  const ball = new Ball(device, camera, ambientLight, directionalLight);

  const update = () => {
    directionalLight.update();
    ambientLight.update();
    camera.update();
    paddle1.update();
    paddle2.update();
    ball.update();
  };

  const draw = () => {
    update();
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
        view: depthTexture.texture.createView(),
        depthLoadOp: "clear",
        depthStoreOp: "store",
        depthClearValue: 1.0,
      },
    });

    // DRAW HERE
    paddle1.draw(renderPassEncoder);
    paddle2.draw(renderPassEncoder);
    ball.draw(renderPassEncoder);

    renderPassEncoder.end();

    device.queue.submit([commandEncoder.finish()]);
    requestAnimationFrame(draw);
  };

  draw();
}

init();
