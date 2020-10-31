<template>
  <Game :is-highlight-animation-running="isGameOver" nav-back-path="/dragdrop" @previous="previousLevel" @restart="restart" @next="nextLevel">
    <div class="drop-section dropzone" v-bind:style="gridContainer">
      <ImageContainer v-for="(charConfig, index) in droppedCharacters" :key="index"
                      :src="charConfig.image" class="drop-element"></ImageContainer>
    </div>
    <div class="spacer"></div>
    <div class="drag-section" v-bind:style="gridContainer" ref="dragSection">
      <ImageContainer v-for="(charConfig, index) in draggableCharacters" :key="index"
                      :data-identifier="charConfig.character" :data-draggable-index="index" :src="charConfig.image"
                      class="draggable-element" ref="draggables"></ImageContainer>
    </div>
    <ErrorAnimation ref="errorAnimation"></ErrorAnimation>
  </Game>
</template>

<script>
import Game from "../Game";
import ImageContainer from "../ImageContainer";
import {dragDrop} from "../mixins/dragDrop"
import {ArrayUtils} from "../utils/ArrayUtils"
import Sounds from "../Sounds";
import {wordConfigs} from "../mixins/wordConfigs";
import {CharacterUtils} from "../utils/CharacterUtils";
import ErrorAnimation from "../ErrorAnimation";

export default {
  name: "DDBuildWords",
  components: {
    ImageContainer,
    Game,
    ErrorAnimation
  },
  mixins: [dragDrop, wordConfigs],
  data() {
    return {
      selectedLevel: 2,
      levels: undefined,
      droppedCharacters: [],
      currentWordCharacters: [],
      draggableCharacters: [],
      solvedCharacters: 0,
      isGameOver: false
    };
  },
  created: function () {
    this.levels = this.wordConfigs.length;
    this.restart();
    this.initDragDrop(false);
  },
  computed: {
    gridContainer: function () {
      let characterAmount = this.wordConfigs[this.selectedLevel].wordLength;
      let gridGap = 2;
      return {
        'grid-template-columns': "repeat(" + characterAmount + ", minmax(20pt, 1fr))",
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
      let dragElement = event.relatedTarget;
      let draggedCharacter = dragElement.getAttribute('data-identifier').toLowerCase();
      let expectedCharacter = this.currentWordCharacters[this.solvedCharacters].toLowerCase();
      if (draggedCharacter === expectedCharacter) {
        this.solvedCharacters++;
        let indexOfElementUnderDrag = dragElement.getAttribute("data-draggable-index");
        let characterConfigForMove = this.draggableCharacters.splice(indexOfElementUnderDrag, 1)[0];
        this.droppedCharacters.push(characterConfigForMove);
        if (this.solvedCharacters === this.wordConfigs[this.selectedLevel].wordLength) {
          setTimeout(function(){
            this.isGameOver = true;
            Sounds.playBigSuccess();
          }.bind(this), 800);
        }
        return true;
      } else{
        this.$refs.errorAnimation.showError();
        return false;
      }
    },
    restart: function () {
      this.isGameOver = false;
      this.solvedCharacters = 0;
      this.droppedCharacters = [];
      this.draggableCharacters = [];
      let word = ArrayUtils.getRandomArrayElement(this.wordConfigs[this.selectedLevel].words);
      this.currentWordCharacters = word.split('');
      for(let character of this.currentWordCharacters){
        Sounds.preload(character.toLowerCase());
        this.draggableCharacters.push(CharacterUtils.createConfig(character));
      }
      ArrayUtils.shuffleArray(this.draggableCharacters);
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
      if (this.selectedLevel < this.levels) {
        this.selectedLevel++;
      }
      this.restart();
    }
  }
}
</script>

<style scoped lang="scss">

.spacer {
  height: 30%;
}

.drop-section, .drag-section {
  width: 100%;
  height: 40%;
  max-height: 40%;
  justify-items: center;
  align-items: center;
  position: relative;
  max-width: 100%;
}

.drag-section {
  height: 20%;
  max-height: 20%;
}

.drop-section {
  background-color: #7ff5f5;
  border-radius: 8pt;
}

.draggable-element {
  touch-action: none;
  background-color: transparent;
}

.drop-target-active {
  background-color: #6060d7;
}

.drag-success, .drop-element {
  background-color: transparent;
}

</style>
