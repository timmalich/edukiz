<template>
  <div class="memory-card" v-bind:class="{ flip : isFlipped }" v-on:click="flipCard">
    <div>
      <div class="front-face">
        <img class="front-face-inner" :src="frontFace" alt="front face"/>
      </div>
      <div>
        <img class="back-face" src="img/cat_wallpaper.svg" alt="back face"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MemoryCard",
  data() {
    return {
      isFlipped: false,
      isFlippable: true
    }
  },
  props: ['frontFace', 'isBoardLocked', 'sound'],
  methods: {
    flipCard: function () {
      if (this.isFlippable && !this.isBoardLocked && !this.isFlipped) {
        this.isFlipped = !this.isFlipped;
        this.$emit('flipped', this);
      }
    },
    reset: function() {
      this.isFlipped = false;
      this.isFlippable = true;
    }
  }
}
</script>

<style scoped>
.memory-card {
  position: relative;
  width: 100%;
  min-width: 30pt;
  height: 100%;
  min-height: 30pt;
  transform: scale(1);
  transform-style: preserve-3d;
  transition: transform 0.5s;
}

.memory-card:active {
  transform: scale(0.97);
  transition: transform 0.2s;
}

.memory-card.flip {
  transform: rotateY(180deg);
}

.front-face,
.back-face {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 15pt;
  background: #9de591;
  backface-visibility: hidden;
  display: flex;
}

.back-face {
  object-fit: cover;
}

.front-face {
  transform: rotateY(180deg);
  overflow: hidden;
}

.front-face-inner {
  margin: auto;
  width: 95%;
  height: 95%;
}

</style>
