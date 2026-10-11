<template>
  <Game
    :is-highlight-animation-running="isGameOver"
    nav-back-path="/dragdrop"
    :explanation="explanation"
    :current-level="selectedLevel"
    @previous="previousLevel"
    @restart="restart"
    @next="nextLevel"
  >
    <div class="drop-section" :style="gridContainer">
      <ImageContainer
        v-for="charConfig in droppableCharacters"
        :key="charConfig.character"
        :data-identifier="charConfig.character"
        :src="charConfig.image"
        class="dropzone empty-droppable-element"
      />
    </div>
    <div class="spacer" />
    <div class="drag-section" :style="gridContainer">
      <ImageContainer
        v-for="charConfig in draggableCharacters"
        :key="charConfig.character"
        :data-identifier="charConfig.character"
        :src="charConfig.image"
        class="draggable-element"
      />
    </div>
    <ErrorAnimation ref="errorAnimation" />
  </Game>
</template>

<script>
  import Game from '../Game.vue';
  import ImageContainer from '../ImageContainer.vue';
  import { dragDrop } from '../mixins/dragDrop.js';
  import { characterConfigs } from '../mixins/characterConfigs.js';
  import { ArrayUtils } from '../utils/ArrayUtils.js';
  import { SoundLib, SoundUtils } from '../utils/SoundUtils.js';
  import { logger } from '@/utils/logger.js';
  import ErrorAnimation from '../ErrorAnimation.vue';

  export default {
    name: 'DDCharacters',
    components: {
      ImageContainer,
      Game,
      ErrorAnimation,
    },
    mixins: [dragDrop, characterConfigs],
    data() {
      return {
        selectedLevel: 2,
        levels: [
          { elementAmount: 2 },
          { elementAmount: 3 },
          { elementAmount: 4 },
          { elementAmount: 5 },
          { elementAmount: 6 },
          { elementAmount: 7 },
          { elementAmount: 8 },
          { elementAmount: 9 },
          { elementAmount: 10 },
          { elementAmount: 11 },
          { elementAmount: 12 },
          { elementAmount: 13 },
          { elementAmount: 14 },
          { elementAmount: 15 },
          { elementAmount: 16 },
          { elementAmount: 17 },
          { elementAmount: 18 },
          { elementAmount: 19 },
          { elementAmount: 20 },
          { elementAmount: 21 },
        ],
        droppableCharacters: [],
        draggableCharacters: [],
        solvedCharacters: 0,
        isGameOver: false,
        explanation: 'dragdrop_characters',
      };
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
          'grid-template-columns': 'repeat(' + elementsInRow + ', minmax(20pt, 1fr))',
          display: 'grid',
          'grid-gap': gridGap + 'pt',
        };
      },
    },
    created: function () {
      SoundUtils.playExplanation(this.explanation);
      this.restart();
    },
    mounted: function () {
      this.initDragDrop(true);
    },
    unmounted: function () {
      SoundUtils.stopAll();
    },
    methods: {
      ondragstart: function (event) {
        let dragElement = event.target;
        try {
          SoundUtils.play(SoundLib[dragElement.getAttribute('data-identifier').toLowerCase()]);
        } catch (e) {
          logger.error('Error dragging. See event content below', e);
          logger.error(event);
        }
      },
      ondrop: function (event) {
        let dropElement = event.currentTarget;
        let dragElement = event.relatedTarget;
        let character = dropElement.getAttribute('data-identifier');

        if (character === dragElement.getAttribute('data-identifier')) {
          this.solvedCharacters++;
          if (this.solvedCharacters === this.levels[this.selectedLevel].elementAmount) {
            setTimeout(
              function () {
                this.emitter.emit('showReward', [this.selectedLevel + 1]);
                this.isGameOver = true;
                SoundUtils.playBigSuccess();
              }.bind(this),
              800
            );
          } else {
            this.emitter.emit('showRewardPreview');
          }
          return true;
        } else {
          this.$refs.errorAnimation.showError();
          return false;
        }
      },
      restart: function () {
        this.isGameOver = false;
        this.solvedCharacters = 0;
        this.droppableCharacters = [];
        this.draggableCharacters = [];
        ArrayUtils.shuffleArray(this.characterConfigs);
        for (let i = 0; i < this.levels[this.selectedLevel].elementAmount; i++) {
          let config = this.characterConfigs[i];
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
      },
    },
  };
</script>

<style scoped lang="scss">
  .spacer {
    height: 20%;
    max-height: 20%;
  }

  .drop-section,
  .drag-section {
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
