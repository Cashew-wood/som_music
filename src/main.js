import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'
import './static/css/iconfont.css'
import './static/css/theme/black.scss'
import './static/css/main.scss'
import ElementPlus from 'element-plus'
import {  reactive } from "vue";
console.log(window.history)
const app = createApp(App);
axios.defaults.baseURL = 'http://localhost:3000'
app.config.globalProperties.$axios = axios;
app.config.globalProperties.player = reactive({
    pic: null,
    name: null,
    progress: 0,
    index: null,
    ids: [],
    singer: [],
    url: null,
    status: 0,//0no 1play 2pause
    current: '00:00',
    duration: '00:00',
    volume: 100
});
app.use(ElementPlus);

app.use(router);
app.mount('#app');
