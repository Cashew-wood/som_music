<template>
    <div class="singer_main">
        <div class="row">
            <button class="" :class="{ 'full': filter.area == -1 }" @click="setValue('area', -1)">全部</button>
            <button class="" :class="{ 'full': filter.area == 7 }" @click="setValue('area', 7)">内地</button>
            <button class="" :class="{ 'full': filter.area == 96 }" @click="setValue('area', 96)">欧美</button>
            <button class="" :class="{ 'full': filter.area == 8 }" @click="setValue('area', 8)">日本</button>
            <button class="" :class="{ 'full': filter.area == 16 }" @click="setValue('area', 16)">韩国</button>
        </div>
        <div class="row">
            <button class="" :class="{ 'full': filter.type == -1 }" @click="setValue('type', -1)">全部</button>
            <button class="" :class="{ 'full': filter.type == 1 }" @click="setValue('type', 1)">男</button>
            <button class="" :class="{ 'full': filter.type == 2 }" @click="setValue('type', 2)">女</button>
            <button class="" :class="{ 'full': filter.type == 3 }" @click="setValue('type', 3)">组合</button>
        </div>
        <div class="row">
            <span class="btn select h" @click="setValue('initial', '')" :class="{'a':!filter.initial}">全部</span>
            <span class="btn select h" v-for="i in 26" :key="i" :class="{'a': filter.initial==String.fromCharCode(i + 96)}"
                @click="setValue('initial', String.fromCharCode(i + 96))">{{ String.fromCharCode(i + 64) }}</span>
        </div>
        <ScrollList>
            <div class="star">
                <div class="block" v-for="(item, i) in starList" :key="i" @click="itemTap(item)">
                    <img class="img" :src="item.picUrl+'?param=180y180'" />
                    <span class="name color_main">{{ item.name }}</span>
                </div>
            </div>
        </ScrollList>
    </div>
</template>

<script>
import ScrollList from '../../../components/ScrollList.vue'
export default {
    data() {
        return {
            filter: {
                type: -1,
                area: -1,
                initial: ''
            },
            starList: []

        }
    },
    components: {
        ScrollList
    },
    async mounted() {
        this.starList = await this.getSinger();
    },
    methods: {
        async getSinger() {
            return (await this.$axios.get(`/artist/list?type=${this.filter.type}&area=${this.filter.area}&initial=${this.filter.initial}&offset=0&limit=20`)).data.artists
        },
        async setValue(key, value) {
            this.filter[key] = value;
            this.starList = await this.getSinger();
        },
        itemTap(item){
            this.$router.to('/index/singer_sheet',{id:item.id})
        }
    }
}
</script>

<style lang="scss">
.singer_main {
    flex: 1;
    display: flex;
    flex-direction: column;

    .row {
        padding: 12px 0;

        button {
            width: 100px;
            margin-right: 20px;
        }

        .btn {
            font-size: 16px;
            padding: 8px 10px;
        }
    }

    .star {
        display: flex;
        flex-wrap: wrap;

        .block {
            width: 25%;
            box-sizing: border-box;
            display: flex;
            margin-bottom: 20px;
            flex-direction: column;
            align-items: center;

            .img {
                border-radius: 50%;
                width: 180px;
                height: 180px;
            }

            .name {
                margin-top: 12px;
                font-size: 16px;
            }
        }
    }
}
</style>