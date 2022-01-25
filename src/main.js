import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHashHistory } from "vue-router";
import "@fortawesome/fontawesome-free/css/all.css";
import mitt from "mitt";
import VueGtag from "vue-gtag";

import Home from "./components/Home.vue";
import Memory from "./components/memory/MemoryNavPage.vue";
import MemoryAnimals from "./components/memory/MemoryAnimals.vue";
import MemoryCharacters from "./components/memory/MemoryCharacters";
import DDNavPage from "./components/drag_drop/DDNavPage";
import DDBuildWordsGame from "./components/drag_drop/DDBuildWordsGame";
import DDCharacters from "./components/drag_drop/DDCharacters";
import MiscNavPage from "./components/misc/MiscNavPage";
import CalculateNumbers0To18 from "./components/misc/CalculateNumbers0To18";
import TextToSppech from "./components/misc/TextToSpeech";
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
      path: "/misc",
      name: "Misc",
      component: MiscNavPage,
    },
    {
      path: "/misc/numbers-0-to-18",
      name: "CalculateNumbers0To18",
      component: CalculateNumbers0To18,
    },
    {
      path: "/misc/t2s",
      name: "TextToSpeech",
      component: TextToSppech,
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
app.use(VueGtag, {config: {id: "G-WFDHBCWETB"}, enabled: false}) // TODO enable on consent
app.config.globalProperties.emitter = emitter;
app.mount("#app");
