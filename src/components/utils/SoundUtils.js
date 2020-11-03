export const SoundUtils = {
  audios: [],
  preload: function (src) {
    this.audios[src] = new Audio("sounds/" + src + '.mp3');
  },
  stopAll: function () {
    for (let src in this.audios) {
      this.audios[src].pause();
      this.audios[src].currentTime = 0;
    }
  },
  getFromCache: function(src){
    let audio = this.audios[src];
    if(audio && audio.readyState){
      return audio;
    }
  },
  playSoundsInRow: function (srcArray) {
    let src = srcArray.shift();
    if (srcArray.length > 0) {
      return this.playSound(src).addEventListener('ended', this.playSoundsInRow.bind(this, srcArray), {once: true});
    }
    return this.playSound(src);
  },
  playSound: function (src) {
    let audio = this.getFromCache(src);
    if (!audio) {
      audio = new Audio("sounds/" + src + '.mp3');
      this.audios[src] = audio;
    }
    audio.play();
    return audio;
  },
  playError: function () {
    return this.playSound("error1");
  },
  playSuccess: function () {
    return this.playSound("success1.mp3")
  },
  playBigSuccess: function () {
    return this.playSound("big_success1.mp3")
  },
  playCharacter: function (character) {
    return this.playSound(this.getCharacterPath(character));
  },
  getCharacterPath: function (character) {
    return 'de/characters/' + character.toLowerCase();
  },
  playExplanation: function (file) {
    return this.playSound('de/explanations/' + file);
  }
}
