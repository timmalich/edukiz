<template>
  <div class="header">
    <div class="header-left">
      <div v-if="navBackPath" @click="navBack" class="game-button"><i class="fas fa-reply"></i></div>
      <div v-if="sound" @click="playGameExplanation" class="game-button"><i class="fas fa-question"
                                                                            style="font-size: 1.3rem"></i><i
          style="font-size: 1.2rem" class="fas fa-headphones"></i></div>
    </div>
    <div class="header-center">
      <div @click="showRewardPreview()" class="reward">
        <div>{{ rewards }}</div>
        <img class="no-drag" v-bind:class="[{'reward-final': isRewardFinalActive}]" v-bind:style="rewardFinal"
             :src="getRewardHeaderImage()" alt="reward"/>
      </div>
    </div>
    <div class="header-right">
      <slot></slot>
    </div>
    <img v-if="isRewardPreviewActive || isRewardShowActive"
         v-bind:class="[{ 'reward-preview' : isRewardPreviewActive }, {'reward-show': isRewardShowActive}]"
         :src="getNextRewardImage()" class="no-drag" alt="reward-preview"/>
  </div>
</template>

<script>
import {SoundUtils} from './utils/SoundUtils';

export default {
  name: "Header",
  props: ['navBackPath', 'sound', 'currentLevel'],
  data() {
    return {
      rewards: 0,
      currentNewRewards: 0,
      isRewardPreviewActive: false,
      isRewardShowActive: false,
      isRewardFinalActive: false,
      rewardImages: ['star1', 'star2', 'star3', 'star4', 'star5']
    }
  },
  mounted: function () {
    this.$eventHub.$on('showRewardPreview', this.showRewardPreview);
    this.$eventHub.$on('showReward', this.showReward);
    this.rewards = localStorage.rewards ? localStorage.rewards : 0;
  },
  watch: {
    rewards(newRewards) {
      localStorage.rewards = newRewards;
    }
  },
  beforeDestroy() {
    this.$eventHub.$off('showRewardPreview');
    this.$eventHub.$off('showReward');
  },
  computed: {
    rewardFinal: function () {
      return {
        'animation-iteration-count': this.currentNewRewards
      }
    }
  },
  methods: {
    getDecimalPart: function(n){
      n+="";
      return n = parseInt(n.slice(n.length-2, n.length-1)) || 0;
    },
    getRewardHeaderImage: function () {
      let n = this.getDecimalPart(this.rewards);
      // n is a number between 0 and 9 now. so we need to ensure that it's bigger than our image array length
      n = n % this.rewardImages.length;
      return "img/" + this.rewardImages[n] + ".svg";
    },
    getNextRewardImage: function (){
      let lastNumberOfCurrentRewards = this.rewards+"";
      lastNumberOfCurrentRewards = parseInt(lastNumberOfCurrentRewards.slice(lastNumberOfCurrentRewards.length-1)) || 0;

      let n = this.getDecimalPart(this.rewards);
      // only show the next reward animation if it can be reached on current success
      if(this.currentLevel + 1 + lastNumberOfCurrentRewards >= 10){
        n++;
      }
      n = n % this.rewardImages.length;
      return "img/" + this.rewardImages[n] + ".svg"
    },
    navBack: function () {
      this.$router.push(this.navBackPath);
    },
    playGameExplanation: function () {
      SoundUtils.playExplanation(this.sound);
    },
    showRewardPreview: function () {
      if (!this.isRewardPreviewActive) {
        this.isRewardPreviewActive = true;
        setTimeout(function () {
          this.isRewardPreviewActive = false;
        }.bind(this), 2000);
      }
    },
    showReward: function (increaseRewardAmount) {
      increaseRewardAmount = parseInt(increaseRewardAmount) || 1;
      if (!this.isRewardShowActive) {
        // this is the first animation. within 4 seconds the big star will be shown and slowly merge to the header star
        // afterwards the header star will spin too
        this.isRewardShowActive = true;
        setTimeout(function () {
          this.isRewardShowActive = false;
        }.bind(this), 4000);
        setTimeout(function () {
          // this is the second animation. the spinning star in the header
          // for every award we will let it spin 1 round in 1 second
          this.currentNewRewards = increaseRewardAmount;
          for (let i = 1; i <= increaseRewardAmount; i++) {
            setTimeout(function () {
              this.rewards = parseInt(this.rewards) + 1 || 1;
            }.bind(this), i * 1000);
          }
          if (!this.isRewardFinalActive) {
            this.isRewardFinalActive = true;
            setTimeout(function () {
              this.isRewardFinalActive = false;
            }.bind(this), increaseRewardAmount * 1000 + 1000);
          }
        }.bind(this), 3500)
      }
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
    bottom: -90%;
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
  60% {
    transform: rotateZ(0deg) rotateY(720deg);
    width: 100%;
    height: 100%;
    left: 0;
  }
  80% {
    width: 100%;
    height: 100%;
  }
  90% {
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

.reward-final {
  animation-name: reward-final-animation;
  animation-duration: 1s;
  animation-iteration-count: 1;
}

@keyframes reward-final-animation {
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(360deg);
  }
}

</style>
