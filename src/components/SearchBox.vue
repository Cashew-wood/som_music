<template>
  <div class="search">
    <div class="placeholder" @click="placeholder" v-show="!focus && !value">
      <span class="iconfont color_secondary icon-sousuo"></span>
      <span class="text color_secondary">搜索音乐</span>
    </div>
    <input ref="_search_input" v-model="value" class="input color_main" @blur="blurEvent" @focus="focusEvent"
      @keydown="keyDown" @input="inputChange" />
    <div class="hot-search panel main_bg" v-show="hotShow">
      <div class="view">
        <div class="title color_main">热门搜索</div>
        <div class="list">
          <div class="row select h" v-for="(item, i) in hots" :key="i">
            <span class="left">{{ item.searchWord }}</span>
            <span class="right">{{ item.score }}</span>
          </div>
        </div>
      </div>
      <div class="view">
        <div class="title color_main">搜索历史</div>
        <div class="list">
          <div class="row select h" v-for="(item, i) in hots" :key="i">
            <span class="left">{{ item.searchWord }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="propose-search panel main_bg" v-show="proposeShow">
      <div class="view">
        <div class="title color_main">在线音乐</div>
        <div class="list">
          <div class="row select h" v-for="(item, i) in propose" :key="i" @click="selectPropose(item.keyword)">
            <span class="left">{{ item.keyword }}</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
let proposeId;
export default {
  name: 'App',
  data() {
    return {
      focus: false,
      value: '',
      hots: [],
      searchHistory: [],
      hotShow: false,
      propose: [],
      proposeShow: false
    }
  },
  async mounted() {
    let list = await this.getHot();
    for (let item of list) {
      if (item.score > 10000) {
        item.score = parseInt(item.score / 10000) + '万';
      }
    }
    this.hots = list;
  },
  methods: {
    placeholder() {
      this.$refs['_search_input'].focus();
      this.focus = true;
    },
    async focusEvent() {
      !this.value && (this.hotShow = true);
      this.value && (this.proposeShow = true);
    },
    async getHot() {
      return (await this.$axios.get('/search/hot/detail')).data.data.splice(0, 10)
    },
    async keyDown(e) {
      if (e.key == 'Enter') {

      }
    },
    inputChange() {
      clearInterval(proposeId)
      this.hotShow = false;
      if (!this.value) {
        this.hotShow = true;
        this.proposeShow = false;
        return;
      }
      proposeId = setTimeout(async () => {
        if (!this.value) {
          return;
        }
        this.propose = await this.getHostPropose(this.value);
        this.proposeShow = true;
      }, 750);
    },
    async getHostPropose(keyword) {
      return (await this.$axios.get('/search/suggest?keywords=' + keyword + '&type=mobile')).data.result.allMatch
    },
    selectPropose(keyword) {
      this.value = keyword;
      this.proposeShow = false;
    },
    blurEvent() {
      setTimeout(() => {
        this.focus = false;
        this.hotShow = false;
        this.proposeShow = false;
      }, 200);
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

  .panel {
    position: absolute;
    top: calc(100% + 20px);
    left: 0;
    border-radius: 10px;
    padding: 10px;
    display: flex;
    flex-direction: row;

    .title {
      font-size: 16px;
      padding: 10px;
      border-bottom: 1px solid var(--color-border-deep);
    }

    .list {
      .row {
        padding: 8px 10px;
        display: flex;
        flex-direction: row;
        width: 220px;
        justify-content: space-between;
        font-size: 14px;
      }
    }
  }
}
</style>