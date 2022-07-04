<template>
  <div class="lyric_main">
    <canvas class="canvas" id="layer0" :width="width" :height="height"></canvas>
    <canvas class="canvas" id="layer1" :width="width" :height="height"></canvas>
  </div>
</template>

<script>
let lyric = [];
let lyricIndex = 0;
let canvas = [];
let current;
let duration;
let textSize;
let screen;
let defaultDisplay = [{ t: -1, text: "Som 音乐" }];
export default {
  data() {
    return {
      width: 0,
      height: 0,
    };
  },

  setup() {},
  mounted() {
    console.log("lyric");
    document.querySelector("#app").setAttribute("class", "lyric_app");
    if (window.native && window.native.isInit) {
      this.init();
    } else {
      window.addEventListener("native", this.init);
    }
  },
  methods: {
    async init() {
      screen = {
        width: await window.native.device.screenWidth,
        height: await window.native.device.screenHeight,
      };
      for (let element of document.querySelectorAll(".canvas")) {
        canvas.push(element.getContext("2d"));
      }
      console.log("layer", canvas);
      lyric = defaultDisplay;
      this.setColor();
      this.setShadow();
      this.setFont();
      window.native.window.top = parseInt(screen.height) - 70 * 2;
      window.native.window.addDragMoveArea(0, 0, 2000, 2000);
      window.native.window.hideInTaskView();
      window.native.window.onMessage = (type, data) => {
        if (type == 0) {
          current = data.current * 1000;
          duration = data.duration * 1000;
          this.draw();
        } else if (type == 1) {
          this.setLyric(data);
        } else if (type == 10) {
          this.config.refresh();
          console.log("setFont");
          this.setFont();
        }
      };
    },
    setLyric(str) {
      console.log(str);
      lyric = [];
      for (let line of str.split("\n")) {
        if (line.trim().length == 0) continue;
        let start = 0;
        let times = [];
        let end = 0;
        while (line[start] == "[") {
          start += 1;
          end = line.indexOf("]", start);
          let time = line.substring(start, end);
          start = end + 1;
          let m_s_ms = time.split(":");
          let s_ms = m_s_ms[1].split(".");
          times.push(
            parseInt(m_s_ms[0]) * 60000 +
              parseInt(s_ms[0]) * 1000 +
              parseInt(s_ms[1])
          );
        }
        for (let t of times) {
          lyric.push({ t, text: line.substring(start).trim() });
        }
      }
      lyric = lyric.sort((a, b) => a.t - b.t);
      console.log(lyric);
    },
    setColor() {
      // foreground = canvas.createLinearGradient(0, 0, 0, canvasDom.height);
      // let colors = [
      //   "#d16ba5",
      //   "#c777b9",
      //   "#ba83ca",
      //   "#aa8fd8",
      //   "#9a9ae1",
      //   "#8aa7ec",
      //   "#79b3f4",
      //   "#69bff8",
      //   "#52cffe",
      //   "#41dfff",
      //   "#46eefa",
      //   "#5ffbf1",
      // ];
      // for (let i = 0; i < colors.length; i++) {
      //   foreground.addColorStop(((1 / (colors.length - 1)) * i).toFixed(2), colors[i]);
      // }
      // grd = canvas.createLinearGradient(0, 0, 0, canvasDom.height);
      // colors = formatColors(
      //   "#720c47, #6b1956, #612463, #542d6e, #423677, #32407e, #1e4982, #005184, #005c83, #00657e, #016d77, #2f7470"
      // );
      // for (let i = 0; i < colors.length; i++) {
      //   grd.addColorStop(((1 / (colors.length - 1)) * i).toFixed(2), colors[i]);
      // }
      canvas[0].fillStyle = this.config.lyricForeground;
      canvas[1].fillStyle = this.config.lyricBackground;
      console.log(canvas[0].fillStyle, canvas[1].fillStyle);
    },
    setShadow() {
      for (let item of canvas) {
        item.shadowColor = this.config.lyricShadowColor;
        item.shadowBlur = this.config.lyricShadowSize;
      }
    },
    setFont(notDraw) {
      console.log("set font");
      let any = canvas[0];
      any.font = `${this.config.lyricFontSize}px ${this.config.lyricFont}`;
      console.log(any.font);
      textSize = any.measureText(lyric[lyricIndex].text);
      let w = textSize.width,
        h =
          textSize.actualBoundingBoxAscent +
          textSize.actualBoundingBoxDescent +
          this.config.lyricShadowSize -
          1;
      console.log(textSize);
      window.native.window.height = h;
      window.native.window.width = w;
      window.native.window.left = parseInt(screen.width / 2 - w / 2);
      this.width = w;
      this.height = h;
      textSize.index = lyricIndex;
      this.$nextTick(() => {
        //set w/h auto clear property
        for (let item of canvas) {
          item.font = `${this.config.lyricFontSize}px ${this.config.lyricFont}`;
        }
        this.setColor();
        this.setShadow();
        !notDraw && this.draw();
      });
    },
    draw() {
      for (let item of canvas) {
        item.clearRect(0, 0, this.width, this.height);
      }
      if (lyric.length == 0) return;
      let rate;
      if (lyric[0].t == -1) {
        lyricIndex = 0;
        rate = 1;
      } else {
        let now = current;
        lyricIndex = lyric.findIndex((e) => e.t > now) - 1;
        if (lyricIndex > -1) {
          let next =
            lyricIndex + 1 == lyric.length ? duration : lyric[lyricIndex + 1].t;
          let d = now - lyric[lyricIndex].t;
          rate = d / (next - lyric[lyricIndex].t);
        } else if (lyric.length > 0) {
          lyricIndex = lyric.length - 1;
          rate = 1;
        } else {
          lyric = defaultDisplay;
          return;
        }
      }
      let text = lyric[lyricIndex].text;
      if (!textSize || textSize.index != lyricIndex) {
        this.setFont(true);
      }
      let x = textSize.width * rate;
      let startX = 0;
      canvas[0].fillText(
        text,
        startX,
        this.height -
          textSize.actualBoundingBoxDescent -
          this.config.lyricShadowSize +
          1
      );
      canvas[0].clearRect(startX + x, 0, this.width - x - startX, this.height);
      canvas[1].fillText(
        text,
        startX,
        this.height -
          textSize.actualBoundingBoxDescent -
          this.config.lyricShadowSize +
          1
      );
      canvas[1].clearRect(startX, 0, x, this.height);
    },
  },
};
function formatColors(str) {
  var a = [];
  for (let color of str.split(",")) {
    a.push(color.trim());
  }
  return a;
}
</script>

<style>
body,
html,
.lyric_app {
  padding: 0 !important;
  margin: 0;
}

.lyric_main {
  width: 100%;
  height: 100%;
  position: relative;
}

.canvas {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
</style>
