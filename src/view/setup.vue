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
      <div class="row">
        <div class="item">
          <el-checkbox
            v-model="config.defaultPlayer"
            label="设为默认播放器"
            size="large"
            @change="defaultPlayer"
          />
        </div>
        <div class="item">
          <el-checkbox
            v-model="config.startup"
            label="开机启动"
            size="large"
            @change="startup"
          />
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
            <el-option
              v-for="item in fonts"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <span class="color_main">字号：</span>
          <el-input-number
            v-model="config.lyricFontSize"
            :min="36"
            :max="128"
          />
        </div>
      </div>
      <div class="row">
        <div class="item">
          <span class="color_main">前景色：</span>
          <el-color-picker
            v-model="config.lyricForeground"
            color-format="hex"
          />
        </div>
        <div class="item">
          <span class="color_main">背景色：</span>
          <el-color-picker
            v-model="config.lyricBackground"
            color-format="hex"
          />
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
  setup() {},
  async mounted() {
    window.native.window.addDragMoveArea(
      0,
      0,
      await window.native.window.width,
      40
    );
    this.fonts = await window.native.system.fonts;
    window.native.window.resize = false;
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
      let color = this.config.color.substring(
        4,
        this.config.color.lastIndexOf(")")
      );
      let bgcolor = this.config.bgColor.substring(
        5,
        this.config.bgColor.lastIndexOf(",")
      );
      let css = this.getTheme(bgcolor, color);
      localStorage.setItem("theme", css);

      window.dispatchEvent(new CustomEvent("config", { detail: css }));
    },
    tapWindow() {
      this.colorPickerShow = false;
      this.bgColorPickerShow = false;
    },
    setWindowState(state) {
      if (state == "close") {
        window.native.window.hide();
      }
    },
    async defaultPlayer() {
      if (this.config.defaultPlayer) {
        let executablePath = this.global.executablePath;
        let path = executablePath.substring(
          0,
          executablePath.lastIndexOf("\\")
        );
        await window.native.system.fileAssociation([
          {
            type: ".mp3",
            name: "somMusic",
            description: "Som 音乐",
            icon: path + "\\icon.ico",
            commands: [
              { path: executablePath, command: "open" },
              { path: executablePath, command: "play" },
            ],
          },
          {
            type: ".wav",
            name: "somMusic",
            description: "Som 音乐",
            icon: path + "\\icon.ico",
            commands: [
              { path: executablePath, command: "open" },
              { path: executablePath, command: "play" },
            ],
          },
        ]);
        this.checkConfig();
      } else {
        window.native.system.clearFileAssociation([".mp3", ".wav"]);
      }
    },
    async startup() {
      if (this.config.startup) {
        console.log(this.global.executablePath);
        console.log(
          await window.native.system.createLnk(
            this.global.executablePath,
            "startup",
            "Som 音乐",
            null,
            (await window.native.io.getPath(6)) + "\\SomMusic.lnk"
          )
        );
      } else {
        window.native.io.delete(
          (await window.native.io.getPath(6)) + "\\SomMusic.lnk"
        );
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
