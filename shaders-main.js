const mainVertexSource = `
attribute vec4 aPosition;
attribute vec3 aNormal;

uniform vec3 uAmbientLight;
uniform vec3 uLightColor;
uniform vec3 uLightDirection;
uniform mat4 uNormal;
uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

varying highp vec3 vLighting;

void main(void) {
  gl_Position = uProjection * uView * uModel * aPosition;
  
  highp vec4 transformedNormal = uNormal * vec4(aNormal, 1.0);
  highp float directional = max(dot(transformedNormal.xyz, normalize(uLightDirection)), 0.0);
  vLighting = uAmbientLight + (uLightColor * directional);
}
`;

const mainFragmentSource = `
varying highp vec3 vLighting;

void main(void) {
  gl_FragColor = vec4(vLighting, 1.0);
}
`;

