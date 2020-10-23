<template>
  <Game nav-back-path="/dragdrop" @previous="previousLevel" @restart="restartGame" @next="nextLevel">
  <i style="color: greenyellow">IN DEVELOPMENT</i>
  </Game>
</template>

<script>
import Game from "../Game";

export default {
  name: "BuildWords",
  components: {
    Game,
  },
  data() {
    return {};
  },
  created: function () {
    this.initGame();
  },
  methods: {
    initGame: function () {
      // TODO add something
    },
    restartGame: function () {
      this.$log.info("IMPLEMENT ME"); // TODO Implement
    },
    previousLevel: function () {
      this.$log.info("IMPLEMENT ME"); // TODO Implement
    },
    nextLevel: function () {
      this.$log.info("IMPLEMENT ME"); // TODO Implement
    }
  }
}
</script>

<style scoped lang="scss">
</style>
