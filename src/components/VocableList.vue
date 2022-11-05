<template>
  <ion-list>
    <ion-item-sliding v-for="vocable in vocables" :key="vocable.id" class="animate__animated animate__slideInRight">
      <ion-item>
        <ion-grid >
          <ion-row>
            <ion-col class="ion-text-start line">
              <ion-label class="ion-text-wrap">
                {{ vocable.native }}
              </ion-label>
            </ion-col>
            <ion-col class="ion-text-end">
              <ion-label class="ion-text-wrap">
                {{ vocable.foreign }}
              </ion-label>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-item>
      <ion-item-options>
        <ion-item-option color="tertiary" @click="editVocable(vocable.id)">
          <ion-icon slot="icon-only" :icon="pencil"></ion-icon>
        </ion-item-option>
        <ion-item-option color="danger" @click="deleteVocable(vocable.id)">
          <ion-icon slot="icon-only" :icon="trash"></ion-icon>
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
<style scoped>
.line {
  border-right: 1px solid #ccc;
}

</style>