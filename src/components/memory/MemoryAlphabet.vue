<template>
  <div>
    <div class="header">
      <label for="levels">Select level: </label>
      <select id="levels" v-model="selectedLevel" @change="generateCards()">
        <option v-for="(level, index) in levels" :key="index" :value="index">
          {{ index + 1 }} ({{ level.cardAmount }} Cards)
        </option>
      </select>
    </div>
    <div v-bind:style="gridContainer" class="grid-container">
      <memory-card class="column" v-for="card in cards" :key="card.key" :front-face="card.value"
                   :is-board-locked="isBoardLocked" @flipped="cardFlipped" />
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
    getCardAmount: function (level){
      return level.columns * level.rows;
    },
    generateCards: function () {
      // TODO need some better cleanup. flipped card is still flipped after level change
      this.cards=[];

      // TODO make method return unique random letter
      //function getUniqueRandomLetter(){
      //  return this.POSSIBLE_CARD_CONTENT[Math.floor(Math.random() * this.POSSIBLE_CARD_CONTENT.length)];
      //}
      let cardAmount = this.getCardAmount(this.levels[this.selectedLevel]);

      for (let i = 0; i < cardAmount / 2; i++) {
        let letter = this.POSSIBLE_CARD_CONTENT[i];
        this.cards.push({
          key: letter + 0,
          value: letter
        });
        this.cards.push({
          key: letter + 1,
          value: letter
        });
      }
    },
    isGameOver: function (){
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
          if(this.isGameOver()) {
            Sounds.playBigSuccess();
          }else{
            Sounds.playSuccess();
          }

          blockCards(this.flippedCard, currentCard)
          this.flippedCard = null;
          this.isBoardLocked = false;
        } else {
          Sounds.playError();
          setTimeout(function () {
            this.flippedCard.isFlipped = false;
            currentCard.isFlipped = false;
            this.flippedCard = null;
            this.isBoardLocked = false;
          }.bind(this), 1000);
        }
      }
    }
  },
  computed: {
    gridContainer: function () {
      return {
        'grid-template-columns': "repeat(" + this.levels[this.selectedLevel].columns + ", minmax(30pt, 1fr))",
      }
    }
  }
}

</script>

<style scoped>
.header {
  width: 100%;
  height: 26pt;
}

.grid-container {
  width: 100%;
  height: 90vh;
  display: grid;
  grid-gap: 5pt;
  justify-items: center;
  align-items: center;
}
</style>
