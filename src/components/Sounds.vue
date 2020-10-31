<script>
// TODO this should be a utils or mixin
export default {
  name: "Sounds",
  error: new Audio("sounds/error1.mp3"),
  success: new Audio("sounds/success1.mp3"),
  bigSuccess: new Audio("sounds/big_success1.mp3"),
  preloaded: {},
  preload: function (src) {
    this.preloaded[src] = new Audio("sounds/" + src);
  },
  playSound: function (src) {
    if (this.preloaded[src]) {
      this.preloaded[src].play();
    } else {
      new Audio("sounds/" + src).play().then();
    }
  },
  playError: function () {
    this.error.play();
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
    this.playSound(this.getCharacterPath(character));
  },
  getCharacterPath: function(character){
    return 'de/characters/' + character.toLowerCase() + '.mp3';
  }
}
</script>
