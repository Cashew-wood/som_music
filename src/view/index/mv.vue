<template>
  <div class="mv_main">
    <ScrollListVue>
      <div class="title color_main">推荐</div>
      <div class="list">
        <div
          class="block"
          v-for="(item, i) in personalized"
          :key="i"
          @click="look(item)"
        >
          <img class="img" :src="item.picUrl + '?param=185y105'" />
          <div class="info color_main tx a">
            {{ item.name }}
          </div>
        </div>
      </div>
      <div class="title color_main">最新</div>
      <div class="list">
        <div
          class="block"
          v-for="(item, i) in exclusive"
          :key="i"
          @click="look(item)"
        >
          <img class="img" :src="item.cover + '?param=185y105'" />
          <div class="info color_main tx a">
            {{ item.name }}
          </div>
        </div>
      </div>
      <div class="title color_main">独家</div>
      <div class="list">
        <div
          class="block"
          v-for="(item, i) in news"
          :key="i"
          @click="look(item)"
        >
          <img class="img" :src="item.cover + '?param=185y105'" />
          <div class="info color_main tx a">
            {{ item.name }}
          </div>
        </div>
      </div>
    </ScrollListVue>
  </div>
</template>

<script>
import ScrollListVue from "../../components/ScrollList.vue";
import icon from '../../static/img/logo.png'
let video;
export default {
  data() {
    return {
      personalized: [],
      exclusive: [],
      news: [],
    };
  },
  async mounted() {
    window.native.window.createWindow(location.origin+'#video',true).then((win) => {
      win.icon = icon;
      win.width = 800;
      video = win;
    });
    this.personalized = await this.getPersonalized();
    this.exclusive = await this.getExclusive();
    this.news = await this.getNews();
  },
  components: {
    ScrollListVue,
  },
  methods: {
    async getPersonalized() {
      return (await this.$axios.get("/personalized/mv")).data.result;
    },
    async getNews() {
      return (await this.$axios.get("/mv/first?limit=10")).data.data;
    },
    async getExclusive() {
      return (await this.$axios.get("/mv/exclusive/rcmd?limit=10")).data.data;
    },
    async getVideo(id) {
      return (await this.$axios.get("/mv/url?id=" + id)).data.data.url;
    },
    async look(item) {
      let url = await this.getVideo(item.id);
      video.data.src = url;
      video.title = item.name;
      video.show(true, () => {});
    },
  },
};
</script>

<style lang="scss">
.mv_main {
  display: flex;
  flex-direction: column;

  .title {
    font-size: 24px;
    margin: 10px 0;
  }

  .list {
    display: flex;
    flex-wrap: wrap;

    .block {
      width: 25%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 15px;

      .img {
        width: 80%;
      }

      .info {
        margin-top: 12px;
        width: 80%;
      }
    }
  }
}
</style>
