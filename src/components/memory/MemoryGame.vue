<template>
  <div class="content">
    <div class="header">
      <label for="levels" style="color:whitesmoke">Select level: </label>
      <select id="levels" v-model="selectedLevel" @change="generateCards()">
        <option v-for="(level, index) in levels" :key="index" :value="index">
          {{ index + 1 }} ({{ level.rows * level.columns }} Cards)
        </option>
      </select>
    </div>
    <div v-bind:style="gridContainer" class="grid-container">
      <button v-if="!isGameStarted" v-on:click="startGame" class="play-button"><i class="fas fa-play-circle"></i></button>
      <memory-card class="column" v-for="card in cards" :key="card.key"
                   :front-face="card.frontFace"
                   :sound="card.sound"
                   :is-board-locked="isBoardLocked" @flipped="cardFlipped" ref="memoryCards"/>
    </div>
    <div class="footer">
      <button @click="previousLevel()" class="game-button"><i class="fas fa-arrow-alt-circle-left"></i></button>
      <button @click="generateCards()" class="game-button"><i class="fas fa-redo-alt"></i></button>
      <button @click="nextLevel()" class="game-button"><i class="fas fa-arrow-alt-circle-right"></i></button>
    </div>
  </div>
</template>

<script>
import MemoryCard from './MemoryCard.vue';
import Sounds from "./Sounds";

export default {
  name: "MemoryAlphabet",
  components: {
    MemoryCard
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
      selectedLevel: 3,
      levels: calculateLevels(),
      timeoutUntilGameStarts: undefined
    };
  },
  created: function () {
    this.generateCards();
  },
  props: ['possibleCardConfigs'],
  methods: {
    isCurrentLevelMaxLevel: function (){
      return this.selectedLevel === this.levels.length-1;
    },
    isCurrentLevelMinLevel: function (){
      return this.selectedLevel === 0;
    },
    nextLevel: function (){
      if(!this.isCurrentLevelMaxLevel()){
        this.selectedLevel++;
      }
      this.generateCards();
    },
    previousLevel: function (){
      if(!this.isCurrentLevelMinLevel()){
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
            Sounds.playError();
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
.header {
  width: 100%;
  height: 25pt;
}

.footer {
  width: 100%;
  height: 50pt;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.grid-container {
  width: 100%;
  height: calc(100% - 50pt - 25pt);
  display: grid;
  grid-gap: 10pt;
  justify-items: center;
  align-items: center;
  position: relative;
}

.play-button {
  font-size: 10rem;
  position: absolute;
  height: 100%;
  width: 100%;
  text-align: center;
  z-index: 2;
  color: #4385f4f0;
  background-color: transparent;
  border: none;
  outline: none;
}

.game-button {
  font-size: 2rem;
  height: 40pt;
  width: 40pt;
  color: #ffffff;
  background-color: #4385f4f0;
  border-radius: 5pt;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content {
  position: relative;
}
</style>
