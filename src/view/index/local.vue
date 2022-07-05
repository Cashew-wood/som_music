<template>
  <div class="song-list-main">
    <div class="row color_secondary">
      <span class="num col">序号</span>
      <span class="name col">名称</span>
      <span class="size col">大小</span>
      <span class="time col">时间</span>
    </div>
    <div class="song-list">
      <div class="list scroll">
        <div
          class="row color_main select h"
          :class="{ a: player.ids[player.index] == song.id }"
          v-for="(song, index) in localFile"
          :key="index"
          @click="tapItem(song)"
        >
          <span class="num col">{{ index + 1 }}</span>
          <span class="name col tx a">{{ song.name }}</span>
          <span class="size col">{{ song.size }}</span>
          <span class="time col">{{ dateTime(song.time) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  mounted() {
  },
  methods:{
    tapItem(item) {
      this.$parent.$parent.openSong(item.id);
    }
  }
};
</script>

<style lang="scss" scoped>
.song-list-main {
  flex: 1;
  display: flex;
  flex-direction: column;
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
    }
  }

  .row {
    display: flex;

    .num {
      width: 80px;
      text-align: center;
    }

    .name {
      flex: 1;
    }
    .size{
        width: 120px;
    }
    .time {
      width: 200px;
    }
    .col {
      box-sizing: border-box;
      padding: 10px;
      white-space: nowrap;
    }
  }
}
</style>