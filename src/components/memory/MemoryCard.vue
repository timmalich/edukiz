<template>
  <div
    class="memory-card"
    @click="flipCard"
  >
    <div>
      <div
        class="front-face"
        :class="[{ flipped: !isFlipped }]"
      >
        <img
          class="front-face-inner no-drag"
          :src="frontFace"
          alt="front face"
        >
      </div>
      <div>
        <img
          class="back-face no-drag"
          :src="backFace"
          alt="back face"
          :class="[{ flipped: isFlipped }]"
        >
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MemoryCard',
    props: ['frontFace', 'isBoardLocked', 'sound'],
    data() {
      return {
        isFlipped: true,
        isFlippable: true,
        backFace: 'img/cat_wallpaper.svg',
      };
    },
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
      reset: function () {
        this.isFlipped = false;
        this.isFlippable = true;
      },
    },
  };
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
    width: 100%;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
</style>
