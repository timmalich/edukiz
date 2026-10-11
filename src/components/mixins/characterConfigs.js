import { ImageUtils } from '../utils/ImageUtils.js';
import { SoundLib } from '../utils/SoundUtils.js';

export const characterConfigs = {
  data() {
    let possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVXYZ0123456789'.split('');
    let characterConfigs = [];
    for (let character of possibleCharacters) {
      characterConfigs.push({
        character: character,
        image: ImageUtils.getCharacterImagePath(character),
        sound: SoundLib[character.toLowerCase()],
      });
    }
    return {
      characterConfigs: characterConfigs,
    };
  },
};
