import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const { execFile,exec  } = require('node:child_process');
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// https://vitejs.dev/config/
let execute=true
export default defineConfig({
  server: {
    port: 8080
  },
  build:{
    sourcemap:true
  },
  plugins: [vue(), AutoImport({
    resolvers: [ElementPlusResolver()],
  }),
  Components({
    resolvers: [ElementPlusResolver()],
  }),{
    configureServer:(e)=>{
      if(execute)execute=false;
      else return;
      let doneFn=()=>{
        execFile('bin\\WebUI.exe', [`http://localhost:${e.config.server.port || 3000}`], (error, stdout, stderr) => {
  
        });
      }
      doneFn();
    }
  }]
})
