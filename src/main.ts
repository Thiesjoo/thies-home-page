import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { format } from "date-fns";

const app = createApp(App, { router });

app.use(router);

app.mount("#app");
