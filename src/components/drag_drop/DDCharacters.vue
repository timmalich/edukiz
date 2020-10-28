<template>
  <Game nav-back-path="/dragdrop" @previous="previousLevel" @restart="restartGame" @next="nextLevel">
    <div class="drop-section">
      <ImageContainer class="dropzone empty-droppable-element" src="img/characters/A.svg"></ImageContainer>
      <ImageContainer class="dropzone empty-droppable-element" src="img/characters/B.svg"></ImageContainer>
      <ImageContainer class="dropzone empty-droppable-element" src="img/characters/C.svg"></ImageContainer>
      <ImageContainer class="dropzone empty-droppable-element" src="img/characters/D.svg"></ImageContainer>
      <ImageContainer class="dropzone empty-droppable-element" src="img/characters/E.svg"></ImageContainer>
    </div>
    <div class="spacer"></div>
    <div class="drag-section">
      <ImageContainer class="draggable-element" src="img/characters/A.svg"></ImageContainer>
      <ImageContainer class="draggable-element" src="img/characters/B.svg"></ImageContainer>
      <ImageContainer class="draggable-element" src="img/characters/C.svg"></ImageContainer>
      <ImageContainer class="draggable-element" src="img/characters/D.svg"></ImageContainer>
      <ImageContainer class="draggable-element" src="img/characters/E.svg"></ImageContainer>
    </div>
  </Game>
</template>

<script>
import Game from "../Game";
import ImageContainer from "../ImageContainer";
import interact from '@interactjs/interactjs'
/* eslint-disable */
export default {
  name: "DDCharacters",
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
  mounted: function () {
    interact('.dropzone').dropzone({
      overlap: 0.5,

      ondropactivate: function (event) {
        console.log('A')

        // add active dropzone feedback
        event.target.classList.add('drop-active')
      },
      ondragenter: function (event) {
        console.log('B')

        var draggableElement = event.relatedTarget
        var dropzoneElement = event.target

        // feedback the possibility of a drop
        dropzoneElement.classList.add('drop-target')
        draggableElement.classList.add('can-drop')
      },
      ondrop: function (event) {
        event.currentTarget.classList.add('drop-success');
        event.currentTarget.classList.remove('empty-droppable-element');

        event.relatedTarget.classList.add('drag-success');
      }
    })

    interact('.draggable-element')
        .draggable({
          inertia: false,
          modifiers: [],
          autoScroll: false,
          listeners: {
            move: function (event) {
              let dragElement = event.target
              let lastElementRelativePostionX = parseFloat(dragElement.getAttribute('data-x')) || 0;
              let lastElementRelativePostionY = parseFloat(dragElement.getAttribute('data-y')) || 0;
              let pixelsMovedSinceLastEventX = event.dx;
              let pixelsMovedSinceLastEventY = event.dy;
              let updatedX = lastElementRelativePostionX + pixelsMovedSinceLastEventX;
              let updatedY = lastElementRelativePostionY + pixelsMovedSinceLastEventY;

              dragElement.style.webkitTransform =
                  dragElement.style.transform =
                      'translate(' + updatedX + 'px, ' + updatedY + 'px)'

              dragElement.setAttribute('data-x', updatedX)
              dragElement.setAttribute('data-y', updatedY)
            }
          }
        })
    console.log("droppable inti");
  },

  methods: {
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

.draggable-element{
  touch-action: none;
}

.empty-droppable-element {
  filter: grayscale(85%);
}

.drop-success {
  background-color: #24ff02;
}

.drag-success {
  visibility: hidden;
}

</style>
