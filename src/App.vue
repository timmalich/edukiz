<template>
  <div :class="[{sidebarCollapsed: collapsed}]">
    <div>
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
    <div :class="[{ sidebarExpanded: (!collapsed && !mobile) }, { sidebarCollapsed: mobile || collapsed }, 'sidebarRight']">
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

<style lang="scss">
$generalPaddingRight: 10pt;
$sidebarCollapsedPaddingLeft: 50pt;

.sidebarRight {
  height: 100%;
  padding-right: $generalPaddingRight;
  width: calc(100% - #{$sidebarCollapsedPaddingLeft} - #{$generalPaddingRight});
  top: 0;
  left: 0;
  position: absolute;
  display: grid;
  background-color: #37373e;
}

.sidebarExpanded {
  padding-left: 270pt;
  width: calc(100% - 270pt - #{$generalPaddingRight});
  transition: 0.3s ease;
}

.sidebarCollapsed {
  padding-left: 50pt;
  width: calc(100% - #{$sidebarCollapsedPaddingLeft} - #{$generalPaddingRight})
}
</style>
