<template>
  <canvas id="c1"></canvas>
</template>

<script setup>
import * as THREE from 'three';

let scene, renderer, camera, cube, line;

const signals = useState('signals');

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    3000
  );
  
  let canvas = document.getElementById("c1");
  renderer = new THREE.WebGLRenderer({ antialias : true, canvas});
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize(window.innerWidth, window.innerHeight);

  const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--white');
  renderer.setClearColor(bgColor, 1);

  // create a line to capture the spectralRolloff signal
  const geometryLine = new THREE.BufferGeometry();
  const arrSizeLine = 100;
  const positions = new Float32Array(arrSizeLine * 3);
  for (let i = 0; i < arrSizeLine; i++) {
    positions[i * 3] = i / arrSizeLine;
    positions[i * 3 + 1] = 0;
    positions[i * 3 + 2] = 0;
  }
  geometryLine.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const materialLine = new THREE.LineBasicMaterial({ color: 0x000000 });
  line = new THREE.Line(geometryLine, materialLine);
  scene.add(line);

  // create a cube to capture the energy signal and the powerSpectrum signal
  const geometryCube = new THREE.BoxGeometry(1,1,1);

  // create the shader material for the cube
  const arrSize = signals.value.arrSize;
  const materialCube = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      fArray: { value: new Float32Array(arrSize) },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vec3 pos = position;
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform float fArray[${arrSize}];

      float plot(vec2 st, float pct){
        return  smoothstep( pct-0.08, pct, st.y) -
                smoothstep( pct, pct+0.08, st.y);
      }

      varying vec2 vUv;
      void main() {

        vec2 st = vUv;
        vec2 store = vUv;

        float size = float(${arrSize});
        st.y = fract(st.y * size);

        float y = sin(st.x * 4. * 3.14 * 3. + time * 8.) * clamp(abs( fArray[ int(floor(store.y * size)) ] * 5000.  ), 0., 1500.) * 0.0005 * 8. / 30. + 0.5;

        float pct = plot(st,y);
        vec3 color = vec3(1.);
        color = (1.0 - pct) * color + pct * vec3(0.);
        gl_FragColor = vec4(color, 1.);
      }
    `,
  });

  cube = new THREE.Mesh(geometryCube, materialCube);
  scene.add(cube);

  // camera init position
  camera.position.set(0,0,5);
  camera.lookAt( scene.position );

}

function animate() {
  requestAnimationFrame(animate);  

  // update mesh size
  cube.scale.x = signals.value.energy * 0.01 + 2.3 ;
  cube.scale.y = signals.value.energy * 0.01 + 2.3 ;
  cube.scale.z = signals.value.energy * 0.01 + 2.3 ;
  
  // update uniforms 
  cube.material.uniforms.fArray.value = signals.value.powerSpectrum;

  // line size
  const lineFactor = signals.value.spectralRolloff / 1100;
  line.scale.set(lineFactor, lineFactor, lineFactor);
  line.position.set(-lineFactor/2, 0, 0);

  cube.rotation.x += 0.0005;
  cube.rotation.y += 0.0005;
  cube.rotation.z += 0.0005;
  
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight ;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

onMounted(() => {
  init();
  animate();
  window.addEventListener('resize', onWindowResize, false);
})

</script>