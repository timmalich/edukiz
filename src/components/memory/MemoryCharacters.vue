<template>
  <MemoryGame :possible-card-configs="characterConfigs"></MemoryGame>
</template>

<script>
import MemoryGame from './MemoryGame.vue';
import {characterConfigs} from "../mixins/characterConfigs"

export default {
  name: "MemoryCharacters",
  components: {
    MemoryGame
  },
  mixins: [characterConfigs]
}

</script>
