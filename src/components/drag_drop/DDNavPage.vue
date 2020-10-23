<template>
  <NavPage nav-back-path="/">
    <link-tile title="Zeichen Finden" nav-path="/dragdrop/characters" src="favicon.svg"
               alt="memory characters"/>
    <link-tile title="Wörter Bauen" nav-path="/dragdrop/build-words" src="favicon.svg" alt="memory animals"/>
  </NavPage>
</template>

<script>
import NavPage from "../NavPage";
import LinkTile from "../LinkTile";

export default {
  name: "DDNavPage",
  components: {LinkTile, NavPage},
};
</script>

<style scoped>
</style>
