<template>
  <div class="header">
    <div class="header-left">
      <div v-if="navBackPath" @click="navBack" class="game-button"><i class="fas fa-reply"></i></div>
      <div v-if="sound" @click="playGameExplanation" class="game-button"><i class="fas fa-question"
                                                                               style="font-size: 1.3rem"></i><i
          style="font-size: 1.2rem" class="fas fa-headphones"></i></div>
    </div>
    <div class="header-center">
      <div class="reward" v-if="this.isRewardVisible()">
        <div>{{rewards}}</div>
        <img src="img/star1.svg" alt="reward"/>
      </div>
    </div>
    <div class="header-right">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import {SoundUtils} from './utils/SoundUtils';

export default {
  name: "Header",
  props: ['navBackPath', 'sound'],
  data() {
    return {
      rewards: 1
    }
  },
  methods: {
    navBack: function () {
      this.$router.push(this.navBackPath);
    },
    playGameExplanation: function () {
      SoundUtils.playExplanation(this.sound);
    },
    increaseRewards: function (amount) {
      this.rewards+=amount;
    },
    isRewardVisible: function(){
      return this.rewards > 0;
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
  width: 33.333%;
}

.header-left > div {
  margin-right: 3pt;
}

.header-center {
  position: relative;
  width: 33.333%;
  justify-content: center;
  align-items: center;
  display: flex;
  margin: 1pt;
}

.header-right {
  width: 33.333%;
  display: flex;
  justify-content: right;
}

.reward {
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
}

.reward > img {
  width: 35pt;
  height: 35pt;
}
</style>
