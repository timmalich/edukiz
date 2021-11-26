<template>
  <div class="content">
    <Header :nav-back-path="navBackPath">
      <div class="game-button">
        <a href="https://github.com/timmalich/edukiz" class="fab fa-github"></a>
      </div>
    </Header>
    <div class="link-area">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Header from "./Header";

export default {
  name: "NavPage",
  components: { Header },
  props: ["navBackPath"],
};
</script>

<style scoped>
.link-area {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  position: relative;
  max-width: 100%;
  height: auto;
  max-height: 100%;
  overflow: auto;
}
</style>
