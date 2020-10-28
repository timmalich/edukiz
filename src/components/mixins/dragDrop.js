import interact from '@interactjs/interactjs'

export const dragDrop = {
  data() {
    return {};
  },
  methods: {
    // should be called after component is rendered
    initDragDrop: function () {
      interact('.dropzone').dropzone({
        overlap: 0.2,
        ondropactivate: function () {},
        ondropdeactivate: function () {},
        ondropmove: function () {},
        ondragenter: function (event) {
          let dropzoneElement = event.target
          dropzoneElement.classList.add('drop-target-active');
          dropzoneElement.classList.remove('empty-droppable-element');
        },
        ondragleave: function (event) {
          let dropzoneElement = event.target
          dropzoneElement.classList.add('empty-droppable-element');
          dropzoneElement.classList.remove('drop-target-active');
        },
        ondrop: function (event) {
          if(typeof this.ondrop === "function"){
            this.ondrop(event);
          }
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
            },
            end: function (event){
              let dragElement = event.target
              dragElement.style.webkitTransform =
                dragElement.style.transform = '';
              dragElement.setAttribute('data-x', 0)
              dragElement.setAttribute('data-y', 0)
            }
          }
        })
    },
  }
}
