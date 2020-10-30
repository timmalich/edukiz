export const arrayUtils = {
  methods: {
    shuffleArray: function (array, cloneArray) {
      let outputArray;
      if(cloneArray){
        outputArray = new Array(array.length);
      }else{
        outputArray = array;
      }
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [outputArray[i], outputArray[j]] = [array[j], array[i]];
      }
      return outputArray;
    },
  }
}
