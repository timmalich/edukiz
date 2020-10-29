<template>
  <Game nav-back-path="/dragdrop" @previous="previousLevel" @restart="restartGame" @next="nextLevel">
    <div class="drop-section">
      <ImageContainer v-for="charConfig in characters" :key="charConfig.character"
                      :data-identifier="charConfig.character" :src="charConfig.image"
                      class="dropzone empty-droppable-element"></ImageContainer>
    </div>
    <div class="spacer"></div>
    <div class="drag-section">
      <ImageContainer v-for="charConfig in characters" :key="charConfig.character"
                      :data-identifier="charConfig.character" :src="charConfig.image"
                      class="draggable-element"></ImageContainer>
    </div>
  </Game>
</template>

<script>
import Game from "../Game";
import ImageContainer from "../ImageContainer";
import {dragDrop} from "../mixins/dragDrop"
import {characterConfigs} from "../mixins/characterConfigs"

export default {
  name: "DDCharacters",
  components: {
    ImageContainer,
    Game,
  },
  mixins: [dragDrop, characterConfigs],
  data() {
    return {
      characters: []
    };
  },
  created: function () {
    this.initGame();
  },
  mounted() {
    this.initDragDrop();
  },
  updated: function () {
    this.initDragDrop();
  },

  methods: {
    ondrop: function (event) {
      let dropElement = event.currentTarget;
      let dragElement = event.relatedTarget;
      if (dropElement.getAttribute('data-identifier') === dragElement.getAttribute('data-identifier')) {
        dropElement.classList.add('drop-success');
        dropElement.classList.remove('empty-droppable-element');
        dragElement.classList.add('drag-success');
      }
    },
    initGame: function () {
      this.characters = [];
      for (let i = 0; i < 5; i++) {
        this.characters.push(this.characterConfigs[i]);
      }
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
