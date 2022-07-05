<template>
  <div class="menu_main main_bg" v-show="show">
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
      show: false,
      items: ["打开主页面", "设置", "退出"],
    };
  },
  watch: {
    show(n, o) {
      if (n) {
        window.native.window.topmost = true;
      } else {
        //clearInterval(id);
        window.native.window.topmost = false;
        console.log("hide");
      }
    },
  },
  async mounted() {
    if (window.native && window.native.isInit) {
      this.init();
    } else {
      window.addEventListener("native", this.init);
    }
  },
  methods: {
    init() {
      width = 180;
      height = 150;
      window.native.window.width = width;
      window.native.window.height = height;
      window.native.window.hideInTaskView();
      window.native.window.onMessage = (type, value) => {
        console.log(value);
        if (type == 0) {
          left = value.x - width / 2;
          top = value.y - height;
          window.native.window.left = left;
          window.native.window.top = top;
          this.show = true;
        } else if (type == 10) {
          window.dispatchEvent(new CustomEvent("config"));
        }
      };
      window.native.window.onDeactivated(() => {
        this.show = false;
      });
      window.native.device.mouse.addGlobalEvent((type, button, x, y) => {
        if (
          type > -1 &&
          type != 5 &&
          (left > x || left + width < x || top > y || top + height < y)
        ) {
          this.show = false;
        } else if (type == 0) {
          console.log(x, x);
        }
      });
      setTimeout(() => {
        window.native.device.mouse.initGlobalEvent();
      }, 2000);
    },
    selectItem(i) {
      window.native.window.parent.onMessage({
        source: "menu",
        type: 0,
        value: i,
      });
      this.show = false;
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
