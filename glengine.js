const AXIS_X = [1, 0, 0];
const AXIS_Y = [0, 1, 0];
const AXIS_Z = [0, 0, 1];

class GLEngine {
  static getGLFromCanvas(canvas) {
    let gl = null;
    for (const type of ['webgl', 'webgl-experimental']) {
      // Set `antialias: false` for chunky pixels.
      gl = canvas.getContext(type, {antialias: true});
      if (gl !== null) {
        return gl;
      }
    }
    throw 'Unable to get WebGL context';
  }

  constructor(gl, light, camera) {
    this._gl = gl;
    this._light = light;
    this._camera = camera;
    
    this._programs = {
      main: this._initializeProgram(mainVertexSource, mainFragmentSource),
    };

    this._locations = {
      main: {
        attributes: this._getAttributeLocations(
          this._programs.main,
          'aPosition',
          'aNormal',
        ),
        uniforms: this._getUniformLocations(
          this._programs.main,
          'uAmbientLight',
          'uLightColor',
          'uLightDirection',
          'uNormal',
          'uModel',
          'uView',
          'uProjection',
        ),
      },
    };

    this._entities = [];
  }

  pushEntity({position, rotation, vertices, normals, indices}) {
    const gl = this._gl;
    this._entities.push({
      position: position,
      rotation: rotation,
      vertexCount: indices.length,
      vertexBuffer: this._initializeBuffer(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW),
      normalBuffer: this._initializeBuffer(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW),
      indexBuffer: this._initializeBuffer(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW),
    });
  }

  resize(width, height) {
    this._gl.viewport(0, 0, width, height);
  }

  render() {
    const gl = this._gl;
    const light = this._light;
    const camera = this._camera;
    const programs = this._programs;
    const locations = this._locations;
    const entities = this._entities;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const projectionMatrix = mat4.create();
    mat4.perspective(
      projectionMatrix,
      45 * Math.PI / 180, // field of view (radians)
      gl.canvas.clientWidth / gl.canvas.clientHeight, // aspect ratio
      0.1, // Z near
      1000.0 // Z far
    );

    const viewMatrix = mat4.create();
    mat4.rotate(
      viewMatrix,
      viewMatrix,
      camera.pitchValue * RADIANS,
      AXIS_X
    );
    mat4.rotate(
      viewMatrix,
      viewMatrix,
      camera.yawValue * RADIANS,
      AXIS_Y
    );
    mat4.rotate(
      viewMatrix,
      viewMatrix,
      camera.rollValue * RADIANS,
      AXIS_Z
    );

    for (let entity of entities) {
      const modelMatrix = mat4.create();
      mat4.translate(
        modelMatrix,
        modelMatrix,
        entity.position
      );
      // The camera's position is stored as the additive inverse (negative)
      // of its logical position, so we'll simply add it here, which is
      // the same as subtracting its logical position.
      mat4.translate(
        modelMatrix,
        modelMatrix,
        camera.position
      );
      mat4.rotate(
        modelMatrix,
        modelMatrix,
        entity.rotation[0],
        AXIS_X
      );
      mat4.rotate(
        modelMatrix,
        modelMatrix,
        entity.rotation[1],
        AXIS_Y
      );
      mat4.rotate(
        modelMatrix,
        modelMatrix,
        entity.rotation[2],
        AXIS_Z
      );
      const normalMatrix = mat4.create();
      mat4.invert(normalMatrix, modelMatrix);
      mat4.transpose(normalMatrix, normalMatrix);

      gl.bindBuffer(gl.ARRAY_BUFFER, entity.vertexBuffer);
      gl.vertexAttribPointer(
        locations.main.attributes.aPosition,
        3, // number of components
        gl.FLOAT, // type
        false, // normalize
        0, // stride
        0 // offset
      );
      gl.enableVertexAttribArray(locations.main.attributes.aPosition);

      gl.bindBuffer(gl.ARRAY_BUFFER, entity.normalBuffer);
      gl.vertexAttribPointer(
        locations.main.attributes.aNormal,
        3, // number of components
        gl.FLOAT, // type
        false, // normalize
        0, // stride
        0, // offset
      );
      gl.enableVertexAttribArray(locations.main.attributes.aNormal);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, entity.indexBuffer);

      gl.useProgram(programs.main);

      gl.uniform3fv(
        locations.main.uniforms.uAmbientLight,
        light.ambient
      );
      gl.uniform3fv(
        locations.main.uniforms.uLightColor,
        light.color
      );
      gl.uniform3fv(
        locations.main.uniforms.uLightDirection,
        light.direction
      );
      gl.uniformMatrix4fv(
        locations.main.uniforms.uProjection,
        false,
        projectionMatrix
      );
      gl.uniformMatrix4fv(
        locations.main.uniforms.uModel,
        false,
        modelMatrix
      );
      gl.uniformMatrix4fv(
        locations.main.uniforms.uView,
        false,
        viewMatrix
      );
      gl.uniformMatrix4fv(
        locations.main.uniforms.uNormal,
        false,
        normalMatrix
      );

      gl.drawElements(
        gl.TRIANGLES,
        entity.vertexCount,
        gl.UNSIGNED_SHORT, // type
        0 // offset
      );
    }
  }

  _initializeProgram(vertexSource, fragmentSource) {
    const gl = this._gl;
    const vertexShader = this._initializeShader(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = this._initializeShader(gl.FRAGMENT_SHADER, fragmentSource);
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(`GL link error: ${gl.getProgramInfoLog(program)}`);
      console.error(`Vertex shader log: ${gl.getShaderInfoLog(vertexShader)}`);
      console.error(`Fragment shader log: ${gl.getShaderInfoLog(fragmentShader)}`);
      program = null;
    }
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return program;   
  }

  _initializeShader(type, source) {
    const gl = this._gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  }

  _getAttributeLocations(program, ...attributeNames) {
    const gl = this._gl;
    return Object.fromEntries(attributeNames.map(attribute => [
      attribute,
      gl.getAttribLocation(program, attribute),
    ]));
  }

  _getUniformLocations(program, ...uniformNames) {
    const gl = this._gl;
    return Object.fromEntries(uniformNames.map(uniform => [
      uniform,
      gl.getUniformLocation(program, uniform),
    ]));
  }

  _initializeBuffer(target, data, usage) {
    const gl = this._gl;
    const buffer = gl.createBuffer();
    gl.bindBuffer(target, buffer);
    gl.bufferData(target, data, usage);
    return buffer;
  }
}

