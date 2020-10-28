import interact from '@interactjs/interactjs'

export const dragDrop = {
  data() {
    return {};
  },
  methods: {
    // should be called after component is rendered
    initDragDrop: function () {
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
          this.ondrop(event);
        }.bind(this)
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
    },
  }
}
