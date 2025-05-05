import { Voice } from "@/models/Voice";

const savedVoice = JSON.parse(localStorage.getItem("selectedVoice"));
const voices = {
  boy0: new Voice("boy0", "Boy Voice"),
  girl0: new Voice("girl0", "Girl Voice"),
};
const randomVoice =
  voices[
    Object.keys(voices)[Math.floor(Math.random() * Object.keys(voices).length)]
  ];

export const SoundUtils = {
  voices: voices,
  selectedVoice: savedVoice ? voices[savedVoice.id] : randomVoice,
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
    let errors = [
      "error1",
      /*"error2" too "strong" as default*,*/ "error3",
      "error4",
    ];
    let randomError = errors[Math.floor(Math.random() * errors.length)];
    return this.playSound(randomError);
  },
  playSuccess: function () {
    let successes = [
      "success1",
      "success2",
      "success3",
      "success4",
      "success5",
    ];
    let randomSuccess = successes[Math.floor(Math.random() * successes.length)];
    return this.playSound(randomSuccess);
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
  play: function (src) {
    // helper function to handle exception, to avoid crashing if the user of the new SoundLib tries to play a sound that is not properly setup.
    if (!src) {
      console.error(
        "No sound source provided, check if the input was extracted from SoundLib correctly."
      );
      return;
    }
    try {
      src.play();
    } catch (e) {
      console.error("Error playing sound: " + src, e);
    }
  },
  setVoice(voice) {
    this.selectedVoice = voice;
    localStorage.setItem("selectedVoice", JSON.stringify(voice));
  },
  useBoy0Voice() {
    this.setVoice(this.voices.boy0);
  },
  useGirl0Voice() {
    this.setVoice(this.voices.girl0);
  },
};

class Sound {
  constructor(group, id) {
    this.group = group;
    this.id = id;
  }

  play() {
    let path = this.id ? this.group + "/" + this.id : this.group;
    SoundUtils.playSound(path);
  }
}

class KidSound extends Sound {
  constructor(group, id) {
    super(group, id);
    let language = "de/";
    SoundUtils.preload(language + this.group + "/boy0/" + this.id);
    SoundUtils.preload(language + this.group + "/girl0/" + this.id);
  }

  play() {
    let language = "de/";
    let path =
      language + this.group + "/" + SoundUtils.selectedVoice.id + "/" + this.id;
    SoundUtils.playSound(path);
  }
}

class DadSound extends Sound {
  constructor(group, id) {
    super(group, id);
    let language = "de/";
    SoundUtils.preload(language + this.group + "/dad/" + this.id);
  }

  play() {
    let language = "de/";
    let path = language + this.group + "/dad/" + this.id;
    SoundUtils.playSound(path);
  }
}

export const SoundLib = {
  // letters
  a: new KidSound("characters", "a"),
  b: new KidSound("characters", "b"),
  c: new KidSound("characters", "c"),
  d: new KidSound("characters", "d"),
  e: new KidSound("characters", "e"),
  f: new KidSound("characters", "f"),
  g: new KidSound("characters", "g"),
  h: new KidSound("characters", "h"),
  i: new KidSound("characters", "i"),
  j: new KidSound("characters", "j"),
  k: new KidSound("characters", "k"),
  l: new KidSound("characters", "l"),
  m: new KidSound("characters", "m"),
  n: new KidSound("characters", "n"),
  o: new KidSound("characters", "o"),
  p: new KidSound("characters", "p"),
  q: new KidSound("characters", "q"),
  r: new KidSound("characters", "r"),
  s: new KidSound("characters", "s"),
  t: new KidSound("characters", "t"),
  u: new KidSound("characters", "u"),
  v: new KidSound("characters", "v"),
  w: new KidSound("characters", "w"),
  x: new KidSound("characters", "x"),
  y: new KidSound("characters", "y"),
  z: new KidSound("characters", "z"),
  // numbers
  0: new KidSound("characters", "0"),
  1: new KidSound("characters", "1"),
  2: new KidSound("characters", "2"),
  3: new KidSound("characters", "3"),
  4: new KidSound("characters", "4"),
  5: new KidSound("characters", "5"),
  6: new KidSound("characters", "6"),
  7: new KidSound("characters", "7"),
  8: new KidSound("characters", "8"),
  9: new KidSound("characters", "9"),
  10: new KidSound("characters", "10"),
  11: new KidSound("characters", "11"),
  12: new KidSound("characters", "12"),
  13: new KidSound("characters", "13"),
  14: new KidSound("characters", "14"),
  15: new KidSound("characters", "15"),
  16: new KidSound("characters", "16"),
  17: new KidSound("characters", "17"),
  18: new KidSound("characters", "18"),
  19: new KidSound("characters", "19"),
  20: new KidSound("characters", "20"),
  // kiz sounds
  ambulance: new KidSound("words", "ambulance"),
  bunny: new KidSound("words", "bunny"),
  butterfly: new KidSound("words", "butterfly"),
  car: new KidSound("words", "car"),
  cat: new KidSound("words", "cat"),
  chicken: new KidSound("words", "chicken"),
  christmasTree: new KidSound("words", "christmas_tree"),
  dino: new KidSound("words", "dino"),
  dog: new KidSound("words", "dog"),
  dragon: new KidSound("words", "dragon"),
  fireDepartment: new KidSound("words", "fire_department"),
  fireEngine: new KidSound("words", "fire_engine"),
  fish: new KidSound("words", "fish"),
  frog: new KidSound("words", "frog"),
  goat: new KidSound("words", "goat"),
  hi: new KidSound("words", "hi"),
  laugh1: new KidSound("words", "laugh1"),
  laugh2: new KidSound("words", "laugh2"),
  laugh3: new KidSound("words", "laugh3"),
  ninja: new KidSound("words", "ninja"),
  owl: new KidSound("words", "owl"),
  penguin: new KidSound("words", "penguin"),
  police: new KidSound("words", "police"),
  rainbow: new KidSound("words", "rainbow"),
  rainbowFish: new KidSound("words", "rainbow_fish"),
  santa: new KidSound("words", "santa"),
  snail: new KidSound("words", "snail"),
  snowman: new KidSound("words", "snowman"),
  tractor: new KidSound("words", "tractor"),
  tree: new KidSound("words", "tree"),
  unicorn: new KidSound("words", "unicorn"),
  // dad sounds
  dad_dragon: new DadSound("words", "drache"),
  // general
  success1: new Sound("success1"),
};
