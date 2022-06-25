<template>
    <div class="elaborate">
        <div class="banner">
            <el-carousel trigger="click" type="card" :height="windowWidth > 1500 ? '250px' : '150px'">
                <el-carousel-item v-for="(item, index) in bannerList" :key="index" @click="bannerTap(item)">
                    <img class="img" :src="item.imageUrl" />
                </el-carousel-item>
            </el-carousel>
        </div>
        <div class="subtitle color_main">
            精选歌单
        </div>
        <div class="carefully scroll">
            <div :gutter="0" class="grid-row">
                <div class="grid-col" :span="4" v-for="(item, index) in carefullyList" :key="index"
                    @click="itemTap(item)">
                    <div class="item">
                        <img class="img" :src="item.coverImgUrl" />
                        <div class="desc color_main">{{ item.name }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            carefullyList: [],
            bannerList: [],
            windowWidth: 0
        }
    },
    mounted() {
        this.getBanner();
        this.getCarefully();
        window.addEventListener('onResize', (e) => {
            this.windowWidth = e.detail.w;
        })
    },
    methods: {
        async getBanner() {
            // http://localhost:3000/banner?type=0
            const response = await this.$axios.get('/banner?type=0')
            let acceptType = [1, 10]
            for (let i = 0; i < response.data.banners.length; i++) {
                if (acceptType.indexOf(response.data.banners[i].targetType) == -1) {
                    response.data.banners.splice(i, 1);
                    i--;
                }
            }
            this.bannerList = response.data.banners;
            console.log(this.bannerList)
        },
        async getCarefully() {
            const response = await this.$axios.get('/top/playlist/highquality?limit=10')
            this.carefullyList = response.data.playlists;
            console.log(this.carefullyList)
        },
        async bannerTap(item) {
            console.log(item)
            if (item.targetType == 1) {//歌曲
                this.invokeWindowFunction("openSong", item.targetId)
            } else if (item.targetType == 10) {//专辑
                this.invokeWindowFunction("album", item.targetId)
            } else if (item.targetType == 3000) {//活动

            }
        },
        async itemTap(item) {
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
.elaborate {
    flex: 1;
    display: flex;
    flex-direction: column;

    .banner {
        position: relative;
        margin-top: 14px;

        .img {
            width: 100%;
        }
    }

    .subtitle {
        font-size: 24px;
        margin: 14px 10px;
    }

    .carefully {
        overflow-y: scroll;
        flex: 1;
        position: relative;

        .grid-row {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            display: flex;
            flex-wrap: wrap;

            .grid-col {
                padding: 10px;
                width: 20%;
                box-sizing: border-box;

            }
        }

        .item {
            display: flex;
            flex-direction: column;

            .img {
                width: 100%;
            }

            .desc {
                margin-top: 8px;
                font-size: 14px;
            }
        }
    }
}
</style>