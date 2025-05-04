<template>
  <Game
    nav-back-path="/misc"
    :explanation="explanation"
    @restart="restart"
    @previous="deleteCharacter"
    @next="writeSpace"
  >
    <div class="upper-section">
      <textarea class="textarea" v-model="inputText"></textarea>
    </div>
    <div class="middle-section">
      <div class="syn-settings">
        <div class="syn-setting">
          <em class="fas fa-comment-dots syn-setting-icon"></em>
          <select v-model="selectedVoice" class="syn-setting-input">
            <option
              v-for="voice in voices"
              :key="voice.voiceURI"
              :value="voice"
            >
              {{ voice.lang }} {{ voice.name }}
            </option>
          </select>
        </div>
        <div class="syn-setting">
          <em class="fas fa-arrows-alt-v syn-setting-icon"></em>
          <input
            v-model="pitch"
            type="range"
            id="pitch"
            name="pitch"
            min="0"
            max="200"
            class="syn-setting-input"
          />
        </div>
        <div class="syn-setting">
          <em class="fas fa-tachometer-alt syn-setting-icon"></em>
          <input
            v-model="rate"
            type="range"
            id="rate"
            name="rate"
            min="0"
            max="1000"
            class="syn-setting-input"
          />
        </div>
        <div class="syn-setting">
          <em class="fas fa-volume-down syn-setting-icon"></em>
          <input
            v-model="volume"
            type="range"
            id="volume"
            name="volume"
            min="0"
            max="100"
            class="syn-setting-input"
          />
        </div>
      </div>
      <div class="syn-actions">
        <div @click="speak" class="game-button play-button">
          <em style="font-size: 1.8rem" class="fas fa-headphones"></em>
          <em class="fas fa-play-circle" style="font-size: 1rem"></em>
        </div>
        <div class="syn-actions-lower">
          <div @click="clearInput" class="game-button syn-actions-lower-button">
            <em style="font-size: 1.8rem" class="fas fa-trash"></em>
          </div>
          <div @click="pause" class="game-button syn-actions-lower-button">
            <em style="font-size: 1.8rem" class="fas fa-stop"></em>
          </div>
        </div>
      </div>
    </div>
    <div class="lower-section" v-bind:style="gridContainer">
      <ImageContainer
        v-for="charConfig in characterConfigs"
        :key="charConfig.character"
        :data-identifier="charConfig.character"
        :src="charConfig.image"
        class="draggable-element"
        @click="writeCharacter(charConfig, $event)"
      ></ImageContainer>
    </div>
  </Game>
</template>

<script>
import Game from "../Game";
import ImageContainer from "../ImageContainer";
import { characterConfigs } from "../mixins/characterConfigs";
import { SoundUtils } from "../utils/SoundUtils";

let dummyText =
  "Schreib mir etwas und ich lese es dir vor. Hier ist ein Beispiel:\n" +
  "Leb deinen Traum, denn er wird wahr.\n" +
  "Geh deinen Weg, stelle dich der Gefahr.\n" +
  "Alles was wichtig ist, wirst du erkennen, wenn die Zeit gekommen ist.\n" +
  "Ja! Greif nach den Sternen, du bist bereit.\n" +
  "Glaub an dich, bald ist es soweit.\n" +
  "Wir werden bei dir sein. Sei bereit.";

