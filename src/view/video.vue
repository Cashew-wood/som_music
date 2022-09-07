<template>
  <div class="video_main">
    <div class="title-bar" v-show="!windowMax">
      <span class="left">{{ title }}</span>
      <div class="right">
        <span class="max iconfont icon-3zuidahua-1" @click="max"></span>
        <span class="close iconfont icon-guanbi" @click="close"></span>
      </div>
    </div>
    <video id="video" controls :src="src" autoplay :style="{ height: windowHeight ? windowHeight + 'px' : '' }"></video>
  </div>
</template>

<script>
let video;
let resize = null;
export default {
  data() {
    return {
      src: null,
      title: null,
      windowMax: false,
      windowHeight: 0
    };
  },
  setup() { },
  async mounted() {
    video = document.getElementById("video");
    video.addEventListener("webkitfullscreenchange", this.fullscreen);
    video.addEventListener("fullscreenchange", this.fullscreen);

    video.addEventListener("canplay", () => {
      if (!resize) {
        this.resize();
        resize = new ResizeObserver((e) => {
          console.log(e);
          this.windowHeight = document.getElementById("app").offsetHeight;
        })
        resize.observe(document.getElementById("app"));
      }
    });
    window.native.window.addDragMoveArea(
      0,
      0,
      await window.native.window.width,
      40
    );
    window.native.window.onVisible(async (e) => {
      if (e) {
        this.src = await window.native.window.data.src;
        this.title = (await window.native.window.title) || "Som Music";
      } else {
        video.pause();
      }
    });
  },
  methods: {
    fullscreen() {
      if (document.webkitFullscreenElement) {
        window.native.window.state = "max";
        this.windowMax = true;
      } else {
        window.native.window.state = "normal";
        this.windowMax = false;
      }
    },
    resize() {
      window.native.window.height = video.offsetHeight + 20;
      window.native.window.showCenter();
    },
    close() {
      resize = null;
      window.native.window.hide();
    },
    max() {
      window.native.window.state = "max";
      video.requestFullscreen();
      this.windowMax = true;
    },
  },
};
</script>

<style lang="scss">
#app {
  overflow: hidden;
}

#video {
  width: 100%;
  box-shadow: 0 0 4px #000;
  padding: 0;
}

.video_main {
  position: relative;
  background-color: #000;
}

.title-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  background-color: rgba(43, 51, 63, 0.5);
  align-items: center;
  height: 41px;
  z-index: 1;

  .left {
    margin-left: 12px;
    color: #fff;
    flex: 1;
    text-align: center;
  }

  .close,
  .max {
    padding: 10px 12px;
    font-size: 20px;
    color: #fff;

    &:hover {
      color: #ccc;
    }
  }
}
</style>
