import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import router from './router/route';
     
import 'primeicons/primeicons.css';
import 'tailwindcss/tailwind.css'
import './assets/tailwind.css'



let vue_app = createApp(App);

export const app = vue_app
    .use(PrimeVue)
    .use(router)
    .mount("#app");



