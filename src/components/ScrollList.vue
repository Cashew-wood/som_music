<template>
    <div class="scroll-list-view">
        <div class="scroll-list scroll" @scroll="scroll">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
.scroll-list-view {
    flex: 1;
    position: relative;

    .scroll-list {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        overflow-y: scroll;
        overflow-x: hidden;
    }
}
</style>