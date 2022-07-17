<template>
  <div class="menu_main main_bg">
    <div
      class="item color_main select h"
      v-for="(text, i) in items"
      :key="i"
      @click="selectItem(i)"
    >
      {{ text }}
    </div>
  </div>
</template>
<script>
let left, top, width, height;
export default {
  data() {
    return {
      items: ["打开主页面", "设置", "退出"],
      interval: 0,
      rate:1
    };
  },
  async mounted() {
    if (window.native && window.native.isInit) {
      this.init();
    } else {
      window.addEventListener("native", this.init);
    }
  },
  methods: {
    async init() {
      width = 180;
      height = 150;
      window.native.window.width = width;
      window.native.window.height = height;
      window.native.window.hideInTaskView();
      window.native.window.onMessage = async (type, value) => {
        if (type == 0) {
        console.log(value.x * this.rate);
          left = value.x * this.rate - width / 2;
          top = value.y * this.rate - height;
          window.native.window.left = left;
          window.native.window.top = top;
          this.interval = Date.now();
          window.native.window.show(false);
          window.native.window.topmost=true;
          width = width == 180 ? width + 1 : width - 1;
          window.native.window.width = width;
        } else if (type == 10) {
          window.dispatchEvent(new CustomEvent("config"));
        }
      };
      window.native.device.mouse.addGlobalEvent((type, button, x, y) => {
        if (
          type > -1 &&
          type != 5 &&
          (left > x || left + width < x || top > y || top + height < y)
        ) {
          if (Date.now() - this.interval > 500) {
            window.native.window.hide();
          }
        } else if (type == 0) {
          console.log(x, x);
        }
      });
      setTimeout(() => {
        window.native.device.mouse.initGlobalEvent();
      }, 1000);
      this.rate=(await this.global.device.screenActualSize).width/(await this.global.device.screenSize).width
    },
    selectItem(i) {
      window.native.window.parent.onMessage({
        source: "menu",
        type: 0,
        value: i,
      });
    },
  },
};
</script>
<style lang="scss">
.menu_main {
  height: 100%;

  display: flex;
  flex-direction: column;
  border-radius: 10px;

  .item {
    padding: 10px 12px;
    font-size: 16px;
    text-align: center;
  }
}
</style>
