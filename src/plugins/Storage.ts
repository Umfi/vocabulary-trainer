import { Storage } from '@ionic/storage';

export default {
  install: async (app: any) => {
    const storage = new Storage();
    const storageInstance = await storage.create();
    app.config.globalProperties.$ionicStorage = storageInstance;
    app.provide('$ionicStorage', storageInstance);
   }
};