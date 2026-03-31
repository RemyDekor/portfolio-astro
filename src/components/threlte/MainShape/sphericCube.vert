// uniform mat4 projectionMatrix;
// uniform mat4 modelViewMatrix;
uniform float cubeSize;
uniform float sphereRadius;
uniform float roundness;
uniform float noiseScale;
uniform float noiseIntensity;
uniform float noiseOffset;
// attribute vec3 position;
// attribute vec3 normal;
varying vec3 vNormal;
varying vec3 wNormal;

#include "../../../../node_modules/lygia/generative/fbm.glsl"

void main() {
	vNormal = normal;
	
	// vec3 offs = normal * roundness;

	float x = position.x / (cubeSize/2.0);
	float y = position.y / (cubeSize/2.0);
	float z = position.z / (cubeSize/2.0);

	float dx = x * sqrt(1.0 - (y*y/2.0) - (z*z/2.0) + (y*y*z*z/3.0));
	float dy = y * sqrt(1.0 - (z*z/2.0) - (x*x/2.0) + (z*z*x*x/3.0));
	float dz = z * sqrt(1.0 - (x*x/2.0) - (y*y/2.0) + (x*x*y*y/3.0));

	float noise1 = fbm(vec3(dx * noiseScale, dy * noiseScale, dz * noiseScale * 0.5) + vec3(noiseOffset)) * (noiseIntensity * 1.3);
	float noise2 = fbm(vec3(dx * (noiseScale + 0.25) + 0.3, dy * (noiseScale + 0.25) + 0.3, dz * (noiseScale + 0.25) + 0.3) + vec3(noiseOffset)) * (noiseIntensity * 0.33);
	float noise3 = fbm(vec3(dx * (noiseScale + 0.75) + 0.6, dy * (noiseScale + 0.75) + 0.6, dz * (noiseScale + 0.75) + 0.6) + vec3(noiseOffset)) * (noiseIntensity * 0.08);

	vec3 dPos = vec3(dx, dy, dz) * sphereRadius; // sphere
	dPos *= 1.0 + noise1;
	dPos *= 1.0 + noise2;
	dPos *= 1.0 + noise3;

  vec3 cubePos = position * cubeSize; // cube
	cubePos *= 1.0 + noise1;
	cubePos *= 1.0 + noise2;
	cubePos *= 1.0 + noise3;

	vec3 sphereNormal = normalize(dPos);

	vNormal = mix(normal, sphereNormal, roundness);
	wNormal = normalMatrix * vNormal;
	vec3 newPos = mix(cubePos, dPos, roundness) ;

	gl_Position =  projectionMatrix *
				modelViewMatrix *
				vec4(newPos, 1.0);
}
