<template>
  <div class="content">
    <Header :nav-back-path="this.navBackPath">
      <slot name="header"></slot>
    </Header>
    <div class="game-content">
      <slot></slot>
    </div>
    <Footer :is-highlight-animation-running="isHighlightAnimationRunning" @previous="previous" @restart="restart" @next="next" />
  </div>
</template>

<script>
import Header from "./Header.vue"
import Footer from "./Footer.vue"

export default {
  name: "Game",
  components: {
    Header,
    Footer
  },
  props: ['navBackPath', 'isHighlightAnimationRunning'],
  methods: {
    previous: function () {
      this.$emit('previous');
    },
    restart: function () {
      this.$emit('restart');
    },
    next: function () {
      this.$emit('next');
    }
  }
}
</script>

<style scoped lang="scss">

.content {
  position: relative;
}

.game-content {
  position: relative;
  width: 100%;
  height: calc(100% - 35pt - 35pt);
}

</style>
