<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ box.name }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ box.name }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <vocabel-list :vocables="vocables" @deleteVocable="deleteVocable" @editVocable="editVocable"/>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button>
          <ion-icon :icon="add" />
        </ion-fab-button>

            <ion-fab-list side="start">
              <ion-fab-button @click="addVocable"><ion-icon :icon="createOutline" /></ion-fab-button>
            </ion-fab-list>
            <ion-fab-list side="top">
              <ion-fab-button><ion-icon :icon="cloudUploadOutline" /></ion-fab-button>
            </ion-fab-list>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { useRoute } from "vue-router";
import { defineComponent } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  useIonRouter,
  IonButtons,
  IonBackButton,
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
  modalController,
} from "@ionic/vue";
import { Box, getBox } from "@/data/box";
import VocabelList from "@/components/VocabelList.vue";
import { createVocable, Vocable, deleteVocable, editVocable } from "@/data/vocable";
import { add, cloudUploadOutline, createOutline } from "ionicons/icons";
import VocabelModal from "@/components/VocabelModal.vue";
import { showToast } from "@/plugins/Toast";

export default defineComponent({
  name: "BoxPage",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonButtons,
    IonBackButton,
    IonFab,
    IonFabButton,
    IonFabList,
    IonIcon,
    VocabelList,
  },
  data() {
    return {
      box: {} as unknown,
      vocables: [] as Vocable[],
    };
  },
  setup() {
    const ionRouter = useIonRouter();

    const route = useRoute();
    const id = route.params.id as string;
    return { ionRouter, id, add, cloudUploadOutline, createOutline };
  },
  async ionViewDidEnter() {
    if (this.id) {
      await this.loadData();
    }
  },
  methods: {
    async loadData() {
      this.box = await getBox(this.id);
      this.vocables = (this.box as Box).vocables;
    },
    async addVocable() {
      const modal = await modalController.create({
        component: VocabelModal,
      });
      modal.present();

      const { data, role } = await modal.onWillDismiss();

      if (role === "confirm") {
        const vocabel = await createVocable(this.id, data.foreign, data.native);
        this.vocables.push(vocabel);
        showToast(this.$t("Vocable has been added"));
      }
    },
    deleteVocable(vocableId: string) {
      try {
        deleteVocable(this.id, vocableId);
        this.vocables = this.vocables.filter((v) => v.id !== vocableId);
        showToast(this.$t("Vocable has been deleted"));
      } catch (error) {
        console.error(error);
      }
    },
    async editVocable(vocableId: string) {

      const vocable = this.vocables.filter((v) => v.id == vocableId);

      const modal = await modalController.create({
        component: VocabelModal,
        componentProps: {vocable: vocable},
      });
      modal.present();

      const { data, role } = await modal.onWillDismiss();

      if (role === "confirm") {
        await editVocable(this.id, data as Vocable);
        const indexVariables = this.vocables.findIndex((obj => obj.id == data.id));
        this.vocables[indexVariables] = data as Vocable;
        showToast(this.$t("Vocable has been updated"));
      }
    },
  },
});
</script>
