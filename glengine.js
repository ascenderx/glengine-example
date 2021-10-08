class GLEngine {
  static getGLFromCanvas(canvas) {
    let gl = null;
    for (const type of ['webgl', 'webgl-experimental']) {
      gl = canvas.getContext(type, {antialias: true});
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (gl !== null) {
        return gl;
      }
    }
    throw 'Unable to get WebGL context';
  }

  constructor(gl, camera, cube) {
    this._gl = gl;
    this._camera = camera;
    this._cube = cube;
    
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
          'uMouse',
          'uTime',
          'uNormal',
          'uResolution',
          'uModel',
          'uView',
          'uProjection',
        ),
      },
    };

    this._buffers = {
      cube: {
        position: this._initializeBuffer(gl.ARRAY_BUFFER, new Float32Array(Cube.POSITIONS), gl.STATIC_DRAW),
        normal: this._initializeBuffer(gl.ARRAY_BUFFER, new Float32Array(Cube.NORMALS), gl.STATIC_DRAW),
        index: this._initializeBuffer(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(Cube.INDICES), gl.STATIC_DRAW),
      },
    };
  }

  render() {
    const gl = this._gl;
    const camera = this._camera;
    const cube = this._cube;
    const programs = this._programs;
    const locations = this._locations;
    const buffers = this._buffers;

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
      100.0 // Z far
    );

    const modelMatrix = mat4.create();
    mat4.translate(
      modelMatrix, // destination
      modelMatrix, // source
      cube.position // translation
    );
    mat4.translate(
      modelMatrix,
      modelMatrix,
      [-camera.x, -camera.y, -camera.z]
    );

    const viewMatrix = mat4.create();
    mat4.rotate(
      viewMatrix,
      viewMatrix,
      camera.pitchValue * RADIANS,
      [1, 0, 0]
    );
    mat4.rotate(
      viewMatrix,
      viewMatrix,
      camera.yawValue * RADIANS,
      [0, 1, 0]
    );
    mat4.rotate(
      viewMatrix,
      viewMatrix,
      camera.rollValue * RADIANS,
      [0, 0, 1]
    );

    const normalMatrix = mat4.create();
    mat4.invert(normalMatrix, modelMatrix);
    mat4.transpose(normalMatrix, normalMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.cube.position);
    gl.vertexAttribPointer(
      locations.main.attributes.aPosition,
      3, // number of components
      gl.FLOAT, // type
      false, // normalize
      0, // stride
      0 // offset
    );
    gl.enableVertexAttribArray(locations.main.attributes.aPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.cube.normal);
    gl.vertexAttribPointer(
      locations.main.attributes.aNormal,
      3, // number of components
      gl.FLOAT, // type
      false, // normalize
      0, // stride
      0, // offset
    );
    gl.enableVertexAttribArray(locations.main.attributes.aNormal);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.cube.index);

    gl.useProgram(programs.main);

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
      36, // vertex count
      gl.UNSIGNED_SHORT, // type
      0 // offset
    );
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

