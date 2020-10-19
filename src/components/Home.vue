<template>
  <div>
    <NavPage>
      <img @click="$router.push('/memory')" src="img/games/MemoryBackface.png" class="link-tile" alt="memory games"/>
    </NavPage>
  </div>
</template>

<script>
import NavPage from "./NavPage";

export default {
  name: "Home",
  components: {NavPage},
  props: {
    msg: String,
  },
};
</script>

<style scoped></style>
