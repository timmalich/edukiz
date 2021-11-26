<template>
  <NavPage nav-back-path="/">
    <link-tile
      title="Zeichen Finden"
      nav-path="/dragdrop/characters"
      src="img/games/DDCharacters.png"
      alt="memory characters"
    />
    <link-tile
      title="Wörter Bauen"
      nav-path="/dragdrop/build-words"
      src="img/games/DDBuildWords.png"
      alt="memory animals"
    />
  </NavPage>
</template>

<script>
import NavPage from "../NavPage";
import LinkTile from "../LinkTile";

export default {
  name: "DDNavPage",
  components: { LinkTile, NavPage },
};
</script>

<style scoped></style>
