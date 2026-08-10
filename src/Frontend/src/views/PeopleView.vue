<script setup lang="ts">
import GlowCard from '@/components/GlowCard.vue';
import PageIntro from '@/components/PageIntro.vue';

import jeffreyImage from '@/assets/images/jeffrey.webp';
import nielsImage from '@/assets/images/niels.jpg';
import axelImage from '@/assets/images/axel.jpg';

const people = [
  {
    name: 'Jeffrey Cornillie',
    role: 'Generalist',
    focus: 'Enthused by everything code, design, and motion. Simply enjoys everything that can be built and shared with others.',
    quote: '"I like building things that feel thoughtful, usable, and hopefully a little bit memorable."',
    color: '#6ee7ff',
    image: jeffreyImage,
    links: [
      { label: 'GitHub', url: 'https://github.com/CornillieJ' },
      { label: 'Presentation', url: 'https://CornillieJ.github.io/Internship-presentation/' },
    ],
  },
  {
    name: 'Niels Vannieuwenborgh',
    role: 'Generalist',
    focus: 'Interested in systems, logic, and making ambitious ideas reliable enough to grow.',
    quote: '"I enjoy connecting the dots between ideas, structure, and real-world implementation."',
    color: '#ff7ad9',
    image: nielsImage,
    links: [{ label: 'GitHub', url: 'https://github.com/NielsVnb' }],
  },
  {
    name: 'Axel Martens',
    role: 'Generalist',
    focus: 'Enjoys working on things that improve the world, and learning new skills along the way.',
    quote: '"I’m happiest when a project feels both imaginative and intentional."',
    color: '#a855f7',
    image: axelImage,
    links: [
      { label: 'GitHub', url: 'https://github.com/AxelMaHowest' },
      { label: 'Portfolio', url: 'https://axelmahowest.github.io/portfolio/' },
    ],
  },
];
people.forEach((person) => (person.image = new URL(person.image ?? '', import.meta.url).href));
people.sort(() => Math.random() - 0.5);
</script>

<template>
  <section class="page-section">
    <PageIntro eyebrow="People / the team" heading="Meet the team behind this project." description="Three generalists learning, building, and shaping this prototype together." />

    <div class="people-list">
      <GlowCard v-for="person in people" :key="person.name" class="person" :tiltStrength="3">
        <div class="person-row">
          <div class="person-image in-front">
            <div v-if="person.image" class="avatar">
              <img :src="person.image" :alt="person.name" :style="{ '--accent': person.color }" />
            </div>
            <div v-else class="avatar" :style="{ '--accent': person.color }">
              {{
                person.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
              }}
            </div>
          </div>

          <div class="person-content">
            <h2>{{ person.name }}</h2>
            <p class="role">{{ person.role }}</p>
            <p class="focus">{{ person.focus }}</p>
            <blockquote class="quote">{{ person.quote }}</blockquote>

            <div class="links-row">
              <a v-for="link in person.links" :key="link.label" :href="link.url" target="_blank" rel="noopener noreferrer">
                {{ link.label }}
              </a>
            </div>
          </div>
        </div>
      </GlowCard>
    </div>
  </section>
</template>

<style scoped>
/* Styles remain unchanged */
.page-section {
  display: grid;
  gap: 1.3rem;
}

.people-list {
  width: 100%;
  max-width: 100vw;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.person {
  width: max-content;
  max-width: 100vw;
  padding: 1rem 5rem;
}
.person-row {
  display: grid;
  gap: 2rem;
}

.person:nth-child(odd) {
  align-self: flex-start;
}
.person:nth-child(odd) .person-row {
  grid-template-columns: 180px 1fr;
}

.person:nth-child(even) {
  align-self: flex-end;
}
.person:nth-child(even) .person-row {
  grid-template-columns: 1fr 180px;
}
.person:nth-child(even) .person-image {
  order: 2;
}
.person:nth-child(even) .person-content {
  order: 1;
  text-align: right;
}

.person-image {
  display: flex;
  justify-content: center;
  padding: 1rem 0;
}

.avatar {
  position: relative;
  display: grid;
  place-items: center;
  width: 15rem;
  height: 15rem;
  border-radius: 1.4rem;
  font-size: 3rem;
  font-weight: 700;
  color: #07111f;
  background: linear-gradient(135deg, var(--accent), rgba(255, 255, 255, 0.1));
  transition: all 500ms ease;
}
.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
  position: absolute;
}
.avatar:hover {
  transform: scale(1.2) translateZ(0.1rem);
  box-shadow: 0 0 80px black;
}

.person-content {
  display: grid;
  gap: 0.5rem;
}

h2 {
  color: #f7fbff;
  font-size: 1.35rem;
}

.role {
  color: #6ee7ff;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.85rem;
}

.focus {
  color: #9db0d8;
  line-height: 1.5;
}

.quote {
  margin-top: 1rem;
  padding: 1rem 1.2rem;
  border-left: 3px solid var(--accent, #6ee7ff);
  background: rgba(110, 231, 255, 0.08);
  border-radius: 0.6rem;
  color: #dff8ff;
  font-style: italic;
  line-height: 1.6;
}
.person:nth-child(even) .quote {
  border-left: none;
  border-right: 3px solid var(--accent, #6ee7ff);
}

.links-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 0.5rem;
}

.links-row a {
  padding: 0.5rem 0.75rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  color: #dff8ff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition:
    transform 180ms ease,
    background 180ms ease;
}

.links-row a:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.12);
}

@media (max-width: 768px) {
  .person-row,
  .person:nth-child(even) .person-row {
    grid-template-columns: 1fr;
  }

  .person:nth-child(even) .person-image {
    order: unset;
  }

  .person:nth-child(even) .person-content {
    order: unset;
    text-align: left;
  }

  .person:nth-child(even) .quote {
    border-left: 3px solid var(--accent, #6ee7ff);
    border-right: none;
  }

  .person-image {
    justify-content: flex-start;
  }
}

@media (max-width: 480px) {
  .person {
    padding: 1rem 2rem;
    flex-direction: column;
    max-width: 90vw;
  }
  .person-row{
    grid-template-columns: 1fr !important;
    max-width: 90vw;
  }
}
</style>
