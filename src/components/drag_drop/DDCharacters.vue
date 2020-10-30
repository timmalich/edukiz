<template>
  <Game :is-highlight-animation-running="isGameOver" nav-back-path="/dragdrop" @previous="previousLevel" @restart="restart" @next="nextLevel">
    <div class="drop-section" v-bind:style="gridContainer">
      <ImageContainer v-for="charConfig in droppableCharacters" :key="charConfig.character"
                      :data-identifier="charConfig.character" :src="charConfig.image"
                      class="dropzone empty-droppable-element"></ImageContainer>
    </div>
    <div class="spacer"></div>
    <div class="drag-section" v-bind:style="gridContainer">
      <ImageContainer v-for="charConfig in draggableCharacters" :key="charConfig.character"
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
import {ArrayUtils} from "../utils/ArrayUtils"
import Sounds from "../Sounds";

export default {
  name: "DDCharacters",
  components: {
    ImageContainer,
    Game,
  },
  mixins: [dragDrop, characterConfigs],
  data() {
    return {
      selectedLevel: 2,
      levels: [
        {elementAmount: 2},
        {elementAmount: 3},
        {elementAmount: 4},
        {elementAmount: 5},
        {elementAmount: 6},
        {elementAmount: 7},
        {elementAmount: 8},
        {elementAmount: 9},
        {elementAmount: 10},
        {elementAmount: 11},
        {elementAmount: 12},
        {elementAmount: 13},
        {elementAmount: 14},
        {elementAmount: 15},
        {elementAmount: 16},
        {elementAmount: 17},
        {elementAmount: 18},
        {elementAmount: 19},
        {elementAmount: 20},
        {elementAmount: 21},
      ],
      droppableCharacters: [],
      draggableCharacters: [],
      solvedCharacters: 0,
      isGameOver: false
    };
  },
  created: function () {
    this.restart();
    this.initDragDrop(true);
  },
  computed: {
    gridContainer: function () {
      let maxElementsInRow = 7;
      let elementAmount = this.levels[this.selectedLevel].elementAmount;
      let gridGap = 10;
      if (elementAmount / maxElementsInRow > 2) {
        gridGap = 3;
      } else if (elementAmount / maxElementsInRow > 1) {
        gridGap = 7;
      }

      let elementsInRow;
      if (elementAmount > maxElementsInRow) {
        elementsInRow = maxElementsInRow;
      } else {
        elementsInRow = elementAmount;
      }

      return {
        'grid-template-columns': "repeat(" + elementsInRow + ", minmax(20pt, 1fr))",
        'display': 'grid',
        'grid-gap': gridGap + 'pt'
      }
    }
  },
  methods: {
    ondragstart: function(event){
      let dragElement = event.target;
      Sounds.playCharacter(dragElement.getAttribute('data-identifier'));
    },
    ondrop: function (event) {
      let dropElement = event.currentTarget;
      let dragElement = event.relatedTarget;
      let character = dropElement.getAttribute('data-identifier');
      Sounds.playCharacter(character);
      if (character === dragElement.getAttribute('data-identifier')) {
        this.solvedCharacters++;
        if (this.solvedCharacters === this.levels[this.selectedLevel].elementAmount) {
          setTimeout(function(){
            this.isGameOver = true;
            Sounds.playBigSuccess();
          }.bind(this), 800);
        }
        return true;
      }
      return false;
    },
    restart: function () {
      this.isGameOver = false;
      this.solvedCharacters = 0;
      this.droppableCharacters = [];
      this.draggableCharacters = [];
      ArrayUtils.shuffleArray(this.characterConfigs);
      for (let i = 0; i < this.levels[this.selectedLevel].elementAmount; i++) {
        let config =  this.characterConfigs[i];
        Sounds.preload(config.character.toLowerCase());
        this.droppableCharacters.push(config);
        this.draggableCharacters.push(config);
      }
      ArrayUtils.shuffleArray(this.droppableCharacters);
      this.resetGameComponents();
    },
    resetGameComponents: function () {
      this.resetDragAndDropSuccessions();
    },
    previousLevel: function () {
      if (this.selectedLevel > 0) {
        this.selectedLevel--;
      }
      this.restart();
    },
    nextLevel: function () {
      if (this.selectedLevel < this.levels.length - 1) {
        this.selectedLevel++;
      }
      this.restart();
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
  max-height: 40%;
  justify-items: center;
  align-items: center;
  position: relative;
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
