export const SoundUtils = {
  audios: {},
  eventListeners: [],
  preload: function (src) {
    this.audios[src] = new Audio("sounds/" + src + ".mp3");
  },
  stopAll: function () {
    for (const eventListener of this.eventListeners) {
      this.audios[eventListener.src].removeEventListener(
        "ended",
        eventListener.listener
      );
    }

    for (const audio of Object.values(this.audios)) {
      audio.pause();
      audio.currentTime = 0;
    }
  },
  getFromCache: function (src) {
    let audio = this.audios[src];
    if (audio && audio.readyState) {
      return audio;
    }
  },
  playSoundsInRow: function (srcArray) {
    let src = srcArray.shift();
    this.eventListeners.shift();
    if (srcArray.length > 0) {
      let nextSound = this.playSoundsInRow.bind(this, srcArray);
      this.eventListeners.push({ src: src, listener: nextSound });
      return this.playSound(src).addEventListener("ended", nextSound, {
        once: true,
      });
    }

    return this.playSound(src);
  },
  playSound: function (src) {
    let audio = this.getFromCache(src);
    if (!audio) {
      audio = new Audio("sounds/" + src + ".mp3");
      this.audios[src] = audio;
    }
    try {
      audio.play();
    } catch (e) {
      console.error("no audio file for: sounds/" + src + ".mp3");
    }
    return audio;
  },
  playError: function () {
    return this.playSound("error1");
  },
  playSuccess: function () {
    return this.playSound("success1");
  },
  playBigSuccess: function () {
    return this.playSound("big_success1");
  },
  playCharacter: function (character) {
    return this.playSound(this.getCharacterPath(character));
  },
  getCharacterPath: function (character) {
    return "de/characters/" + character.toLowerCase();
  },
  playExplanation: function (file) {
    return this.playSound("de/explanations/" + file);
  },
};
