<template>
  <Game nav-back-path="/dragdrop" @previous="previousLevel" @restart="restartGame" @next="nextLevel">
    <div class="drop-section">
      <ImageContainer class="drop-element" src="img/characters/A.svg"></ImageContainer>
      <ImageContainer class="drop-element" src="img/characters/B.svg"></ImageContainer>
      <ImageContainer class="drop-element" src="img/characters/C.svg"></ImageContainer>
      <ImageContainer class="drop-element" src="img/characters/D.svg"></ImageContainer>
      <ImageContainer class="drop-element" src="img/characters/E.svg"></ImageContainer>
    </div>
    <div class="spacer"></div>
    <div class="drag-section">
      <div v-on:mouseup="end($event)"
           v-on:touchend="end($event)"
           v-on:mousemove="move($event)"
           v-on:touchmove="move($event)"
           v-on:mousedown="start($event)"
           v-on:touchstart="start($event)"
           class="foo"
      >
        <ImageContainer src="img/characters/A.svg"></ImageContainer>
      </div>
      <ImageContainer src="img/characters/B.svg"></ImageContainer>
      <ImageContainer src="img/characters/C.svg"></ImageContainer>
      <ImageContainer src="img/characters/D.svg"></ImageContainer>
      <ImageContainer src="img/characters/E.svg"></ImageContainer>
    </div>
  </Game>
</template>

<script>
import Game from "../Game";
import ImageContainer from "../ImageContainer";

export default {
  name: "BuildWords",
  components: {
    ImageContainer,
    Game,
  },
  data() {
    return {
      elementSelected: false,
      elementWidth: undefined,
      elementHeight: undefined,
      selectedElement: undefined,
      backupElement: undefined
    };
  },
  created: function () {
    this.initGame();
  },
  /* eslint-disable */
  methods: {
    start: function (evt) {
      console.log("start");
      this.elementSelected = true;
      this.selectedElement =  evt.currentTarget;
      this.elementWidth = this.selectedElement.clientWidth;
      this.elementHeight = this.selectedElement.clientHeight;

      this.backupElement = this.selectedElement.cloneNode(true);
      // todo
      this.backupElement.id = this.backupElement.id + "-BackupElementFromDragging"; // todo restore id on the end
      this.selectedElement.after(this.backupElement);
      this.backupElement.style.visibility = "hidden";

      this.selectedElement.style.position = "fixed";
      this.selectedElement.style.width = this.elementWidth + "px";
      this.selectedElement.style.height = this.elementHeight + "px";

      console.log(this.elementWidth);
      console.log(this.elementHeight);

      //console.log(evt);
      //debugger; // eslint-disable-line
    },
    move: function (evt) {
      console.log("move");
      console.log(evt.targetTouches[0].clientX);
      console.log(evt.targetTouches[0].clientY);
      this.selectedElement.style.left = evt.targetTouches[0].clientX + "px";
      this.selectedElement.style.top = evt.targetTouches[0].clientY + "px";
      // todo heed mouse / touch position
      evt.stopPropagation();
      //debugger; // eslint-disable-line
    },
    end: function (evt) {
      this.elementSelected = false;
      console.log("end");
      this.selectedElement.style.width = this.elementWidth;
      this.selectedElement.style.height = this.elementHeight;
      //console.log(evt);
      //debugger; // eslint-disable-line
      // TODO: create a list of all droppable elements and their coordinates
      // check with this if they overlap.
      // if not: restore backup and ID
    },
    initGame: function () {
      // TODO add something
    },
    restartGame: function () {
      this.$log.info("IMPLEMENT ME"); // TODO Implement
    },
    previousLevel: function () {
      this.$log.info("IMPLEMENT ME"); // TODO Implement
    },
    nextLevel: function () {
      this.$log.info("IMPLEMENT ME"); // TODO Implement
    }
  }
}
</script>

<style scoped lang="scss">
.spacer {
  height: 20%;
}

.foo {
  width: 100%;
  height: 100%;
}

.drop-section, .drag-section {
  width: 100%;
  height: 40%;
  display: grid;
  grid-gap: 10pt;
  justify-items: center;
  align-items: center;
  position: relative;
  grid-template-columns: repeat(5, minmax(20pt, 1fr));
}

.drop-element {
  filter: grayscale(85%);
}

</style>
