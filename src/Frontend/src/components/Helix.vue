<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
    images: string[]
}

const props = withDefaults(defineProps<Props>(), {
    images: () => [],
})


const images = ref<string[]>([]);
while (images.value.length < 100) {
    images.value.push(...props.images);
}
const amount = computed(() => props.images.length);
const turns = 2;
const radius = ref(15);
const maxBlur = 5;
const brightnessFloor = 0.5;
const elapsed = ref(0);
const speed = ref(0.1);
const autoSpin = ref(true);
const fillBottom = 200;
const fillTop = 200;
const containerHeight = 300;
const zoom = ref(1);
const imagesPerTurn = ref(12);
const showControls = ref(true);


const depthOf = (angle: number): number => (Math.cos(angle) + 1) / 2;

function helixTransform(angle: number, y: number): string {
    const range = containerHeight + fillTop + fillBottom;
    const wrappedY = ((y + fillBottom) % range + range) % range - fillBottom;
    const translateY = wrappedY;

    return `
        translate(-50%, -50%)
        rotateY(${angle.toFixed(4)}rad)
        translateZ(${radius.value}vw)
        translateY(${translateY.toFixed(1)}vh)
    `;
}

const helixHeight = (index: number, phase: number): number => {
    const progress = index / imagesPerTurn.value + phase;
    return progress * 100;
};

const helixAngle = (index: number, phase: number): number => {
    const anglePerImage = (2 * Math.PI) / imagesPerTurn.value;
    return index * anglePerImage + phase * 2 * Math.PI;
};


function depthFilter(depth: number): string{
	const brightness = brightnessFloor + (1 - brightnessFloor) * depth * depth;
	const blur = (1 - depth) * (1 - depth) * maxBlur;
	return `brightness(${brightness.toFixed(3)}) blur(${blur.toFixed(2)}px)`;
};


let lastFrame = performance.now();

const frame = (now: number): void => {
	const dt = Math.min((now - lastFrame) / 1000, 0.1);
	lastFrame = now;
    if(autoSpin.value) 
        elapsed.value += dt * speed.value;
	requestAnimationFrame(frame);
};

window.addEventListener('wheel', (event) => {
    event.preventDefault();
    if(event.deltaY < 0) {
        elapsed.value -= speed.value * 0.2;
    } else {
        elapsed.value += speed.value * 0.2;
    }
});

requestAnimationFrame(frame);

</script>

<template>
    <div class="screen">
    <div v-show="showControls" class="controls">
    <fieldset class="separation-container">
      <legend>Controls</legend>
        <div class="speed-controls">
        <h4>Speed Control</h4>
        <input type="range" v-model="speed" min="0.005" max="0.5" step="0.005" />
        </div>
        <div class="toggle-controls">
          <h4>Auto Spin</h4>
          <input type="checkbox" v-model="autoSpin" />
        </div>
        <div class="zoom-controls">
          <h4>Zoom</h4>
          <input type="range" v-model="zoom" min="0.25" max="2" step="0.1" />
        </div>
        <div class="radius-controls">
          <h4>Radius</h4>
          <input type="range" v-model="radius" min="5" max="50" step="1" />
        </div>
        <div class="spacing-controls">
          <h4>Spacing</h4>
          <input type="range" v-model="imagesPerTurn" min="5" max="20" step="1" />
        </div>
    </fieldset>
    </div>
    <div class="helix-container" :style="{ transform: ` translate(-50%,-50%) scale(${zoom})` }">
        <img
            v-for="(image, i) in images"
            :key="i"
            :src="image"
            alt="Image in a helix"
            class="helix-image"
            @click="autoSpin = !autoSpin"
            :style="{
                transform: helixTransform(
                    helixAngle(i, elapsed),
                    helixHeight(i, elapsed)
                ),
                filter: depthFilter(
                    depthOf(helixAngle(i, elapsed))
                ),
                zIndex: Math.round(
                    depthOf(helixAngle(i, elapsed)) * 100
                ),
            }"
        />
        <img
            v-for="(image, i) in images"
            :key="`reverse-${i}`"
            :src="image"
            alt="Image in a helix"
            class="helix-image reverse-strand"
            @click="autoSpin = !autoSpin"
            :style="{
                transform: helixTransform(
                    helixAngle(i, elapsed) + Math.PI,
                    helixHeight(i, elapsed)
                ),
                filter: depthFilter(
                    depthOf(helixAngle(i, elapsed) + Math.PI)
                ),
                zIndex: Math.round(
                    depthOf(helixAngle(i, elapsed) + Math.PI) * 100
                ),
            }"
        />
    </div>
    </div>
    <div>
        <div class="scroll-tip">
            <span class="arrow-up">↑</span>
            <span>Scroll to rotate</span>
            <span class="arrow-down">↓</span>
        </div>
    </div>
</template>

<style scoped>
.screen {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}
.helix-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    perspective: 1000px;
	perspective-origin: 50% 50%;
    /* overflow: hidden; */
}
.helix-image {
    position: absolute;
    width: 200px;
    height: 200px;

}
.controls {
    position: absolute;
    top: 50%;
    left: 2%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    z-index: 5;
}
.scroll-tip {
    z-index: 5;
    position: fixed;
    top: 50%;
    right: 10%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 1.2rem;
    text-shadow:
        0 0 2px #000,
        0 0 10px #000,
        0 0 20px #000;
    animation: bounce 2s infinite;
}
@keyframes bounce {
    0%, 100% {
        transform: translateY(-50%) translateY(0);
    }
    50% {
        transform: translateY(-50%) translateY(-10px);
    }
}
</style>