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
    <div
      class="drop-section dropzone"
      v-bind:style="gridContainer"
      v-bind:class="[{ 'all-drops-successful': isGameOver }]"
    >
      <ImageContainer
        v-for="(charConfig, index) in droppedCharacters"
        :key="index"
        :src="charConfig.image"
        class="drop-element"
      ></ImageContainer>
    </div>
    <div class="spacer">{{ currentWord }}</div>
    <div class="drag-section" v-bind:style="gridContainer" ref="dragSection">
      <ImageContainer
        v-for="(charConfig, index) in draggableCharacters"
        :key="index"
        :data-identifier="charConfig.character"
        :data-draggable-index="index"
        :src="charConfig.image"
        class="draggable-element"
        :ref="setDraggableRef"
      ></ImageContainer>
    </div>
    <ErrorAnimation ref="errorAnimation"></ErrorAnimation>
  </Game>
</template>

<script>
import Game from "../Game";
import ImageContainer from "../ImageContainer";
import { dragDrop } from "../mixins/dragDrop";
import { ArrayUtils } from "../utils/ArrayUtils";
import { SoundUtils } from "../utils/SoundUtils";
import { wordConfigs } from "../mixins/wordConfigs";
import { CharacterUtils } from "../utils/CharacterUtils";
import ErrorAnimation from "../ErrorAnimation";

export default {
  name: "DDBuildWords",
  components: {
    ImageContainer,
    Game,
    ErrorAnimation,
  },
  mixins: [dragDrop, wordConfigs],
  data() {
    return {
      draggables: [],
      selectedLevel: 2,
      droppedCharacters: [],
      currentWordCharacters: [],
      currentWord: undefined,
      draggableCharacters: [],
      solvedCharacters: 0,
      isGameOver: false,
      explanation: "dragdrop_buildwords",
    };
  },
  created: function () {
    this.restart(true);
    this.initDragDrop(false);
    SoundUtils.playExplanation(this.explanation).addEventListener(
      "ended",
      this.playHelpWord.bind(this)
    );
  },
  unmounted: function () {
    SoundUtils.stopAll();
  },
  computed: {
    gridContainer: function () {
      let characterAmount = this.wordConfigs[this.selectedLevel].wordLength;
      let gridGap = 2;
      return {
        "grid-template-columns":
          "repeat(" + characterAmount + ", minmax(20pt, 1fr))",
        display: "grid",
        "grid-gap": gridGap + "pt",
      };
    },
  },
  beforeUpdate() {
    this.draggables = [];
  },
  methods: {
    setDraggableRef(el) {
      if (el) {
        this.draggables.push(el);
      }
    },
    playHelpWord: function () {
      let audios = [
        "de/helpers/wir_schreiben_das_wort",
        "de/words/dad/" + this.currentWord.toLowerCase(),
      ];
      for (let char of this.currentWordCharacters) {
        audios.push("de/characters/dad/" + char.toLowerCase());
      }
      SoundUtils.playSoundsInRow(audios);
    },
    ondragstart: function (event) {
      let dragElement = event.target;
      SoundUtils.playCharacter(dragElement.getAttribute("data-identifier"));
    },
    ondrop: function (event) {
      SoundUtils.stopAll();
      let dragElement = event.relatedTarget;
      let draggedCharacter = dragElement
        .getAttribute("data-identifier")
        .toLowerCase();
      let expectedCharacter =
        this.currentWordCharacters[this.solvedCharacters].toLowerCase();
      if (draggedCharacter === expectedCharacter) {
        this.solvedCharacters++;
        let indexOfElementUnderDrag = dragElement.getAttribute(
          "data-draggable-index"
        );
        let characterConfigForMove = this.draggableCharacters.splice(
          indexOfElementUnderDrag,
          1
        )[0];
        this.droppedCharacters.push(characterConfigForMove);
        if (
          this.solvedCharacters ===
          this.wordConfigs[this.selectedLevel].wordLength
        ) {
          this.isGameOver = true;
          this.emitter.emit("showReward", [this.selectedLevel + 1]);
          /* TODO: do we need i18n SoundLib here?
              This might look more 'clean', but the approach with the untranslated words here is just so nice and easy.
              I'd also like to add tts as fallback in case, a word is missing */
          SoundUtils.playSound(
            "de/words/dad/" + this.currentWord.toLowerCase()
          ).addEventListener(
            "ended",
            SoundUtils.playBigSuccess.bind(SoundUtils),
            { once: true }
          );
        } else {
          let nextCharacter =
            this.currentWordCharacters[this.solvedCharacters].toLowerCase();
          this.emitter.emit("showRewardPreview");
          SoundUtils.playSoundsInRow([
            "de/helpers/super_und_jetzt_ein",
            "de/characters/dad/" + nextCharacter,
          ]);
        }
        return true;
      } else {
        this.$refs.errorAnimation.showError(function () {
          SoundUtils.playSoundsInRow([
            "de/helpers/du_hast_ein",
            "de/characters/dad/" + draggedCharacter,
            "de/helpers/aber_wir_brauchen_ein",
            "de/characters/dad/" + expectedCharacter,
          ]);
        });
        return false;
      }
    },
    restart: function (muteWordSound) {
      this.isGameOver = false;
      this.solvedCharacters = 0;
      this.droppedCharacters = [];
      this.draggableCharacters = [];
      SoundUtils.stopAll();
      this.currentWord = ArrayUtils.getRandomArrayElement(
        this.wordConfigs[this.selectedLevel].words
      ).toUpperCase();
      this.currentWordCharacters = this.currentWord.split("");
      for (let character of this.currentWordCharacters) {
        SoundUtils.preload("de/characters/" + character.toLowerCase());
        this.draggableCharacters.push(CharacterUtils.createConfig(character));
      }
      ArrayUtils.shuffleArray(this.draggableCharacters);
      this.resetGameComponents();
      if (!muteWordSound) {
        this.playHelpWord();
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
      if (this.selectedLevel < this.wordConfigs.length - 1) {
        this.selectedLevel++;
      }
      this.restart();
    },
  },
};
</script>

<style scoped lang="scss">
.spacer {
  height: 30%;
  color: #ffffff;
  text-align: center;
  font-size: 1.2rem;
}

.drop-section,
.drag-section {
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

.drag-success,
.drop-element {
  background-color: transparent;
}

.all-drops-successful {
  background-color: #24ff02;
}
</style>
