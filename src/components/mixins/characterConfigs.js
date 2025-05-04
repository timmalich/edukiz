import { ImageUtils } from "../utils/ImageUtils";
import { SoundLib } from "@/components/utils/SoundUtils";

export const characterConfigs = {
  data() {
    let possibleCharacters = "ABCDEFGHIJKLMNOPQRSTUVXYZ0123456789".split("");
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
