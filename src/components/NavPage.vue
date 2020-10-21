<template>
  <div class="content">
    <Header>
      <button v-if="navBackLink" @click="navBack" class="game-button"><i class="fas fa-reply"></i></button>
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
  components: {Header},
  props: ['navBackLink'],
  methods: {
    navBack: function (){
      this.$router.push(this.navBackLink);
    }
  }
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
