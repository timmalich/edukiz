import { SoundUtils } from './SoundUtils.js';
import { ImageUtils } from './ImageUtils.js';

export const CharacterUtils = {
  createConfig: function (character) {
    return {
      character: character,
      sound: SoundUtils.getCharacterPath(character),
      image: ImageUtils.getCharacterImagePath(character),
    };
  },
};
