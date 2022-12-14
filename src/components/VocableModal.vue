<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>{{
        id == 0 ? $t("Add Vocable") : $t("Edit Vocable")
      }}</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="cancel">
          <ion-icon slot="icon-only" :icon="close"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <ion-item>
      <ion-label position="stacked">{{ $t("Word") }}</ion-label>
      <ion-input v-model="native" placeholder=""></ion-input>
    </ion-item>
    <ion-item>
      <ion-label position="stacked">{{ $t("Translation") }}</ion-label>
      <ion-input v-model="foreign" placeholder=""></ion-input>
    </ion-item>
  </ion-content>
  <ion-footer>
    <ion-button expand="block" class="ion-margin" @click="confirm">
      {{ $t("Save") }}
    </ion-button>
  </ion-footer>
</template>

<script lang="ts">
import { getTranslation } from "@/main";
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonFooter,
  IonIcon,
  modalController,
  alertController,
} from "@ionic/vue";
import { close } from "ionicons/icons";
import { defineComponent } from "vue";

export default defineComponent({
  name: "VocableModal",
  props: {
    vocable: {
      type: Object,
      required: false,
    },
  },
  components: {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonItem,
    IonLabel,
    IonFooter,
    IonInput,
    IonIcon,
  },
  setup() {
    return {
      close,
    };
  },
  data() {
    return {
      id: 0,
      foreign: "",
      native: "",
    };
  },
  mounted() {
    if (this.$props.vocable) {
      this.id = this.$props.vocable[0].id;
      this.foreign = this.$props.vocable[0].foreign;
      this.native = this.$props.vocable[0].native;
    }
  },
  methods: {
    cancel() {
      return modalController.dismiss(null, "cancel");
    },
    async confirm() {
      if (this.native.length == 0) {
        const alert = await alertController.create({
          header: getTranslation().t("Warning"),
          message: getTranslation().t("Word can not be empty."),
          buttons: [getTranslation().t("Okay")],
        });

        await alert.present();
        return;
      }

      if (this.foreign.length == 0) {
        const alert = await alertController.create({
          header: getTranslation().t("Warning"),
          message: getTranslation().t("Translation can not be empty."),
          buttons: [getTranslation().t("Okay")],
        });

        await alert.present();
        return;
      }
      
      return modalController.dismiss(
        { id: this.id, native: this.native, foreign: this.foreign },
        "confirm"
      );
    },
  },
});
</script>