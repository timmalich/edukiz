<template>
  <div class="footer">
    <div
      @click="previous()"
      v-bind:class="[
        { highlight: isHighlightAnimationRunning && !previousLevelDisabled },
        { disabled: previousLevelDisabled },
        { gameSwitchesHidden: gameSwitchesHidden },
      ]"
      class="game-button"
    >
      <em class="fas fa-arrow-alt-circle-left"></em>
    </div>
    <div @click="useBoyVoice()" class="voiceOption">
      <img :src="voiceOptionImageBoy" alt="Boys Voice" />
    </div>
    <div
      @click="restart()"
      v-bind:class="[
        { highlight: isHighlightAnimationRunning },
        { gameSwitchesHidden: gameSwitchesHidden },
      ]"
      class="game-button"
    >
      <em class="fas fa-redo-alt"></em>
    </div>
    <div @click="useGirlVoice()" class="voiceOption">
      <img class="voiceOption" :src="voiceOptionImageGirl" alt="Girls Voice" />
    </div>
    <div
      @click="next()"
      v-bind:class="[
        { highlight: isHighlightAnimationRunning && !nextLevelDisabled },
        { disabled: nextLevelDisabled },
        { gameSwitchesHidden: gameSwitchesHidden },
      ]"
      class="game-button"
    >
      <em class="fas fa-arrow-alt-circle-right"></em>
    </div>
    <slot></slot>
    <img
      v-if="isShowBoyVoiceAnimationActive"
      v-bind:class="[
        { 'voiceAnimationBoy-show': isShowBoyVoiceAnimationActive },
      ]"
      src="img/boy_happy.png"
      class="no-drag"
      alt="Voice animation boy"
    />
    <img
      v-if="isShowGirlVoiceAnimationActive"
      v-bind:class="[
        { 'voiceAnimationGirl-show': isShowGirlVoiceAnimationActive },
      ]"
      src="img/girl_happy.png"
      class="no-drag"
      alt="Voice animation girl"
    />
  </div>
</template>

<script>
import { SoundUtils } from "./utils/SoundUtils";
import { SoundLib } from "./utils/SoundUtils";
export default {
  name: "Footer",
  data() {
    return {
      voiceOptionImageBoy: "img/boy_happy.png",
      voiceOptionImageGirl: "img/girl_happy.png",
      isShowBoyVoiceAnimationActive: false,
      isShowGirlVoiceAnimationActive: false,
    };
  },
  props: [
    "isHighlightAnimationRunning",
    "nextLevelDisabled",
    "previousLevelDisabled",
    "gameSwitchesHidden",
  ],
  mounted() {
    this.voiceOptionImageBoy =
      SoundUtils.selectedVoice.id !== "boy0"
        ? "img/boy_bored.png"
        : "img/boy_happy.png";
    this.voiceOptionImageGirl =
      SoundUtils.selectedVoice.id !== "girl0"
        ? "img/girl_bored.png"
        : "img/girl_happy.png";
  },
  methods: {
    previous: function () {
      if (!this.previousLevelDisabled) {
        this.$emit("previous");
      }
    },
    restart: function () {
      this.$emit("restart");
    },
    next: function () {
      if (!this.nextLevelDisabled) {
        this.$emit("next");
      }
    },
    useBoyVoice: function () {
      this.voiceOptionImageBoy = "img/boy_happy.png";
      this.voiceOptionImageGirl = "img/girl_bored.png";
      SoundUtils.useBoy0Voice();
      SoundUtils.play(SoundLib.success1);
      if (!this.isShowBoyVoiceAnimationActive) {
        this.isShowBoyVoiceAnimationActive = true;
        setTimeout(
          function () {
            this.isShowBoyVoiceAnimationActive = false;
          }.bind(this),
          2000
        );
      }
    },
    useGirlVoice: function () {
      this.voiceOptionImageBoy = "img/boy_bored.png";
      this.voiceOptionImageGirl = "img/girl_happy.png";
      SoundUtils.useGirl0Voice();
      let sounds = [
        SoundLib.hi,
        SoundLib.laugh1,
        SoundLib.laugh2,
        SoundLib.laugh3,
      ];
      let randomSound = sounds[Math.floor(Math.random() * sounds.length)];
      SoundUtils.play(randomSound);
      if (!this.isShowGirlVoiceAnimationActive) {
        this.isShowGirlVoiceAnimationActive = true;
        setTimeout(
          function () {
            this.isShowGirlVoiceAnimationActive = false;
          }.bind(this),
          2000
        );
      }
    },
  },
};
</script>

<style scoped lang="scss">
.footer {
  width: 100%;
  height: 35pt;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@keyframes highlight-animation {
  33% {
    background-color: #dcb308;
    color: #4385f4f0;
  }
  66% {
    background-color: #5fec48;
    color: rgba(67, 133, 243, 0.94);
  }
}

.highlight {
  animation-name: highlight-animation;
  animation-duration: 3s;
  animation-iteration-count: infinite;
  animation-fill-mode: forwards;
}

.disabled {
  background-color: #7f7f7f;
}

.gameSwitchesHidden {
  visibility: hidden;
}

.voiceOption {
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
}

.voiceOption > img {
  width: 35pt;
  height: 35pt;
}

.voiceAnimationGirl-show {
  position: fixed;
  top: 0;
  right: 0;
  width: 40vw;
  max-height: 100vh;
  z-index: 999;
  object-fit: fill;
  animation-name: voice-animation;
  animation-duration: 2s;
  overflow: hidden;
  transform: rotate(180deg) translate(100%, -100%);
  transform-origin: top right;
}

.voiceAnimationBoy-show {
  position: fixed;
  top: 0;
  left: 0;
  width: 40vw;
  max-height: 100vh;
  z-index: 999;
  object-fit: fill;
  animation-name: voice-animation;
  animation-duration: 2s;
  overflow: hidden;
  transform: rotate(180deg) translate(100%, -100%);
  transform-origin: top right;
}

@keyframes voice-animation {
  0% {
    visibility: visible;
    transform: rotate(180deg) translate(100%, -100%) translateY(100%);
  }

  50% {
    transform: rotate(180deg) translate(100%, -100%) translateY(10%);
  }

  100% {
    transform: rotate(180deg) translate(100%, -100%) translateY(0%);
    visibility: hidden;
  }
}
</style>
