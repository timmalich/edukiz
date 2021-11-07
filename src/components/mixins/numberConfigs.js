import {ImageUtils} from '../utils/ImageUtils'

export const numberConfigs = {
  data() {
    let possibleNumbers = "0123456789".split('');
    let numberConfigs = [];
    for (let number of possibleNumbers) {
      numberConfigs.push({
        number: parseInt(number),
        image: ImageUtils.getCharacterImagePath(number),
        sound: "de/characters/" + number,
      })
    }
    return {
      numberConfigs: numberConfigs
    }
  },
}
