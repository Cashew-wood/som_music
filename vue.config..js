const { defineConfig } = require('@vue/cli-service')
const { execFile,exec  } = require('node:child_process');
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack:{
    plugins:[{
        apply:(compiler)=>{
          let execute=true
          let doneFn=()=>{
            if(execute)execute=false;
            else return;
            execFile('bin\\WebUI.exe', [`http://localhost:8080`], (error, stdout, stderr) => {
              if (stdout) process.stdout.write(stdout);
              if (stderr) process.stderr.write(stderr);
            });
          }
          if (compiler.hooks) {
            compiler.hooks.done.tap({ name: 'WebUI' }, doneFn);
          } else {
            compiler.plugin('done', doneFn);
          }
        }
      },
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      })
    ]
  }
})
