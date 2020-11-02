<template>
  <div class="header">
    <div class="header-left">
      <div v-if="navBackPath" @click="navBack" class="game-button"><i class="fas fa-reply"></i></div>
      <div v-if="sound" @click="playGameExplanation" class="game-button"><i class="fas fa-question"
                                                                               style="font-size: 1.3rem"></i><i
          style="font-size: 1.2rem" class="fas fa-headphones"></i></div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import {SoundUtils} from './utils/SoundUtils';

export default {
  name: "Header",
  props: ['navBackPath', 'sound'],
  methods: {
    navBack: function () {
      this.$router.push(this.navBackPath);
    },
    playGameExplanation: function () {
      SoundUtils.playExplanation(this.sound);
    }
  }
};

</script>

<style scoped lang="scss">
.header {
  width: 100%;
  height: 35pt;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  justify-content: left;
  align-items: center;
  margin-right: -3pt;
}

.header-left > div {
  margin-right: 3pt;
}
</style>
