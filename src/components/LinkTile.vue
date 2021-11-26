<template>
  <div class="link-tile">
    <figure class="link-tile-box">
      <figcaption>
        <b>{{ title }}</b>
      </figcaption>
      <img
        @click="nav"
        :src="this.src"
        class="link-tile clickable-elements"
        :alt="alt"
      />
    </figure>
  </div>
</template>
<script>
export default {
  name: "LinkTile",
  props: ["navPath", "src", "alt", "title"],
  methods: {
    nav: function () {
      this.$router.push(this.navPath);
    },
  },
};
</script>

<style scoped lang="scss">
.link-tile figure {
  width: 100%;
  text-align: center;
  color: #ffffff;
  margin: 0;
}

.link-tile figcaption {
  // dirty hack to recenter after link-tile padding
  padding-left: 10pt;
  font-size: 1.05rem;
}

.link-tile {
  display: flex;
  justify-content: space-between;
  width: 28%;
  padding: 10pt;
}

.link-tile img {
  position: relative;
  width: 100%;
  padding: 5pt;
}
</style>
