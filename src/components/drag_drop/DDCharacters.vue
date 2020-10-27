<template>
  <Game nav-back-path="/dragdrop" @previous="previousLevel" @restart="restartGame" @next="nextLevel">
    <div class="dropzone drop-section drag-drop-zone drop-zone draggable-dropzone--active" ref="dropzone">
      <ImageContainer class="dropzone drop-element" src="img/characters/A.svg"></ImageContainer>
      <ImageContainer class="drop-element" src="img/characters/B.svg"></ImageContainer>
      <ImageContainer class="drop-element" src="img/characters/C.svg"></ImageContainer>
      <ImageContainer class="drop-element" src="img/characters/D.svg"></ImageContainer>
      <ImageContainer class="drop-element" src="img/characters/E.svg"></ImageContainer>
    </div>
    <div class="spacer"></div>
    <div class="drag-section drag-drop-zone draggable-dropzone--occupied" ref="dragzone">
      <ImageContainer style="touch-action: none" class="drag-drop" src="img/characters/A.svg"></ImageContainer>
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
import interact from '@interactjs/interactjs'

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
  mounted: function() {
    function dragMoveListener (event) {

      let target = event.target

      // keep the dragged position in the data-x/data-y attributes
      let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
      let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

      // translate the element
      target.style.webkitTransform =
          target.style.transform =
              'translate(' + x + 'px, ' + y + 'px)'

      // update the posiion attributes
      target.setAttribute('data-x', x)
      target.setAttribute('data-y', y)
    }

    interact('.dropzone').dropzone({
      // only accept elements matching this CSS selector
      // Require a 75% element overlap for a drop to be possible
      overlap: 0.5,

      // listen for drop related events:


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
          draggableElement.textContent = 'Dragged in'
        },
        ondragleave: function (event) {
          console.log('C')

          // remove the drop feedback style
          event.target.classList.remove('drop-target')
          event.relatedTarget.classList.remove('can-drop')
          event.relatedTarget.textContent = 'Dragged out'
        },
        ondrop: function (event) {
          console.log('D')
          console.log('DROPPED')
          event.relatedTarget.textContent = 'Dropped'
        },
        ondropdeactivate: function (event) {
          console.log('E')
          // remove active dropzone feedback
          event.target.classList.remove('drop-active')
          event.target.classList.remove('drop-target')
        }
      })

    interact('.drag-drop')
        .draggable({
          inertia: false,
          modifiers: [
          ],
          autoScroll: false,
          // dragMoveListener from the dragging demo above
          listeners: { move: dragMoveListener }
        })
    console.log("droppable inti");
  },
  /* eslint-disable */
  methods: {
    start: function (evt) {
      console.log("start");
      this.elementSelected = true;
      this.selectedElement = evt.currentTarget;
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
      // TODO: https://shopify.github.io/draggable/examples/unique-dropzone.html use this or this: https://bevacqua.github.io/dragula/
      //
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

.drag-item {
  width: 100%;
  height: 100%;
}

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
