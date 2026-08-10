<script setup lang="ts">
import Helix from '@/components/Helix.vue'

const imageUrls = [
    'https://placehold.co/600x400',
    'https://placehold.co/600x400',
    'https://placehold.co/600x400',
    'https://placehold.co/600x400',
    'https://placehold.co/600x400',
    'https://placehold.co/600x400',
    'https://placehold.co/600x400',
    'https://placehold.co/600x400',
    'https://placehold.co/600x400',
    'https://placehold.co/600x400',
    'https://placehold.co/600x400',
    'https://placehold.co/600x400',
    'https://placehold.co/600x400',
    'https://placehold.co/600x400',
    'https://placehold.co/600x400',
    'https://placehold.co/600x400',
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