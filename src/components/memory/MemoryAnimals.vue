<template>
  <MemoryGame :possible-card-configs="possibleCardConfigs"></MemoryGame>
</template>

<script>
import MemoryGame from "./MemoryGame.vue";
import { SoundLib } from "../utils/SoundUtils";

export default {
  name: "MemoryCharacters",
  components: {
    MemoryGame,
  },
  data() {
    let possibleCardConfigs = [];
    let add = function (img, sound, filetype) {
      possibleCardConfigs.push({
        image: "img/" + img + "." + (filetype ? filetype : "svg"),
        sound: sound,
      });
    };
    add("ambulance1", SoundLib.ambulance);
    add("bird1", SoundLib.owl);
    add("bird2", SoundLib.owl);
    add("butterfly", SoundLib.butterfly);
    add("car1", SoundLib.car);
    add("car2", SoundLib.car);
    add("cat1", SoundLib.cat, "png");
    add("chicken1", SoundLib.chicken);
    add("christmas_tree1", SoundLib.christmasTree);
    add("christmas_tree2", SoundLib.christmasTree);
    add("dino1", SoundLib.dino);
    add("dino2", SoundLib.dino);
    add("dog1", SoundLib.dog);
    add("dragon1", SoundLib.dragon);
    add("dragon2", SoundLib.dragon);
    add("dragon3", SoundLib.dragon);
    add("dragon4", SoundLib.dragon, "png");
    add("dragon5", SoundLib.dragon);
    add("dragon6", SoundLib.dragon);
    add("dragon7", SoundLib.dragon);
    add("dragon8", SoundLib.dragon, "png");
    add("dragon9", SoundLib.dragon);
    add("dragon1", SoundLib.dragon);
    add("fire_truck1", SoundLib.fireEngine);
    add("fire_truck2", SoundLib.fireEngine);
    add("fish1", SoundLib.fish);
    add("fish2", SoundLib.fish);
    add("fish3", SoundLib.fish);
    add("fish4", SoundLib.rainbowFish);
    add("fish5", SoundLib.fish);
    add("fish6", SoundLib.fish);
    add("fish7", SoundLib.fish);
    add("fish8", SoundLib.fish);
    add("frog1", SoundLib.frog);
    add("frog2", SoundLib.frog);
    add("goat1", SoundLib.goat);
    add("goat2", SoundLib.goat);
    add("ninja1", SoundLib.ninja);
    add("penguin1", SoundLib.penguin);
    add("penguin2", SoundLib.penguin);
    add("penguin3", SoundLib.penguin);
    add("penguin5", SoundLib.penguin);
    add("penguin6", SoundLib.penguin);
    add("penguin7", SoundLib.penguin);
    add("penguin8", SoundLib.penguin);
    add("penguin9", SoundLib.penguin);
    add("penguin10", SoundLib.penguin);
    add("penguin11", SoundLib.penguin);
    add("penguin12", SoundLib.penguin);
    add("penguin13", SoundLib.penguin);
    add("penguin14", SoundLib.penguin);
    add("penguin15", SoundLib.penguin);
    add("police_car", SoundLib.police);
    add("rabbit1", SoundLib.bunny);
    add("rainbow1", SoundLib.rainbow);
    add("santa1", SoundLib.santa);
    add("snail1", SoundLib.snail);
    add("snail2", SoundLib.snail);
    add("snail3", SoundLib.snail);
    add("snowman1", SoundLib.snowman);
    add("tractor1", SoundLib.tractor);
    add("tractor2", SoundLib.tractor);
    add("tree1", SoundLib.tree);
    add("unicorn1", SoundLib.unicorn);
    add("unicorn2", SoundLib.unicorn);
    return {
      possibleCardConfigs: possibleCardConfigs,
    };
  },
};
</script>
