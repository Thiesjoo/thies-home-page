import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

/* Fontawesome shizz */
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTwitch } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faTwitch);

const app = createApp(App, { router });
app.use(router);
app.component("font-awesome-icon", FontAwesomeIcon);
app.mount("#app");
