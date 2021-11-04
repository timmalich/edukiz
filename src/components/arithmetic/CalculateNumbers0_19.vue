<template>
  <Game :is-highlight-animation-running="isGameOver" nav-back-path="/arithmetic" :explanation="explanation"
        :current-level="selectedLevel"
        @previous="previousLevel" @restart="restart" @next="nextLevel">
    <!-- TODO use static grid container (4) a+b=c -->
    <div class="exercise-section" v-bind:style="gridContainer"
         v-bind:class="[{ 'all-drops-successful' : isGameOver } ]">
      <ImageContainer key="firstElement" :src="firstElement.image"></ImageContainer>
      <ImageContainer key="operatorElement" :src="operator.image"></ImageContainer>
      <ImageContainer key="secondElement" :src="secondElement.image"></ImageContainer>
      <ImageContainer key="equals" src="img/characters/=.svg"></ImageContainer>
    </div>
    <div class="spacer"></div>
    <div class="solution-section" v-bind:style="gridContainer">
      <ImageContainer key="solEl1" :src="secondElement.image" class="drop-element"></ImageContainer>
      <ImageContainer key="selEl2" :src="secondElement.image" class="drop-element"></ImageContainer>
    </div>
    <div class="spacer"></div>
    <div class="choice-section" v-bind:style="gridContainer" ref="dragSection">
      <ImageContainer v-for="(numberConfig, index) in choices" :key="index"
                      :data-identifier="numberConfig.number" :data-draggable-index="index" :src="numberConfig.image"
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

export default {
  name: "CalculateNumbers0_19",
  components: {
    ImageContainer,
    Game,
    ErrorAnimation
  },
  mixins: [numberConfigs],
  data() {
    return {
      selectedLevel: 1,
      droppedCharacters: [],
      currentWordCharacters: [],
      currentWord: undefined,
      choices: [],
      firstElement: {},
      secondElement: {},
      solution: {},
      isGameOver: false,
      explanation: "dragdrop_buildwords",
      operator: CharacterUtils.createConfig("+")
    };
  },
  created: function () {
    this.restart(true);
    SoundUtils.playExplanation(this.explanation).addEventListener('ended',
        this.playHelpWord.bind(this));
  },
  destroyed: function () {
    SoundUtils.stopAll();
  },
  computed: {
    gridContainer: function () {
      let choicesAmount = 4;
      let gridGap = 2;
      return {
        'grid-template-columns': "repeat(" + choicesAmount + ", minmax(20pt, 1fr))",
        'display': 'grid',
        'grid-gap': gridGap + 'pt'
      }
    }
  },
  methods: {
    playHelpWord: function () {
      let audios = ['de/helpers/wir_schreiben_das_wort', 'de/words/dad/' + this.currentWord.toLowerCase()];
      for (let char of this.currentWordCharacters) {
        audios.push('de/characters/dad/' + char.toLowerCase());
      }
      SoundUtils.playSoundsInRow(audios);
    },
    onPress: function () {
      SoundUtils.stopAll();
      let isCorrect = true;
      if (isCorrect) {
        this.isGameOver = true;
        this.$eventHub.$emit('showReward', [this.selectedLevel + 1]);
        SoundUtils.playSound('de/words/dad/' + this.currentWord.toLowerCase())
            .addEventListener('ended', SoundUtils.playBigSuccess.bind(SoundUtils), {once: true}
            );
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
    restart: function (muteWordSound) {
      this.isGameOver = false;
      this.choices = [];
      SoundUtils.stopAll();
      // ideas:
      // auto level up after 2 correct solutions
      // l1: max 15, +, 4 choices
      // l1: max 10, +, 4 choices
      // l2: max 10, +, 8 choices
      // l3: max 19, +, 8 choices
      // l4: max 9, -, 8 choices
      // l5: max 19, +-, 8 choices
      // l6: min -9, +-, 8 choices
      console.log("DEBBBBBBBBBBBBBBBBBBBBUG")
      this.firstElement = this.numberConfigs[1]
      console.log("DEBBBBBBX " + this.firstElement.number)

      this.secondElement = this.numberConfigs[2]
      console.log("DEBBBBBBy " + this.numberConfigs[this.firstElement.number + this.secondElement.number] + this.firstElement.number + this.secondElement.number)
      this.solution = this.numberConfigs[this.firstElement.number + this.secondElement.number];
      console.log(this.solution)
      this.choicesAmount = 4;

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
        this.playHelpWord();
      }
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

.spacer {
  height: 10%;
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
  background-color: #24ff02;
}

</style>
