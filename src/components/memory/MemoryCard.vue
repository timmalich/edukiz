<template>
  <div class="memory-card" data-framework="cat" v-on:click="flipCard">
    <div>
      <img class="front-face" src="img/cat1.svg" alt="cat"/>
      <img class="back-face" src="img/cat_wallpaper.svg" alt="back face" />
    </div>
  </div>
</template>

<script></script>

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
