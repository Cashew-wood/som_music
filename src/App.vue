<template>
  <router-view></router-view>
</template>

<script>
export default {
  setup() {},
  mounted() {
    let theme = document.createElement("style");
    document.body.appendChild(theme);
    theme.innerHTML = localStorage.getItem("theme");
    let root = document.querySelector("html");
    root.setAttribute("class", "theme");
    window.addEventListener("config", () => {
      console.log("config");
      theme.innerHTML = localStorage.getItem("theme");
      console.log(theme.innerHTML);
      root.setAttribute("class", "theme");
      for (let subview in window.native.window.subwindows) {
        window.native.window.subwindows[subview].onMessage &&
          window.native.window.subwindows[subview].onMessage(10);
      }
    });
    const setup = async () => {
      if (window.native.window.parent) {
        console.log(await window.native.window.data.page);
        this.$router.push(await window.native.window.data.page);
      } else {
        this.$router.push("/index");
      }
    };
    if (window.native && window.native.isInit) {
      setup();
    } else {
      console.log("wait native");
      window.addEventListener("native", setup);
    }
  },
};
</script>

<style></style>
