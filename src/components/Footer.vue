<template>
  <div class="footer">
    <div
      :class="[
        { highlight: isHighlightAnimationRunning && !previousLevelDisabled },
        { disabled: previousLevelDisabled },
        { gameSwitchesHidden: gameSwitchesHidden },
      ]"
      class="game-button"
      @click="previous()"
    >
      <em class="fas fa-arrow-alt-circle-left" />
    </div>
    <div
      class="voiceOption"
      @click="useBoyVoice()"
    >
      <img
        :src="voiceOptionImageBoy"
        alt="Boys Voice"
      >
    </div>
    <div
      :class="[
        { highlight: isHighlightAnimationRunning },
        { gameSwitchesHidden: gameSwitchesHidden },
      ]"
      class="game-button"
      @click="restart()"
    >
      <em class="fas fa-redo-alt" />
    </div>
    <div
      class="voiceOption"
      @click="useGirlVoice()"
    >
      <img
        class="voiceOption"
        :src="voiceOptionImageGirl"
        alt="Girls Voice"
      >
    </div>
    <div
      :class="[
        { highlight: isHighlightAnimationRunning && !nextLevelDisabled },
        { disabled: nextLevelDisabled },
        { gameSwitchesHidden: gameSwitchesHidden },
      ]"
      class="game-button"
      @click="next()"
    >
      <em class="fas fa-arrow-alt-circle-right" />
    </div>
    <slot />
    <img
      v-if="isShowBoyVoiceAnimationActive"
      :class="[{ 'voiceAnimationBoy-show': isShowBoyVoiceAnimationActive }]"
      :src="boyAnimationImage"
      class="no-drag"
      alt="Voice animation boy"
    >
    <img
      v-if="isShowGirlVoiceAnimationActive"
      :class="[{ 'voiceAnimationGirl-show': isShowGirlVoiceAnimationActive }]"
      :src="girlAnimationImage"
      class="no-drag"
      alt="Voice animation girl"
    >
  </div>
</template>

<script>
  import { SoundUtils } from './utils/SoundUtils.js';
  import { SoundLib } from './utils/SoundUtils.js';
  export default {
    name: 'Footer',
    props: [
      'isHighlightAnimationRunning',
      'nextLevelDisabled',
      'previousLevelDisabled',
      'gameSwitchesHidden',
    ],
    data() {
      return {
        voiceOptionImageBoy: 'img/boy_happy.png',
        voiceOptionImageGirl: 'img/girl_happy.png',
        boyAnimationImage: 'img/boy_happy.png',
        girlAnimationImage: 'img/girl_happy.png',
        isShowBoyVoiceAnimationActive: false,
        isShowGirlVoiceAnimationActive: false,
      };
    },
    mounted() {
      this.voiceOptionImageBoy =
        SoundUtils.selectedVoice.id !== 'boy0' ? 'img/boy_bored.png' : 'img/boy_happy.png';
      this.voiceOptionImageGirl =
        SoundUtils.selectedVoice.id !== 'girl0' ? 'img/girl_bored.png' : 'img/girl_happy.png';
    },
    methods: {
      previous: function () {
        if (!this.previousLevelDisabled) {
          this.$emit('previous');
        }
      },
      restart: function () {
        this.$emit('restart');
      },
      next: function () {
        if (!this.nextLevelDisabled) {
          this.$emit('next');
        }
      },
      useBoyVoice: function () {
        this.voiceOptionImageBoy = 'img/boy_happy.png';
        this.voiceOptionImageGirl = 'img/girl_bored.png';
        SoundUtils.useBoy0Voice();
        let sounds = [
          SoundLib.hi,
          SoundLib.laugh1,
          SoundLib.laugh2,
          SoundLib.laugh3,
          SoundLib.success1,
        ];
        let randomSound = sounds[Math.floor(Math.random() * sounds.length)];
        SoundUtils.play(randomSound);
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
        this.voiceOptionImageBoy = 'img/boy_bored.png';
        this.voiceOptionImageGirl = 'img/girl_happy.png';
        SoundUtils.useGirl0Voice();
        let sounds = [
          SoundLib.hi,
          SoundLib.laugh1,
          SoundLib.laugh2,
          SoundLib.laugh3,
          SoundLib.success2,
          SoundLib.success2,
          SoundLib.success3,
          SoundLib.success4,
          SoundLib.success5,
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
