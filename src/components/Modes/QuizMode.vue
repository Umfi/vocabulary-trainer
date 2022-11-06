<template>
  <div>
    <div>
      <ion-item lines="none">
        <ion-label class="ion-text-center ion-padding-top animate__animated  animate__flipInX">
          <h1 class="ion-text-wrap">{{ word }}</h1>
        </ion-label>
      </ion-item>
    </div>
    <ion-grid class="animate__animated animate__delay-1s animate__flipInX" style="--animate-delay: 0.5s;">
      <ion-row>
        <ion-col size="6" class="ion-text-center" v-for="answer in options" :key="answer">
          <ion-button @click="checkAnswer(answer)" fill="outline" class="ion-text-wrap h-auto" expand="block">
            {{ answer }}
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
  name: "QuizMode",
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
    answers: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      options: [] as string[],
    };
  },
  mounted() {
    this.options = [...this.$props.answers as string[]];
    this.options.sort(() => Math.random() - 0.5);
  },
  methods: {
    async checkAnswer(answer: string) {
      const a = answer.toLowerCase().trim();
      const s = this.$props.solution.toLowerCase().trim();

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
  },
});
</script>
<style scoped>
.h-auto {
  min-height: 36px;
  height: 100%;
}
</style>