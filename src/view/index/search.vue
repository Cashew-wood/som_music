<template>
  <SongListVue :songList="songList" @play="play"></SongListVue>
</template>
<script>
import SongListVue from "../../components/SongList.vue";
export default {
  data() {
    return {
      songList: [],
      keyword: "",
    };
  },
  components: {
    SongListVue,
  },
  async mounted() {
    this.keyword = this.$route.query.value;
    window.addEventListener("search", ({ detail }) => {
      this.keyword = detail;
      this.searchSong();
    });
    console.log(this.keyword);
    this.searchSong();
  },
  methods: {
    async searchSong() {
      this.songList = (
        await this.$axios.get("/cloudsearch?keywords=" + this.keyword)
      ).data.result.songs;
    },
    play(item) {
      this.$parent.$parent.openSong(item.id);
    },
  },
};
</script>
<style>
</style>