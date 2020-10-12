import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import VueSidebarMenu from "vue-sidebar-menu";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";
import "@fortawesome/fontawesome-free/css/all.css";

import Home from "./components/Home.vue";
import Memory from "./components/memory/Memory.vue";
import MemoryAnimals from "./components/memory/MemoryAnimals.vue";
import MemoryAlphabet from "./components/memory/MemoryAlphabet";

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(VueSidebarMenu);

Vue.prototype.$playSound = function (src) {
  new Audio(src).play().then();
};
Vue.prototype.$playError = function () {
  this.$playSound("sounds/error1.mp3");
};
Vue.prototype.$playSuccess = function (){
  this.$playSound("sounds/success1.mp3");
};
Vue.prototype.$playBigSuccess = function (){
  this.$playSound("sounds/big_success1.mp3");
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
      path: "/memory/alphabet",
      name: "MemoryAlphabet",
      component: MemoryAlphabet,
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
