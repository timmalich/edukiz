<template>
  <MemoryGame :possible-card-configs="possibleCardConfigs"></MemoryGame>
</template>

<script>
import MemoryGame from './MemoryGame.vue';

export default {
  name: "MemoryAlphabet",
  components: {
    MemoryGame
  },
  data() {
    let possibleCharacters = "ABCDEFGHIJKLMNOPQRSTUVXYZ0123456789".split('');
    let possibleCardConfigs = [];
    for (let character of possibleCharacters) {
      possibleCardConfigs.push({
        frontFace: "img/characters/" + character.toUpperCase() + ".svg",
        sound: "de/characters/" + character.toLowerCase() + ".mp3",
      })
    }
    return {
      possibleCardConfigs: possibleCardConfigs
    }
  }
}

</script>
