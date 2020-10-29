<script>
export default {
  name: "Sounds",
  error: new Audio("sounds/error1.mp3"),
  success: new Audio("sounds/success1.mp3"),
  bigSuccess: new Audio("sounds/big_success1.mp3"),
  playSound: function (src) {
    new Audio("sounds/" + src).play().then();
  },
  playError: function () {
    this.error.play();
  },
  playSuccess: function () {
    this.success.play();
  },
  playBigSuccess: function () {
    this.bigSuccess.play();
  },
}
</script>
