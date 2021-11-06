<template>
  <Game :is-highlight-animation-running="isGameOver" nav-back-path="/arithmetic" :explanation="explanation"
        :current-level="selectedLevel"
        @previous="previousLevel" @restart="restart" @next="nextLevel">
    <div class="grid-container4 exercise-section dropzone"
         v-bind:class="[{ 'all-drops-successful' : isGameOver } ]">
      <ImageContainer class="drop-element" key="firstElement" :src="firstElement.image"></ImageContainer>
      <ImageContainer class="drop-element" key="operatorElement" :src="operator.image"></ImageContainer>
      <ImageContainer class="drop-element" key="secondElement" :src="secondElement.image"></ImageContainer>
      <ImageContainer class="drop-element" key="equals" src="img/characters/=.svg"></ImageContainer>
    </div>
    <div class="solution-section dropzone" v-bind:style="gridContainerSolutionZone">
      <div/>
      <ImageContainer v-for="(numberConfig, index) in droppedNumbers" :key="index"
                      :src="numberConfig.image" class="drop-element"></ImageContainer>
    </div>
    <div class="spacer"></div>
    <div class="choice-section" v-bind:style="gridContainer" ref="dragSection">
      <ImageContainer v-for="(numberConfig, index) in choices" :key="index"
                      :data-identifier="numberConfig.number" :data-draggable-index="index" :src="numberConfig.image"
                      v-bind:class="[{'level-finished': isLevelFinished}]"
                      class="draggable-element" ref="draggables"></ImageContainer>
    </div>
    <ErrorAnimation ref="errorAnimation"></ErrorAnimation>
  </Game>
</template>

<script>
import Game from "../Game";
import ImageContainer from "../ImageContainer";
import {ArrayUtils} from "../utils/ArrayUtils"
import {SoundUtils} from "../utils/SoundUtils";
import {numberConfigs} from "../mixins/numberConfigs";
import ErrorAnimation from "../ErrorAnimation";
import {CharacterUtils} from "../utils/CharacterUtils";
import {dragDrop} from "../mixins/dragDrop"

