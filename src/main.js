import Vue from "vue";
import App from "./App.vue";
import router from "./router";
//引入饿了么ui
import ElementUI from 'element-ui';
import store from './store';

//引入饿了么css
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI); //使用饿了么ui
import './permission';//路由权限
Vue.config.productionTip = process.env.NODE_ENV === 'production';
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
