<template>
  <div>
    <Header><button class="game-button"><a href="https://github.com/timmalich/edukiz" class="fab fa-github"></a></button></Header>
    <NavPage>
      <LinkTile title="Memory" nav-path="/memory" src="img/games/MemoryBackface.png" alt="memory games" />
      <LinkTile title="Bewegen" nav-path="/dragdrop" src="img/games/MemoryBackface.png" alt="drag and drop games" />
    </NavPage>
  </div>
</template>

<script>
import NavPage from "./NavPage";
import LinkTile from "./LinkTile";
import Header from "./Header";

export default {
  name: "Home",
  components: {Header, LinkTile, NavPage},
  props: {
    msg: String,
  },
};
</script>

<style scoped>
</style>
