<template>
    <NavPage>
      <LinkTile title="Memory" nav-path="/memory" src="img/games/MemoryBackface.png" alt="memory games"/>
      <LinkTile title="Bewegen" nav-path="/dragdrop" src="img/games/DD.png" alt="drag and drop games"/>
    </NavPage>
</template>

<script>
import NavPage from "./NavPage";
import LinkTile from "./LinkTile";

export default {
  name: "Home",
  components: {LinkTile, NavPage},
  props: {
    msg: String,
  },
};
</script>

<style scoped>
</style>
