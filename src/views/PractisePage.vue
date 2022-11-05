<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ $t("Practice") }}</ion-title>
        <ion-progress-bar :value="progress"></ion-progress-bar>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ $t("Practice") }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-card v-if="!done">
        <ion-card-content> 
          <LetterSort
            :key="currentWord.id + Math.random()"
            :word="currentWord.native"
            :solution="currentWord.foreign"
            @correct="correctAnswer"
            @wrong="wrongAnswer"
          />
        </ion-card-content>
      </ion-card>

      <ion-card v-if="done && id" color="primary">
        <ion-card-header>
          <ion-card-title>{{ $t("Made it!") }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>

          {{ $t("You have practiced all vocables in this box.") }}
          <br>
          {{ $t("Correct") }}: {{ correct }} <br />
          {{ $t("Wrong") }}:  {{ wrong }}

          <ion-footer class="ion-margin-top">
            <ion-button
              color="light"
              class="ion-float-end ion-margin-top ion-margin-bottom"
              fill="outline"
              @click="restart"
              >{{ $t("Restart") }}</ion-button
            >
          </ion-footer>
        </ion-card-content>
      </ion-card>


      <ion-card v-if="done && !id" color="primary">
        <ion-card-header>
          <ion-card-title>{{ $t("Made it!") }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          {{ $t("You have practiced all your vocables. Come back later to practice again.") }}
        </ion-card-content>
      </ion-card>

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonProgressBar,
  IonFooter,
  IonButton,
  useIonRouter,
} from "@ionic/vue";
import LetterSort from "@/components/Modes/LetterSort.vue";
import { Vocable } from "@/data/vocable";
import { useRoute } from "vue-router";
import { getBox } from "@/data/box";
import { getDueVocables, giveAnswer } from "@/data/learning";

export default defineComponent({
  name: "PractisePage",
  components: {
    LetterSort,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonProgressBar,
    IonFooter,
    IonButton,
  },
  setup() {
    const ionRouter = useIonRouter();

    const route = useRoute();
    const id = route.params.id as string;
    return { ionRouter, id };
  },
  data() {
    return {
      words: [] as Vocable[],
      index: 0,
      activeWordId: "",
      correct: 0,
      wrong: 0,
      done: false,
    };
  },
  computed: {
    currentWord: function (): Vocable | null {
      for (let i = 0; i < this.words.length; i++) {
        if (this.words[i].id === this.activeWordId) {
          return this.words[i];
        }
      }

      return {
        id: "",
        native: "",
        foreign: "",
      } as Vocable;
    },
    progress: function (): number {
      return this.index / this.words.length;
    },
  },
  async mounted() {
    if (this.id) {
      const box = await getBox(this.id);
      if (box) {
        this.words = box.vocables;
      }
    } else {
      this.words = await getDueVocables();
      if (this.words.length === 0) {
        this.done = true;
        return;
      }
    }

    this.restart();
  },
  methods: {
    nextWord() {
      this.index++;
      if (this.index > this.words.length - 1) {
        this.done = true;
      } else {
        this.activeWordId = this.words[this.index].id;
      }
    },
    async correctAnswer() {
      if (this.id == undefined) {
        if (this.currentWord) {
          await giveAnswer(this.currentWord, true);
        }
      }

      this.correct++;
      this.nextWord();
    },
    async wrongAnswer() {
      if (this.id == undefined) {
        if (this.currentWord) {
          await giveAnswer(this.currentWord, false);
        }
      }

      this.wrong++;

      this.nextWord();
    },
    restart() {
      this.words.sort(() => Math.random() - 0.5);
      this.index = 0;
      this.activeWordId = this.words[this.index].id;
      this.correct = 0;
      this.wrong = 0;
      this.done = false;
    },
  },
});
</script>
