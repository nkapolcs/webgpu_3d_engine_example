import { ShadowCamera } from "../Camera/ShadowCamera";
import { GeometryBuffers } from "../attribute_buffers/GeometryBuffers";
import shaderSource from "../shaders/ShadowShader.wgsl?raw";
import { UniformBuffer } from "../uniform_buffers/UniformBuffer";

export class ShadowRenderPipeline {
  private renderPipeline: GPURenderPipeline;

  private projectionViewBindGroup!: GPUBindGroup;
  private vertexBindGroup!: GPUBindGroup;

  constructor(private device: GPUDevice, camera: ShadowCamera, transformsBuffer: UniformBuffer) {
    const shaderModule = device.createShaderModule({
      code: shaderSource,
    });

    const bufferLayout: Array<GPUVertexBufferLayout> = [];

    // POSITIONS
    bufferLayout.push({
      arrayStride: 3 * Float32Array.BYTES_PER_ELEMENT,
      attributes: [
        {
          shaderLocation: 0,
          offset: 0,
          format: "float32x3",
        },
      ],
    });

    // RELATED TO VERTEX
    const vertexGroupLayout = device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: {},
        },
      ],
    });

    // RELATED TO CAMERA
    const projectionViewGroupLayout = device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: {},
        },
      ],
    });

    const layout = device.createPipelineLayout({
      bindGroupLayouts: [
        vertexGroupLayout, // group 0
        projectionViewGroupLayout, // group 1
      ],
    });

    this.renderPipeline = device.createRenderPipeline({
      layout: layout,
      label: "Shadow Render Pipeline",
      vertex: {
        buffers: bufferLayout,
        module: shaderModule,
        entryPoint: "shadowVS",
      },
      // CONFIGURE DEPTH
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: "less",
        format: "depth32float",
      },
    });

    // BIND GROUP RELATED TO VERTEX, TRANSFORMATIONS etc...
    this.vertexBindGroup = device.createBindGroup({
      layout: vertexGroupLayout,
      entries: [
        {
          binding: 0,
          resource: {
            buffer: transformsBuffer.buffer,
          },
        },
      ],
    });

    // BIND GROUP RELATED TO CAMERA. PROJECTION VIEW etc...
    this.projectionViewBindGroup = device.createBindGroup({
      layout: projectionViewGroupLayout,
      entries: [
        {
          binding: 0,
          resource: {
            buffer: camera.buffer.buffer,
          },
        },
      ],
    });
  }

  public draw(renderPassEncoder: GPURenderPassEncoder, buffers: GeometryBuffers, instanceCount = 1) {
    renderPassEncoder.setPipeline(this.renderPipeline);
    renderPassEncoder.setVertexBuffer(0, buffers.positionsBuffer);

    // passes texture
    renderPassEncoder.setBindGroup(0, this.vertexBindGroup);
    renderPassEncoder.setBindGroup(1, this.projectionViewBindGroup);

    // draw with indexed buffer
    if (buffers.indicesBuffer) {
      renderPassEncoder.setIndexBuffer(buffers.indicesBuffer, "uint16");
      renderPassEncoder.drawIndexed(buffers.indicesCount!, instanceCount, 0, 0, 0);
    } else {
      renderPassEncoder.draw(buffers.vertextCount, instanceCount, 0, 0);
    }
  }
}
