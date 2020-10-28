<template>
  <Game nav-back-path="/dragdrop" @previous="previousLevel" @restart="restartGame" @next="nextLevel">
    <div class="drop-section">
      <ImageContainer class="dropzone empty-droppable-element" src="img/characters/A.svg"></ImageContainer>
      <ImageContainer class="dropzone empty-droppable-element" src="img/characters/B.svg"></ImageContainer>
      <ImageContainer class="dropzone empty-droppable-element" src="img/characters/C.svg"></ImageContainer>
      <ImageContainer class="dropzone empty-droppable-element" src="img/characters/D.svg"></ImageContainer>
      <ImageContainer class="dropzone empty-droppable-element" src="img/characters/E.svg"></ImageContainer>
    </div>
    <div class="spacer"></div>
    <div class="drag-section">
      <ImageContainer class="draggable-element" src="img/characters/A.svg"></ImageContainer>
      <ImageContainer class="draggable-element" src="img/characters/B.svg"></ImageContainer>
      <ImageContainer class="draggable-element" src="img/characters/C.svg"></ImageContainer>
      <ImageContainer class="draggable-element" src="img/characters/D.svg"></ImageContainer>
      <ImageContainer class="draggable-element" src="img/characters/E.svg"></ImageContainer>
    </div>
  </Game>
</template>

<script>
import Game from "../Game";
import ImageContainer from "../ImageContainer";
import {dragDrop} from "../mixins/dragDrop"
/* eslint-disable */ // TODO REMOVE
export default {
  name: "DDCharacters",
  components: {
    ImageContainer,
    Game,
  },
  mixins: [dragDrop],
  data() {
    return {};
  },
  created: function () {
    this.initGame();
  },
  mounted: function () {
    this.initDragDrop();
  },

  methods: {
    ondrop: function(event){
      event.currentTarget.classList.add('drop-success');
      event.currentTarget.classList.remove('empty-droppable-element');
      event.relatedTarget.classList.add('drag-success');
    },
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

.draggable-element {
  touch-action: none;
  background-color: transparent;
}

.empty-droppable-element {
  filter: grayscale(85%);
}

.drop-target-active {
  background-color: #6060d7;
}

.drop-success {
  background-color: #24ff02;
}

.drag-success {
  visibility: hidden;
}

</style>
