<template>
  <div>
    <div class="header">
      <label for="levels">Select level: </label>
      <select id="levels" v-model="selectedLevel" @change="generateCards()">
        <option v-for="(level, index) in levels" :key="index" :value="index">
          {{ index + 1 }} ({{ level.cardAmount }} Cards)
        </option>
      </select>
      <button @click="generateCards()">Restart</button>
    </div>
    <div v-bind:style="gridContainer" class="grid-container">
      <memory-card class="column" v-for="card in cards" :key="card.key" :front-face="card.value"
                   :is-board-locked="isBoardLocked" @flipped="cardFlipped" ref="memoryCards"/>
    </div>
    <div class="footer" />
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
      solvedCards: 0,
      selectedLevel: 4,
      levels: calculateLevels()
    };
  },
  created: function () {
    this.ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVXYZ";
    this.NUMBERS = "0123456789";
    this.POSSIBLE_CARD_CONTENT = this.ALPHABET + this.NUMBERS;
    this.generateCards();
  },
  methods: {
    getCardAmount: function (level) {
      return level.columns * level.rows;
    },
    resetExistingCards: function () {
      this.solvedCards = 0;
      if (this.$refs.memoryCards) {
        for (let card of this.$refs.memoryCards) {
          card.reset();
        }
      }
    },
    shuffle: function (array) {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
    generateCards: function () {
      this.cards = [];
      this.flippedCard = null;
      let cardAmount = this.getCardAmount(this.levels[this.selectedLevel]);
      let frontFaces = this.shuffle(this.POSSIBLE_CARD_CONTENT.split(''));
      for (let i = 0; i < cardAmount / 2; i++) {
        let frontFace = frontFaces[i];
        this.cards.push({
          key: frontFace + 0,
          value: frontFace,
          isFlipped: false,
          isFlippable: true
        });
        this.cards.push({
          key: frontFace + 1,
          value: frontFace,
          isFlipped: false,
          isFlippable: true
        });
      }
      this.shuffle(this.cards);
      this.resetExistingCards();
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
          Sounds.playError();
          setTimeout(function () {
            if(this.flippedCard){
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

<style scoped>
.header {
  width: 100%;
  height: 25pt;
}

.footer {
  width: 100%;
  height: 25pt;
}

.grid-container {
  width: 100%;
  height: calc(100% - 50pt);
  display: grid;
  grid-gap: 10pt;
  justify-items: center;
  align-items: center;
}
</style>