export default {
  name: "TextToSpeech",
  components: {
    ImageContainer,
    Game,
  },
  mixins: [characterConfigs],
  data() {
    return {
      inputText: dummyText,
      explanation: "t2s",
      speech: new SpeechSynthesisUtterance(),
      voices: window.speechSynthesis.getVoices(),
      selectedVoice: undefined,
      pitch: 100, // to have nice slider well convert this value later divided by 100 to a float. def=1, min=0.0, max=2.0
      rate: 100, // to have nice slider well convert this value later divided by 100 to a float. def=1, min=0.1, max=10
      volume: 100, // to have nice slider well convert this value later divided by 100 to a float. def1, min=0.0, max=1.0
    };
  },
  created: function () {
    SoundUtils.playExplanation(this.explanation);
    this.speech.lang = "de";
    if (this.voices) {
      let orderedVoices = [];
      for (const voice of this.voices) {
        if (voice.lang.toLowerCase().startsWith("de")) {
          orderedVoices.unshift(voice);
        } else {
          orderedVoices.push(voice);
        }
      }
      this.voices = orderedVoices;
      this.selectedVoice = this.voices[0];
    } else {
      console.error(
        "No voices. Good luck. Most likely the browser doesn't support this."
      );
    }
  },
  unmounted: function () {
    SoundUtils.stopAll();
  },
  computed: {
    gridContainer: function () {
      let maxElementsInRow = 7; // TODO Add more keys (shift, dot, comma, +, -) and set to 10
      return {
        "grid-template-columns":
          "repeat(" + maxElementsInRow + ", minmax(20pt, 1fr))",
        display: "grid",
        "grid-gap": "7pt",
      };
    },
  },
  methods: {
    restart: function () {
      this.speech.text = "";
      this.inputText = dummyText;
    },
    clearInput: function () {
      this.inputText = "";
      this.speech.text = "";
    },
    writeCharacter: function (charConfig) {
      if (charConfig) {
        this.inputText += charConfig.character.toLowerCase();
        SoundUtils.play(charConfig.sound);
      } else {
        this.inputText += "⚠";
      }
    },
    deleteCharacter: function () {
      this.inputText = this.inputText.slice(0, -1);
    },
    writeSpace: function () {
      this.inputText += " ";
    },
    speak: function () {
      SoundUtils.stopAll();

      window.speechSynthesis.cancel();
      this.speech.text = this.inputText;
      if (this.selectedVoice) {
        this.speech.voice = this.selectedVoice;
      }
      if (this.pitch >= 0 && this.pitch <= 200) {
        this.speech.pitch = this.pitch / 100;
      }
      if (this.rate >= 0 && this.rate <= 1000) {
        if (this.rate <= 0.1) {
          this.rate = 0.1;
        }
        this.speech.rate = this.rate / 100;
      }
      if (this.volume >= 0 && this.volume <= 100) {
        this.speech.volume = this.volume / 100;
      }
      window.speechSynthesis.speak(this.speech);
    },
    pause: function () {
      // since window.speechSynthesis.pause() is currently working on many devices we'll just implement a cancel
      window.speechSynthesis.cancel();
    },
  },
};
</script>

<style scoped lang="scss">
.textarea {
  font-family: "Comic Sans MS", "sans-serif";
  border-radius: 5pt;
  resize: none;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  margin-top: 15pt;
  width: 100%;
  height: 90%;
}

.play-button {
  width: 100%;
  height: 50%;
  margin-bottom: 5pt;
}

.syn-settings {
  width: 70%;
  max-width: 70%;
  padding-top: 5pt;
}

.syn-setting {
  width: 100%;
  display: flex;
}

.syn-setting-icon {
  width: 20pt;
  font-size: 1.2rem;
  color: #ffffff;
}

.syn-setting-input {
  height: 18%; // hack to vertical align the settings a bit nicer
  width: 80%;
  background-color: #4385f482;
  border-color: #4385f482;
  color: #ffffff;
}

.syn-actions {
  height: 93%;
  width: 30%;
  padding-left: 10pt;
  padding-top: 5pt;
}

.syn-actions-lower {
  display: flex;
  width: 100%;
  height: 35%;
}

.syn-actions-lower-button {
  width: 45%;
  height: 100%;
  margin-bottom: 5pt;
  margin-left: 5pt;
  margin-right: 5pt;
}

.middle-section {
  height: 20%;
  max-height: 20%;
  display: flex;
}

.upper-section,
.lower-section {
  width: 100%;
  height: 45%;
  max-height: 45%;
  justify-items: center;
  align-items: center;
  position: relative;
}

.upper-section {
  height: 35%;
}

.draggable-element {
  background-color: transparent;
}
</style>
