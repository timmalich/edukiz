<template>
  <NavPage nav-back-path="/">
    <link-tile
      title="Zahlen 0-18"
      nav-path="/misc/numbers-0-to-18"
      src="img/games/Calculate.png"
      alt="calculate with numbers from 0 to 18"
    />
    <link-tile
      title="Text sprechen"
      nav-path="/misc/t2s"
      src="img/games/T2S.png"
      alt="text to speech"
    />
  </NavPage>
</template>

<script>
import NavPage from "../NavPage";
import LinkTile from "../LinkTile";

export default {
  name: "MiscNavPage",
  components: { LinkTile, NavPage },
};
</script>
<style scoped></style>
