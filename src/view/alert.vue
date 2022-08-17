<template>
  <div class="alert_main main_bg">
    <div class="top">
      <span class="title">{{ title }}</span>
      <span
        class="close iconfont icon-guanbi icon_top_btn hover"
        @click="setWindowState('close')"
      ></span>
    </div>
    <div class="content">
      {{ content }}
    </div>
    <div class="floor">
      <button class="full" @click="setWindowState('close')">确定</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "提示",
      content: "",
    };
  },
  mounted() {
    if (window.native && window.native.isInit) {
      this.init();
    } else {
      window.addEventListener("native", this.init);
    }
  },
  methods: {
    init() {
      window.native.window.resize = false;
      window.native.window.width = 420;
      window.native.window.height = 160;
      window.native.window.showCenter();
      window.native.window.hideInTaskView();
      window.native.window.onVisible(async (e) => {
        if (!e) return;
        let value = await window.native.window.data.value;
        this.title = value.title || this.title;
        window.native.window.title = this.title;
        this.content = value.content;
      });
    },
    setWindowState() {
      window.native.window.hide();
    },
  },
};
</script>

<style lang="scss" >
.alert_main {
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  .top {
    height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .title {
      margin-left: 14px;
    }
    .close {
      padding: 10px;
      font-size: 18px;
    }
  }
  .content {
    flex: 1;
    padding: 10px 14px;
  }
  .floor {
    padding: 10px 14px;
    display: flex;
    justify-content: right;
    .full {
      width: 100px;
    }
  }
}
</style>