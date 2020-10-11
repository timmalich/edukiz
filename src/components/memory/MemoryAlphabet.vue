<template>
  <div>
    <label for="levels">Select level: </label>
    <select id="levels" v-model="selectedLevel" @change="selectLevel()">
      <option v-for="(level, index) in levels" :key="index" :value="index">
        {{ index + 1 }} ({{ level.cardAmount }} Cards)
      </option>
    </select>
    <br/>
    <div v-bind:style="gridContainer" class="grid-container">
      <memory-card class="column" v-for="card in levels[selectedLevel].cardAmount" :key="card"></memory-card>
    </div>
  </div>
</template>

<script>
import MemoryCard from './MemoryCard.vue';

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
          levels.push({rows: minRows, columns: cols, cardAmount: minRows * cols});
          level++;
        }
        if (cols * cols % 2 === 0) {
          levels.push({rows: cols, columns: cols, cardAmount: cols * cols})
          level++;
        }
        cols++;
      }
      return levels;
    }

    return {
      cards: {},
      firstCard: {},
      secondCard: {},
      hasFlippedCard: false,
      lockBoard: false,
      solvedCards: 0,
      selectedLevel: 4,
      levels: calculateLevels()
    };
  },
  created: function () {
  },
  methods: {
    selectLevel: function () {
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
.grid-container {
  width: 100%;
  height: 90vh;
  display: grid;
  grid-gap: 5pt;
  justify-items: center;
  align-items: center;
}
</style>
