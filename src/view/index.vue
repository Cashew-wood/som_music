<template>
  <div class="main main_bg" @click="pageTap">
    <div class="main_top">
      <div class="title color_main">Som 音乐</div>
      <div class="mid">
        <SearchBox class="search" />
      </div>
      <div class="right">
        <span class="iconfont icon-24gf-gear4 icon_top_btn hover" @click="setup" />
        <span class="min iconfont icon-24gl-minimization icon_top_btn hover" @click="setWindowState('min')"></span>
        <span class="max iconfont icon-3zuidahua-1 icon_top_btn hover" @click="
          windowState == 'max'
            ? setWindowState('normal')
            : setWindowState('max')
        "></span>
        <span class="close iconfont icon-guanbi icon_top_btn hover" @click="setWindowState('close')"></span>
      </div>
    </div>
    <div class="body">
      <div class="left-menu">
        <div class="label color_secondary">在线音乐</div>
        <div class="item select h" :class="{ a: menuSelect == 0 }" @click="selectMenu(0)">
          <span class="iconfont color_main icon-yinle"></span>
          <span class="text color_main">音乐馆</span>
        </div>
        <div class="item select h" :class="{ a: menuSelect == 1 }" @click="selectMenu(1)">
          <span class="iconfont color_main icon-24gf-videoCamera"></span>
          <span class="text color_main">MV</span>
        </div>
        <div class="label color_secondary">我的音乐</div>
        <div class="item select h" :class="{ a: menuSelect == 2 }" @click="selectMenu(2)">
          <span class="iconfont color_main icon-diannao"></span>
          <span class="text color_main">本地音乐</span>
        </div>
      </div>
      <div class="content">
        <div class="absolute">
          <router-view ref="subview" class="center-area"></router-view>
          <div class="player">
            <el-slider v-model="player.progress" class="progress" size="small" :max="2000"
              :format-tooltip="progressTooltip" :disabled="player.status == 0" @change="dragProgress"
              @mousedown="skipProgress" />
            <div class="left">
              <img class="pic" v-if="player.pic" :src="player.pic + '?param=48y48'" />
              <img class="pic" v-else src="../static/img/default_music.jpg" />
              <div class="info">
                <span class="name color_main">{{
                player.name || "Som Music"
                }}</span>
                <span class="time color_secondary">{{ player.current }}/{{ player.duration }}</span>
              </div>
            </div>
            <div class="mid">
              <span class="item iconfont last icon-24gf-previous color_main hover" @click="last"></span>
              <span class="item iconfont play color_main hover" :class="
                player.status == 1
                  ? 'icon-24gf-pauseCircle'
                  : 'icon-24gf-playCircle'
              " @click="play"></span>
              <span class="item iconfont next icon-24gf-next color_main hover" @click="next"></span>
              <el-tooltip class="box-item" effect="dark" placement="top-start" v-model:visible="volumePanel"
                trigger="focus" :show-arrow="false">
                <template v-slot>
                  <span class="item iconfont volume color_main" @click="showVolumePanel" @click.stop :class="
                    volumeIcon[
                    player.volume && player.volume != 100
                      ? parseInt((player.volume / 100) * 3) + 1
                      : player.volume == 100
                        ? 3
                        : 0
                    ]
                  "></span>
                </template>
                <template v-slot:content>
                  <div class="volume-panel" @click.stop>
                    <el-slider v-model="player.volume" vertical height="125px" @input="setVolume($event)">
                    </el-slider>
                    <span class="text color_main">{{ player.volume }}%</span>
                    <span class="item iconfont volume color_main hover" @click="setVolume(player.volume > 0 ? 0 : 100)"
                      :class="
                        volumeIcon[
                        player.volume && player.volume != 100
                          ? parseInt((player.volume / 100) * 3) + 1
                          : player.volume == 100
                            ? 3
                            : 0
                        ]
                      "></span>
                  </div>
                </template>
              </el-tooltip>
            </div>
            <div class="right"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let audio = new Audio();
