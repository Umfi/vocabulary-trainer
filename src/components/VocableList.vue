<template>
  <ion-list>
    <ion-item-sliding v-for="vocable in vocables" :key="vocable.id">
      <ion-item>
        <ion-grid>
          <ion-row>
            <ion-col class="ion-text-start">
              <ion-label class="ion-text-wrap">
                {{ vocable.foreign }}
              </ion-label>
            </ion-col>
            <ion-col size="1" class="ion-text-center">
              <ion-label>|</ion-label>
            </ion-col>
            <ion-col class="ion-text-end">
              <ion-label class="ion-text-wrap">
                {{ vocable.native }}
              </ion-label>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-item>
      <ion-item-options>
        <ion-item-option>
          <ion-icon slot="icon-only" :icon="pencil" @click="editVocable(vocable.id)"></ion-icon>
        </ion-item-option>
        <ion-item-option color="danger">
          <ion-icon slot="icon-only" :icon="trash" @click="deleteVocable(vocable.id)"></ion-icon>
        </ion-item-option>
      </ion-item-options>
    </ion-item-sliding>
  </ion-list>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  IonItem,
  IonLabel,
  IonList,
  IonGrid,
  IonRow,
  IonCol,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonIcon,
  alertController
} from "@ionic/vue";
import { Vocable } from "@/data/vocable";
import { trash, pencil } from "ionicons/icons";
import { getTranslation } from "@/main";

export default defineComponent({
  name: "VocableList",
  components: {
    IonItem,
    IonLabel,
    IonList,
    IonGrid,
    IonRow,
    IonCol,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonIcon
  },
  props: {
    vocables: {
      type: Array as () => Vocable[],
      required: true,
    },
  },
  setup() {
    return {
      trash,
      pencil,
    };
  },
  methods: {
    async deleteVocable(id: number) {
      const alert = await alertController.create({
        header: getTranslation().t("Do you really want to delete this vocable?"),
        buttons: [
          {
            text: getTranslation().t("Cancle"),
            role: "cancel",
          },
          {
            text: getTranslation().t("DELETE"),
            role: "confirm",
            handler: () => { 
              this.$emit("deleteVocable", id);
            },
          },
        ],
      });

      await alert.present();
    },
    editVocable(id: number) {
      this.$emit("editVocable", id);
    },
  },
});
</script>
