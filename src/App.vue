<template>
  <router-view></router-view>
</template>

<script>
export default {
  setup() {

  },
  mounted() {
    const setup = async () => {
      console.log('init native')

      if (window.native.window.parent) {
        console.log(await window.native.window.data.page)
        this.$router.push(await window.native.window.data.page);
      } else {
        this.$router.push('/index');
      }
    }

    if (window.native && window.native.isInit) {
      setup();
    } else {
      console.log('wait native')
      window.addEventListener('native', setup)
    }
  }
}
</script>

<style>
</style>