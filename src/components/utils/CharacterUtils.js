import { ImageUtils } from './ImageUtils.js';

export const CharacterUtils = {
  createConfig: function (character) {
    return {
      character: character,
      image: ImageUtils.getCharacterImagePath(character),
    };
  },
};
