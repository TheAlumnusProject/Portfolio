<script setup lang="ts">
import { ref, reactive } from 'vue';
import { RouterLink } from 'vue-router';
import GlowCard from '@/components/GlowCard.vue';
import Pill from '@/components/Pill.vue';
import PageIntro from '@/components/PageIntro.vue';
import IconDisplay from '@/components/IconDisplay.vue';

interface ShowcaseItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  type: 'internal' | 'external' | 'video';
  link?: string;
  route?: string;
  videoUrl?: string;
  tags: string[];
  featured?: boolean;
}

const showcaseItems = reactive<ShowcaseItem[]>([
  // 3D & WebGL Section
  {
    id: 'starwars',
    title: 'Star Wars Text Crawl',
    description: 'A Three.js recreation of the iconic Star Wars opening crawl with 3D perspective and space effects.',
    icon: 'rocket',
    category: '3D & WebGL',
    type: 'internal',
    route: '/three/starwars',
    tags: ['Three.js', 'WebGL', '3D', 'Animation'],
    featured: true,
  },
  {
    id: 'vr-experience',
    title: 'VR Experience - Dichotomy',
    description: 'An immersive VR experience built with Three.js featuring an interactive 3D worlds and spatial interactions.',
    icon: 'vr',
    category: '3D & WebGL',
    type: 'internal',
    route: '/three/vr-demo',
    tags: ['VR', 'Three.js', 'Interactive'],
  },
  {
    id: 'procedural-gen',
    title: 'Procedural Terrain Generation',
    description: 'Dynamically generated 3D landscapes using noise algorithms and WebGL rendering.',
    icon: 'terrain',
    category: '3D & WebGL',
    type: 'internal',
    route: '/three/terrain',
    tags: ['Three.js', 'Procedural Generation', 'WebGL'],
  },

  // Games & Interactive
  {
    id: 'web-game',
    title: 'Browser-Based Game',
    description: 'A full-featured game built with modern web technologies. Experience interactive gameplay directly in your browser.',
    icon: 'gamepad',
    category: 'Games & Interactive',
    type: 'internal',
    route: '/game',
    tags: ['Gaming', 'Interactive', 'JavaScript'],
    featured: true,
  },
  {
    id: 'unreal-game',
    title: 'Link to a Unreal Engine Game made with UEFN',
    description: 'A link to a game hosted on the fortnite platform. Experimenting with brand new as of yet unreleased UEFN features. Collab with Team Unite',
    icon: 'gamepad',
    category: 'Games & Interactive',
    type: 'external',
    link: 'https://www.epicgames.com/fortnite/en-US/news/introducing-uefn',
    tags: ['Game', 'Puzzle', 'Logic'],
  },

  // Media & Demonstrations
  {
    id: 'feature-reel',
    title: 'Feature Showcase Reel',
    description: 'A video compilation of our most impressive features and technical achievements from past projects.',
    icon: 'film',
    category: 'Media & Demonstrations',
    type: 'video',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    tags: ['Video', 'Showcase', 'Features'],
    featured: true,
  },
  // External Projects
  {
    id: 'github-repos',
    title: 'GitHub Repositories',
    description: 'Explore our open-source projects and technical contributions on GitHub.',
    icon: 'github',
    category: 'External Projects',
    type: 'external',
    link: 'https://github.com',
    tags: ['Open Source', 'GitHub', 'Code'],
  },
  {
    id: 'live-demo',
    title: 'Live Production Demo',
    description: 'Experience a live version of one of our production applications in action.',
    icon: 'globe',
    category: 'External Projects',
    type: 'external',
    link: 'https://example.com',
    tags: ['Live', 'Production', 'Demo'],
  },
]);

const selectedCategory = ref<string | null>(null);
const categories = Array.from(new Set(showcaseItems.map((item) => item.category)));

const filteredItems = () => {
  if (!selectedCategory.value) return showcaseItems;
  return showcaseItems.filter((item) => item.category === selectedCategory.value);
};

const filteredFeatured = () => {
  return showcaseItems.filter((item) => item.featured && (!selectedCategory.value || item.category === selectedCategory.value));
};
</script>

