export const ArrayUtils = {
  shuffleArray: function (array, cloneArray) {
    let outputArray;
    if (cloneArray) {
      outputArray = new Array(array.length);
    } else {
      outputArray = array;
    }
    for (let i = array.length - 1; i > 0; i--) {
      let j = this.getRandomArrayIndex(array);
      [outputArray[i], outputArray[j]] = [array[j], array[i]];
    }
    return outputArray;
  },
  getRandomArrayIndex(array) {
    return Math.floor(Math.random() * array.length);
  },
  getRandomArrayElement(array) {
    return array[this.getRandomArrayIndex(array)];
  },
};
