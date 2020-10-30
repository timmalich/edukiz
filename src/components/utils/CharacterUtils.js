import Sounds from "../Sounds";
import {ImageUtils} from "./ImageUtils";

export const CharacterUtils = {
  createConfig: function (character) {
    return {
      character: character,
      sound: Sounds.getCharacterPath(character),
      image: ImageUtils.getCharacterImagePath(character)
    }
  }
}
