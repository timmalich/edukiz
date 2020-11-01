export const SoundUtils = {
  error: new Audio("sounds/error1.mp3"),
  success: new Audio("sounds/success1.mp3"),
  bigSuccess: new Audio("sounds/big_success1.mp3"),
  preloaded: {},
  preload: function (src) {
    this.preloaded[src] = new Audio("sounds/" + src + '.mp3');
  },
  audios: [],
  stopAll: function (){
    let audio;
    while ((audio = this.audios.pop())){
      audio.pause();
      audio.currentTime = 0;
    }
  },
  playSoundsInRow: function (srcArray){
    let src = srcArray.shift();
    let audio = new Audio('sounds/' + src + '.mp3');
    this.audios.push(audio);
    if(srcArray.length > 0){
      audio.addEventListener('ended', this.playSoundsInRow.bind(this, srcArray));
    }
    audio.play();
    return audio
  },
  playSound: function (src) {
    if (this.preloaded[src]) {
      this.preloaded[src].play();
      return this.preloaded[src];
    } else {
      let audio = new Audio("sounds/" + src);
      this.audios.push(audio);
      audio.play();
      return audio;
    }
  },
  playError: function () {
    this.error.play();
    return this.error;
  },
  playSuccess: function (timeout) {
    if (timeout) {
      setTimeout(function () {
        this.success.play()
      }.bind(this), timeout);
    } else {
      this.success.play();
    }
  },
  playBigSuccess: function (timeout) {
    if (timeout) {
      setTimeout(function () {
        this.bigSuccess.play()
      }.bind(this), timeout);
    } else {
      this.bigSuccess.play();
    }
  },
  playCharacter: function(character){
    return this.playSound(this.getCharacterPath(character));
  },
  getCharacterPath: function(character){
    return 'de/characters/' + character.toLowerCase() + '.mp3';
  },
  playExplanation: function (file){
    return this.playSound('de/explanations/' + file + '.mp3');
  }
}
