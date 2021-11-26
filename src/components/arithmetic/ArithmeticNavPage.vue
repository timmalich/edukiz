<template>
  <NavPage nav-back-path="/">
    <link-tile
      title="Zahlen 0-19"
      nav-path="/arithmetic/numbers-0-to-19"
      src="img/games/Calculate.png"
      alt="calculate with numbers from 0 to 19"
    />
  </NavPage>
</template>

<script>
import NavPage from "../NavPage";
import LinkTile from "../LinkTile";

export default {
  name: "ArithmeticNavPage",
  components: { LinkTile, NavPage },
};
</script>
<style scoped></style>
