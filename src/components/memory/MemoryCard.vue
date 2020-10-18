<template>
  <div class="memory-card" v-on:click="flipCard">
    <div>
      <div class="front-face" v-bind:class="[{ flipped : !isFlipped } ]">
        <img class="front-face-inner" :src="frontFace" alt="front face"/>
      </div>
      <div>
        <img class="back-face" src="img/cat_wallpaper.svg" alt="back face" v-bind:class="[{ flipped : isFlipped } ]"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MemoryCard",
  data() {
    return {
      isFlipped: true,
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
    forceFlip: function () {
      this.isFlipped = true;
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
}

.flipped {
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
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.back-face {
  object-fit: cover;
}

.front-face {
  overflow: hidden;
}

.front-face-inner {
  margin: auto;
  width: 95%;
  height: 95%;
}

</style>
