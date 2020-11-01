<template>
  <div class="content-window">
    <router-view style="position: relative"/>
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
              href: "/memory/Characters",
              title: "Characters",
              icon: "fa fa-font",
            }
          ],
        },
        {
          href: "/dragdrop",
          title: "Drag and Drop",
          icon: "far fa-hand-point-up",
          child: [
            {
              href: "/dragdrop/build-words",
              title: "Wörter Bauen",
              icon: "fas fa-hammer",
            },
            {
              href: "/dragdrop/characters",
              title: "Zeichen Finden",
              icon: "fa fa-font",
            },
          ]
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
$generalPaddingLeft: 10pt;

.content-window {
  height: 100%;
  padding-right: $generalPaddingRight;
  padding-left: $generalPaddingLeft;
  width: calc(100% - #{$generalPaddingLeft} - #{$generalPaddingRight});
  top: 0;
  left: 0;
  position: absolute;
  display: grid;
  background-color: #37373e;
}

.clickable-elements, .game-button {
  color: #ffffff;
  background-color: #4385f4f0;
  border-radius: 5pt;
}

.game-button {
  height: 30pt;
  width: 30pt;
  font-size: 1.7rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.game-button > a {
  color: inherit;
  text-decoration: none;
}

</style>
