<template>
  <div>
    <div>
      <ion-item lines="none">
        <ion-label class="ion-text-center ion-padding-top animate__animated  animate__flipInX">
          <h1 class="ion-text-wrap">{{ word }}</h1>
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
    <ion-grid class="animate__animated animate__delay-1s animate__flipInY" style="--animate-delay: 0.5s;">
      <ion-row>
        <ion-col class="ion-text-center">
          <ion-button
            v-for="(letter, index) of letters"
            :key="index"
            @click="giveAnswer(letter, index)"
            color="light"
            v-show="letter !== ' '"
          >
            {{ letter }}
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-grid>
  </div>
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
  alertController,
} from "@ionic/vue";
import { getTranslation } from "@/main";

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
  emits: ["correct", "wrong"],
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
      const solutionAsArray = [...this.$props.solution];

      if (typeof solutionAsArray[this.answer.length] !== 'undefined') {
        if (solutionAsArray[this.answer.length] === ' ') {
          this.answer.push(" ");
        }
      }

      this.answer.push(letter);
      this.letters.splice(index, 1);

      if (typeof solutionAsArray[this.answer.length] !== 'undefined') {
        if (solutionAsArray[this.answer.length] === ' ') {
          this.answer.push(" ");
        }
      }

      if (this.answer.length == this.$props.solution.length) {
        this.checkAnswer();
      }
    },
    removeAnswer(letter: string, index: number) {
      this.letters.push(letter);
      this.answer.splice(index, 1);
    },
    async checkAnswer() {
      const a = this.answer.join("").toLowerCase();
      const s = this.$props.solution.toLowerCase();
      if (a === s) {
        this.$emit("correct");
      } else {
        const alert = await alertController.create({
          header: getTranslation().t("Wrong"),
          message: getTranslation().t("The correct answer is <b>x</b>", { x: this.$props.solution }) ,
          buttons: [
            {
              text: getTranslation().t("Okay"),
              role: "confirm",
              handler: () => {
                this.$emit("wrong");
              },
            },
          ],
        });
        await alert.present();
      }
    },
    getRandomLetter() {
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      return letters.charAt(Math.floor(Math.random() * letters.length));
    },
  },
});
</script>