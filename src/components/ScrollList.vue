<template>
    <div class="list-view">
        <div class="list scroll" @scroll="scroll">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
.list-view {
    flex: 1;
    position: relative;

    .list {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        overflow-y: scroll;
    }
}
</style>