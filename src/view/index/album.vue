<template>
  <div class="album_main">
    <div class="top">
      <img class="img" :src="album.picUrl + '?param=180y180'" />
      <div class="info">
        <span class="name color_main">{{ album.name }}</span>
        <span class="company color_secondary" v-if="album.company"
          >发行公司：{{ album.company }}</span
        >
        <div class="desc color_secondary">
          <span class="label"> 简介：</span>
          <span class="value tx c">{{ album.description }}</span>
        </div>
        <button class="play" @click="allPlay">全部播放</button>
      </div>
    </div>
    <div class="title color_main">歌曲</div>
    <div class="song-list">
      <div class="list scroll">
        <div
          class="row color_main hover"
          v-for="(song, index) in songList"
          :key="index"
          @click="play(song)"
        >
          {{ song.name }} - {{ song.ar.map((e) => e.name).join() }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      album: {},
      songList: [],
      albumId: null,
    };
  },
  async mounted() {
    this.albumId = this.$route.query.id;
    let album = await this.getDetail();
    this.album = album.album;
    this.songList = album.songs;
    console.log(this.album);
  },
  methods: {
    async getDetail() {
      return (await this.$axios.get("/album?id=" + this.albumId)).data;
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

<style lang="scss">
.album_main {
  display: flex;
  flex-direction: column;
  padding: 15px;

  .top {
    display: flex;

    .img {
      width: 180px;
      height: 180px;
      border-radius: 10px;
    }

    .info {
      margin-left: 16px;
      display: flex;
      flex-direction: column;

      .name {
        font-size: 28px;
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
    margin: 16px 0;
  }

  .song-list {
    position: relative;
    flex: 1;

    .list {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      display: flex;
      flex-direction: column;
      overflow-y: scroll;

      .row {
        padding: 10px;
      }
    }
  }
}
</style>
