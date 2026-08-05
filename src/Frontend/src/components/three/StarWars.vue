<script setup lang="ts">
// Hero section is a three.js canvas that shows the text: The Alumnus Project
import { onMounted, onUnmounted } from 'vue';
import { ref } from 'vue';
import * as THREE from 'three';
import * as HELPERS from '@/helpers/three-helpers.ts';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let canvas = ref<HTMLCanvasElement | null>(null);
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let texts: THREE.Mesh[] = [];
let spaceship: THREE.Object3D | null = null;
let gltfLoader: GLTFLoader;
let spaceshipSpawned = false;

async function initializeThreeJs(): Promise<void> {
  // setup three.js scene, camera, renderer, and loaders
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ canvas: canvas.value! });
  gltfLoader = new GLTFLoader();
  const light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);
  camera.position.z = 5;
  camera.position.y = 0;
  camera.position.x = 0;

  // controls
  HELPERS.createOrbitControls(camera, renderer);

  // Add starfield
  HELPERS.addStarfield(scene, 1000, 0xffffff, 0.1);

  // Add text
  const textContent = ['The Alumnus Project', 'A collaborative effort', 'by', 'Cornillie Jeffrey', 'Vannieuwenborgh Niels', 'Martens Axel', 'Enjoy the journey through our work!'];
  const positions = [100, 250, 300, 350, 400, 450, 550];
  texts = await HELPERS.createStarwarsTexts(textContent, positions, 0xffff00);
  texts.forEach((text) => {
    scene.add(text);
  });
}

async function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  texts.forEach((text) => {
    HELPERS.updateStarwarsText(text);
  });
  if (!spaceshipSpawned && texts.length > 0 && (texts[0]?.position.z || 0) < -50) {
    spaceshipSpawned = true;
    spaceship = await HELPERS.AddSpaceship(scene, gltfLoader);
  }
  if (spaceship) {
    HELPERS.animateSpaceship(scene, spaceship);
  }
}

const handleResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

onMounted(() => {
  initializeThreeJs();
  window.addEventListener('resize', handleResize);
  handleResize();
  animate();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>

<style scoped>
#hero-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
</style>
