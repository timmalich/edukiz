<template>
  <NavPage>
    <LinkTile
      title="Memory"
      nav-path="/memory"
      src="img/games/MemoryBackface.png"
      alt="memory games"
    />
    <LinkTile
      title="Bewegen"
      nav-path="/dragdrop"
      src="img/games/DD.png"
      alt="drag and drop games"
    />
    <LinkTile
      title="Sonstiges"
      nav-path="/misc"
      src="img/games/Calculate.png"
      alt="Other uncategorized games"
    />
  </NavPage>
</template>

<script>
  import NavPage from './NavPage.vue';
  import LinkTile from './LinkTile.vue';

  export default {
    name: 'Home',
    components: { LinkTile, NavPage },
    props: {
      msg: String,
    },
  };
</script>

<style scoped></style>
