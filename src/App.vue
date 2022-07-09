<template>
  <router-view></router-view>
</template>

<script>
export default {
  setup() {},
  mounted() {
    let theme = document.createElement("style");
    document.body.appendChild(theme);
    let css =
      localStorage.getItem("theme") || this.getTheme("255,255,255", "0,0,0");
    theme.innerHTML = css;
    let root = document.querySelector("html");
    root.setAttribute("class", "theme");
    window.addEventListener("config", () => {
      console.log("config");
      let css=localStorage.getItem("theme");
      if(css) theme.innerHTML = css;
      console.log(theme.innerHTML);
      root.setAttribute("class", "theme");
      for (let subview in window.native.window.childs) {
        window.native.window.childs[subview].onMessage &&
          window.native.window.childs[subview].onMessage(10);
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key == "F12") {
        window.native.window.showDevTool();
      }
    });
    const setup = async () => {
      window.native.app.executablePath.then((e) => {
          this.global.executablePath=e;
          console.log(this.global);
        });
      if (window.native.window.parent) {
      } else {
        this.$router.push("/index");
      }
    };
    if (window.native && window.native.isInit) {
      setup();
    } else {
      window.addEventListener("native", setup);
    }
  },
};
</script>

<style>
</style>
