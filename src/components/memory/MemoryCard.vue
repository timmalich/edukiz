<template>
  <div class="memory-card" v-bind:class="{ flip : isFlipped }" data-framework="cat" v-on:click="flipCard">
    <div>
      <div class="front-face">
        <p style="font-size: xx-large">{{ frontFace }} </p>
      </div>
      <img class="back-face" src="img/cat_wallpaper.svg" alt="back face"/>
    </div>
  </div>
</template>

<script>
export default {
  // TODO beautify card
  name: "MemoryCard",
  data() {
    return {
      isFlipped: false,
      isFlippable: true
    }
  },
  props: ['frontFace', 'isBoardLocked'],
  methods: {
    flipCard: function () {
      if (this.isFlippable && !this.isBoardLocked && !this.isFlipped) {
        this.isFlipped = !this.isFlipped;
        this.$emit('flipped', this);
      }
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
  background: #9ec9ec;
  backface-visibility: hidden;
}

.back-face {
  object-fit: cover;
}

.front-face {
  transform: rotateY(180deg);
}
</style>
