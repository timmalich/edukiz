<template>
  <div class="header">
    <div class="header-left">
      <div v-if="navBackPath" @click="navBack" class="game-button"><i class="fas fa-reply"></i></div>
      <div v-if="sound" @click="playGameExplanation" class="game-button"><i class="fas fa-question"
                                                                            style="font-size: 1.3rem"></i><i
          style="font-size: 1.2rem" class="fas fa-headphones"></i></div>
    </div>
    <div class="header-center">
      <div @click="showReward()" class="reward">
        <div>{{ rewards }}</div>
        <img src="img/star1.svg" alt="reward"/>
      </div>
    </div>
    <div class="header-right">
      <slot></slot>
    </div>
    <img v-if="isRewardPreviewActive || isRewardShowActive"
         v-bind:class="[{ 'reward-preview' : isRewardPreviewActive }, {'reward-show': isRewardShowActive} ]"
         src=" img/star2.svg" alt="reward-preview"/>
  </div>
</template>

<script>
import {SoundUtils} from './utils/SoundUtils';

export default {
  name: "Header",
  props: ['navBackPath', 'sound'],
  data() {
    return {
      rewards: 1,
      isRewardPreviewActive: false,
      isRewardShowActive: false
    }
  },
  created() {
    this.$eventHub.$on('showRewardPreview', this.showRewardPreview);
  },
  beforeDestroy() {
    this.$eventHub.off('showRewardPreview');
  },
  methods: {
    navBack: function () {
      this.$router.push(this.navBackPath);
    },
    playGameExplanation: function () {
      SoundUtils.playExplanation(this.sound);
    },
    increaseRewards: function (amount) {
      this.rewards += amount;
    },
    showRewardPreview: function () {
      if (this.isRewardPreviewActive) {
        return;
      }
      this.isRewardPreviewActive = true;
      setTimeout(function () {
        this.isRewardPreviewActive = false;
      }.bind(this), 2000);
    },
    showReward: function () {
      if (this.isRewardShowActive) {
        return;
      }
      this.isRewardShowActive = true;
      setTimeout(function () {
        this.isRewardShowActive = false;
      }.bind(this), 4000);
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

.reward-preview, .reward-show {
  position: fixed;
  z-index: 999;
  left: 0;
  bottom: -90%;
  height: 100%;
  width: 100%;
  opacity: 50%;
  animation-name: reward-preview-animation;
  overflow: hidden;
  animation-duration: 2s;
  animation-direction: reverse;
}

.reward-show {
  animation-name: reward-show-animation;
  animation-duration: 4s;
  bottom: 0;
  animation-direction: normal;
}

@keyframes reward-preview-animation {
  0% {
    bottom: -10%;
    visibility: visible;
    transform: rotate(-45deg);
  }
  25% {
    transform: rotate(45deg);
  }
  37.5% {
    bottom: -40%;
  }
  50% {
    transform: rotate(-45deg);
  }
  75% {
    transform: rotate(45deg);
  }
  100% {
    transform: rotate(-45deg);
    visibility: hidden;
  }
}

@keyframes reward-show-animation {
  0% {
    bottom: -100%;
    visibility: visible;
    opacity: 100;
    transform: rotateZ(45deg)
  }
  37.5% {
    bottom: 0;
  }
  40% {
    transform: rotateZ(0deg) rotateY(720deg);
    width: 100%;
    height: 100%;
    left: 0;
  }
  60%{
    transform: rotateZ(0deg) rotateY(720deg);
    width: 100%;
    height: 100%;
    left: 0;
  }
  80% {
    width: 100%;
    height: 100%;
  }
  90%{
    left: -20%;
    bottom: 30%;
    transform: rotateZ(45deg) rotateY(1440deg);

  }
  100% {
    transform: rotateZ(45deg) rotateY(1800deg);
    width: 35pt;
    height: 35pt;
    left: calc(50% - 10pt);
    top: 0;
  }
}


</style>
