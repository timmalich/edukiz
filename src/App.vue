<template>
  <div id="app" :class="[{ collapsed: collapsed }, { onmobile: isOnMobile }]">
    <sidebar-menu
      :menu="menu"
      :collapsed="collapsed"
      :theme="selectedTheme"
      :show-one-child="true"
      @toggle-collapse="onToggleCollapse"
    />
    <div
      v-if="isOnMobile && !collapsed"
      class="sidebar-overlay"
      @click="collapsed = true"
    />
    <div>
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menu: [
        {
          header: true,
          title: "EDUKIZ",
          hiddenOnCollapse: true,
        },
        {
          href: "/",
          title: "Home",
          icon: "fa fa-home",
        },
        {
          href: "/memory",
          title: "Memory",
          icon: "fa fa-th",
          child: [
            {
              href: "/memory/animals",
              title: "Animals",
              icon: "fa fa-paw",
            },
            {
              href: "/memory/alphabet",
              title: "Alphabet",
              icon: "fa fa-font",
            }
          ],
        },
        {
          href: "/github",
          title: "GitHub",
          icon: "fab fa-github",
        },
      ],
      collapsed: false,
      isOnMobile: false,
      themes: [
        {
          name: "Default theme",
          input: "",
        },
        {
          name: "White theme",
          input: "white-theme",
        },
      ],
      selectedTheme: "",
    };
  },
  name: "App",
  methods: {
    onToggleCollapse(collapsed) {
      this.collapsed = collapsed;
    },
    onResize() {
      if (window.innerWidth <= 767) {
        this.isOnMobile = true;
        this.collapsed = true;
      } else {
        this.isOnMobile = false;
        this.collapsed = false;
      }
    }
  },
  mounted() {
    this.onResize();
    window.addEventListener("resize", this.onResize);
  },
};
</script>

<style>
#app {
  padding-left: 280pt;
  transition: 0.3s ease;
}
#app.collapsed {
  padding-left: 50pt;
}
#app.onmobile {
  padding-left: 50pt;
}
</style>
