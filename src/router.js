import index from './view/index.vue'
import index_default from './view/index/default.vue'
import index_album from './view/index/album.vue'
import lyric from './view/lyric.vue'
import song_sheet from './view/index/song_sheet.vue'
import elaborate from './view/index/tabs/elaborate.vue'
import ranking from './view/index/tabs/ranking.vue'
import singer from './view/index/tabs/singer.vue'
import singer_sheet from './view/index/singer_sheet.vue'
import { createRouter, createWebHashHistory } from 'vue-router'
const routes = [{
    path: '/index', component: index,
    children: [{
        path: 'default',
        component: index_default,
        children: [{
            path: 'elaborate',
            component: elaborate,
        }, {
            path: 'ranking',
            component: ranking
        }, {
            path: 'singer',
            component: singer
        }]
    }, {
        path: 'album',
        component: index_album
    }, {
        path: 'song_sheet',
        component: song_sheet
    }, {
        path: 'singer_sheet',
        component: singer_sheet
    }]
}, {
    path: '/lyric', component: lyric,
}]
const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.to = (path, args) => {
    window.dispatchEvent(new CustomEvent('router', { dateil: path }))
    router.push({ path, replace: true, query: args })
}
export default router; 