import {ImageUtils} from '../utils/ImageUtils'

export const characterConfigs = {
  data() {
    let possibleCharacters = "ABCDEFGHIJKLMNOPQRSTUVXYZ0123456789".split('');
    let characterConfigs = [];
    for (let character of possibleCharacters) {
      characterConfigs.push({
        character: character,
        image: ImageUtils.getCharacterImagePath(character),
        sound: "de/characters/" + character.toLowerCase() + ".mp3",
      })
    }
    return {
      characterConfigs: characterConfigs
    }
  },
}
