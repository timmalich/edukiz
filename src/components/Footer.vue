<template>
  <div class="footer">
    <button @click="previous()" class="game-button"><i class="fas fa-arrow-alt-circle-left"></i></button>
    <button @click="restart()" class="game-button"><i class="fas fa-redo-alt"></i></button>
    <button @click="next()" class="game-button"><i class="fas fa-arrow-alt-circle-right"></i></button>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Footer",
  methods: {
    previous: function () {
      this.$emit('previous');
    },
    restart: function () {
      this.$emit('restart');
    },
    next: function () {
      this.$emit('next');
    }
  }
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
</style>
