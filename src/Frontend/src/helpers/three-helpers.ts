import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader, Font } from 'three/addons/loaders/FontLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// @ts-ignore
import { Text } from 'troika-three-text';

export function createOrbitControls(camera: THREE.Camera, renderer: THREE.WebGLRenderer): OrbitControls {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = true;
  controls.enablePan = true;
  controls.minDistance = 1;
  controls.maxDistance = 1000;
  return controls;
}
export async function createStarwarsTexts(content: string[], positions: number[], color: number): Promise<THREE.Mesh[]> {
  const textMeshes: THREE.Mesh[] = [];
  content.forEach((line, index) => {
    const text = createText(line, color);
    text.position.y = (positions[index] || 0) * -1;
    text.position.z = (positions[index] || 0) * 3;
    textMeshes.push(text);
  });
  return textMeshes;
}

export function createText(content: string, color: number): Text {
  const text = new Text();
  text.text = content;
  text.font = '/fonts/starwars.ttf';
  text.fontSize = 40;
  text.color = color;

  text.anchorX = 'center';
  text.anchorY = 'middle';

  text.position.z = 0;
  text.rotation.x = -Math.PI / 6;

  text.sync();

  return text;
}

export function centerText(text: THREE.Mesh): void {
  text.geometry.computeBoundingBox();
  if (text.geometry.boundingBox) {
    const centerOffsetX = -0.5 * (text.geometry.boundingBox.max.x - text.geometry.boundingBox.min.x);
    text.position.x = centerOffsetX;
  }
}

export function addStarfield(scene: THREE.Scene, count: number, color: number, size: number): void {
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({ color: color, size: size });
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 100;
    positions[i + 1] = (Math.random() - 0.5) * 100;
    positions[i + 2] = (Math.random() - 0.5) * 100;
  }
  starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const starField = new THREE.Points(starGeometry, starMaterial);
  scene.add(starField);
}

export function updateStarwarsText(text: THREE.Mesh): void {
  text.position.y += 0.15;
  text.position.z -= 0.6;
  // update opacity based on distance from camera
  const distance = text.position.distanceTo(new THREE.Vector3(0, 0, 0));
  const maxDistance = 2000;
  const minDistance = 0;
  const opacity = THREE.MathUtils.clamp(1 - (distance - minDistance) / (maxDistance - minDistance), 0, 1);
  if (text.material instanceof THREE.Material) {
    text.material.opacity = opacity;
  }
}
export function AddSpaceship(scene: THREE.Scene, gltfLoader: GLTFLoader): Promise<THREE.Object3D> {
  return new Promise((resolve) => {
    gltfLoader.load('/3d/x-wing.glb', (gltf) => {
      const spaceship = gltf.scene;
      spaceship.scale.set(0.5, 0.5, 0.5);
      spaceship.position.set(0, 10, 100);
      scene.add(spaceship);
      spaceship.visible = false;
      resolve(spaceship);
    });
  });
}

let shouldBeVisible = true;
export function animateSpaceship(scene: THREE.Scene, spaceship: THREE.Object3D): void {
  // complex animation path where a small spaceship whips around the scene, moving in a figure-eight pattern
  const time = Date.now() * 0.0005;
  const radiusX = 100;
  const radiusY = 150;
  const radiusZ = 4000;
  const offsetX = -radiusX * 0.6;
  const offsetY = 0;
  const offsetZ = 0;
  const pullbackZ = 200;
  let x = -radiusX * Math.sin(time * 1) + offsetX;
  let y = -radiusY * Math.sin(time * 2) * 0.5 + offsetY;
  let z = -radiusZ * Math.cos(time * 1) + offsetZ;
  // toggle direction when reaching certain z thresholds
  if (Math.cos(time) < -0.5) {
    shouldBeVisible = true;
  }
  if (Math.cos(time) > 0.5) {
    shouldBeVisible = false;
  }
  spaceship.visible = shouldBeVisible ? true : false;
  // clamp z
  z = Math.min(z, -80);
  if (Math.cos(time) > -0.4 && Math.cos(time) < 0) {
    z += (Math.cos(time) + 0.4) * pullbackZ;
  }
  console.log(Math.cos(time));
  if (shouldBeVisible && Math.cos(time) > -0.1 && Math.cos(time) < 0.3) {
    addTrail(spaceship, scene);
  }
  // make spaceship invisible when turning back
  spaceship.position.set(x, y, z);
  spaceship.lookAt(0, 1000, -5000);
  spaceship.rotation.z = y * 0.01;
}

function addTrail(spaceship: THREE.Object3D<THREE.Object3DEventMap>, scene: THREE.Scene<THREE.Object3DEventMap>) {
  const trailGeometry = new THREE.BufferGeometry();
  const trailMaterial = new THREE.PointsMaterial({ color: 0x808080, size: 1 });
  const trailPositions = new Float32Array(20 * 3);
  for (let i = 0; i < 20; i++) {
    trailPositions[i * 3] = spaceship.position.x + (Math.random() - 0.5) * 10;
    trailPositions[i * 3 + 1] = spaceship.position.y + (Math.random() - 0.5) * 10;
    trailPositions[i * 3 + 2] = spaceship.position.z + (Math.random() - 0.5) * 10;
  }
  trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
  const trail = new THREE.Points(trailGeometry, trailMaterial);
  scene.add(trail);
  // remove trail after a short delay
  setTimeout(() => {
    scene.remove(trail);
  }, 500);
}
