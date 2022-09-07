<template>
  <div class="sheet_main">
    <div class="top">
      <el-image class="img" :src="sheet.coverImgUrl + '?param=180y180'" />
      <div class="info">
        <span class="name color_main">{{ sheet.name }}</span>
        <span class="company color_secondary" v-if="sheet.company"
          >类型：{{ sheet.tag }}</span
        >
        <div class="desc color_secondary">
          <span class="label"> 简介：</span>
          <span class="value tx c">{{ sheet.description }}</span>
        </div>
        <button class="play" @click="allPlay">全部播放</button>
      </div>
    </div>
    <div class="title color_main">歌曲</div>
    <SongListVue :songList="songList" @play="play" :next="nextPage"></SongListVue>
  </div>
</template>

<script>
import SongListVue from '../../components/SongList.vue';
export default {
  data() {
    return {
      sheet: {},
      songList: [],
      id: null,
      page: {
        offset: 0,
        limit: 50,
      },
      loading: false,
    };
  },
  components:{
    SongListVue
  },
  async mounted() {
    this.id = this.$route.query.id;
    console.log(this.player);
    let sheet = await this.getDetail();
    this.sheet = sheet.playlist;
    this.songList = await this.geSongs();
  },
  methods: {
    async getDetail() {
      return (await this.$axios.get("/playlist/detail?id=" + this.id)).data;
    },
    async nextPage(){
      this.page.offset++;
      this.songList=this.songList.concat(await this.geSongs());
    },
    async geSongs() {
      return (
        await this.$axios.get(
          `/playlist/track/all?id=${this.id}&limit=${this.page.limit}&offset=${this.page.offset}`
        )
      ).data.songs;
    },
    allPlay() {
      this.$parent.$parent.setPlayList(this.songList.map((e) => e.id));
    },
    play(item) {
      this.$parent.$parent.openSong(item.id);
    },
  },
};
</script>

<style lang="scss" scoped>
.sheet_main {
  display: flex;
  flex-direction: column;
  padding: 15px;

  .top {
    display: flex;

    .img,.el-image__inner {
      width: 180px;
      height: 180px;
      border-radius: 10px;
    }

    .info {
      margin-left: 16px;
      display: flex;
      flex-direction: column;
      flex:1;

      .name {
        font-size: 28px;
        white-space: nowrap;
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
    margin: 16px 0 4px 0;
  }
}

</style>
