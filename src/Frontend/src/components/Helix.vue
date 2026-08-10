<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { onMounted } from 'vue'

interface Props {
    images: string[]
}
const props = withDefaults(defineProps<Props>(), {
    images: () => [],
})


onMounted(() => {
    while (images.value.length < 200) {
        images.value.push(...props.images);
    }
    requestAnimationFrame(frame);
    const defaultSpeed = speed.value;
    speed.value = 1;
    const interval = setInterval(() => {
        const step = (speed.value - defaultSpeed) * 0.1;
        speed.value -= step;
        if (speed.value <= defaultSpeed || step < 0.001) {
            speed.value = defaultSpeed;
            clearInterval(interval);
        }
    }, 50);
});


//#region State
const images = ref<string[]>([]);
const selectedImage = ref<string | undefined>(undefined);
const selectedElement = ref<HTMLElement | null>(null);
const radius = ref(13);
const maxBlur = 10;
const brightnessFloor = 0.5;
const elapsed = ref(0);
const speed = ref(0.05);
const autoSpin = ref(true);
const margin = 50;
const zoom = ref(1);
const showControls = ref(true);
let lastFrame = performance.now();
let lastX = 0;
let isDragging = false;
let wasDragging = false;
const minDragDistance = 5;
let savedAutoSpin = autoSpin.value;
//#endregion

//#region Computed Properties
const imagesPerTurn = computed(()=>{
    return radius.value;
})
const containerHeight = computed(() => {
    const minimum = 200;
    const amountOfImages = images.value.length * 4;
    const roundedToNearestMultipleOf100 = Math.ceil(amountOfImages / 100) * 100;
    console.log('containerHeight', roundedToNearestMultipleOf100);
    return Math.max(minimum, roundedToNearestMultipleOf100);
});
const imageSpacing = computed(() => {
    return 100 / imagesPerTurn.value;
});

//#endregion

//#region Animation Frame
const frame = (now: number): void => {
	const dt = Math.min((now - lastFrame) / 1000, 0.1);
	lastFrame = now;
    if(autoSpin.value) 
        elapsed.value += dt * speed.value;
	requestAnimationFrame(frame);
};
//#endregion

//#region Event Listeners

// Mouse wheel
window.addEventListener('wheel', (e) => {
    e.preventDefault();

    elapsed.value += Math.sign(e.deltaY) * speed.value * 0.2;
}, { passive: false });


// Pointer pressed
window.addEventListener('pointerdown', (e) => {
    lastX = e.clientX;
    isDragging = true;
    wasDragging = false;
});


// Pointer moved
window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - lastX;

    if (Math.abs(deltaX) < minDragDistance) return;

    wasDragging = true;

    e.preventDefault();

    elapsed.value += Math.sign(deltaX) * speed.value * 0.1;

    lastX = e.clientX;
}, { passive: false });


// Pointer released
window.addEventListener('pointerup', () => {
    isDragging = false;

    setTimeout(() => {
        wasDragging = false;
    }, 200);
});


// Pointer leaves the window
window.addEventListener('pointerleave', () => {
    isDragging = false;
    wasDragging = false;
});


function onImageClick(e: MouseEvent, index: number) {
    if (isDragging || wasDragging) return;

    e.stopPropagation();

    if (depthOf(index) < 0.91) return;

    selectedElement.value = e.target as HTMLElement;
    selectedElement.value.classList.add('selected-image');

    savedAutoSpin = autoSpin.value;
    autoSpin.value = false;

    selectedImage.value = images.value[index];

    const overlay = document.querySelector('.overlay') as HTMLElement;
    overlay.classList.remove('hidden');
}


function closeOverlay() {
    autoSpin.value = savedAutoSpin;
    selectedImage.value = undefined;

    if (selectedElement.value) {
        selectedElement.value.classList.remove('selected-image');
        selectedElement.value = null;
    }

    const overlay = document.querySelector('.overlay') as HTMLElement;
    overlay.classList.add('hidden');
}

