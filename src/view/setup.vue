<template>
  <div class="setup_main main_bg" @click="tapWindow">
    <div class="top">
      <div class="left color_secondary">
        <span class="iconfont icon-24gf-gear4" @click="setup" />
        <span class="title">设置</span>
      </div>
      <div class="right">
        <span
          class="close iconfont icon-guanbi icon_top_btn hover"
          @click="setWindowState('close')"
        ></span>
      </div>
    </div>
    <ScrollListVue class="content">
      <div class="title color_main">颜色</div>
      <div class="row">
        <div class="item">
          <span class="color_main">前景色：</span>
          <el-color-picker
            v-model="config.color"
            color-format="rgb"
            @active-change="changeColor"
          />
        </div>
        <div class="item">
          <span class="color_main">背景色：</span>
          <el-color-picker
            v-model="config.bgColor"
            show-alpha
            color-format="rgb"
            @active-change="changeBgColor"
          />
        </div>
      </div>
      <div class="title color_main">程序</div>
      <div class="row">
        <div class="item">
          <el-radio-group v-model="config.exit">
            <el-radio :label="false">最小化到托盘，不退出程序</el-radio>
            <el-radio :label="true">退出程序</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="title color_main">歌词</div>
      <div class="row">
        <div class="item">
          <el-radio-group v-model="config.lyric">
            <el-radio :label="true">显示歌词</el-radio>
            <el-radio :label="false">隐藏歌词</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <span class="color_main">字体：</span>
          <el-select v-model="config.lyricFont" class>
            <el-option v-for="item in fonts" :key="item" :label="item" :value="item" />
          </el-select>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <span class="color_main">字号：</span>
          <el-input-number v-model="config.lyricFontSize" :min="36" :max="128" />
        </div>
      </div>
      <div class="row">
        <div class="item">
          <span class="color_main">前景色：</span>
          <el-color-picker v-model="config.lyricForeground" color-format="hex" />
        </div>
        <div class="item">
          <span class="color_main">背景色：</span>
          <el-color-picker v-model="config.lyricBackground" color-format="hex" />
        </div>
      </div>
    </ScrollListVue>
  </div>
</template>

<script>
import { ColorPicker } from "vue-color-kit";
import "vue-color-kit/dist/vue-color-kit.css";
import ScrollListVue from "../components/ScrollList.vue";
export default {
  data() {
    return {
      colorPickerShow: false,
      bgColorPickerShow: false,
      fonts: [],
    };
  },
  setup() {
    window.native.window.width = 500;
    window.native.window.height = 700;
    window.native.window.showCenter();
    window.native.window.title = '设置';
  },
  async mounted() {
    window.native.window.addDragMoveArea(0, 0, await window.native.window.width, 40);
    this.fonts = await window.native.system.fonts;
    this.config.setSetup();
  },
  components: {
    ScrollListVue,
    ColorPicker,
  },
  methods: {
    changeColor(e) {
      this.config.color = e;
      this.preview();
    },
    changeBgColor(e) {
      this.config.bgColor = e;
      this.preview();

      console.log(e);
    },
    preview() {
      console.log(this.config.bgColor);
      let color = this.config.color.substring(4, this.config.color.lastIndexOf(")"));
      let bgcolor = this.config.bgColor.substring(
        5,
        this.config.bgColor.lastIndexOf(",")
      );
      let progress = this.increaseColor(bgcolor, "15,15,15");
      let deep = this.increaseColor(bgcolor, "60,60,60");
      let css = `html.theme {
  --color-text-primary: rgb(${color});
  --color-text-tinit: rgb(${this.increaseColor(color, "66,66,67", true)});
  --color-bg-primary: ${this.config.bgColor};
  --color-bg-light: rgb(${this.increaseColor(bgcolor, "35,35,35", true)});
  --color-bg-shadow: rgb(${this.increaseColor(bgcolor, "30,30,30", true)});
  --color-search-bg: rgba(${this.increaseColor(bgcolor, "51,51,51", true)}, 0.3);
  --color-scroll-bg: rgba(${deep}, 0.2);
  --color-scroll-slider: rgba(${deep}, 0.4);
  --color-progress-bg: rgb(${this.increaseColor(bgcolor, "17,17,17", true)});
  --color-progress-slider: rgb(${this.increaseColor(color, "204,204,204", true)});
  --color-progress-dot: rgb(${this.increaseColor(color, "153,153,153")});
  --color-select-hover: rgba(${deep}, 0.15);
  --color-select-active: rgba(${deep}, 0.3);
  --color-panel-shadow: rgba(${this.increaseColor(bgcolor, "255,255,255")}, 0.5);
  --color-volume-progress-bg: rgb(${progress});
  --color-volume-progress-slider: rgb(${this.increaseColor(progress, "30,30,30")});
  --color-split-line-tint: rgb(${this.increaseColor(color, "204,204,204")});
  --color-split-line-deep: rgb(${this.increaseColor(color, "153,153,153")});
  --color-text-btn-primary:rgb(${this.increaseColor(color, "66,66,67")});
  --color-border-primary: rgb(${this.increaseColor(bgcolor, "40,40,40")});
  --color-button-full: rgb(${this.increaseColor(bgcolor, "16,16,16", true)});
}`;
      localStorage.setItem("theme", css);

      window.dispatchEvent(new CustomEvent("config", { detail: css }));
    },
    tapWindow() {
      this.colorPickerShow = false;
      this.bgColorPickerShow = false;
    },
    increaseColor(color, rgb, reduce) {
      let rgbs = color.split(",");
      let rgbs1 = rgb.split(",");
      let newRgb = [];
      for (let i = 0; i < 3; i++) {
        newRgb[i] = reduce
          ? parseInt(rgbs[i]) - parseInt(rgbs1[i])
          : parseInt(rgbs[i]) + parseInt(rgbs1[i]);
        if (newRgb[i] < 0) {
          newRgb[i] = Math.abs(newRgb[i]);
        } else if (newRgb[i] > 255) {
          newRgb[i] = parseInt(rgbs[i]) - parseInt(rgbs1[i]);
        }
      }
      return newRgb.join();
    },
    setWindowState(state) {
      if (state == "close") {
        window.native.window.close();
      }
    },
  },
};
</script>

<style lang="scss">
.setup_main {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left {
      margin-left: 12px;

      .title {
        font-size: 16px;
        margin-left: 8px;
      }
    }

    .right {
      padding: 10px 12px;

      .close {
        font-size: 20px;
      }
    }
  }

  .content {
    padding: 10px;

    .title {
      font-size: 24px;
    }

    .row {
      display: flex;
      flex-wrap: wrap;
      margin: 10px 0;
    }

    .item {
      display: flex;
      align-items: center;
      margin-left: 16px;
      font-size: 16px;

      .color {
        width: 10px;
        height: 10px;
      }
    }
  }
}
</style>
