<template>
  <canvas id="c1"></canvas>
</template>

<script setup>
import * as THREE from 'three';

let scene, renderer, camera, mesh;

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

  const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--black');
  renderer.setClearColor(bgColor, 1);

  const geometry = new THREE.SphereGeometry(2, 64, 64);
  const arrSize = signals.value.arrSize;
  const material = new THREE.ShaderMaterial({
    transparent:true,
    side: THREE.DoubleSide,
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
      uniform vec2 resolution;
      uniform float fArray[${arrSize}];
      
      float plot(vec2 st, float pct){
        return  smoothstep( pct-0.1, pct, st.y) -
                smoothstep( pct, pct+0.1, st.y);
      }


      varying vec2 vUv;
      void main() {

        vec2 st = vUv;
        vec2 store = vUv;

        float size = float(${arrSize});
        st.y = fract(st.y * size);

        float y = sin(st.x * 4. * 3.14 * 10. + time * 8.) * abs( fArray[ int(floor(store.y * size)) ] * 500.  ) * 0.00009 * 4. / 10. + 0.5;
    
        float pct = plot(st,y);
        
        vec4 col = vec4(1.);
        vec4 col2 = vec4(1.);
        col = (1.0-pct)*col+pct*vec4(vec3(0.), 0.1);
        col2 = (1.0-pct)*col2+pct*vec4(vec3(0.), 0.9);

        // effect extra 1
        clamp(abs(fArray[ int(floor(store.y * size)) ] * 500.  ), 0., 12000.) > 2000. 
            && 
        clamp(abs(fArray[ int(floor(store.y * size)) ] * 500.  ), 0., 12000.) < 6000. 
            ? 
          col = col : col = col2;

        gl_FragColor = 1. - col;
      }
    `,
  });

  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // camera init position
  camera.position.set(0,0,5);
  camera.lookAt( scene.position );

}

function animate() {
  requestAnimationFrame(animate);  
  
  // update uniforms 
  mesh.material.uniforms.fArray.value = signals.value.powerSpectrum;

  mesh.rotation.x += 0.0005;
  mesh.rotation.y += 0.0005;
  mesh.rotation.z += 0.0005;
  
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