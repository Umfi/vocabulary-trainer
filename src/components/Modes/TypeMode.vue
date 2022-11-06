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
        <ion-col class="ion-text-center">
           <ion-item>
            <ion-input :clear-input="true" v-model="answer"></ion-input>
          </ion-item>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col class="ion-text-center">
          <ion-button @click="checkAnswer">{{ $t("Check answer")}}</ion-button>
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
  IonInput,
  alertController,
} from "@ionic/vue";
import { getTranslation } from "@/main";

export default defineComponent({
  name: "TypeMode",
  components: {
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonLabel,
    IonItem,
    IonInput
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
  },
  data() {
    return {
      answer: ''
    };
  },
  methods: {
    async checkAnswer() {
      const a = this.answer.toLowerCase().trim();
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