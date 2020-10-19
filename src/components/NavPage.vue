<template>
  <div class="content">
    <Header>
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
};
</script>

<style scoped>

.content {
  position: relative;
}

</style>
