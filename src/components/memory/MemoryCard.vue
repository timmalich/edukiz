<template>
  <div class="memory-card" data-framework="cat" v-on:click="flipCard">
    <img class="front-face" src="img/cat1.svg" alt="cat"/>
    <img
        class="back-face"
        src="img/cat_wallpaper.svg"
        alt="back face"
    />
  </div>
</template>

<script></script>

<style scoped>
.memory-card {
  width: 70pt;
  height: 100pt;
  margin: 3pt;
  position: relative;
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
  width: 100%;
  height: 100%;
  padding: 0;
  position: absolute;
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
