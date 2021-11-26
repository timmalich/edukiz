<template>
  <div class="footer">
    <div
      @click="previous()"
      v-bind:class="[
        { highlight: isHighlightAnimationRunning && !previousLevelDisabled },
        { disabled: previousLevelDisabled },
      ]"
      class="game-button"
    >
      <i class="fas fa-arrow-alt-circle-left"></i>
    </div>
    <div
      @click="restart()"
      v-bind:class="[{ highlight: isHighlightAnimationRunning }]"
      class="game-button"
    >
      <i class="fas fa-redo-alt"></i>
    </div>
    <div
      @click="next()"
      v-bind:class="[
        { highlight: isHighlightAnimationRunning && !nextLevelDisabled },
        { disabled: nextLevelDisabled },
      ]"
      class="game-button"
    >
      <i class="fas fa-arrow-alt-circle-right"></i>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Footer",
  props: [
    "isHighlightAnimationRunning",
    "nextLevelDisabled",
    "previousLevelDisabled",
  ],
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
</style>
