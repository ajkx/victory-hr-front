<template>
    <div class="app-main">
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    export default {
        name: 'content',
        data() {
            return {}
        },
        computed: {
            key() {
                return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
            }
        }
    }
</script>

<style>
    .app-main{
        margin-top: 15px;
        padding: 0 20px;

    }
</style>