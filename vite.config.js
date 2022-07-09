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
    closeBundle:(e)=>{
        let dist=import.meta.url.substring(8,import.meta.url.lastIndexOf("/")).replaceAll('/','\\')+'\\dist';
       execFile('bin\\SepoBuild.exe', ['res='+dist,'icon={index}','name=Som 音乐','embedded','single','output='+dist+'\\build','app.company=Som',
      'app.product=Music','app.copyright=Som','app.trademark=Som','app.version=1.0.0.4'], (error, stdout, stderr) => {
          console.log(error,stdout,stderr)
        });
    
    },
    configureServer:(e)=>{
      if(execute)execute=false;
      else return;
      let doneFn=()=>{
        execFile('bin\\SepoProgram.exe', [`http://localhost:${e.config.server.port || 3000}`], (error, stdout, stderr) => {
          console.log(error,stdout,stderr)
        });
      }
      doneFn();
    }
  }]
})
