<template>
  <MemoryGame :possible-card-configs="possibleCardConfigs"></MemoryGame>
</template>

<script>
import MemoryGame from './MemoryGame.vue';

export default {
  name: "MemoryCharacters",
  components: {
    MemoryGame
  },
  data() {
    let possibleCardConfigs = [];
    let add = function (img, sound, filetype){
      possibleCardConfigs.push({
        frontFace: "img/" + img + "." + (filetype ? filetype : "svg"),
        sound: "de/words/" + sound + ".mp3",
      })
    }
    add("ambulance1", "krankenwagen");
    add("bird1", "eule");
    add("bird2", "eule");
    add("butterfly", "schmetterling");
    add("car1", "auto");
    add("car2", "auto");
    add("cat1", "katze", "png");
    add("chicken1", "huhn");
    add("christmas_tree1", "weihnachtsbaum");
    add("christmas_tree2","weihnachtsbaum");
    add("dino1", "dino");
    add("dino2", "dino");
    add("dog1", "hund");
    add("dragon1", "dad/drache");
    add("dragon2", "dad/drache");
    add("dragon3", "dad/drache");
    add("dragon4", "dad/drache", "png");
    add("dragon5", "dad/drache");
    add("dragon6", "dad/drache");
    add("dragon7", "dad/drache");
    add("dragon8", "dad/drache", "png");
    add("dragon9", "dad/drache");
    add("dragon1", "dad/drache");
    add("fire_truck1", "feuerwehr");
    add("fire_truck2", "feuerwehrauto");
    add("fish1", "fisch");
    add("fish2", "fisch");
    add("fish3", "fisch");
    add("fish4", "regenbogenfisch");
    add("fish5", "fisch");
    add("fish6", "fisch");
    add("fish7", "fisch");
    add("fish8", "fisch");
    add("frog1", "frosch");
    add("frog2", "frosch");
    add("goat1", "ziege");
    add("goat2", "ziege");
    add("ninja1", "ninja");
    add("penguin1", "pinguin");
    add("penguin2", "pinguin");
    add("penguin3", "pinguin");
    add("penguin5", "pinguin");
    add("penguin6", "pinguin");
    add("penguin7", "pinguin");
    add("penguin8", "pinguin");
    add("penguin9", "pinguin");
    add("penguin10", "pinguin");
    add("penguin11", "pinguin");
    add("penguin12", "pinguin");
    add("penguin13", "pinguin");
    add("penguin14", "pinguin");
    add("penguin15", "pinguin");
    add("police_car", "polizei");
    add("rabbit1", "hase");
    add("rainbow1", "regenbogen");
    add("santa1", "weihnachtsmann");
    add("snail1", "schnecke");
    add("snail2", "schnecke");
    add("snail3", "schnecke");
    add("snowman1", "schneemann");
    add("tractor1", "traktor");
    add("tractor2", "traktor");
    add("tree1", "baum");
    add("unicorn1", "einhorn");
    add("unicorn2","einhorn");
    return {
      possibleCardConfigs: possibleCardConfigs
    }
  }
}

</script>
