<script setup lang="ts">
import Helix from '@/components/Helix.vue'

const imageUrls = [
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
]
</script>

<template>
    <div class="content">
        <Helix :images="imageUrls" />
    </div>
</template>
<style scoped>
.content {
    position: absolute;
    top:0;
    left: 0;
}
</style>