<template>
    <div class="ranking_main">
        <div class="rankinglist scroll">
            <div class="block" v-for="(item, i) in rankingList" :key="i" @click="itemTap(item)">
                <img class="img" :src="item.coverImgUrl" />
                <div class="info">
                    <span class="name color_main">{{ item.name }}</span>
                    <div class="desc color_secondary">{{ item.description }}</div>
                    <span class="update color_secondary">{{ item.updateFrequency }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            rankingList: []
        }
    },
    async mounted() {
        this.rankingList = await this.getRanking();
    },
    methods: {
        async getRanking() {
            return (await this.$axios.get('/toplist')).data.list;
        },
        itemTap(item){
            this.$router.to('/index/song_sheet', { id: item.id })
        },
        invokeWindowFunction(method) {
            let args = []
            for (let i = 1; i < arguments.length; i++) {
                args.push(arguments[i])
            }
            window.dispatchEvent(new CustomEvent('invoke', { detail: { method, args } }))
        }
    }
}
</script>

<style lang="scss">
.ranking_main {
    flex: 1;
    position: relative;

    .rankinglist {
        display: flex;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        flex-wrap: wrap;
        overflow-y: scroll;
    }

    .block {
        width: 50%;
        padding: 10px;
        display: flex;
        box-sizing: border-box;

        .img {
            width: 140px;
            height: 140px;
            border-radius: 10px;
        }

        .info {
            margin-left: 16px;

            .name {
                font-size: 28px;
            }

            .update,
            .desc {
                font-size: 14px;
                margin-top: 12px;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow-wrap: break-word;
                word-break: break-all;
                white-space: normal;
                overflow: hidden;
            }
        }

    }
}
</style>