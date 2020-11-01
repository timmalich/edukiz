<template>
  <div class="content-window">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style lang="scss">
$generalPaddingRight: 10pt;
$generalPaddingLeft: 10pt;

.content-window {
  height: 100%;
  max-height: 100%;
  padding-right: $generalPaddingRight;
  padding-left: $generalPaddingLeft;
  width: calc(100% - #{$generalPaddingLeft} - #{$generalPaddingRight});
  max-width: calc(100% - #{$generalPaddingLeft} - #{$generalPaddingRight});
  top: 0;
  left: 0;
  position: absolute;
  background-color: #37373e;
  overflow: hidden;
}

.content {
  position: relative;
  width: 100%;
  max-width: 100%;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
}

.clickable-elements, .game-button {
  color: #ffffff;
  background-color: #4385f4f0;
  border-radius: 5pt;
}

.game-button {
  height: 30pt;
  width: 30pt;
  font-size: 1.7rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.game-button > a {
  color: inherit;
  text-decoration: none;
}

html {
  height: 100%;
  background-color: #37373e;
  width: 100%;
}

</style>
