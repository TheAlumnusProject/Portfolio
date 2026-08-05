<script setup lang="ts">
import GlowCard from '@/components/GlowCard.vue';
import Pill from '@/components/Pill.vue';
import PageIntro from '@/components/PageIntro.vue';
</script>

<template>
  <section class="page-section">
    <PageIntro eyebrow="Utility Hub / concept lab" heading="One space for quick experiments, ideas and polished demos." description="This page is designed as a flexible toolkit where each block can become a real feature later: small utilities, mini dashboards, or developer workflows." />

    <div class="card-grid">
      <GlowCard>
        <h2>Developer toolkit</h2>
        <p>Snippets, generators and tiny command helpers to improve our, and your workflow.</p>
        <ul>
          <li>GraphQL query playground</li>
          <li>Color palette generator</li>
          <li>Json validator</li>
        </ul>
      </GlowCard>

      <GlowCard>
        <h2>Live signals</h2>
        <p>Info about the live performance of this very application.</p>
        <div class="metric-row">
          <span>Latency</span>
          <strong>42ms</strong>
        </div>
        <div class="metric-row">
          <span>Cache hit</span>
          <strong>89%</strong>
        </div>
      </GlowCard>

      <GlowCard>
        <h2>Release notes</h2>
        <p>A snapshot of what is being tested right now.</p>
        <div class="mini-stack">
          <Pill>Animated cards</Pill>
          <Pill>Adding Downloadable Shell scripts</Pill>
        </div>
      </GlowCard>
    </div>
  </section>
</template>

<style scoped>
.page-section {
  display: grid;
  gap: 1.3rem;
}

.hero-copy {
  display: grid;
  gap: 0.7rem;
  max-width: 760px;
}

.eyebrow {
  color: #6ee7ff;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-size: 0.76rem;
}

h1 {
  font-size: clamp(2rem, 3.4vw, 2.8rem);
  line-height: 1.1;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

h2 {
  margin-bottom: 0.6rem;
  color: #f7fbff;
}

p,
li,
span {
  color: #9db0d8;
}

ul {
  padding-left: 1rem;
  display: grid;
  gap: 0.35rem;
  margin-top: 0.9rem;
}

.metric-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.7rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.mini-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

@media (max-width: 900px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}
</style>
