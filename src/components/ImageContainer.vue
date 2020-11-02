<template>
    <div class="wrapper">
      <img :src="src" alt="containerized image">
    </div>
</template>
<script>
export default {
  name: "ImageContainer",
  props: ['src']
};

</script>

<style scoped>

.wrapper {
  background-color: #a94ed2;
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
  min-width: 30pt;
  min-height: 25pt;
  border-radius: 15pt;
  justify-content: center;
  align-items: center;
}

.wrapper > img {
  position: absolute;
  margin: auto;
  width: 100%;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}
</style>
