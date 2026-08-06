<script setup lang="ts">
import GlowCard from '@/components/GlowCard.vue';
import PageIntro from '@/components/PageIntro.vue';
</script>

<template>
  <section class="page-section">
    <PageIntro eyebrow="Contact / start a conversation" heading="Let the project grow through thoughtful feedback and ideas." description="Whether you want to talk about the visual direction or the roadmap, this space is ready for the next step." />

    <div class="card-grid">
      <GlowCard :tiltStrength="3">
        <h2>Drop a note</h2>
        <form class="contact-form">
          <input type="text" placeholder="Your name" />
          <input type="email" placeholder="Email" />
          <textarea rows="4" placeholder="What do you have in mind?" />
          <button type="button">Send note</button>
        </form>
      </GlowCard>

      <GlowCard :tiltStrength="3">
        <h2>Reach out to the team</h2>
        <div class="contact-list">
          <span>GitHub</span>
          <span>LinkedIn</span>
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

.card-grid {
  display: grid;
  grid-template-columns: 1.3fr 0.9fr;
  gap: 1rem;
}

h2 {
  margin-bottom: 0.8rem;
  color: #f7fbff;
}

.contact-form {
  display: grid;
  gap: 0.7rem;
}

input,
textarea {
  width: 100%;
  border: 1px solid var(--accent-ghost);
  border-radius: 0.9rem;
  padding: 0.8rem 0.95rem;
  background: var(--surface);
  color: var(--text);
}

button {
  border: none;
  border-radius: 999px;
  padding: 0.8rem 1rem;
  color: var(--bg);
  font-weight: 700;
  background: linear-gradient(135deg, var(--accent), var(--accent2), var(--accent3));
  cursor: pointer;
}

.contact-list {
  display: grid;
  gap: 0.7rem;
}

.contact-list span {
  padding: 0.75rem 0.85rem;
  border-radius: 0.9rem;
  background: var(--accent-weak);
  color: var(--text);
  border: 1px solid var(--accent-ghost);
}

@media (max-width: 900px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}
</style>
