import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import "@fortawesome/fontawesome-free/css/all.css";
import VueLogger from 'vuejs-logger';

import Home from "./components/Home.vue";
import Memory from "./components/memory/MemoryNavPage.vue";
import MemoryAnimals from "./components/memory/MemoryAnimals.vue";
import MemoryCharacters from "./components/memory/MemoryCharacters";
import DDNavPage from "./components/drag_drop/DDNavPage";
import DDBuildWordsGame from "./components/drag_drop/DDBuildWordsGame";
import DDCharacters from "./components/drag_drop/DDCharacters";
import './registerServiceWorker'

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(VueLogger);
Vue.prototype.$eventHub = new Vue();
if(!localStorage.rewards){
  localStorage.rewards=0;
}

const router = new VueRouter({
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
    },
    {
      path: "/memory",
      name: "Memory",
      component: Memory,
    },
    {
      path: "/memory/animals",
      name: "MemoryAnimals",
      component: MemoryAnimals,
    },
    {
      path: "/memory/characters",
      name: "MemoryCharacters",
      component: MemoryCharacters,
    },{
      path: "/dragdrop",
      name: "DragDrop",
      component: DDNavPage,
    },{
      path: "/dragdrop/build-words",
      name: "DDBuildWords",
      component: DDBuildWordsGame,
    },
    {
      path: "/dragdrop/characters",
      name: "DDCharacters",
      component: DDCharacters,
    },
    {
      path: "/github",
      name: "github",
      beforeEnter() {
        location.href = "https://github.com/timmalich/edukiz";
      },
    },
  ],
});

new Vue({
  el: "#app",
  router,
  render: (h) => h(App),
});
