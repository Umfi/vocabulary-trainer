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
            :key="currentWord.id"
            :word="currentWord.native"
            :solution="currentWord.foreign"
            @correct="correctAnswer"
            @wrong="wrongAnswer"
          />
        </ion-card-content>
      </ion-card>

      <ion-card v-if="done">
        <ion-card-header>
          <ion-card-title>Done</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          Correct: {{ correct }} <br />
          Wrong: {{ wrong }}

          <ion-footer>
            <ion-button
              class="ion-float-end ion-margin-top ion-margin-bottom"
              fill="outline"
              @click="restart"
              >Restart</ion-button
            >
          </ion-footer>
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
import { getBox, getBoxes } from "@/data/box";

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
      const boxes = await getBoxes();
      for (let i = 0; i < boxes.length; i++) {
        const items = boxes[i].vocables;
        for (let j = 0; j < items.length; j++) {
          this.words.push(items[j]);
        }
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
    correctAnswer() {
      this.correct++;
      this.nextWord();
    },
    wrongAnswer() {
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
