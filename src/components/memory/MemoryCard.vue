<template>
  <div class="memory-card" v-bind:class="{ flip : isFlipped }" data-framework="cat" v-on:click="flipCard">
    <div>
      <div class="front-face">
        <svg
            class="front-face-inner"
            viewBox="0 0 16 16"
            preserveAspectRatio="xMinYMid meet"
            xmlns="http://www.w3.org/2000/svg"
        >
          <text
              x="1"
              y="14"
              font-size="20"
              font-family="Arial"
              fill="black"
          >{{ frontFace }}</text>
        </svg>
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
  props: ['frontFace', 'isBoardLocked'],
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
  background: #9ec9ec;
  backface-visibility: hidden;
  display: flex;
}

.back-face {
  object-fit: cover;
}

.front-face {
  transform: rotateY(180deg);
  resize: both;
  overflow: hidden;
}

.front-face-inner {
  margin: auto;
  width: 95%;
  height: 95%;
}

</style>
