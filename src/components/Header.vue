<template>
  <div class="header">
    <button v-if="navBackPath" @click="navBack" class="game-button"><i class="fas fa-reply"></i></button>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Header",
  props: ['navBackPath'],
  methods: {
    navBack: function () {
      this.$router.push(this.navBackPath);
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
</style>
