<template>
  <Game :is-highlight-animation-running="isGameOver" :previous-level-disabled="previousLevelDisabled"
        :next-level-disabled="nextLevelDisabled" nav-back-path="/arithmetic" :explanation="explanation"
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
  name: "CalculateNumbers0To18",
  components: {
    ImageContainer,
    Game,
    ErrorAnimation
  },
  mixins: [numberConfigs, dragDrop],
  data() {
    return {
      selectedLevel: 1,
      unlockedLevels: 1,
      maxLevel: 6,
      droppedNumbers: [],
      choices: [],
      firstElement: {},
      secondElement: {},
      solution: {
        numberConfigs: []
      },
      isGameOver: false,
      isLevelFinished: false,
      explanation: "calculation0To18",
      operator: CharacterUtils.createConfig("+"),
      finishedRounds: 0,
      previousLevelDisabled: true,
      nextLevelDisabled: true
    };
  },
  mounted: function () {
    if (localStorage.calculateNumbers0To18_selectedLevel) {
      this.selectedLevel = Number.parseInt(localStorage.calculateNumbers0To18_selectedLevel);
    } else {
      localStorage.calculateNumbers0To18_selectedLevel = this.selectedLevel;
    }

    if (localStorage.calculateNumbers0To18_unlockedLevels) {
      this.unlockedLevels = Number.parseInt(localStorage.calculateNumbers0To18_unlockedLevels);
    } else {
      localStorage.calculateNumbers0To18_unlockedLevels = this.unlockedLevels;
    }
    this.restart(true);
  },
  watch: {
    selectedLevel(newValue) {
      localStorage.calculateNumbers0To18_selectedLevel = newValue;
    },
    unlockedLevels(newValue) {
      localStorage.calculateNumbers0To18_unlockedLevels = newValue;
    }
  },
  created: function () {
    this.initDragDrop(false);
    SoundUtils.playExplanation(this.explanation).addEventListener('ended', this.playHelpWord.bind(this));
  },
  destroyed: function () {
    SoundUtils.stopAll();
  },
  computed: {
    gridContainerSolutionZone: function () {
      let columns = 1;
      let solutionCharacterLength = this.solution.numberConfigs.length;
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
    randomNumberFrom0ToN(highestPossibleNumber) {
      return Math.floor(Math.random() * (highestPossibleNumber + 1));
    },
    increaseLevel: function () {
      let roundsToFinishUntilNextLevel = 3;
      if (this.finishedRounds % roundsToFinishUntilNextLevel === 0 && this.selectedLevel < this.maxLevel) {
        this.selectedLevel++;
        this.unlockedLevels++;
        return true;
      }
      return false;
    },
    levelCompleted: function () {
      this.isLevelFinished = true;
      this.finishedRounds++;

      let audios = [
        'de/words/dad/super',
        'de/characters/dad/' + this.firstElement.number,
        'de/words/dad/' + (this.operator.character === "+" ? "plus" : "minus"),
        'de/characters/dad/' + this.secondElement.number,
        'de/words/dad/istgleich',
        'de/characters/dad/' + this.solution.asInt];
      let levelIncreased = this.increaseLevel();
      if(levelIncreased){
        audios.push('de/helpers/next_level')
      }

      SoundUtils.playSoundsInRow(audios);
      setTimeout(function () {
        this.isGameOver = true;
        this.$eventHub.$emit('showReward', [this.selectedLevel]);
      }.bind(this), 2000);
    },
    ondrop: function (event) {
      SoundUtils.stopAll();
      let dragElement = event.relatedTarget;
      let draggedNumber = parseInt(dragElement.getAttribute('data-identifier'));
      let expectedSolutionPart = this.solution.numberConfigs[this.droppedNumbers.length].number;
      if (draggedNumber === expectedSolutionPart) {
        let indexOfElementUnderDrag = dragElement.getAttribute("data-draggable-index");
        let characterConfigForMove = this.choices.splice(indexOfElementUnderDrag, 1)[0];
        this.droppedNumbers.push(characterConfigForMove);
        if (this.droppedNumbers.length === this.solution.numberConfigs.length) {
          this.levelCompleted();
        }

        return true;
      } else {
        this.$refs.errorAnimation.showError(function () {
          let audios = [
            'de/helpers/nicht_ganz_richtig',
            'de/characters/dad/' + this.firstElement.number,
            'de/words/dad/' + (this.operator.character === "+" ? "plus" : "minus"),
            'de/characters/dad/' + this.secondElement.number,
            'de/words/dad/ist',
            'de/characters/dad/' + this.solution.asInt
          ];
          if (this.solution.numberConfigs.length > 1) {
            audios.push('de/helpers/das_ist_eine');
            audios.push('de/characters/dad/' + this.solution.numberConfigs[0].number);
            audios.push('de/helpers/und_eine');
            audios.push('de/characters/dad/' + this.solution.numberConfigs[1].number);
            SoundUtils.playSoundsInRow(audios);
          } else {
            SoundUtils.playSoundsInRow(audios);
          }
        }.bind(this));
        return false;
      }
    },
    getTwoRandomNumbersHavingATotalOfMaxN: function (maxTotal = 9) {
      let firstNumber;
      let secondNumber;
      if (this.finishedRounds % 2 === 0) {
        // with this approach we will likely get higher numbers as total, but we want an equal distribution from 0 to n
        firstNumber = this.randomNumberFrom0ToN(maxTotal);
        secondNumber = this.randomNumberFrom0ToN(maxTotal - firstNumber);
      } else {
        // with this approach we will likely get lower numbers as total, but we want an equal distribution from 0 to n
        let total = this.randomNumberFrom0ToN(maxTotal);
        firstNumber = this.randomNumberFrom0ToN(total)
        secondNumber = total - firstNumber;
      }
      return ArrayUtils.shuffleArray([firstNumber, secondNumber]);
    },
    createSolution: function (number) {
      let numberConfigs;
      if (number.toString().length > 1) {
        let split = number.toString().split("").map(Number);
        let firstPart = split[0];
        let secondPart = split[1];
        numberConfigs = [this.numberConfigs[firstPart], this.numberConfigs[secondPart]];
      } else {
        numberConfigs = [this.numberConfigs[number]];
      }
      return {
        asInt: number,
        numberConfigs: numberConfigs
      }
    },
    generateLevel: function () {
      let randomNumbers;
      this.operator = CharacterUtils.createConfig("+");
      this.choicesAmount = 8;

      let generateSubtraction = function () {
        this.firstElement = this.numberConfigs[this.randomNumberFrom0ToN(9)];
        this.secondElement = this.numberConfigs[this.randomNumberFrom0ToN(9)];
        // ensure we do not get into the negative range
        if (this.firstElement.number < this.secondElement.number) {
          [this.firstElement, this.secondElement] = [this.secondElement, this.firstElement];
        }
        this.solution = this.createSolution(this.firstElement.number - this.secondElement.number);
        this.operator = CharacterUtils.createConfig("-");
      }.bind(this);

      let generateAddition0To18 = function () {
        this.firstElement = this.numberConfigs[this.randomNumberFrom0ToN(9)];
        this.secondElement = this.numberConfigs[this.randomNumberFrom0ToN(9)];
        this.solution = this.createSolution(this.firstElement.number + this.secondElement.number);
      }.bind(this);

      switch (this.selectedLevel) {
        case 1:
          randomNumbers = this.getTwoRandomNumbersHavingATotalOfMaxN(5);
          this.firstElement = this.numberConfigs[randomNumbers[0]];
          this.secondElement = this.numberConfigs[randomNumbers[1]];
          this.solution = this.createSolution(this.firstElement.number + this.secondElement.number);
          this.choicesAmount = 4;
          break;
        case 2:
          randomNumbers = this.getTwoRandomNumbersHavingATotalOfMaxN(5);
          this.firstElement = this.numberConfigs[randomNumbers[0]];
          this.secondElement = this.numberConfigs[randomNumbers[1]];
          this.solution = this.createSolution(this.firstElement.number + this.secondElement.number);
          break;
        case 3:
          randomNumbers = this.getTwoRandomNumbersHavingATotalOfMaxN(9);
          this.firstElement = this.numberConfigs[randomNumbers[0]];
          this.secondElement = this.numberConfigs[randomNumbers[1]];
          this.solution = this.createSolution(this.firstElement.number + this.secondElement.number);
          break;
        case 4:
          generateAddition0To18();
          break;
        case 5:
          generateSubtraction();
          break;
        default:
          if (this.finishedRounds % 2 === 0) {
            generateSubtraction();
          } else {
            generateAddition0To18();
          }
      }
    },
    handleLevelButtons: function () {
      this.nextLevelDisabled = this.selectedLevel >= this.unlockedLevels;
      this.previousLevelDisabled = this.selectedLevel <= 1;
    },
    restart: function (muteWordSound) {
      this.isGameOver = false;
      this.isLevelFinished = false;
      this.choices = [];
      this.droppedNumbers = [];
      SoundUtils.stopAll();
      this.handleLevelButtons();
      this.generateLevel();

      for (let i = 0; i < this.choicesAmount - this.solution.numberConfigs.length; i++) {
        let randomNumberConfig = ArrayUtils.getRandomArrayElement(this.numberConfigs);
        this.choices.push(randomNumberConfig);
        SoundUtils.preload('de/characters/' + randomNumberConfig.number);
      }

      for (let el in this.solution.numberConfigs) {
        let numberConfig = this.solution.numberConfigs[el];
        this.choices.push(numberConfig);
        SoundUtils.preload('de/characters/' + numberConfig.number);
      }
      this.choices = ArrayUtils.shuffleArray(this.choices);

      ArrayUtils.shuffleArray(this.choices);
      if (!muteWordSound) {
        //this.playHelpWord();
      }
    }
    ,
    resetGameComponents: function () {
      this.resetDragAndDropSuccessions();
    },
    previousLevel: function () {
      if (this.selectedLevel > 1) {
        this.selectedLevel--;
      }
      this.restart();
    },
    nextLevel: function () {
      if (this.selectedLevel < this.maxLevel && this.selectedLevel < this.unlockedLevels) {
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
