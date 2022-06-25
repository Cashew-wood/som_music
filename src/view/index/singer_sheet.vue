<template>
    <div class="sheet_main">
        <img class="cover" :src="sheet.cover + '?param=978y320'" />
        <div class="info">
            <div class="name color_main">
                {{ sheet.name }}
            </div>
            <div class="desc tx c color_secondary">
                {{ sheet.briefDesc }}
            </div>
        </div>
        <div class="title color_main">歌曲</div>
        <div class="row color_secondary">
            <span class="num col">序号</span>
            <span class="name col">标题</span>
            <span class="singer col">歌手</span>
        </div>
        <div class="song-list">
            <div class="list scroll">
                <div class="row color_main select h" :class="{ 'a': player.ids[player.index] == song.id }"
                    v-for="(song, index) in songList" :key="index" @click="play(song)">
                    <span class="num col">{{ index + 1 }}</span>
                    <span class="name col tx a">{{ song.name }}</span>
                    <span class="singer col">{{ song.ar.map(e => e.name).join() }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            sheet: {
            },
            songList: [],
            id: null,
            page: {
                offset: 0,
                limit: 50
            },
            loading: false
        }
    },
    async mounted() {
        this.id = this.$route.query.id;
        console.log(this.player)
        let sheet = await this.getDetail();
        //window.dispatchEvent(new CustomEvent('background', { detail: sheet.cover }))
        this.sheet = sheet;
        this.songList = await this.geSongs();
    },
    methods: {
        async getDetail() {
            return (await this.$axios.get(`/artist/detail?id=${this.id}`)).data.data.artist
        },
        async geSongs() {
            return (await this.$axios.get(`/artist/top/song?id=${this.id}`)).data.songs
        },
        allPlay() {
            this.$parent.$parent.setPlayList(this.songList.map(e => e.id));
        },
        play(item) {
            this.$parent.$parent.openSong(item.id);
        },
        async scroll(e) {
            if (e.target.scrollTop + e.target.offsetHeight >= e.target.scrollHeight * 0.8 && !this.loading) {
                this.loading = true;
                this.page.offset++;
                this.songList = this.songList.concat(await this.geSongs())
                setTimeout(() => {
                    this.loading = false;
                }, 100);
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.sheet_main {
    display: flex;
    flex-direction: column;
    padding: 15px;

    .cover {
        z-index: -1;
        width: 100%;
        position: fixed;
        top: 0;
        left: 222px;
        opacity: 0.1;
    }

    .info {
        position: fixed;
        top: 240px;
        left: 250px;
        right: 40px;
        .name{
            font-size: 36px;
        }
        .desc{
            font-size: 14px;
            margin-top: 10px;
        }
    }

    .title {
        font-size: 18px;
        margin-top: 340px;
    }

    .song-list {
        position: relative;
        flex: 1;

        .list {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
            display: flex;
            flex-direction: column;
            overflow-y: scroll;


        }
    }
}

.row {
    display: flex;

    .num {
        width: 80px;
        text-align: center;
    }

    .name,
    .singer {
        flex: 1;
    }

    .col {
        box-sizing: border-box;
        padding: 10px;
    }
}
</style>