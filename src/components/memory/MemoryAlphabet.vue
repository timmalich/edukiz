<template>
</template>

<script>
export default {
  name: "MemoryAlphabet",
  data() {
    return {
      cards: {},
      firstCard: {},
      secondCard: {},
      hasFlippedCard: false,
      lockBoard: false,
      solvedCards: 0,
      levels: [
        {rows: 1, columns: 2},
        {rows: 2, columns: 2},
        {rows: 2, columns: 3},
        {rows: 3, columns: 4},
        {rows: 4, columns: 4},
        {rows: 4, columns: 5},
        {rows: 5, columns: 6},
        {rows: 6, columns: 6},
        {rows: 6, columns: 7},
        {rows: 7, columns: 8},
        {rows: 8, columns: 8},
      ]
    };
  },
  created: function () {
  },
  methods: {}
}

</script>

<style scoped>
</style>
