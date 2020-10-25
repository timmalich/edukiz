<template>
  <div class="ratio-wrapper-container">
    <div class="inner">
      <img :src="src" alt="containerized image">
    </div>
  </div>
</template>
<script>
export default {
  name: "ImageContainer",
  props: ['width', 'height', 'src']
};

</script>

<style scoped>
.ratio-wrapper-container {
  position: relative;
  width: 100%;
  min-width: 30pt;
  height: 100%;
  min-height: 30pt;
  border-radius: 15pt;
  background-color: #a94ed2;
}

.inner {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
}

.inner > img {
  margin: auto;
  width: 100%;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}
</style>
