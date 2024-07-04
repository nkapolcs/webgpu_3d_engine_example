struct VSInput {
  @location(0) position: vec3f,
  @location(1) color: vec4f,
  @location(2) texCoord: vec2f,
}

struct VSOutput {
  @builtin(position) position: vec4f,
  @location(1) color: vec4f,
  @location(2) texCoord: vec2f,
}

@group(0) @binding(0)
var<uniform> textureTilling: vec2f;

@vertex
fn unlitMaterialVS(
  in: VSInput,

  //builtins
  @builtin(vertex_index) vid: u32
) -> VSOutput {

  var out: VSOutput;
  out.position = vec4f(in.position, 1.0);
  out.color = in.color;
  out.texCoord = in.texCoord * textureTilling;

  return out;
}

@group(1) @binding(0)
var diffuseTexture: texture_2d<f32>;
@group(1) @binding(1)
var diffuseTexSampler: sampler;

@group(2) @binding(0)
var<uniform> diffuseColor: vec4f;

@fragment
fn unlitMaterialFS(in: VSOutput) -> @location(0) vec4f {
  return textureSample(diffuseTexture, diffuseTexSampler, in.texCoord) * in.color * diffuseColor;
}