import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ShowcaseView from '../views/ShowcaseView.vue';
import UtilityHubView from '../views/UtilityHubView.vue';
import AIStudioView from '../views/AIStudioView.vue';
import PeopleView from '../views/PeopleView.vue';
import ContactView from '../views/ContactView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/showcase',
      name: 'showcase',
      component: ShowcaseView,
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
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
});

export default router;
