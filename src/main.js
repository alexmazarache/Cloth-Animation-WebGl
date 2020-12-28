import Cloth from './cloth'


(function(window) {
  let DEBUG = false;
  Sim.DEBUG = DEBUG;
  let Options = {
    gravity: -9.8,
    structK: 100000,
    shearK: 5000,
    bendK: 1000,
    dampSpring: 10,
    dampAir: 5,
    clothWidth: 16,
    clothHeight: 16,
    mass: 1.0,
    sleepThreshold: 0.001,
    sleepCount: 100,
    tension: 1.0,
    timeStep: 0.016,
    pinned: {
        bottomLeft: false,
        bottomRight: false,
        topLeft: true,
        topRight: true
    },
    dynamicWind: true,
    wind: [0.0, 0.0, 0.0] // if not dynamic
  };
  
  
  function run(clothImage) {
      Sim.init();
      
      let cloth = new Cloth(Options.clothWidth, Options.clothHeight, 1.0);
      cloth.wind[0] = -1.0; cloth.wind[2] = 0.4;
      let {clothWidth, clothHeight} = Options;
      for (let i = 0; i < cloth.X.size; ++i) 
          cloth.X.data[i*3+2] -= 1.75;
      cloth.wind[0] = Options.wind[0];
      cloth.wind[1] = Options.wind[1];
      cloth.wind[2] = Options.wind[2];
      let clothDt = Options.timeStep;
      let selection = 0;
      let shader = Sim.createShader("fs", "vs", {a_position: 0, a_normal: 1, a_color: 2});
      let vertexBuffer = new Float32Array(cloth.X.size*8);
      let gl = Sim.gl;
      let clothTexture = gl.createTexture();
      
      gl.bindTexture(gl.TEXTURE_2D, clothTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, clothImage);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
      gl.generateMipmap(gl.TEXTURE_2D);
      Sim.checkGL("load texture");
      let viewMatrix = mat4.lookAt(null, 0,0,0, 0,0,-1, 0,1,0);
      let modelMatrix = mat4.identity();
      let vbo = gl.createBuffer();
      let ibo = gl.createBuffer();
      
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cloth.tris, gl.STATIC_DRAW);
    Sim.checkGL('bufferData (tris)');
  
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertexBuffer, gl.DYNAMIC_DRAW);
  
    Sim.checkGL('bufferData (verts)');
  
      gl.enable(gl.DEPTH_TEST);
      //gl.enable(gl.CULL_FACE);
      let time = 0.0;
      Sim.update = function(dt) {
      Sim.canvas.width = Sim.width;
      Sim.canvas.height = Sim.height;
          time += dt;
          gl.clearColor(0.2, 0.2, 0.2, 1.0);
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
          let unsetPoint = -1;
          if (Options.dynamicWind) {
              let sx = Math.sin(time);
              let sy = Math.cos(time);
              cloth.wind[0] = sx;
              cloth.wind[1] = 1.0;
              cloth.wind[2] = sy;
          }
          if (!Sim.mouse.down) {
              if (Sim.lastMouse.down && 
                  selection !== clothWidth*clothHeight-1 &&
                  selection !== clothWidth*(clothHeight-1)) {
                  cloth.pointStatusSet(selection, 0);
              }
              let [vx, vy, vz] = Sim.mouse.vec;
              let bi = 0;
              let bx = 0.0, by = 0.0, bz = 0.0;
              for (let i = 1; i < cloth.X.size; ++i) {
                  let cx = cloth.X.data[i*3+0];
                  let cy = cloth.X.data[i*3+1];
                  let cz = cloth.X.data[i*3+2];
                  let l = Math.sqrt(cx*cx+cy*cy+cz*cz);
                  if (l === 0) 
                      continue;
                  cx /= l;
                  cy /= l;
                  cz /= l;
                  if (vx*cx+vy*cy+vz*cz > bx*vx+by*vy+bz*vz) {
                      bi = i;
                      bx = cx;
                      by = cy;
                      bz = cz;
                  }
              }
              selection = bi;
          }
          else {
              if (!cloth.pointStatusSet(selection, -1)) {
                  unsetPoint = selection;
                  cloth.pointStatusSet(unsetPoint, 1);
              }
              let [vx, vy, vz] = Sim.mouse.vec;
              let si = selection*3;
              let cx = cloth.X.data[si+0], cy = cloth.X.data[si+1], cz = cloth.X.data[si+2];
              let mul = (vx*cx+vy*cy+vz*cz)/(vx*vx+vy*vy+vz*vz);
              cloth.X.data[si+0] = vx*mul;
              cloth.X.data[si+1] = vy*mul;
              cloth.X.data[si+2] = vz*mul;
          }
          cloth.simulate(clothDt);
          
          cloth.populateVertexBuffer(vertexBuffer);
          
          gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      //gl.bufferData(gl.ARRAY_BUFFER, vertexBuffer, gl.DYNAMIC_DRAW);
          gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertexBuffer);
          Sim.checkGL("upload vert data");
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
          
          gl.useProgram(shader.program);
          
        gl.enableVertexAttribArray(0); // posn
        gl.enableVertexAttribArray(1); // norm
        gl.enableVertexAttribArray(2); // texc
        
        Sim.checkGL("enableVertexAttribs");
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 4*8, 0); // pos
        gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 4*8, 3*4); // norm
        gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 4*8, 6*4); // texc
          
        Sim.checkGL("vertexAttribPointer");
        
          gl.bindTexture(gl.TEXTURE_2D, clothTexture);
          gl.activeTexture(gl.TEXTURE0);
          Sim.checkGL("bind/active texture ");
          Sim.setSceneUniforms(shader, viewMatrix);
          Sim.setModelUniforms(shader, viewMatrix, modelMatrix);
          
          shader.setUniform1i('u_albedo', 0);
        Sim.checkGL("set uniforms");
        gl.drawElements(gl.TRIANGLES, cloth.tris.length, gl.UNSIGNED_SHORT, 0);
        Sim.checkGL("drawcall");
      }
      //cloth.simulate(dt);
      Sim.start();
  }
  
  
  
  
  //window.addEventListener('load', function() {
      let img = new Image();
      img.crossOrigin = "anonymous";
      img.addEventListener('load', function() {
          run(img);
      })
      img.addEventListener('error', function() {
          alert('dang image didnt load');
      });
     // img.src = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/98205/GglYYNn.jpg";
     img.src = "https://media.istockphoto.com/vectors/white-cloth-texture-vector-id484397768";
  //});
  }(window))
  