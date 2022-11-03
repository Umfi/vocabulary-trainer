<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>{{ (id == 0) ? $t("Add Box") : $t("Edit Box") }}</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="cancel">
          <ion-icon slot="icon-only" :icon="close"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <ion-item>
      <ion-label position="stacked">{{ $t("Name") }}</ion-label>
      <ion-input v-model="name" placeholder=""></ion-input>
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
  alertController
} from "@ionic/vue";
import { close } from "ionicons/icons";
import { defineComponent } from "vue";

export default defineComponent({
  name: "BoxModal",
  props: {
    box: {
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
    IonIcon
  },
  setup() {
    return {
      close,
    };
  },
  data() {
    return {
      id: 0,
      name: "",
    };
  },
  mounted() {
    if (this.$props.box) {
      this.id = this.$props.box[0].id;
      this.name = this.$props.box[0].name;
    }
  },
  methods: {
    cancel() {
      return modalController.dismiss(null, "cancel");
    },
    async confirm() {

      if (this.name.length == 0) {
        const alert = await alertController.create({
          header: getTranslation().t("Warning"),
          message: getTranslation().t("Name can not be empty."),
          buttons: [getTranslation().t("Okay")],
        });

        await alert.present();
        return;
      }

      return modalController.dismiss(
        { id: this.id, name: this.name },
        "confirm"
      );
    },
  },
});
</script>