export default {
  name: "CalculateNumbers0_19",
  components: {
    ImageContainer,
    Game,
    ErrorAnimation
  },
  mixins: [numberConfigs, dragDrop],
  data() {
    return {
      selectedLevel: 1,
      droppedNumbers: [],
      choices: [],
      firstElement: {},
      secondElement: {},
      solution: {},
      isGameOver: false,
      isLevelFinished: false,
      explanation: "dragdrop_buildwords",
      operator: CharacterUtils.createConfig("+")
    };
  },
  created: function () {
    this.restart(true);
    this.initDragDrop(false);
    SoundUtils.playExplanation(this.explanation).addEventListener('ended',
        this.playHelpWord.bind(this));
  },
  destroyed: function () {
    SoundUtils.stopAll();
  },
  computed: {
    gridContainerSolutionZone: function () {
      let columns = 1;
      let solutionCharacterLength = (this.solution.number + "").length
      if (solutionCharacterLength === 1) {
        columns = 3;
      } else if (solutionCharacterLength === 2) {
        columns = 4;
      }
      return {
        'grid-template-columns': "repeat(" + columns + ", minmax(20pt, 1fr))",
        'display': 'grid',
        'grid-gap': '2pt'
      }
    },
    gridContainer: function () {
      let columns = 4;
      let gridGap = 2;
      return {
        'grid-template-columns': "repeat(" + columns + ", minmax(20pt, 1fr))",
        'display': 'grid',
        'grid-gap': gridGap + 'pt'
      }
    }
  },
  methods: {
    playHelpWord: function () {
      /*
      let audios = ['de/helpers/wir_schreiben_das_wort', 'de/words/dad/' + 3];
      for (let char of this.currentWordCharacters) {
        audios.push('de/characters/dad/' + char.toLowerCase());
      }
      SoundUtils.playSoundsInRow(audios);

       */
    },
    randomNumberFrom0To9() {
      return Math.floor(Math.random() * 10);
    },
    levelCompleted: function () {
      this.isLevelFinished = true;
      setTimeout(function () {
        this.isGameOver = true;
        this.$eventHub.$emit('showReward', [this.selectedLevel + 1]);
      }.bind(this), 2000);
    },
    ondrop: function (event) {
      SoundUtils.stopAll();
      let dragElement = event.relatedTarget;
      let draggedNumber = parseInt(dragElement.getAttribute('data-identifier'));
      if (draggedNumber === this.solution.number) {
        /*
        SoundUtils.playSound('de/words/dad/' + this.currentWord.toLowerCase())
            .addEventListener('ended', SoundUtils.playBigSuccess.bind(SoundUtils), {once: true}
            );*/
        let indexOfElementUnderDrag = dragElement.getAttribute("data-draggable-index");
        let characterConfigForMove = this.choices.splice(indexOfElementUnderDrag, 1)[0];
        this.droppedNumbers.push(characterConfigForMove);
        this.levelCompleted();
        return true;
      } else {
        this.$refs.errorAnimation.showError(function () {
          SoundUtils.playSoundsInRow([
            'de/helpers/du_hast_ein',
            'de/characters/dad/0',
            'de/helpers/aber_wir_brauchen_ein',
            'de/characters/dad/1'
          ]);
        });
        return false;
      }
    },
    reduceNumbersSoSumIsMax9: function (firstRandomNumber, secondRandomNumber) {
      if (firstRandomNumber + secondRandomNumber > 9) {
        let reducer = firstRandomNumber + secondRandomNumber - 9;
        if (firstRandomNumber > secondRandomNumber) {
          firstRandomNumber -= reducer;
        } else {
          secondRandomNumber -= reducer;
        }
      }
      return [firstRandomNumber, secondRandomNumber]
    },
    generateLevel: function () {
      //if(this.selectedLevel <= 1){ TODO add more
      let randomNumbers = this.reduceNumbersSoSumIsMax9(this.randomNumberFrom0To9(), this.randomNumberFrom0To9());
      this.firstElement = this.numberConfigs[randomNumbers[0]];
      this.secondElement = this.numberConfigs[randomNumbers[1]];
      this.solution = this.numberConfigs[this.firstElement.number + this.secondElement.number];
      this.choicesAmount = 4;
      //}
    },
    restart: function (muteWordSound) {
      this.isGameOver = false;
      this.isLevelFinished = false;
      this.choices = [];
      this.droppedNumbers = [];
      SoundUtils.stopAll();
      // ideas:
      // auto level up after 2 correct solutions
      // l1: max 5, +, 4 choices
      // l2: max 5, +, 8 choices
      // l3: max 10, +, 8 choices
      // l4: max 19, +, 8 choices
      // l5: max 9, -, 8 choices
      // l6: max 19, +-, 8 choices
      // l7: min -9, +-, 8 choices
      this.generateLevel();

      for (let i = 0; i < this.choicesAmount - 1; i++) {
        let randomNumberConfig = ArrayUtils.getRandomArrayElement(this.numberConfigs);
        this.choices.push(randomNumberConfig);
        SoundUtils.preload('de/characters/' + randomNumberConfig.number);
      }
      this.choices.push(this.solution);
      SoundUtils.preload('de/characters/' + this.solution.number);
      this.choices = ArrayUtils.shuffleArray(this.choices);

      ArrayUtils.shuffleArray(this.choices);
      if (!muteWordSound) {
        //this.playHelpWord();
      }
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
      if (this.selectedLevel < this.numberConfigs.length - 1) {
        this.selectedLevel++;
      }
      this.restart();
    }
  }
}
</script>

<style scoped lang="scss">

.grid-container4 {
  grid-template-columns: repeat(4, minmax(20pt, 1fr));
  display: grid;
  grid-gap: 2pt
}

.spacer {
  height: 10%;
  width: 100%;
  color: #ffffff;
  text-align: center;
  font-size: 1.2rem;
}

.exercise-section, .choice-section, .solution-section {
  width: 100%;
  height: 20%;
  max-height: 20%;
  justify-items: center;
  align-items: center;
  position: relative;
  max-width: 100%;
}

.exercise-section {
  padding-top: 2%;
  padding-bottom: 8%;
}

.solution-section {
  background-color: #7ff5f5;
  border-radius: 8pt;
  height: 30%;
  min-height: 30%;
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

.all-drops-successful {
}

.level-finished {
  animation-name: flip-numbers;
  animation-duration: 1500ms;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

@keyframes flip-numbers {
  0% {
    transform: rotateZ(0deg);
  }
  100% {
    transform: rotateZ(90deg);
  }
}

</style>
