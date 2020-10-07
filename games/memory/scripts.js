const cards = document.querySelectorAll(".memory-card");

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let solvedCards = 0;

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flip");

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  if (isMatch()) {
    disableCards();
    solvedCards++;
    if (isAllSolved()) {
      playSound("../../sounds/big_success1.mp3");
    } else {
      playSound("../../sounds/success1.mp3");
    }
  } else {
    playSound("../../sounds/error1.mp3");
    unflipCards();
  }
}

function isAllSolved() {
  return cards.length / 2 === solvedCards;
}

function isMatch() {
  return firstCard.dataset.framework === secondCard.dataset.framework;
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");

    resetBoard();
  }, 1000);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

(function shuffle() {
  cards.forEach((card) => {
    card.style.order = Math.floor(Math.random() * 12);
  });
})();

cards.forEach((card) => card.addEventListener("click", flipCard));

function playSound(src) {
  new Audio(src).play().then();
}
