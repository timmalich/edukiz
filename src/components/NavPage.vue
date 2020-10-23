<template>
  <div class="content">
    <Header :nav-back-path="navBackPath" />
    <div class="link-area">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Header from "./Header";

export default {
  name: "NavPage",
  components: {Header},
  props: ['navBackPath']
};
</script>

<style scoped>

.content {
  position: relative;
}

.link-area {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  position: relative;
  max-width: 100%;
}
</style>
