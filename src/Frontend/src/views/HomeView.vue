<script setup lang="ts">
import GlowCard from '@/components/GlowCard.vue';
import Pill from '@/components/Pill.vue';
import PageIntro from '@/components/PageIntro.vue';
</script>

<template>
  <section class="page-section">
    <PageIntro eyebrow="TAP / portfolio playground" heading="Elegant, modular and ready for the next big experiment." description="This landing experience blends a dark cinematic palette with futuristic motion, giving the project a premium feel from the very first screen.">
      <h3>Technologies</h3>
      <div class="pill-row">
        <Pill>Vue 3</Pill>
        <Pill>TypeScript</Pill>
        <Pill>Three.js</Pill>
      </div>
    </PageIntro>

    <div class="card-grid">
      <GlowCard>
        <h2>Concept goal</h2>
        <p>A portfolio that will evolve with more content and features over time.</p>
      </GlowCard>

      <GlowCard>
        <h2>Project structure</h2>
        <p>The modular architecture allows for easy integration of new features and content as the project evolves.</p>
      </GlowCard>

      <GlowCard>
        <h2>Next step</h2>
        <p>Expand the portfolio with more projects and detailed case studies.</p>
      </GlowCard>
    </div>
  </section>
</template>

<style scoped>
.page-section {
  display: grid;
  gap: 1.3rem;
}

.pill-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 0.3rem;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

h2 {
  margin-bottom: 0.55rem;
  color: #f7fbff;
}

p {
  color: #9db0d8;
}

@media (max-width: 900px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}
</style>
