<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ $t("Practice") }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ $t("Practice") }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-grid class="ion-no-padding" v-if="id">
        <ion-row>
          <ion-col>
            <ion-progress-bar
              :value="progress[0]"
              color="danger"
            ></ion-progress-bar>
          </ion-col>
          <ion-col>
            <ion-progress-bar
              :value="progress[1]"
              color="warning"
            ></ion-progress-bar>
          </ion-col>
          <ion-col>
            <ion-progress-bar
              :value="progress[2]"
              color="tertiary"
            ></ion-progress-bar>
          </ion-col>
          <ion-col>
            <ion-progress-bar
              :value="progress[3]"
              color="secondary"
            ></ion-progress-bar>
          </ion-col>
          <ion-col>
            <ion-progress-bar
              :value="progress[4]"
              color="success"
            ></ion-progress-bar>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-card>
        <ion-card-content>
          <LetterSort
            :key="currentWord.id + Math.random()"
            :word="currentWord.native"
            :solution="currentWord.foreign"
            @correct="giveAnswer(true)"
            @wrong="giveAnswer(false)"
          />
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
  IonCardContent,
  IonProgressBar,
  IonGrid,
  IonRow,
  IonCol,
  useIonRouter,
} from "@ionic/vue";
import LetterSort from "@/components/Modes/LetterSort.vue";
import { Vocable } from "@/data/vocable";
import { useRoute } from "vue-router";
import { answerWord, getLearningProgress, getNextWord } from "@/data/learning";

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
    IonCardContent,
    IonProgressBar,
    IonGrid,
    IonRow,
    IonCol,
  },
  setup() {
    const ionRouter = useIonRouter();

    const route = useRoute();
    const id = route.params.id as string;
    return { ionRouter, id };
  },
  data() {
    return {
      progress: [0, 0, 0, 0, 0],
      currentWord: {
        id: "",
        native: "",
        foreign: "",
      } as Vocable,
    };
  },
  async mounted() {
    this.currentWord = await getNextWord(this.id);
    this.progress = await getLearningProgress(this.id);
  },
  methods: {
    async giveAnswer(correct: boolean) {
      await answerWord(this.id, this.currentWord.id, correct);
      this.currentWord = await getNextWord(this.id);
      this.progress = await getLearningProgress(this.id);
    },
  },
});
</script>
