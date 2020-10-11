<template>
</template>

<script>
export default {
  name: "MemoryAlphabet",
  data() {
    function calculateLevels () {
      let maxLevels = 10;
      let level = 1;
      let cols = 2;
      let levels = [];
      while (level <= maxLevels) {
        if (cols * (cols - 1) % 2 === 0) {
          levels.push({rows: cols - 1, columns: cols});
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
      cards: {},
      firstCard: {},
      secondCard: {},
      hasFlippedCard: false,
      lockBoard: false,
      solvedCards: 0,
      levels: calculateLevels()
    };
  },
  created: function () {
  },
  methods: {}
}

</script>

<style scoped>
</style>
