<template>
  <router-view></router-view>
</template>

<script>
export default {
  setup() { },
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
      let css = localStorage.getItem("theme");
      if (css) theme.innerHTML = css;
      root.setAttribute("class", "theme");
      for (let subview in window.native.window.childs) {
        window.native.window.childs[subview].onMessage &&
          window.native.window.childs[subview].onMessage(10);
      }
    });
    const setup = () => {
      this.global.device = this.lazy(window.native.device);
      window.native.app.executablePath.then((e) => {
        this.global.executablePath = e;
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
    document.body.addEventListener('keydown',(e=>{
      if(e.code=='F12')
        window.native.window.showDevTool();
    }))
  },
  methods: {
    lazy(obj) {
      return new Proxy({}, {
        get(target, p) {
          
          if(typeof p !='string' || p.startsWith('__v'))return;
          return new Promise((r, s) => {
            if (target[p]) r(target[p]);
            obj[p].then(r);
          })
        }
      })
    }
  }
};
</script>

<style>
</style>
