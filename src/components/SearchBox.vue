<template>
    <div class="search">
        <div class="placeholder" @click="placeholder" v-show="!focus && !value">
            <span class="iconfont color_secondary icon-sousuo"></span>
            <span class="text color_secondary">搜索音乐</span>
        </div>
        <input ref="_search_input" v-model="value" class="input color_main" @blur="focus=false" />
    </div>
</template>
<script>
export default {
    name: 'App',
    data(){
        return {
            focus:false,
            value:''
        }
    },
    setup() {
    },
    methods:{
        placeholder(){
            this.$refs['_search_input'].focus();
            this.focus=true;
        }
    }
}
</script>
<style lang="scss" scoped>
  .search {
    border-radius: 20px;
    position: relative;

    .placeholder {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      display: flex;
      align-items: center;

      .iconfont {
        margin: 0 10px 0 20px;
      }

      .text {
        font-size: 15px;

      }
    }

    .input {
      padding: 12px 20px;
      width: calc(100% - 40px);
      border: 0;
      outline: none;
      background-color: transparent;
    }
  }
</style>