import SearchBox from "../components/SearchBox.vue";
import icon from "../static/img/logo.png";
let lyric;
let audioId;
let menu;
let setup;
let alert;
export default {
  name: "App",
  components: {
    SearchBox,
  },
  data() {
    return {
      menuSelect: 0,
      windowState: "normal",
      windowWidth: 1200,
      volumeIcon: [
        "icon-24gf-volumeCross",
        "icon-24gf-volumeLow",
        "icon-24gf-volumeMiddle",
        "icon-24gf-volumeHigh",
      ],
      volumePanel: false,
    };
  },
  setup() {
    window.native.window.icon = icon;
    window.native.window.title = "Som Music";
  },
  mounted() {
    this.$router.to("/index/default");
    window.native &&
      window.native.window.onResize((w, h) => {
        this.windowWidth = w;
        window.dispatchEvent(new CustomEvent("onResize", { detail: { w, h } }));
      });
    audio.addEventListener("canplay", () => {
      clearInterval(audioId);
      this.updateAudio();
      audioId = setInterval(() => {
        this.updateAudio();
      }, 40);
    });


    window.native.window.onClose(() => {
      window.native.window.hide();

    });
    window.native.window.setNotifyIcon(
      icon,
      "Som Music",
      (type, button, x, y) => {
        if (type == 1 && button == 0) {
          window.native.window.show();
          window.native.window.activate();
        } else if (type == 0 && button == 2) {
          menu.onMessage(0, { x, y });
        }
      }
    );
    window.native.window
      .createWindow(location.origin + "#setup", true)
      .then((win) => {
        win.title = "设置";
        win.icon = icon;
        win.width = 500;
        win.height = 600;
        setup = win;
      });

    window.native.window
      .createWindow(location.origin + "#lyric")
      .then((win) => {
        if (this.config.lyric) win.show(false);
        lyric = win;
      });
    window.native.window.createWindow(location.origin + "#menu").then((win) => {
      win.title = "菜单";
      win.showInTaskbar = false;
      menu = win;
    });
    window.native.window
      .createWindow(location.origin + "#alert", true)
      .then((win) => {
        win.showInTaskbar = false;
        alert = win;
      });

    window.addEventListener("invoke", (e) => {
      let data = e.detail;
      this[data.method].apply(this, data.args);
    });
    window.native.window.onMessage = ({ source, type, value }) => {
      if (source == "setup" && type == 0) {
        this.readConfig();
        window.dispatchEvent(new CustomEvent("config"));
      } else if (source == "menu" && type == 0) {
        if (value == 0) {
          window.native.window.show();
          window.native.window.activate();
        } else if (value == 1) {
          this.setup();
        } else if (value == 2) {
          window.native.window.allowClose = true;
          setTimeout(() => {
            window.native.window.close();
          }, 10);
        }
      }
    };
    this.loadLocalMusic();
    window.addEventListener("drag", ({ detail }) => {
      this.addLocalMusic(detail.path);
    });
    window.addEventListener("command", ({ detail }) => {
      console.log(detail);
      this.startArgs(detail);
    });
    this.checkConfig();
    this.readConfig();
    this.startArgs();
    this.show();
  },
  methods: {
    async show() {
      window.native.window.show();
      console.log('show')
      let actualSize = await this.global.device.screenActualSize;
      console.log(actualSize, 'actualSize')
      window.native.window.width = parseInt(actualSize.width * 0.625);
      window.native.window.height = parseInt(actualSize.height * 0.75);
      window.native.window.addDragMoveArea(0, 0, 99999, 50);
      window.native.window.showCenter();
    },
    async startArgs(args) {
      args = args || (await window.native.app.startArgs);
      console.log("startup args:", args);
      if (args.indexOf("startup") > -1) {
        window.native.window.hide();
      }
      if (args.length > 0 && (await window.native.io.exists(args[0])) == 1) {
        let id = await this.addLocalMusic(args[0]);
        setTimeout(() => {
          this.openSong(id);
          setTimeout(() => {
            if (this.player.status != 1) this.openSong(id);
          }, 750);
        }, 1500);
      }
    },
    async addLocalMusic(path) {
      let info = await window.native.io.info(path);
      console.log(info);
      if (!info) return;
      let loadFile = (file) => {
        let k = this.localFile.findIndex((e) => e.path == file.absolutePath);
        if (k > -1) return this.localFile[k].id;
        let id = "local_" + this.uid();
        this.localFile.unshift({
          id,
          name: file.name.substring(0, file.name.indexOf(".")),
          time: Date.now(),
          size:
            file.size < 1024
              ? file.size + "B"
              : file.size < 1048576
                ? (file.size / 1024).toFixed(1) + "KB"
                : (file.size / 1048576).toFixed(1) + "MB",
          path: file.absolutePath,
        });
        return id;
      };
      let id;
      if (info.isFile) {
        id = loadFile(info);
      } else {
        let files = await window.native.io.files(info.absolutePath);
        for (let file of files) {
          id = loadFile(file);
        }
      }
      this.storage.set("local_music", this.localFile);
      return id;
    },
    pageTap() {
      this.volumePanel = false;
    },
    selectMenu(index) {
      if (index == 0) {
        this.$router.to("/index/default");
      } else if (index == 1) {
        this.$router.to("/index/mv");
      } else if (index == 2) {
        this.$router.to("/index/local");
      }
      this.menuSelect = index;
    },
    async getSongDetail(id) {
      //{"songs":[{"name":"未来","id":1956463991,"pst":0,"t":0,"ar":[{"id":13155879,"name":"霓虹花园","tns":[],"alias":[]},{"id":12193780,"name":"Kc","tns":[],"alias":[]}],"alia":[],"pop":5,"st":0,"rt":"","fee":8,"v":3,"crbt":null,"cf":"","al":{"id":146614615,"name":"未来","picUrl":"https://p2.music.126.net/6o-162BAd1jugpT_jrhihQ==/109951167561616238.jpg","tns":[],"pic_str":"109951167561616238","pic":109951167561616240},"dt":170857,"h":{"br":320000,"fid":0,"size":6837165,"vd":-50041,"sr":48000},"m":{"br":192000,"fid":0,"size":4102317,"vd":-47469,"sr":48000},"l":{"br":128000,"fid":0,"size":2734893,"vd":-46023,"sr":48000},"sq":{"br":847604,"fid":0,"size":18102418,"vd":-50027,"sr":48000},"hr":{"br":1582306,"fid":0,"size":33793550,"vd":-50035,"sr":48000},"a":null,"cd":"01","no":0,"rtUrl":null,"ftype":0,"rtUrls":[],"djId":0,"copyright":0,"s_id":0,"mark":536879104,"originCoverType":0,"originSongSimpleData":null,"tagPicList":null,"resourceState":true,"version":3,"songJumpInfo":null,"entertainmentTags":null,"single":0,"noCopyrightRcmd":null,"rtype":0,"rurl":null,"mst":9,"cp":0,"mv":0,"publishTime":0}],"privileges":[{"id":1956463991,"fee":8,"payed":0,"st":0,"pl":128000,"dl":0,"sp":7,"cp":1,"subp":1,"cs":false,"maxbr":999000,"fl":128000,"toast":false,"flag":4,"preSell":false,"playMaxbr":999000,"downloadMaxbr":999000,"maxBrLevel":"hires","playMaxBrLevel":"hires","downloadMaxBrLevel":"hires","plLevel":"standard","dlLevel":"none","flLevel":"standard","rscl":null,"freeTrialPrivilege":{"resConsumable":false,"userConsumable":false,"listenType":null},"chargeInfoList":[{"rate":128000,"chargeUrl":null,"chargeMessage":null,"chargeType":0},{"rate":192000,"chargeUrl":null,"chargeMessage":null,"chargeType":1},{"rate":320000,"chargeUrl":null,"chargeMessage":null,"chargeType":1},{"rate":999000,"chargeUrl":null,"chargeMessage":null,"chargeType":1},{"rate":1999000,"chargeUrl":null,"chargeMessage":null,"chargeType":1}]}],"code":200}
      return (await this.$axios.get("/song/detail?ids=" + id)).data.songs[0];
    },
    async getUrl(id) {
      //{"data":[{"id":1956463991,"url":"http://m701.music.126.net/20220623005645/5ab63c968fa8615ce1ed74c8263029df/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/15143321565/7574/f81c/eb73/221b0068a7b7f3475c2e901649462eff.mp3","br":128000,"size":2734893,"md5":"221b0068a7b7f3475c2e901649462eff","code":200,"expi":1200,"type":"mp3","gain":-8.6023,"fee":8,"uf":null,"payed":0,"flag":4100,"canExtend":false,"freeTrialInfo":null,"level":"standard","encodeType":"mp3","freeTrialPrivilege":{"resConsumable":false,"userConsumable":false,"listenType":null},"freeTimeTrialPrivilege":{"resConsumable":false,"userConsumable":false,"type":0,"remainTime":0},"urlSource":0,"rightSource":0}],"code":200}
      return (await this.$axios.get("/song/url?id=" + id)).data.data[0];
    },
    async getAlbum(id) {
      return (await this.$axios.get("/album?id=" + id)).data.songs;
    },
    async getLyric(id) {
      return (await this.$axios.get("/lyric?id=" + id)).data.lrc.lyric;
    },
    async openSong(targetId) {
      this.player.ids = [targetId];
      this.player.index = 0;
      this.playSong();
    },
    async album(id) {
      this.$router.to("/index/album", { id });
    },
    setWindowState(state) {
      if (state == "close") {
        window.native.window.close();
      } else {
        this.windowState = state;
        window.native.window.state = state;
      }
    },
    play() {
      if (this.player.status == 1) {
        this.player.status = 2;
        audio.pause();
        clearInterval(audioId);
      } else if (this.player.status == 2) {
        if (audio.currentTime != 0 && audio.currentTime == audio.duration) {
          audio.currentTime = 0;
        }
        this.player.status = 1;
        audio.play();
      }
    },
    updateAudio() {
      if (!audio.duration) return;
      let m = parseInt(audio.currentTime / 60);
      this.player.current =
        m.toString().padStart(2, "0") +
        ":" +
        parseInt(audio.currentTime % 60)
          .toString()
          .padStart(2, "0");
      m = parseInt(audio.duration / 60);
      this.player.duration =
        m.toString().padStart(2, "0") +
        ":" +
        parseInt(audio.duration % 60)
          .toString()
          .padStart(2, "0");
      this.player.progress = parseInt(
        (audio.currentTime / audio.duration) * 2000
      );
      let id = this.player.ids[this.player.index];
      if (typeof id != "string" || !id.startsWith("local_")) {
        lyric.onMessage(0, {
          current: audio.currentTime,
          duration: audio.duration,
        });
      }

      if (audio.currentTime == audio.duration && this.player.status == 1) {
        clearInterval(audioId);
        this.next();
      }
    },
    dragProgress(val) {
      audio.duration && (audio.currentTime = (val / 2000) * audio.duration);
    },
    showVolumePanel(e) {
      console.log(e);
      this.volumePanel = !this.volumePanel;
    },
    setVolume(e) {
      this.player.volume = e;
      audio.volume = this.player.volume / 100;
    },
    setPlayList(ids) {
      if (this.player.status == 1) {
        this.play();
      }
      this.player.ids = ids;
      this.player.index = 0;
      this.playSong();
      console.log(this.player);
    },
    async playSong() {
      let id = this.player.ids[this.player.index];
      if (typeof id == "string" && id.startsWith("local_")) {
        let detail =
          this.localFile[this.localFile.findIndex((e) => e.id == id)];
        if ((await window.native.io.exists(detail.path)) != 1) {
          this.alert("文件已失效。", () => {
            this.player.ids.splice(this.player.index, 1);
            this.localFile.splice(
              this.localFile.findIndex((e) => e.id == id),
              1
            );
          });
          return;
        }
        this.player.singer = ""; //{"id":13155879,"name":"霓虹花园","tns":[],"alias":[]}
        this.player.name = detail.name;
        this.player.pic = null;
        this.player.url = null;
        let base64 = await window.native.io.readToBase64(detail.path);
        audio.src = "data:audio/mp3;base64," + base64;
        lyric.onMessage(-1);
        console.log('none lyric')
      } else {
        let detail = await this.getSongDetail(id);
        this.player.singer = detail.ar; //{"id":13155879,"name":"霓虹花园","tns":[],"alias":[]}
        this.player.name = detail.name;
        this.player.pic = detail.al.picUrl;
        this.player.url = (
          await this.getUrl(this.player.ids[this.player.index])
        ).url;
        audio.loop = false;
        audio.src = this.player.url;

        let lyricstr = await this.getLyric(this.player.ids[this.player.index]);
        console.log('set lyric', lyricstr)
        lyric.onMessage(1, lyricstr);
      }
      audio.volume = this.player.volume / 100;
      audio.play();
      this.player.status = 1;
    },
    last() {
      if (this.player.index == 0) {
        this.player.index = this.player.ids.length - 1;
      } else {
        this.player.index--;
      }
      this.playSong();
    },
    next() {
      if (this.player.index == this.player.ids.length - 1) {
        this.player.index = 0;
      } else {
        this.player.index++;
      }
      console.log(this.player);
      this.playSong();
    },
    async setup() {
      setup.showCenter();
      setup.show(true, () => { });
      setTimeout(async () => {
        setup.width = (await setup.width) == 500 ? 501 : 500;
      }, 100);
    },
    skipProgress(e) {
      console.log(this.player.progress, e);
      this.dragProgress(this.player.progress);
    },
    progressTooltip(e) {
      if (this.player.status == 0) {
        return "无";
      }
      let currentTime = parseInt((e / 2000) * audio.duration);
      let m = parseInt(currentTime / 60);
      return (
        m.toString().padStart(2, "0") +
        ":" +
        parseInt(currentTime % 60)
          .toString()
          .padStart(2, "0")
      );
    },
    readConfig() {
      this.config.refresh();
      window.native.window.allowClose = this.config.exit;
    },
    async loadLocalMusic() {
      let files = this.storage.get("local_music") || [];
      for (let file of files) {
        if ((await window.native.io.exists(file.path)) == 1) {
          this.localFile.push(file);
        }
      }
    },
    async alert(title, msg, callback) {
      if (!msg && !callback) {
        msg = title;
        title = null;
      } else if (!callback) {
        callback = msg;
        msg = title;
        title = null;
      }
      alert.data.value = { content: msg };
      alert.show(true, callback);
      let w = await alert.width;
      setTimeout(() => {
        alert.width = w % 10 == 0 ? w + 1 : w - 1;
      }, 100);
    },
  },
};
</script>
<style lang="scss">
.main {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  height: 100%;
  padding: 18px 22px 0 22px;
  box-sizing: border-box;
  position: relative;

  .body {
    flex: 1;
    display: flex;
    flex-direction: row;
  }

  .main_top {
    height: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    z-index: 10;

    .title {
      font-size: 24px;
    }

    .mid {
      margin-left: 110px;
      flex: 1;

      .search {
        width: 300px;
      }
    }

    .right {
      display: flex;

      .iconfont {
        padding: 10px;
        font-size: 24px;
      }
    }
  }
}

