<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ $t("Vocables") }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ $t("Vocables") }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <BoxList ref="boxes" />

      <ion-fab vertical="bottom" horizontal="center" slot="fixed" class="animate__animated animate__zoomIn">
        <ion-fab-button @click="addBox">
          <ion-icon :icon="add" />
        </ion-fab-button>
      </ion-fab>
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
  IonFab,
  IonFabButton,
  IonIcon,
  modalController
} from "@ionic/vue";
import BoxList from "@/components/BoxList.vue";
import { add } from "ionicons/icons";
import BoxModal from "@/components/BoxModal.vue";
import { createBox } from "@/data/box";
import { showToast } from "@/plugins/Toast";

export default defineComponent({
  name: "VocablesPage",
  components: {
    BoxList,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonFab,
    IonFabButton,
    IonIcon,
  },
  setup() {
    return {
      add,
    };
  },
  ionViewWillEnter() {
    (this.$refs.boxes as any).load();
  },
  methods: {
    async addBox() {
      const modal = await modalController.create({
        component: BoxModal,
      });
      modal.present();

      const { data, role } = await modal.onWillDismiss();

      if (role === "confirm") {
        await createBox(data.name);
        showToast(this.$t("Box has been added"));
        (this.$refs.boxes as any).load();
      }
    },
  },
});
</script>
