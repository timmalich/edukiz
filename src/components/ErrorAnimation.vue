<template>
  <div>
    <img
      :src="error.image"
      v-for="error in errors"
      :key="error.key"
      class="error-animation"
      alt="error animation"
    />
  </div>
</template>

<script>
import { SoundUtils } from "./utils/SoundUtils";
import { ArrayUtils } from "./utils/ArrayUtils";

export default {
  name: "ErrorAnimation",
  data() {
    return {
      errors: [],
      errorImages: [
        "fish1.svg",
        "fish3.svg",
        "fish8.svg",
        "snail2.svg",
        "tractor1.svg",
        "tractor2.svg",
        "ambulance1.svg",
        "ninja1.svg",
        "penguin13.svg",
        "fire_truck1.svg",
        "fire_truck2.svg",
        "dragon5.svg",
      ],
    };
  },
  methods: {
    showError: function (soundCallback) {
      let errorDuration = 4000;
      let error = SoundUtils.playError();
      if (typeof soundCallback === "function") {
        error.addEventListener("ended", soundCallback, { once: true });
      }
      this.errors.push({
        image: "img/" + ArrayUtils.getRandomArrayElement(this.errorImages),
        key: new Date().getTime(),
      });
      setTimeout(
        function () {
          this.errors.shift();
        }.bind(this),
        errorDuration
      );
    },
  },
};
</script>

<style scoped lang="scss">
@keyframes error-animation {
  0% {
    left: 0;
  }
  100% {
    left: 100%;
    visibility: hidden;
  }
}

.error-animation {
  height: 80pt;
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 999;
  overflow: hidden;
  animation-name: error-animation;
  animation-duration: 4s;
  animation-fill-mode: forwards;
  visibility: visible;
}
</style>
