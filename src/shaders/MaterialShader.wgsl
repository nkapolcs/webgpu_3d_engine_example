struct VSInput {
  @location(0) position: vec3f,
  @location(1) color: vec4f,
  @location(2) texCoord: vec2f,
  @location(3) normal: vec3f,
}

struct VSOutput {
  @builtin(position) position: vec4f,
  @location(1) color: vec4f,
  @location(2) texCoord: vec2f,
  @location(3) normal: vec3f,
  @location(4) fragPos: vec3f,
  @location(5) eye: vec3f,
}

@group(0) @binding(0)
var<uniform> transforms: array<mat4x4f, 1>;
@group(0) @binding(1)
var<uniform> normalMatrix: array<mat3x3f, 1>;
@group(0) @binding(2)
var<uniform> textureTilling: vec2f;

@group(1) @binding(0)
var<uniform> viewProjection: mat4x4f;
@group(1) @binding(1)
var<uniform> eye: vec3f;

@vertex
fn materialVS(
  in: VSInput,

  //builtins
  @builtin(vertex_index) vid: u32,
  @builtin(instance_index) iid: u32,
) -> VSOutput {

  var out: VSOutput;
  out.position = viewProjection * transforms[iid] * vec4f(in.position, 1.0);
  out.color = in.color;
  out.texCoord = in.texCoord * textureTilling;
  out.normal = normalMatrix[iid] * in.normal;
  out.fragPos = (transforms[iid] * vec4f(in.position, 1.0)).xyz;
  out.eye = eye;

  return out;
}

struct AmbientLight {
  @location(0) color: vec3f,
  @location(1) intensity: f32,
}

struct DirectionalLight {
  @location(0) color: vec3f,
  @location(1) intensity: f32,
  @location(2) direction: vec3f,
  @location(3) _discard: f32,
  @location(4) specularColor: vec3f,
  @location(5) specularIntensity: f32,
}

struct PointLight {
  @location(0) color: vec3f,
  @location(1) intensity: f32,
  @location(2) position: vec3f,
  @location(3) attenConst: f32,
  @location(4) attenLin: f32,
  @location(5) attenQuad: f32,
  @location(6) _discard: vec2f,
  @location(7) specularColor: vec3f,
  @location(8) specularIntensity: f32,
}

@group(2) @binding(0)
var diffuseTexture: texture_2d<f32>;
@group(2) @binding(1)
var diffuseTexSampler: sampler;
@group(2) @binding(2)
var<uniform> diffuseColor: vec4f;
@group(2) @binding(3)
var<uniform> shininess: f32;

@group(3) @binding(0)
var<uniform> ambientLight: AmbientLight;
@group(3) @binding(1)
var<uniform> directionalLight: DirectionalLight;
@group(3) @binding(2)
var<uniform> positionalLights: array<PointLight, 3>;

@fragment
fn materialFS(in: VSOutput) -> @location(0) vec4f {

  // Vector towards the eye
  var toEye = normalize(in.eye - in.fragPos);

  // Ambient Light
  var lightAmount = ambientLight.color * ambientLight.intensity;

  // Directional Light / Diffuse Light
  var lightDir = normalize(-directionalLight.direction);
  var n = normalize(in.normal);
  var diff = max(dot(n, lightDir), 0.0);
  lightAmount += directionalLight.color * directionalLight.intensity * diff;

  // Specular Light
  var halfVector = normalize(lightDir + toEye);
  var dotSpecular = max(dot(n, halfVector), 0);
  dotSpecular = pow(dotSpecular, shininess);
  lightAmount += directionalLight.specularColor * dotSpecular * directionalLight.specularIntensity;

  // Point Lights
  for(var i = 0; i < 3; i++) {
    var lightDir = normalize(positionalLights[i].position - in.fragPos);
    var dotLight = max(dot(n, lightDir), 0);
    lightAmount += positionalLights[i].color * positionalLights[i].intensity * dotLight;

    var distance = length(positionalLights[i].position - in.fragPos);
    var attenuation = positionalLights[i].attenConst
    + positionalLights[i].attenLin * distance
    + positionalLights[i].attenQuad * distance * distance;

    attenuation = 1.0 / attenuation;

    lightAmount += positionalLights[i].color * positionalLights[i].intensity * dotLight * attenuation;

    // Specular Light for Point Lights
    halfVector = normalize(lightDir + toEye);
    dotSpecular = max(dot(n, halfVector), 0);
    dotSpecular = pow(dotSpecular, shininess);
    lightAmount += positionalLights[i].specularColor * dotSpecular * positionalLights[i].specularIntensity;
  }

  var color = textureSample(diffuseTexture, diffuseTexSampler, in.texCoord) * in.color * diffuseColor;

  return vec4f(color.rgb * lightAmount, 1.0);
}