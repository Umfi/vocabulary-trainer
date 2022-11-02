<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 2</ion-title>
        <ion-progress-bar :value="progress"></ion-progress-bar>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 2</ion-title>
        </ion-toolbar>
      </ion-header>
      
      <ion-card v-if="!done">
        <ion-card-content>
          <LetterSort :key="currentWord.id" :word="currentWord.native" :solution="currentWord.foreign" @correct="correctAnswer" @wrong="wrongAnswer"/>
        </ion-card-content>
      </ion-card>

      <ion-card v-if="done">
        <ion-card-header>
          <ion-card-title>Done</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          Correct: {{ correct }} 
          Wrong: {{ wrong }}
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, useIonRouter } from '@ionic/vue';
import LetterSort from '@/components/Modes/LetterSort.vue';
import { Vocable } from '@/data/vocable';
import { useRoute } from "vue-router";
import { getBox } from '@/data/box';

export default defineComponent({
  name: 'PractisePage',
  components: { LetterSort, IonHeader, IonToolbar, IonTitle, IonContent, IonPage },
  setup() {
    const ionRouter = useIonRouter();

    const route = useRoute();
    const id = route.params.id as string;
    return { ionRouter, id };
  },
  data() {
    return {
      words: [] as Vocable[],
      index: 0,
      activeWordId: '',
      correct: 0,
      wrong: 0,
      done: false
    };
  },
  computed: {
    currentWord: function () : Vocable | null {
      for(let i = 0; i < this.words.length; i++) {
        if(this.words[i].id === this.activeWordId) {
          return this.words[i];
        }
      }

      return {
        id: '',
        native: '',
        foreign: '',
      } as Vocable;
    },
    progress: function () : number {
      return this.index / this.words.length;
    }
  },
  async mounted() {
    if (this.id) {
      const box = await getBox(this.id);
      if (box) {
        this.words = box.vocables;
        this.words.sort(() => Math.random() - 0.5);
        this.index = 0;
        this.activeWordId = this.words[this.index].id
      }
    }


  },
  methods: {
    nextWord() {
      this.index++;
      if (this.index > this.words.length - 1) {
        this.done = true;
      } else {
        this.activeWordId = this.words[this.index].id;
      }   
    },
    correctAnswer() {
      this.correct++;
      this.nextWord();
    },
    wrongAnswer() {
      this.wrong++;
      
      this.nextWord();
    },
  },
});
</script>