.left-menu {
  width: 200px;
  height: 100%;

  .label {
    margin-top: 16px;
    font-size: 14px;
  }

  .item {
    margin-top: 16px;
    padding: 10px;

    &:hover {
      border-radius: 3px;
    }

    &.active {
      border-radius: 3px;
    }

    .iconfont {
      margin-right: 10px;
    }

    .text {
      font-size: 16px;
    }
  }
}

.center-area {
  flex: 1;
}

.player {
  display: flex;
  align-items: center;
  height: 80px;
  position: relative;
  justify-content: space-between;
  width: 100%;

  .progress {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    transform: translateY(-50%);

    //dot button
    .el-slider__button {
      width: 6px;
      height: 6px;
    }

    //slider bg
    .el-slider__runway {
      height: 2px;
    }

    //dot button offset
    .el-slider__button-wrapper {
      top: -17px;
    }

    //slider slide bg
    .el-slider__bar {
      height: 2px;
    }
  }

  .left {
    display: flex;
    width: 33.3%;

    .pic {
      width: 48px;
      height: 48px;
      border-radius: 4px;
    }

    .info {
      display: flex;
      flex-direction: column;
      font-size: 14px;
      margin-left: 12px;

      .name {
        margin-bottom: 8px;
      }
    }
  }

  .mid {
    display: flex;
    width: 33.3%;
    justify-content: center;
    align-items: center;

    .last,
    .next {
      font-size: 24px;
    }

    .play {
      font-size: 30px;
    }

    .volume {
      font-size: 20px;
    }

    .iconfont {
      margin-right: 20px;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .right {
    width: 33.3%;
  }

  .box-item {
    background-color: transparent;
  }
}

.volume-panel {
  padding: 0 6px;
  height: 230px;
  display: flex;
  flex-direction: column;
  align-content: center;
  border-radius: 6px;

  .el-slider {
    margin-top: 20px;
  }

  //dot button
  .el-slider__button {
    width: 6px;
    height: 6px;
  }

  //slider bg
  .el-slider__runway {
    width: 6px !important;
    flex: unset;
  }

  //dot button offset
  .el-slider__button-wrapper {
    top: -17px;
  }

  //slider slide bg
  .el-slider__bar {
    width: 6px !important;
  }

  .el-divider {
    margin: 12px 0;
  }

  .text {
    margin: 12px 0;
    text-align: center;
  }

  .volume {
    text-align: center;
  }
}

.content {
  flex: 1;
  margin-left: 10px;
  position: relative;
  height: 100%;
}
.absolute{
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
// .el-popper__arrow{
//     left:28px;
// }
</style>
