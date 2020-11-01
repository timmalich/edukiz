import interact from '@interactjs/interactjs'

export const dragDrop = {
  destroyed() {
    interact('.dropzone').unset();
    interact('.draggable-element').unset();
  },
  methods: {
    resetDragAndDropSuccessions: function(){
      for (let dropzoneElement of document.getElementsByClassName('dropzone')) {
        this.resetSuccessionDropMark(dropzoneElement);
      }
      for (let dragElement of document.getElementsByClassName('draggable-element')) {
        this.resetSuccessionDragMark(dragElement);
      }
    },
    markSuccess : function(dropzoneElement, dragElement){
      dropzoneElement.classList.add('drop-success');
      dropzoneElement.classList.remove('empty-droppable-element');
      dragElement.classList.add('drag-success');
    },
    resetSuccessionDropMark : function(element){
      element.classList.remove('drop-success');
      element.classList.add('empty-droppable-element');
    },
    resetSuccessionDragMark: function(element){
      element.classList.remove('drag-success');
    },
    initDragDrop: function (lockDropzoneSuccessfulAfterDrag) {
      function isDropzoneLocked(dropzoneElement){
        if(lockDropzoneSuccessfulAfterDrag){
          return dropzoneElement.classList.contains('drop-success');
        }
        return false;
      }
      interact('.dropzone').dropzone({
        overlap: 0.5,
        ondropactivate: function () {},
        ondropdeactivate: function () {},
        ondropmove: function () {},
        ondragenter: function (event) {
          let dropzoneElement = event.target
          if(!isDropzoneLocked(dropzoneElement)){
            dropzoneElement.classList.add('drop-target-active');
            dropzoneElement.classList.remove('empty-droppable-element');
          }
        },
        ondragleave: function (event) {
          let dropzoneElement = event.target
          if(!isDropzoneLocked(dropzoneElement)){
            dropzoneElement.classList.add('empty-droppable-element');
            dropzoneElement.classList.remove('drop-target-active');
          }
        },
        ondrop: function (event) {
          let dropzoneElement = event.target;
          if(!isDropzoneLocked(dropzoneElement)){
            dropzoneElement.classList.add('empty-droppable-element');
            dropzoneElement.classList.remove('drop-target-active');

            let dragElement = event.relatedTarget;
            if(typeof this.ondrop === "function"){
              if(this.ondrop(event)){
                this.markSuccess(dropzoneElement, dragElement);
              }
            }else{
              this.markSuccess(dropzoneElement, dragElement);
            }
          }
        }.bind(this)
      })

      interact('.draggable-element')
        .draggable({
          inertia: false,
          modifiers: [],
          autoScroll: false,
          listeners: {
            start: function (event){
              if(typeof this.ondragstart === "function"){
                this.ondragstart(event);
              }
            }.bind(this),
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
