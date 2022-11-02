import { toastController } from '@ionic/vue';

export async function showToast(message: string) {
    const toast = await toastController
    .create({
      message: message,
      duration: 1000,
    })
  return toast.present(); 
} 