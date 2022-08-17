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
//axios.defaults.baseURL = 'http://localhost:3000'
axios.defaults.baseURL = 'https://music163api.herokuapp.com'
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
app.config.globalProperties.localFile = reactive([])
app.config.globalProperties.getTheme = (bgcolor, color) => {
    function increaseColor(color, rgb, reduce) {
        let rgbs = color.split(",");
        let rgbs1 = rgb.split(",");
        let newRgb = [];
        for (let i = 0; i < 3; i++) {
            newRgb[i] = reduce
                ? parseInt(rgbs[i]) - parseInt(rgbs1[i])
                : parseInt(rgbs[i]) + parseInt(rgbs1[i]);
            if (newRgb[i] < 0) {
                newRgb[i] = Math.abs(newRgb[i]);
            } else if (newRgb[i] > 255) {
                newRgb[i] = parseInt(rgbs[i]) - parseInt(rgbs1[i]);
            }
        }
        return newRgb.join();
    }
    let progress = increaseColor(bgcolor, "30,30,30");
    let deep = increaseColor(bgcolor, "60,60,60");
    return `html.theme {
--color-text-primary: rgb(${color});
--color-text-tinit: rgb(${increaseColor(color, "66,66,67", true)});
--color-bg-primary: ${app.config.globalProperties.config.bgColor};
--color-bg-light: rgb(${increaseColor(bgcolor, "15,15,15", true)});
--color-bg-shadow: rgb(${increaseColor(bgcolor, "30,30,30", true)});
--color-search-bg: rgba(${increaseColor(bgcolor, "51,51,51", true)}, 0.3);
--color-scroll-bg: rgba(${deep}, 0.2);
--color-scroll-slider: rgba(${deep}, 0.4);
--color-progress-bg: rgb(${increaseColor(bgcolor, "17,17,17", true)});
--color-progress-slider: rgb(${increaseColor(color, "204,204,204", true)});
--color-progress-dot: rgb(${increaseColor(color, "153,153,153")});
--color-select-hover: rgba(${deep}, 0.15);
--color-select-active: rgba(${deep}, 0.3);
--color-volume-progress-bg: rgb(${progress});
--color-volume-progress-slider: rgb(${increaseColor(progress, "30,30,30")});
--color-split-line-tint: rgb(${increaseColor(color, "204,204,204")});
--color-split-line-deep: rgb(${increaseColor(color, "153,153,153")});
--color-text-btn-primary:rgb(${increaseColor(color, "66,66,67")});
--color-border-primary: rgb(${increaseColor(bgcolor, "40,40,40")});
--color-border-deep: rgb(${increaseColor(bgcolor, "80,80,80")});
--color-button-full: rgb(${increaseColor(bgcolor, "16,16,16", true)});
}`;
}
app.config.globalProperties.uid = () => {
    let s = Date.now().toString(36) + '?';
    for (let i = 0; i < 8; i++) {
        s += parseInt(Math.random() * 36).toString(36);
    }
    return s;
}
app.config.globalProperties.dateTime = (val) => {
    if (typeof val == 'string') {
        val = parseInt(val);
    }
    let d = new Date(val);
    return `${d.getFullYear()}-${((d.getMonth() + 1).toString()).padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`
}
app.config.globalProperties.checkConfig = async function () {
    console.log(this);
    app.config.globalProperties.config.defaultPlayer = await window.native.system.fileAssociationName('.mp3') == "somMusic";
    app.config.globalProperties.config.startup = await window.native.io.exists(await window.native.io.getPath(6) + "\\SomMusic.lnk") == 1;
}
app.config.globalProperties.storage = {
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value))
    },
    get(key) {
        let val = localStorage.getItem(key);
        return val ? JSON.parse(localStorage.getItem(key)) : null;
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
        lyricFontSize: 36,
        lyricShadowColor: '#000000',
        lyricShadowSize: 5,
        lyricForeground: '#005AFF',
        lyricBackground: '#86A8E7',
        defaultPlayer: false,
        startup: false
    },
    setup: false,
    get(target, propertity) {
        if (propertity == 'refresh') {
            return () => {
                let config = app.config.globalProperties.storage.get('config');
                for (let p in config) {
                    if (config[p] != null)
                        target[p] = config[p];
                }
            }
        } else if (propertity == "setSetup") {
            return () => {
                this.setup = true;
            }
        }
        let val = target[propertity]
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
        this.setup && window.native.window.parent.onMessage({ source: "setup", type: 0 });
        return true;
    }
})
app.config.globalProperties.global=reactive({});
app.use(ElementPlus);

app.use(router);
app.mount('#app');
