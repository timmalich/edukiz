import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHashHistory } from "vue-router";
import "@fortawesome/fontawesome-free/css/all.css";
import mitt from "mitt";

import Home from "./components/Home.vue";
import Memory from "./components/memory/MemoryNavPage.vue";
import MemoryAnimals from "./components/memory/MemoryAnimals.vue";
import MemoryCharacters from "./components/memory/MemoryCharacters";
import DDNavPage from "./components/drag_drop/DDNavPage";
import DDBuildWordsGame from "./components/drag_drop/DDBuildWordsGame";
import DDCharacters from "./components/drag_drop/DDCharacters";
import ArithmeticNavPage from "./components/arithmetic/ArithmeticNavPage";
import CalculateNumbers0To18 from "./components/arithmetic/CalculateNumbers0To18";
import "./registerServiceWorker";

if (!localStorage.rewards) {
  localStorage.rewards = 0;
}

const router = createRouter({
  history: createWebHashHistory(),
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
    },
    {
      path: "/dragdrop",
      name: "DragDrop",
      component: DDNavPage,
    },
    {
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
      path: "/arithmetic",
      name: "Arithmetic",
      component: ArithmeticNavPage,
    },
    {
      path: "/arithmetic/numbers-0-to-19",
      name: "CalculateNumbers0To18",
      component: CalculateNumbers0To18,
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

const emitter = mitt();
const app = createApp(App);
app.use(router);
app.config.globalProperties.emitter = emitter;
app.mount("#app");
