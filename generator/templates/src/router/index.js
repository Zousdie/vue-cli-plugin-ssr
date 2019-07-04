import Vue from 'vue';
import Router from 'vue-router';
import guards from './guards';

Vue.use(Router);

export default (context) => {
  const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
      {
        path: '/',
        name: 'home',
        meta: {
          title: 'HOME',
          description: 'Home',
          keywords: 'ssr,home'
        },
        component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
      },
      {
        path: '/about',
        name: 'about',
        meta: {
          title: 'ABOUT',
          description: 'About',
          keywords: 'ssr,about'
        },
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
      },
    ],
  });

  return guards(router, context);
};