//#endregion


//# region Utility Functions
const wrap = (value: number, min: number, max: number): number => {
    const range = max - min;
    return ((value - min) % range + range) % range + min;
};
const depthOf = (index : number, reverse: boolean = false): number => (Math.cos(helixAngle(index, reverse)) + 1) / 2;

const helixHeight = (index: number): number => {
    return (index + elapsed.value * imagesPerTurn.value) * imageSpacing.value;
};
function helixTransform(index: number, reverse: boolean = false): string {
    const y = helixHeight(index);
    const angle = helixAngle(index, reverse);
    const wrappedY = wrap(y, margin - containerHeight.value / 2, margin + containerHeight.value / 2);
    const translateY = wrappedY;

    return `
        translate(-50%, -50%)
        rotateY(${angle.toFixed(4)}rad)
        translateZ(${radius.value}vmax)
        translateY(${translateY.toFixed(1)}vh)
    `;
}

const helixAngle = (index: number, reverse: boolean = false): number => {
    const anglePerImage = (2 * Math.PI) / imagesPerTurn.value;
    const baseAngle = index * anglePerImage + elapsed.value * 2 * Math.PI;
    return reverse ? baseAngle + Math.PI  : baseAngle;
};


function depthFilter(depth: number): string{
	const brightness = brightnessFloor + (1 - brightnessFloor) * depth * depth;
	const blur = (1 - depth) * (1 - depth) * maxBlur;
	return `brightness(${brightness.toFixed(3)}) blur(${blur.toFixed(2)}px)`;
};
//# endregion

</script>

<template>
    <div class="screen">
    <div class="overlay hidden" :onClick="closeOverlay">
        <img :src="selectedImage" alt="Selected Image" class="image-to-show" />
    </div>
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
          <input type="range" v-model="radius" min="5" max="20" step="1" />
        </div>
    </fieldset>
    </div>
    <div class="helix-container" :style="{ transform: ` translate(-50%,-50%) scale(${zoom})` }">
        <div v-for="(image, i) in images" :key="`item-${i}`"
            class="helix-item" 
            @click="(e)=>onImageClick(e,i)"
            :style="{
                transform: helixTransform(i),
                filter: depthFilter(depthOf(i)),
                zIndex: Math.round(depthOf(i) * 100),
            }">
            <img :src="image" alt="Image in a helix" class="helix-image"/>
        </div>
        <div v-for="(image, i) in images" :key="`reverse-item-${i}`"
            class="helix-item" 
            @click="(e)=>onImageClick(e, i)"
            :style="{
                transform: helixTransform(i,true),
                filter: depthFilter(depthOf(i, true)),
                zIndex: Math.round(depthOf(i, true) * 100),
            }">
            <img :src="image" alt="Image in a helix" class="helix-image reverse-strand" />
        </div>
    </div>
    </div>
    <div>
        <div class="scroll-tip">
            <span class="arrow-up">↑</span>
            <span>Scroll to rotate</span>
            <span class="arrow-down">↓</span>
        </div>
        <div class="drag-tip">
            <span class="arrow-left">←</span>
            <span>Drag to rotate</span>
            <span class="arrow-right">→</span>
        </div>
    </div>
</template>

<style scoped>
::selection {
    background: transparent;
}
.screen {
    position: fixed;
    inset: 0;
    width: 100dvw;
    height: 100dvh;
    overflow: hidden;
    user-select: none;
    -webkit-user-drag: none;
    touch-action: none;
}

