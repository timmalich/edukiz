<template>
  <div>
    <section class="memory-game">
      <div class="memory-card" data-framework="cat" v-on:click="flipCard">
        <img class="front-face" src="img/cat1.svg" alt="cat" />
        <img
          class="back-face"
          src="img/cat_wallpaper.svg"
          alt="back face"
        />
      </div>
      <div class="memory-card" data-framework="cat" v-on:click="flipCard">
        <img class="front-face" src="img/cat1.svg" alt="cat" />
        <img
          class="back-face"
          src="img/cat_wallpaper.svg"
          alt="back face"
        />
      </div>

      <div class="memory-card" data-framework="chicken" v-on:click="flipCard">
        <img class="front-face" src="img/chicken1.svg" alt="Aurelia" />
        <img
          class="back-face"
          src="img/cat_wallpaper.svg"
          alt="back face"
        />
      </div>
      <div class="memory-card" data-framework="chicken" v-on:click="flipCard">
        <img class="front-face" src="img/chicken1.svg" alt="Aurelia" />
        <img
          class="back-face"
          src="img/cat_wallpaper.svg"
          alt="back face"
        />
      </div>

      <div class="memory-card" data-framework="dino" v-on:click="flipCard">
        <img class="front-face" src="img/dino1.svg" alt="dino" />
        <img
          class="back-face"
          src="img/cat_wallpaper.svg"
          alt="back face"
        />
      </div>
      <div class="memory-card" data-framework="dino" v-on:click="flipCard">
        <img class="front-face" src="img/dino1.svg" alt="dino" />
        <img
          class="back-face"
          src="img/cat_wallpaper.svg"
          alt="back face"
        />
      </div>

      <div class="memory-card" data-framework="dog" v-on:click="flipCard">
        <img class="front-face" src="img/dog1.svg" alt="dog" />
        <img
          class="back-face"
          src="img/cat_wallpaper.svg"
          alt="back face"
        />
      </div>
      <div class="memory-card" data-framework="dog" v-on:click="flipCard">
        <img class="front-face" src="img/dog1.svg" alt="dog" />
        <img
          class="back-face"
          src="img/cat_wallpaper.svg"
          alt="back face"
        />
      </div>

      <div class="memory-card" data-framework="rabbit" v-on:click="flipCard">
        <img class="front-face" src="img/rabbit1.svg" alt="rabbit" />
        <img
          class="back-face"
          src="img/cat_wallpaper.svg"
          alt="back face"
        />
      </div>
      <div class="memory-card" data-framework="rabbit" v-on:click="flipCard">
        <img class="front-face" src="img/rabbit1.svg" alt="rabbit" />
        <img
          class="back-face"
          src="img/cat_wallpaper.svg"
          alt="back face"
        />
      </div>

      <div class="memory-card" data-framework="unicorn" v-on:click="flipCard">
        <img class="front-face" src="img/unicorn1.svg" alt="unicorn" />
        <img
          class="back-face"
          src="img/cat_wallpaper.svg"
          alt="back face"
        />
      </div>
      <div class="memory-card" data-framework="unicorn" v-on:click="flipCard">
        <img class="front-face" src="img/unicorn1.svg" alt="unicorn" />
        <img
          class="back-face"
          src="img/cat_wallpaper.svg"
          alt="back face"
        />
      </div>
    </section>
  </div>
</template>

<script>
import Sounds from "./Sounds";

export default {
  name: "MemoryAnimals",
  data() {
    return {
      cards: {},
      firstCard: {},
      secondCard: {},
      hasFlippedCard: false,
      lockBoard: false,
      solvedCards: 0,
    };
  },
  mounted: function () {
    //debugger; // eslint-disable-line
    this.cards = document.querySelectorAll(".memory-card");
    this.shuffle();
  },
  methods: {
    shuffle: function () {
      this.cards.forEach((card) => {
        card.style.order = Math.floor(Math.random() * 12);
      });
    },
    flipCard: function (event) {
      let currentCard = event.target.parentElement;

      if (this.lockBoard) return;
      if (currentCard === this.firstCard) return;

      currentCard.classList.add("flip");

      if (!this.hasFlippedCard) {
        this.hasFlippedCard = true;
        this.firstCard = currentCard;
        return;
      }

      this.secondCard = currentCard;
      if (this.isMatch()) {
        this.disableCards();
        this.solvedCards += 2;
        if (this.isAllSolved()) {
          Sounds.playBigSuccess();
        } else {
          Sounds.playSuccess();
        }
      } else {
        Sounds.playError();
        this.unflipCards();
      }
    },
    unflipCards: function () {
      this.lockBoard = true;

      setTimeout(() => {
        this.firstCard.classList.remove("flip");
        this.secondCard.classList.remove("flip");

        this.resetBoard();
      }, 1000);
    },
    disableCards: function () {
      this.firstCard.removeEventListener("click", this.flipCard);
      this.secondCard.removeEventListener("click", this.flipCard);
      this.resetBoard();
    },
    isMatch: function () {
      return (
        this.firstCard.dataset.framework === this.secondCard.dataset.framework
      );
    },
    isAllSolved: function () {
      return 12 === this.solvedCards;
    },
    resetBoard: function () {
      [this.hasFlippedCard, this.lockBoard] = [false, false];
      [this.firstCard, this.secondCard] = [null, null];
    },
  },
};
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.memory-game {
  height: 380pt;
  width: 260pt;
  margin: auto;
  display: flex;
  flex-wrap: wrap;
}

.memory-card {
  width: 70pt;
  height: 100pt;
  margin: 3pt;
  position: relative;
  transform: scale(1);
  transform-style: preserve-3d;
  transition: transform 0.5s;
}

.memory-card:active {
  transform: scale(0.97);
  transition: transform 0.2s;
}

.memory-card.flip {
  transform: rotateY(180deg);
}

.front-face,
.back-face {
  width: 100%;
  height: 100%;
  padding: 0;
  position: absolute;
  border-radius: 15pt;
  background: #9ec9ec;
  backface-visibility: hidden;
}

.back-face {
  object-fit: cover;
}

.front-face {
  transform: rotateY(180deg);
}
</style>
