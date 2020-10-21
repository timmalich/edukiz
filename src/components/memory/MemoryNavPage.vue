<template>
  <div class="content">
    <NavPage nav-back-link="/">
      <link-tile title="Bilder" nav-path="/memory/animals" src="img/games/MemoryAnimals.png" alt="memory animals" />
      <link-tile title="ABC & 123" nav-path="/memory/characters" src="img/games/MemoryCharacters.png" alt="memory characters" />
    </NavPage>
  </div>
</template>

<script>
import NavPage from "../NavPage";
import LinkTile from "../LinkTile";

export default {
  name: "Memory",
  components: {LinkTile, NavPage},
};
</script>

<style scoped>

.content {
  position: relative;
}

</style>
