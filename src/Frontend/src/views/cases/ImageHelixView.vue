<script setup lang="ts">
import Helix from '@/components/Helix.vue'
import { ref } from 'vue';

const imageUrls = ref([
    'https://static.photos/technology/640x360/125',
    'https://static.photos/technology/640x360/126',
    'https://static.photos/technology/640x360/127',
    'https://static.photos/technology/640x360/128',
    'https://static.photos/technology/640x360/129',
    'https://static.photos/technology/640x360/130',
    'https://static.photos/technology/640x360/131',
    'https://static.photos/technology/640x360/132',
    'https://static.photos/technology/640x360/133',
    'https://static.photos/technology/640x360/134',
    'https://static.photos/technology/640x360/135',
]);

const inputText = ref(imageUrls.value.join('\n'));
const rerender = () => {
    console.log('Rerendering with new image URLs:', inputText.value);
    imageUrls.value = inputText.value.split('\n').filter(url => url.trim() !== '');
};

</script>

<template>
    <div class="content">
        <div class="text-controls">
            <h2>Add your own photo links</h2>
            <textarea v-model="inputText" rows="5" cols="50" placeholder="Enter your photo links here, one line per entry"></textarea>
            <button @click="rerender">Confirm changes</button>
        </div>
        <Helix :images="imageUrls" />
    </div>
</template>
<style scoped>
.content {
    position: absolute;
    top:0;
    left: 0;
}
.text-controls {
    position: absolute;
    top: 1rem;
    left: 1rem;
    z-index: 50;
    border: 1px solid var(--surface-strong);
    background-color: transparent;
    color: var(--text-primary);
    padding: 1rem;
    border-radius: 8px;
    z-index: 10;
}
</style>