<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="list" href="/tabs/list">
          <ion-icon :icon="listOutline" />
          <ion-label>{{ $t("List") }}</ion-label>
        </ion-tab-button>
          
        <ion-tab-button tab="practise" href="/tabs/practise">
          <ion-icon :icon="schoolOutline" />
          <ion-label>{{ $t("Practice") }}</ion-label>
        </ion-tab-button>

      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { schoolOutline, settingsOutline, listOutline } from 'ionicons/icons';

export default defineComponent({
  name: 'TabsPage',
  components: { IonLabel, IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage, IonRouterOutlet },
  setup() {
    return {
      schoolOutline, 
      settingsOutline, 
      listOutline,
    }
  }
});
</script>
