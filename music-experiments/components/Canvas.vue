<template>
  <canvas id="c1"></canvas>
</template>

<script setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

let stats;
let scene, renderer, camera, cube;

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
  
  // cube
  const colorCube = new THREE.Color("red")
  const geometryCube = new THREE.BoxGeometry(1,1,1);
  const materialCube = new THREE.MeshBasicMaterial({
    color: colorCube,
    wireframe: false
  });

  cube = new THREE.Mesh(geometryCube, materialCube);
  scene.add(cube);

  // camera init position
  camera.position.set(0,0,5);
  camera.lookAt( scene.position );
  // light
  const lightAmbient = new THREE.AmbientLight(0xffffff, 10);
  const controls = new OrbitControls( camera, renderer.domElement );
  // STATS
  stats = new Stats();
  // document.body.appendChild( stats.dom );

      
}

function animate() {
  requestAnimationFrame(animate);
  const time = - performance.now() * 0.0005;
  
  cube.rotation.x = time;

  console.log(signals.value);

  cube.rotation.y = time;

  // cube.scale.x = signals.value.zcr * 0.01 ; //signals.rms * 100;
  // cube.scale.y = signals.value.zcr * 0.01 ; //signals.rms * 100;
  // cube.scale.z = signals.value.zcr * 0.01 ; //signals.rms * 100;

  cube.scale.x = 2 + Math.max(0.02, signals.value.powerSpectrum[100] * 0.1) ;
  cube.scale.y = 2 + Math.max(0.02, signals.value.powerSpectrum[100] * 0.1) ;
  cube.scale.z = 2 + Math.max(0.02, signals.value.powerSpectrum[100] * 0.1) ;

  console.log(signals.value.zcr)
  
  renderer.render(scene, camera);
  stats.update();
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

<style lang="scss" scoped>
canvas {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 0;
}
</style>