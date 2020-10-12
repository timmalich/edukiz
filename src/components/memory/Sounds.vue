<script>
export default {
  name: "Sounds",
  playSound: function (src) {
    new Audio(src).play().then();
  },
  playError: function () {
    this.playSound("sounds/error1.mp3");
  },
  playSuccess: function () {
    this.playSound("sounds/success1.mp3");
  },
  playBigSuccess: function () {
    this.playSound("sounds/big_success1.mp3");
  },
}
</script>
