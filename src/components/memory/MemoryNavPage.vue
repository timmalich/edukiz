<template>
  <div class="content">
    <NavPage>
      <img @click="$router.push('/memory/animals')" src="img/games/MemoryAnimals.png" class="link-tile"
           alt="memory animals"/>
      <img @click="$router.push('/memory/characters')" src="img/games/MemoryCharacters.png" class="link-tile"
           alt="memory characters"/>
    </NavPage>
  </div>
</template>

<script>
import NavPage from "../NavPage";

export default {
  name: "Memory",
  components: {NavPage},
};
</script>

<style scoped>

.content {
  position: relative;
}

</style>
