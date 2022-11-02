<template>
  <div>
    <ion-item lines="none">
      <ion-label class="ion-text-center ion-padding-top">
        <h1>{{ word }}</h1>
      </ion-label>
    </ion-item>
    <ion-item>
      <ion-grid>
        <ion-row>
          <ion-col class="ion-text-center">
            <ion-button
              v-for="(letter, index) of answer"
              :key="index"
              @click="removeAnswer(letter, index)"
              color="primary"
            >
              {{ letter }}
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-item>
  </div>

  <ion-grid>
    <ion-row>
      <ion-col class="ion-text-center">
        <ion-button
          v-for="(letter, index) of letters"
          :key="index"
          @click="giveAnswer(letter, index)"
          color="light"
        >
          {{ letter }}
        </ion-button>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonLabel,
  IonItem,
} from "@ionic/vue";

export default defineComponent({
  name: "LetterSort",
  components: {
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonLabel,
    IonItem,
  },
  props: {
    word: {
      type: String,
      required: true,
    },
    solution: {
      type: String,
      required: true,
    },
    randomize: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      letters: [] as string[],
      answer: [] as string[],
    };
  },
  mounted() {
    this.letters = [...this.$props.solution];
    if (this.$props.randomize) {
      for (let i = 0; i < Math.floor(Math.random() * 6); i++) {
        this.letters.push(this.getRandomLetter());
      }
    }
    this.letters.sort(() => Math.random() - 0.5);
  },
  methods: {
    giveAnswer(letter: string, index: number) {
      this.answer.push(letter);
      this.letters.splice(index, 1);

      if (this.answer.length == this.$props.solution.length) {
        this.checkAnswer();
      }
    },
    removeAnswer(letter: string, index: number) {
      this.letters.push(letter);
      this.answer.splice(index, 1);
    },
    checkAnswer() {
      const a = this.answer.join("").toLowerCase();
      const s = this.$props.solution.toLowerCase();
      if (a === s) {
        this.$emit("correct");
      } else {
        this.$emit("wrong");
      }
    },
    getRandomLetter() {
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      return letters.charAt(Math.floor(Math.random() * letters.length));
    },
  },
});
</script>