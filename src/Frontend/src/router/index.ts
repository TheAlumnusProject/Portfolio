import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ShowcaseView from '../views/ShowcaseView.vue';
import UtilityHubView from '../views/UtilityHubView.vue';
import AIStudioView from '../views/AIStudioView.vue';
import PeopleView from '../views/PeopleView.vue';
import ContactView from '../views/ContactView.vue';
import StarWarsView from '../views/cases/StarWarsView.vue';
import ImageHelixView from '../views/cases/ImageHelixView.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/utility-hub',
      name: 'utility-hub',
      component: UtilityHubView,
    },
    {
      path: '/ai-studio',
      name: 'ai-studio',
      component: AIStudioView,
    },
    {
      path: '/showcase',
      name: 'showcase',
      component: ShowcaseView,
    },
    {
      path: '/people',
      name: 'people',
      component: PeopleView,
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView,
    },
    {
      path: '/showcase/starwars',
      name: 'starwars',
      component: StarWarsView,
    },
    {
      path: '/showcase/helix',
      name: 'image-helix',
      component: ImageHelixView,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
});

export default router;
