import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import VueSidebarMenu from "vue-sidebar-menu";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";
import "@fortawesome/fontawesome-free/css/all.css";

import Home from "./components/Home.vue";
import Memory from "./components/memory/Memory.vue";
import MemoryAnimals from "./components/memory/MemoryAnimals.vue";

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(VueSidebarMenu);

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
