<template>
    <div class="sheet_main">
        <div class="top">
            <img class="img" :src="sheet.coverImgUrl+'?param=180y180'" />
            <div class="info">
                <span class="name color_main">{{ sheet.name }}</span>
                <span class="company color_secondary" v-if="sheet.company">类型：{{ sheet.tag }}</span>
                <div class="desc color_secondary">
                    <span class="label"> 简介：</span>
                    <span class="value tx c">{{ sheet.description }}</span>
                </div>
                <button class="play" @click="allPlay">全部播放</button>
            </div>
        </div>
        <div class="title color_main">歌曲</div>
        <div class="row color_secondary">
            <span class="num col">序号</span>
            <span class="name col">标题</span>
            <span class="singer col">歌手</span>
        </div>
        <div class="song-list">
            <div class="list scroll" @scroll="scroll">
                <div class="row color_main select h" :class="{'a': player.ids[player.index]==song.id}" v-for="(song, index) in songList" :key="index" @click="play(song)">
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
        this.sheet = sheet.playlist;
        this.songList = await this.geSongs();
    },
    methods: {
        async getDetail() {
            return (await this.$axios.get('/playlist/detail?id=' + this.id)).data
        },
        async geSongs() {
            return (await this.$axios.get(`/playlist/track/all?id=${this.id}&limit=${this.page.limit}&offset=${this.page.offset}`)).data.songs
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

    .top {
        display: flex;

        .img {
            width: 180px;
            height: 180px;
            border-radius: 10px;
        }

        .info {
            margin-left: 16px;
            display: flex;
            flex-direction: column;

            .name {
                font-size: 28px;
            }

            .company,
            .desc {
                font-size: 14px;
                margin-top: 6px;
            }

            .desc {
                display: flex;
                flex-direction: column;
                flex: 1;

                .label {
                    margin-bottom: 6px;
                }

                .value {
                    font-size: 14px;
                }
            }
        }

        .play {
            width: 120px;
        }
    }

    .title {
        font-size: 18px;
        margin: 16px 0;
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