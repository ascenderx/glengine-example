const mainVertexSource = `
attribute vec4 aPosition;
attribute vec3 aNormal;

uniform mat4 uNormal;
uniform mat4 uModelView;
uniform mat4 uProjection;

varying highp vec3 vLighting;

void main(void) {
  gl_Position = uProjection * uModelView * aPosition;
  
  highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
  highp vec3 lightColor = vec3(1, 1, 1);
  highp vec3 lightDirection = normalize(vec3(0.85, 0.8, 0.75));
  highp vec4 transformedNormal = uNormal * vec4(aNormal, 1.0);
  highp float directional = max(dot(transformedNormal.xyz, lightDirection), 0.0);
  vLighting = ambientLight + (lightColor * directional);
}
`;

const mainFragmentSource = `
varying highp vec3 vLighting;

void main(void) {
  gl_FragColor = vec4(vLighting, 1.0);
}
`;

