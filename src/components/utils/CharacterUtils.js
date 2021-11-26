import { SoundUtils } from "./SoundUtils";
import { ImageUtils } from "./ImageUtils";

export const CharacterUtils = {
  createConfig: function (character) {
    return {
      character: character,
      sound: SoundUtils.getCharacterPath(character),
      image: ImageUtils.getCharacterImagePath(character),
    };
  },
};
