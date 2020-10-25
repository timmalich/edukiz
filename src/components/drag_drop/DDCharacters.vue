<template>
  <Game nav-back-path="/dragdrop" @previous="previousLevel" @restart="restartGame" @next="nextLevel">
    <div class="drop-section">
      <ImageContainer class="drop-element" src="img/characters/A.svg"></ImageContainer>
      <ImageContainer class="drop-element" src="img/characters/B.svg"></ImageContainer>
      <ImageContainer class="drop-element" src="img/characters/C.svg"></ImageContainer>
      <ImageContainer class="drop-element" src="img/characters/D.svg"></ImageContainer>
      <ImageContainer class="drop-element" src="img/characters/E.svg"></ImageContainer>
    </div>
    <div class="spacer"></div>
    <div class="drag-section">
      <ImageContainer src="img/characters/A.svg"></ImageContainer>
      <ImageContainer src="img/characters/B.svg"></ImageContainer>
      <ImageContainer src="img/characters/C.svg"></ImageContainer>
      <ImageContainer src="img/characters/D.svg"></ImageContainer>
      <ImageContainer src="img/characters/E.svg"></ImageContainer>
    </div>
  </Game>
</template>

<script>
import Game from "../Game";
import ImageContainer from "../ImageContainer";

export default {
  name: "BuildWords",
  components: {
    ImageContainer,
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
.spacer {
  height: 20%;
}

.drop-section, .drag-section {
  width: 100%;
  height: 40%;
  display: grid;
  grid-gap: 10pt;
  justify-items: center;
  align-items: center;
  position: relative;
  grid-template-columns: repeat(5, minmax(20pt, 1fr));
}

.drop-element {
  filter: grayscale(85%);
}

</style>
