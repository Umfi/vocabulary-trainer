<template>
  <ion-list>
    <ion-item-sliding v-for="box in boxes" :key="box.id">
      <ion-item :routerLink="'/tabs/list/' + box.id">
        <ion-label>
          <h3>{{ box.name }}</h3>
          <p>{{ $t("x vocables", { x: box.vocables.length }) }} </p>
        </ion-label>
        <ion-button slot="end" size="default" :href="'/tabs/practise/' + box.id">
          <ion-icon slot="icon-only" :icon="school" />
        </ion-button>
      </ion-item>
      <ion-item-options>
        <ion-item-option>
          <ion-icon
            slot="icon-only"
            :icon="pencil"
            @click="editBox(box.id)"
          ></ion-icon>
        </ion-item-option>
        <ion-item-option color="danger">
          <ion-icon
            slot="icon-only"
            :icon="trash"
            @click="deleteBox(box.id)"
          ></ion-icon>
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
  IonButton,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonIcon,
  modalController,
  alertController,
} from "@ionic/vue";
import { school, trash, pencil } from "ionicons/icons";
import { Box, getBoxes, deleteBox, editBox } from "@/data/box";
import { showToast } from "@/plugins/Toast";
import BoxModal from "@/components/BoxModal.vue";
import { getTranslation } from "@/main";

export default defineComponent({
  name: "BoxList",
  components: {
    IonItem,
    IonLabel,
    IonList,
    IonButton,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonIcon,
  },
  data() {
    return {
      boxes: [] as Box[],
    };
  },
  setup() {
    return {
      school,
      trash,
      pencil,
    };
  },
  methods: {
    async load() {
      this.boxes = await getBoxes();
    },
    async deleteBox(id: string) {
      const alert = await alertController.create({
        header: getTranslation().t("Do you really want to delete this box?"),
        buttons: [
          {
            text: getTranslation().t("Cancle"),
            role: "cancel",
          },
          {
            text: getTranslation().t("DELETE"),
            role: "confirm",
            handler: () => {
              try {
                deleteBox(id);
                this.boxes = this.boxes.filter((v) => v.id !== id);
                showToast(this.$t("Box has been deleted"));
              } catch (error) {
                console.error(error);
              }
            },
          },
        ],
      });

      await alert.present();
    },
    async editBox(id: string) {
      const box = this.boxes.filter((v) => v.id == id);

      const modal = await modalController.create({
        component: BoxModal,
        componentProps: { box: box },
      });
      modal.present();

      const { data, role } = await modal.onWillDismiss();

      if (role === "confirm") {
        await editBox(id, data as Box);
        const index = this.boxes.findIndex((obj) => obj.id == id);
        this.boxes[index].name = (data as Box).name;
        showToast(this.$t("Box has been updated"));
      }
    },
  },
  async mounted() {
    this.load();
  },
});
</script>
