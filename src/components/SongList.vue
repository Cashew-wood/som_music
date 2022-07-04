<template>
    <div class="song-list-main">
        <div class="row color_secondary">
            <span class="num col">序号</span>
            <span class="name col">标题</span>
            <span class="singer col">歌手</span>
            <span class="time col">时长</span>
        </div>
        <div class="song-list">
            <div class="list scroll" @scroll="scroll">
                <div class="row color_main select h" :class="{ a: player.ids[player.index] == song.id }"
                    v-for="(song, index) in songList" :key="index" @click="tapItem(song)">
                    <span class="num col">{{ index + 1 }}</span>
                    <span class="name col tx a">{{ song.name }}</span>
                    <span class="singer col">{{ song.ar.map((e) => e.name).join() }}</span>
                    <span class="time col">{{ time(song.dt) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        songList: Array,
    },
    methods: {
        async scroll(e) {
            if (
                e.target.scrollTop + e.target.offsetHeight >= e.target.scrollHeight * 0.8 &&
                !this.loading
            ) {
                this.loading = true;
                this.page.offset++;
                this.songList = this.songList.concat(await this.geSongs());
                setTimeout(() => {
                    this.loading = false;
                }, 100);
            }
        },
        time(t) {
            t = parseInt(t / 1000);
            return (t > 60 ? parseInt(t / 60).toString().padStart(2, '0') : '00') + ':' + (t % 60).toString().padStart(2, '0')
        },
        tapItem(item) {
            this.$emit('play', item);
        }
    }
}
</script>
<style lang="scss">
.song-list-main {
    flex: 1;
    display: flex;
    flex-direction: column;
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
        .time{
            width: 100px;
        }
        .col {
            box-sizing: border-box;
            padding: 10px;
        }
    }
}
</style>