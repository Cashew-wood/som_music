import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'
import './static/css/iconfont.css'
import './static/css/theme/white.scss'
import './static/css/main.scss'
import ElementPlus from 'element-plus'
import { reactive } from "vue";

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
app.config.globalProperties.storage = {
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value))
    },
    get(key) {
        return JSON.parse(localStorage.getItem(key))
    }
}
let config = reactive({});
app.config.globalProperties.config = new Proxy(config, {
    default: {
        color: "rgb(0,0,0)",
        exit: false,
        bgColor: "rgba(255,255,255,0.95)",
        lyric: true,
        lyricFont: '微软雅黑',
        lyricFontSize: 48,
        lyricShadowColor:'#000000',
        lyricShadowSize:5,
        lyricForeground:'#005AFF',
        lyricBackground:'#86A8E7'
    },
    setup:false,
    get(target, propertity) {
        if (propertity == 'refresh') {
            return () => {
                let config = app.config.globalProperties.storage.get('config');
                for (let p in config) {
                    if (config[p] != null)
                        target[p] = config[p];
                }
            }
        }else if(propertity == "setSetup"){
            return ()=>{
                this.setup = true;
            }
        }
        let val = target[propertity]
        console.log('config', propertity, val)
        if (val == null) {
            let config = app.config.globalProperties.storage.get('config') || this.default;
            val = config[propertity] == null ? this.default[propertity] : config[propertity]
            target[propertity] = val;
        }
        return val;
    },
    set(target, propertity, val) {
        target[propertity] = val;
        app.config.globalProperties.storage.set('config', target);
        this.setup && window.native.window.parent.onMessage({ source: "setup", type: 0});
        return true;
    }
})
app.use(ElementPlus);

app.use(router);
app.mount('#app');
