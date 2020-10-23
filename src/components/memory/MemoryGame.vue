<template>
  <Game nav-back-path="/memory" @previous="previousLevel" @restart="generateCards" @next="nextLevel">
    <template v-slot:header>
      <select class="clickable-elements" id="levels" v-model="selectedLevel" @change="generateCards()">
        <option v-for="(level, index) in levels" :key="index" :value="index">
          {{ index + 1 }} ({{ level.rows * level.columns }} Cards)
        </option>
      </select>
    </template>
    <div v-bind:style="gridContainer" class="grid-container">
      <button v-if="!isGameStarted" v-on:click="startGame" class="play-button"><i class="fas fa-play-circle"></i>
      </button>
      <memory-card class="column" v-for="card in cards" :key="card.key"
                   :front-face="card.frontFace"
                   :sound="card.sound"
                   :is-board-locked="isBoardLocked" @flipped="cardFlipped" ref="memoryCards"/>
    </div>
    <img src="img/fish8.svg" v-if="isErrorPlaying" class="error-animation" alt="error animation"/>
  </Game>
</template>

<script>
import MemoryCard from './MemoryCard.vue';
import Sounds from "./Sounds";
import Game from "../Game.vue"

export default {
  name: "MemoryCharacters",
  extends: Game,
  components: {
    MemoryCard,
    Game
  },
  data() {
    function calculateLevels() {
      let maxLevels = 11;
      let level = 1;
      let cols = 2;
      let levels = [];
      while (level < maxLevels) {
        let minRows = cols - 1;
        if (cols * (minRows) % 2 === 0) {
          levels.push({rows: minRows, columns: cols});
          level++;
        }
        if (cols * cols % 2 === 0) {
          levels.push({rows: cols, columns: cols})
          level++;
        }
        cols++;
      }
      return levels;
    }

    return {
      cards: undefined,
      flippedCard: undefined,
      isBoardLocked: false,
      isGameStarted: false,
      solvedCards: 0,
      selectedLevel: 4,
      levels: calculateLevels(),
      timeoutUntilGameStarts: undefined,
      isErrorPlaying: false
    };
  },
  created: function () {
    this.generateCards();
  },
  props: ['possibleCardConfigs'],
  methods: {
    isCurrentLevelMaxLevel: function () {
      return this.selectedLevel === this.levels.length - 1;
    },
    isCurrentLevelMinLevel: function () {
      return this.selectedLevel === 0;
    },
    nextLevel: function () {
      if (!this.isCurrentLevelMaxLevel()) {
        this.selectedLevel++;
      }
      this.generateCards();
    },
    previousLevel: function () {
      if (!this.isCurrentLevelMinLevel()) {
        this.selectedLevel--;
      }
      this.generateCards();
    },
    getCardAmount: function (level) {
      return level.columns * level.rows;
    },
    showAllCards: function () {
      if (this.$refs.memoryCards) {
        for (let card of this.$refs.memoryCards) {
          card.forceFlip();
        }
      }
    },
    startGame: function () {
      if (!this.isGameStarted) {
        this.solvedCards = 0;
        if (this.$refs.memoryCards) {
          for (let card of this.$refs.memoryCards) {
            card.reset();
          }
        }
        this.isGameStarted = true;
        this.isBoardLocked = false;
      }
    },
    shuffle: function (array) {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
    createCard: function (key, cardConfig) {
      return {
        key: cardConfig.key,
        frontFace: cardConfig.frontFace,
        sound: cardConfig.sound,
      }
    },
    generateCards: function () {
      this.isBoardLocked = true;
      this.isGameStarted = false;
      clearTimeout(this.timeoutUntilGameStarts);
      this.cards = [];
      this.flippedCard = null;
      let cardAmount = this.getCardAmount(this.levels[this.selectedLevel]);
      this.shuffle(this.possibleCardConfigs);
      for (let i = 0; i < cardAmount / 2; i++) {
        this.cards.push(this.createCard(this.cards.length, this.possibleCardConfigs[i]));
        this.cards.push(this.createCard(this.cards.length, this.possibleCardConfigs[i]));
      }
      this.shuffle(this.cards);
      this.showAllCards();
      this.timeoutUntilGameStarts = setTimeout(function () {
        this.startGame();
      }.bind(this), 10000);
    },
    isGameOver: function () {
      let cardsInCurrentLevel = this.getCardAmount(this.levels[this.selectedLevel]);
      return this.solvedCards === cardsInCurrentLevel;
    },
    cardFlipped: function (currentCard) {
      this.isBoardLocked = true;
      let cardsMatch = function (firstCard, secondCard) {
        return firstCard.frontFace === secondCard.frontFace;
      }

      let blockCards = function (firstCard, secondCard) {
        firstCard.isFlippable = false;
        secondCard.isFlippable = false;
      }

      if (!this.flippedCard) {
        Sounds.playSound(currentCard.sound);
        this.flippedCard = currentCard;
        this.isBoardLocked = false;
      } else {
        if (cardsMatch(this.flippedCard, currentCard)) {
          this.solvedCards += 2;
          if (this.isGameOver()) {
            Sounds.playBigSuccess();
          } else {
            Sounds.playSuccess();
          }

          blockCards(this.flippedCard, currentCard)
          this.flippedCard = null;
          this.isBoardLocked = false;
        } else {
          Sounds.playSound(currentCard.sound);
          setTimeout(function () {
            // TODO refactore this all into an error component
            this.isErrorPlaying = true;
            Sounds.playError();
            setTimeout(function () {
              this.isErrorPlaying = false;
            }.bind(this), 4000);
            if (this.flippedCard) {
              this.flippedCard.isFlipped = false;
              this.flippedCard = null;
            }
            currentCard.isFlipped = false;
            this.isBoardLocked = false;
          }.bind(this), 1000);
        }
      }
    }
  },
  computed: {
    gridContainer: function () {
      return {
        'grid-template-columns': "repeat(" + this.levels[this.selectedLevel].columns + ", minmax(20pt, 1fr))",
      }
    }
  }
}

</script>

<style scoped lang="scss">

.grid-container {
  width: 100%;
  height: 100%;
  display: grid;
  grid-gap: 10pt;
  justify-items: center;
  align-items: center;
  position: relative;
}

.play-button {
  font-size: 7rem;
  position: absolute;
  height: 100%;
  width: 100%;
  text-align: center;
  z-index: 2;
  color: #4385f482;
  background-color: transparent;
  border: none;
  outline: none;
}

@keyframes error-animation {
  0% {
    left: 0;
  }
  100% {
    left: 100%;
    visibility: hidden
  }
}

.error-animation {
  height: 80pt;
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 999;
  overflow: hidden;
  animation-name: error-animation;
  animation-duration: 4s;
  animation-fill-mode: forwards;
  visibility: visible;
}

</style>
