<template>
    <div class="main">
        <div class="title color_main">
            音乐馆
        </div>
        <div class="tabs">
            <span class="item color_main select h" :class="{ 'a': tabIndex == 0 }" @click="selectTabs(0)">精选</span>
            <span class="item color_main select h" :class="{ 'a': tabIndex == 1 }" @click="selectTabs(1)">排行</span>
            <span class="item color_main select h" :class="{ 'a': tabIndex == 2 }" @click="selectTabs(2)">歌手</span>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tabIndex: 0,
            tabs: ['elaborate', 'ranking', 'singer']
        }
    },
    mounted() {
        this.$router.push('/index/default/'+this.tabs[0])
    },
    methods: {
        selectTabs(index) {
            if(this.tabIndex!=index)
            this.$router.push('/index/default/'+this.tabs[index])
            this.tabIndex = index;
        }
    }
}
</script>

<style lang="scss" scoped>
.main {

    display: flex;
    flex-direction: column;

    .title {
        font-size: 32px;
        margin: 10px 10px 15px 10px;
    }

    .tabs {
        display: flex;
        flex-direction: row;

        .item {
            width: 120px;
            margin: 0 14px;
            text-align: center;
            padding: 8px 0;

            &:hover {
                border-radius: 3px;
            }

            &.active {
                border-radius: 3px;
            }
        }
    }

    
}
</style>