<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ box.name }}</ion-title>
        <ion-buttons slot="end" v-show="vocables.length > 0">
          <ion-button :router-link="'/tabs/practise/' + box.id" color="primary">
            <ion-icon slot="icon-only" :icon="school" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ box.name }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <vocable-list :vocables="vocables" @deleteVocable="deleteVocable" @editVocable="editVocable"/>

      <ion-fab vertical="bottom" horizontal="center" slot="fixed" class="animate__animated animate__delay-1s animate__zoomIn">
        <ion-fab-button>
          <ion-icon :icon="add" />
        </ion-fab-button>

        <ion-fab-list side="start">
          <ion-fab-button @click="addVocable"><ion-icon :icon="createOutline" /></ion-fab-button>
        </ion-fab-list>
        <ion-fab-list side="end">
          <ion-fab-button @click="openFilePicker"><ion-icon :icon="cloudUploadOutline" /></ion-fab-button>
        </ion-fab-list>
      </ion-fab>

      <input type="file" id="file-upload" style="display: none" @change="importVocables"/>

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
  IonButton,
  IonBackButton,
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
  modalController,
  loadingController
} from "@ionic/vue";
import { Box, getBox } from "@/data/box";
import VocableList from "@/components/VocableList.vue";
import { createVocable, Vocable, deleteVocable, editVocable, importVocables } from "@/data/vocable";
import { add, cloudUploadOutline, createOutline, school } from "ionicons/icons";
import VocableModal from "@/components/VocableModal.vue";
import { showToast } from "@/plugins/Toast";
import readXlsxFile from 'read-excel-file'

export default defineComponent({
  name: "BoxPage",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonButtons,
    IonButton,
    IonBackButton,
    IonFab,
    IonFabButton,
    IonFabList,
    IonIcon,
    VocableList,
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
    return { ionRouter, id, add, cloudUploadOutline, createOutline, school };
  },
  async ionViewDidEnter() {
    if (this.id) {
      await this.loadData();
    }
  },
  methods: {
    async loadData() {
      const loading = await loadingController.create({
        message: 'Loading...',
        spinner: 'circles'
      });
      
      loading.present();

      this.box = await getBox(this.id);
      this.vocables = (this.box as Box).vocables;

      loading.dismiss();
    },
    async addVocable() {
      const modal = await modalController.create({
        component: VocableModal,
      });
      modal.present();

      const { data, role } = await modal.onWillDismiss();

      if (role === "confirm") {
        const vocable = await createVocable(this.id, data.foreign, data.native);
        this.vocables.push(vocable);
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
        component: VocableModal,
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
    openFilePicker() {
      const fileInput = document.getElementById("file-upload");
      if (fileInput) {
        fileInput.click();
      }
    },
    async importVocables(_event: any) {
      if (_event.target.files) {

        const loading = await loadingController.create({
          message: 'Importing...',
          spinner: 'circles'
        });
        
        loading.present();

        readXlsxFile(_event.target.files[0]).then(async (rows) => {
          const data = [];
          for (let i = 1; i < rows.length; i++) {
            data.push({native: rows[i][0], foreign: rows[i][1]});
          }

          const vocables = await importVocables(this.id, data);
          for (let i = 0; i < vocables.length; i++) {
            this.vocables.push(vocables[i]);
          }

          loading.dismiss();
          showToast(this.$t("{x} vocables have been imported", { x: vocables.length }));
        })
      }
    }
  },
});
</script>