<template>
  <section class="page-section">
    <PageIntro eyebrow="Showcase" heading="Our creative and technical achievements." description="A curated collection of projects, experiments, and features we've built over the years. From immersive 3D experiences to interactive games and innovative applications." />

    <!-- Featured Section -->
    <div v-if="!selectedCategory" class="featured-section">
      <h2 class="section-title">Featured Projects</h2>
      <div class="featured-grid">
        <GlowCard v-for="item in filteredFeatured()" :key="item.id" class="featured-card">
          <div class="card-header">
            <IconDisplay :icon="item.icon" size="lg" class="card-icon" />
            <span class="featured-badge">Featured</span>
          </div>
          <h3>{{ item.title }}</h3>
          <p class="card-description">{{ item.description }}</p>
          <div class="tags-row">
            <Pill v-for="tag in item.tags.slice(0, 2)" :key="tag" color="#e4d9ff" backgroundColor="rgba(168, 85, 247, 0.16)">
              {{ tag }}
            </Pill>
          </div>
          <div class="card-action">
            <RouterLink v-if="item.type === 'internal' && item.route" :to="item.route" class="action-link"> Explore → </RouterLink>
            <a v-else-if="item.type === 'external' && item.link" :href="item.link" target="_blank" rel="noopener noreferrer" class="action-link"> Visit → </a>
            <a v-else-if="item.type === 'video' && item.videoUrl" :href="item.videoUrl" target="_blank" rel="noopener noreferrer" class="action-link"> Watch → </a>
          </div>
        </GlowCard>
      </div>
    </div>

    <!-- Category Filter -->
    <div class="category-filter">
      <button class="filter-btn" :class="{ active: !selectedCategory }" @click="selectedCategory = null">All Projects</button>
      <button v-for="category in categories" :key="category" class="filter-btn" :class="{ active: selectedCategory === category }" @click="selectedCategory = category">
        {{ category }}
      </button>
    </div>

    <!-- Main Grid -->
    <div class="showcase-grid">
      <template v-for="(item, index) in filteredItems()" :key="item.id">
        <div v-if="!selectedCategory && index === 0" class="category-divider">
          <span class="divider-title">All Projects</span>
        </div>

        <GlowCard class="showcase-card">
          <div class="card-content">
            <div class="card-top">
              <IconDisplay :icon="item.icon" size="md" class="card-icon" />
              <h3>{{ item.title }}</h3>
            </div>
            <p class="card-description">{{ item.description }}</p>

            <div class="tags-row">
              <Pill v-for="tag in item.tags.slice(0, 3)" :key="tag" color="#c9e4ff" backgroundColor="rgba(110, 231, 255, 0.16)">
                {{ tag }}
              </Pill>
            </div>
          </div>

          <div class="card-footer">
            <RouterLink v-if="item.type === 'internal' && item.route" :to="item.route" class="card-button"> Explore </RouterLink>
            <a v-else-if="item.type === 'external' && item.link" :href="item.link" target="_blank" rel="noopener noreferrer" class="card-button"> Visit </a>
            <a v-else-if="item.type === 'video' && item.videoUrl" :href="item.videoUrl" target="_blank" rel="noopener noreferrer" class="card-button"> Watch Video </a>
          </div>
        </GlowCard>
      </template>
    </div>

    <div v-if="filteredItems().length === 0" class="empty-state">
      <p>No projects in this category yet. Check back soon!</p>
    </div>
  </section>
</template>

<style scoped>
.page-section {
  display: grid;
  gap: 2rem;
}

.featured-section {
  display: grid;
  gap: 1.5rem;
}

.section-title {
  color: #f7fbff;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.featured-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.card-icon {
  color: #6ee7ff;
  flex-shrink: 0;
}

.featured-badge {
  background: linear-gradient(135deg, var(--accent), var(--accent2), var(--accent3));
  color: #04050b;
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.featured-card h3 {
  color: #f7fbff;
  font-size: 1.2rem;
  margin: 0 0 0.6rem;
  line-height: 1.3;
}

.featured-card .card-description {
  color: #9db0d8;
  margin-bottom: 1rem;
  flex-grow: 1;
  font-size: 0.95rem;
  line-height: 1.5;
}

.card-action {
  display: flex;
  gap: 0.5rem;
}

.action-link,
.card-button {
  align-self: flex-start;
  padding: 0.7rem 1.3rem;
  background: linear-gradient(135deg, var(--accent), var(--accent-weak));
  border: none;
  border-radius: 0.6rem;
  color: var(--bg);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;
  display: inline-block;
}

.action-link:hover,
.card-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(110, 231, 255, 0.3);
}

.action-link:active,
.card-button:active {
  transform: translateY(0);
}

.category-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 1.5rem;
  background: var(--surface);
  border-radius: 1rem;
  border: 1px solid var(--accent-ghost);
}

.filter-btn {
  padding: 0.7rem 1.2rem;
  border: 1px solid var(--accent-ghost);
  border-radius: 0.6rem;
  color: #9db0d8;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.filter-btn:hover {
  background: var(--accent-weak);
  color: #f7fbff;
  border-color: rgba(110, 231, 255, 0.3);
}

.filter-btn.active {
  background: linear-gradient(135deg, rgba(110, 231, 255, 0.25), rgba(255, 122, 217, 0.15));
  border-color: rgba(110, 231, 255, 0.4);
  color: #f7fbff;
}

.showcase-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.category-divider {
  grid-column: 1 / -1;
  padding: 2rem 0 0;
  border-top: 1px solid rgba(110, 231, 255, 0.1);
  margin-top: 1rem;
}

.divider-title {
  display: inline-block;
  color: #6ee7ff;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.showcase-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.2s ease;
}

.showcase-card:hover {
  transform: translateY(-4px);
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card-top {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.showcase-card h3 {
  color: #f7fbff;
  font-size: 1.1rem;
  margin: 0;
  font-weight: 600;
}

.showcase-card .card-description {
  color: #9db0d8;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
}

.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.3rem;
}

.card-footer {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem 2rem;
  color: #9db0d8;
  font-size: 1.1rem;
}

@media (max-width: 900px) {
  .featured-grid {
    grid-template-columns: 1fr;
  }

  .showcase-grid {
    grid-template-columns: 1fr;
  }

  .category-filter {
    gap: 0.5rem;
  }

  .filter-btn {
    flex: 1;
    min-width: 100px;
  }
}
</style>