.helix-container {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100dvw;
    height: 100dvh;
    display: flex;
    justify-content: center;
    perspective: 800px;
    perspective-origin: 50% 50%;
    touch-action: none;
}
.helix-item {
    position: absolute;
    top: 50%;
    left: 50%;
    width: clamp(110px, 14vw, 200px);
    border-radius: clamp(6px, 0.7vw, 10px);
    overflow: hidden;
    margin: 0;
    padding: 0;

    touch-action: none;
}
.helix-image {
    margin: 0;
    padding: 0;
    width: 100%;
    border-radius: 10px;
    pointer-events: none;
}
.controls {
    position: fixed;
    top: 50%;
    left: clamp(10px, 2vw, 30px);

    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    z-index: 5;
    transform: translateY(-50%);
}

.separation-container {
    margin: 0;
    padding: 0.75rem 1rem;

    max-width: min(220px, 25vw);

    backdrop-filter: blur(8px);
    border-radius: 8px;
}

.separation-container h4 {
    margin: 0 0 0.25rem;
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
.drag-tip {
    z-index: 5;
    position: fixed;
    bottom: 10%;
    left: 50%;
    transform: translateX(-50%);
    width: fit-content;
    font-size: 1.2rem;
    text-shadow:
        0 0 2px #000,
        0 0 10px #000,
        0 0 20px #000;
}
.drag-tip span{
    text-align: center;
    width: fit-content;
}
.drag-tip .arrow-left {
    position: absolute;
    left: -50%;
    width: fit-content;
    animation: bounce-horizontal-1 2s infinite;
}
.drag-tip .arrow-right {
    position: absolute;
    right: -50%;
    width: fit-content;
    animation: bounce-horizontal-2 2s infinite;
}
.selected-image{
    display: none;
    transition: opacity 0.3s ease;
}
.image-to-show {
    position: fixed;
    top: 50%;
    left: 50%;

    transform: translate(-50%, -50%);

    max-width: 90dvw;
    max-height: 85dvh;

    z-index: 1000;

    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);

    animation: popIn 0.3s ease-out;
}
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 999;
    backdrop-filter: blur(10px);
}
.hidden {
    display: none;
}
@keyframes bounce {
    0%, 100% {
        transform: translateY(-50%) translateY(0);
    }
    50% {
        transform: translateY(-50%) translateY(-10px);
    }
}
@keyframes bounce-horizontal-1 {
    0%, 100% {
        transform: translateX(-50%) translateX(0);
    }
    50% {
        transform: translateX(-50%) translateX(-10px);
    }
}
@keyframes bounce-horizontal-2 {
    0%, 100% {
        transform: translateX(50%) translateX(0);
    }
    50% {
        transform: translateX(50%) translateX(10px);
    }
}
@keyframes popIn {
    0% {
        transform: translate(-50%, -50%) scale(0.5);
        opacity: 0;
    }
    100% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
    }
}


@media (max-width: 768px) {
    .controls {
        top: auto;
        bottom: max(10px, env(safe-area-inset-bottom));
        left: 50%;
        transform: translateX(-50%);

        width: min(90vw, 420px);
    }

    .separation-container {
        width: 100%;
        max-width: none;

        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem 1rem;

        box-sizing: border-box;
    }

    .separation-container legend {
        grid-column: 1 / -1;
    }

    .speed-controls,
    .toggle-controls,
    .zoom-controls,
    .radius-controls {
        min-width: 0;
    }

    .separation-container input[type="range"] {
        width: 100%;
    }
}
@media (max-width: 768px) {
    .scroll-tip {
        top: 15%;
        right: 50%;
        transform: translateX(50%);

        font-size: 0.9rem;
        opacity: 0.8;
    }

    .drag-tip {
        bottom: 24%;
        font-size: 0.9rem;
        opacity: 0.8;
    }
}
@media (max-width: 480px) {
    .scroll-tip {
        top: 12%;
        font-size: 0.8rem;
    }

    .drag-tip {
        bottom: 27%;
        font-size: 0.8rem;
    }

    .controls {
        width: 94vw;
    }

    .separation-container {
        padding: 0.5rem 0.75rem;
        font-size: 0.85rem;
    }
}
</style>