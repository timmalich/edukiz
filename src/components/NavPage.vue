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
    <div>
      <Footer
          :previous-level-disabled="true"
          :next-level-disabled="true"
          :game-switches-hidden="true"
      />
    </div>
  </div>
</template>

<script>
import Header from "./Header";
import Footer from "@/components/Footer.vue";

export default {
  name: "NavPage",
  components: {Footer, Header },
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
  height: calc(100% - 35pt - 35pt);
  max-height: calc(100% - 35pt - 35pt);
  overflow: auto;
}
</style>
