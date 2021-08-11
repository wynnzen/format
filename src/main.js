import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import VueCompositionAPI from '@vue/composition-api'
import VueCodemirror from 'vue-codemirror'
import VueFullscreen from 'vue-fullscreen'
import VueClipboard from 'vue-clipboard2'
import 'codemirror/lib/codemirror.css'


Vue.use(VueCompositionAPI)
Vue.use(Antd)
Vue.use(VueCodemirror)
Vue.use(VueFullscreen)
Vue.use(VueClipboard)

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
