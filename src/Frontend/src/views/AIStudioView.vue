<script setup lang="ts">
import { ref, reactive } from 'vue';
import GlowCard from '@/components/GlowCard.vue';
import Pill from '@/components/Pill.vue';
import PageIntro from '@/components/PageIntro.vue';

interface AIProject {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'coming-soon';
  category: string;
}

const projects = reactive<AIProject[]>([
  {
    id: 'dnd-npc',
    name: 'D&D NPC Generator',
    description: 'Generate unique D&D characters with personality traits, backgrounds, and motivations.',
    status: 'active',
    category: 'Character Generation',
  },
  {
    id: 'project-2',
    name: 'Coming Soon',
    description: 'More AI-powered mini-projects coming soon. Each tool generates or creates something unique.',
    status: 'coming-soon',
    category: 'Creative Tools',
  },
]);

const selectedProject = ref<string | null>(null);
</script>

<template>
  <section class="page-section">
    <PageIntro eyebrow="AI Studio" heading="Small AI-powered creative projects." description="A collection of interactive tools that generate unique content. Each project showcases a different AI capability." />

    <div class="projects-grid">
      <GlowCard v-for="project in projects" :key="project.id" class="project-card" :class="{ active: selectedProject === project.id, disabled: project.status === 'coming-soon' }">
        <div class="project-header">
          <h3>{{ project.name }}</h3>
        </div>

        <p class="project-description">{{ project.description }}</p>

        <Pill v-if="project.status === 'coming-soon'" color="var(--text)" backgroundColor="var(--bg)"> Coming soon </Pill>
        <button v-else class="project-button">Launch Project</button>
      </GlowCard>
    </div>
  </section>
</template>

<style scoped>
.page-section {
  display: grid;
  gap: 1.3rem;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.project-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: opacity 0.2s ease;
  cursor: pointer;
}

.project-card.disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.project-card.active {
  border-color: #6ee7ff;
}

.project-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.emoji {
  font-size: 2rem;
}

h3 {
  margin: 0;
  color: #f7fbff;
  font-size: 1.1rem;
  font-weight: 600;
}

.project-description {
  color: #9db0d8;
  margin-bottom: 1.2rem;
  flex-grow: 1;
  font-size: 0.95rem;
  line-height: 1.5;
}

.project-button {
  align-self: flex-start;
  padding: 0.6rem 1.2rem;
  background: linear-gradient(135deg, var(--accent), var(--accent2), var(--accent3));
  border: none;
  border-radius: 0.6rem;
  color: #04050b;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.project-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(110, 231, 255, 0.2);
}

.project-button:active {
  transform: translateY(0);
}

@media (max-width: 900px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>
