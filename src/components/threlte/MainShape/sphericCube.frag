// uniform vec2 resolution;
uniform float roundness;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 lightDir;

varying mediump vec3 vNormal;
varying mediump vec3 wNormal;

void main() {
	// vec3 baseColor = vec3(roundness, 1. - roundness, 1.);
	vec3 baseColor = mix(color1, color2, roundness);

	// ensure it's normalized
	vec3 light = normalize(lightDir);

	// calculate the dot product of
	// the light to the vertex normal
	mediump float dProd = max(0.85, dot(normalize(wNormal), light));

	// feed into our frag colour
	gl_FragColor = vec4(baseColor.r * dProd, // R
						baseColor.g * dProd, // G
						baseColor.b * dProd, // B
						1.0);  // A
}
