import Vue from 'vue';
import createRouter from './router';
import createStore from './store';
import App from './App.vue';

Vue.config.productionTip = false;

export default (context) => {
  const router = createRouter(context);
  const store = createStore(context);
  const app = new Vue({
    router,
    store,
    render: h => h(App),
  });

  return { app, router, store };
};
