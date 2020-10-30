export const characterConfigs = {
  data() {
    let possibleCharacters = "ABCDEFGHIJKLMNOPQRSTUVXYZ0123456789".split('');
    let characterConfigs = [];
    for (let character of possibleCharacters) {
      characterConfigs.push({
        character: character,
        image: "img/characters/" + character.toUpperCase() + ".svg",
        sound: "de/characters/" + character.toLowerCase() + ".mp3",
      })
    }
    return {
      characterConfigs: characterConfigs
    }
  },
}
