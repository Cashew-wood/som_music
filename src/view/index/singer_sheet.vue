<template>
  <div class="sheet_main">
    <div class="cover">
      <el-image class="img" :src="sheet.cover + '?param=900y220'" fit="contain" />
      <div class="info">
        <div class="name color_main">
          {{ sheet.name }}
        </div>
        <div class="desc tx c color_secondary">
          {{ sheet.briefDesc }}
        </div>
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
  components: {
    SongListVue
  },
  async mounted() {
    this.id = this.$route.query.id;
    console.log(this.player);
    let sheet = await this.getDetail();
    //window.dispatchEvent(new CustomEvent('background', { detail: sheet.cover }))
    this.sheet = sheet;
    this.songList = await this.geSongs();
  },
  methods: {
    async nextPage() {
      this.page.offset++;
      this.songList = this.songList.concat(await this.geSongs());
    },
    async getDetail() {
      return (await this.$axios.get(`/artist/detail?id=${this.id}`)).data.data.artist;
    },
    async geSongs() {
      return (await this.$axios.get(`/artist/top/song?id=${this.id}`)).data.songs;
    },
    allPlay() {
      this.$parent.$parent.setPlayList(this.songList.map((e) => e.id));
    },
    play(item) {
      this.$parent.$parent.openSong(item.id);
    }
  },
};
</script>

<style lang="scss" scoped>
.sheet_main {
  display: flex;
  flex-direction: column;
  padding: 15px;

  .cover {
    position: relative;

    .img {
      opacity: 0.5;
      width: 100%;
    }
  }

  .info {
    position: absolute;
    bottom: 15px;
    left: 15px;
    right: 40px;
    flex: 1;

    .name {
      font-size: 36px;
      white-space: nowrap;
    }

    .desc {
      font-size: 14px;
      margin-top: 10px;
    }
  }

  .title {
    font-size: 18px;
    margin-top: 12px;
  }
}
</style>
