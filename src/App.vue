<template>
  <div>
    <div :class="[{ sidebarCollapsed: collapsed }, { sidebarOnMobile: mobile }]">
      <sidebar-menu
          :menu="menu"
          :collapsed="collapsed"
          :theme="selectedTheme"
          :show-one-child="true"
          @toggle-collapse="onToggleCollapse"
      />
      <div
          v-if="mobile && !collapsed"
          class="sidebar-overlay"
          @click="collapsed = true"
      />
    </div>
    <router-view
        :class="[{ sidebarCollapsed: collapsed }, { sidebarExpanded: !collapsed && !mobile }, {sidebarOnMobile: mobile}, 'sidebarRight']"/>
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
      mobile: false,
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
        this.mobile = true;
        this.collapsed = true;
      } else {
        this.mobile = false;
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
.sidebarRight {
  height: calc(100% - 10pt);
  position: absolute;
  display: inline;
}

.sidebarExpanded {
  padding-left: 270pt;
  transition: 0.3s ease;
  width: calc(100% - 290pt);
}

.sidebarCollapsed {
  padding-left: 50pt;
  width: calc(100% - 60pt)
}

.sidebarOnMobile {
  padding-left: 50pt;
  width: calc(100% - 68pt);
}
</style>
