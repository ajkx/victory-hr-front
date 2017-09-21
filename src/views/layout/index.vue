<template>
    <div class="layout">
        <navbar></navbar>
        <div class="layout-content">
            <div class="sidebar">
                <sidebar></sidebar>
            </div>
            <div class="main-container">
                <main-content></main-content>
            </div>
        </div>
        <div class="layout-footer"></div>
    </div>
</template>

<script>
    import navbar from './navbar.vue';
    import sidebar from './sidebar.vue';
    import content from  './content.vue';

    export default {
        name: 'index',
        components: {
            'navbar': navbar,
            'sidebar': sidebar,
            'main-content': content
        },
    }
</script>

<style>
    .layout{
        position: relative;
        height: 100%;
        width: 100%;
        background:#fff;
    }
    .layout-content{
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        top:60px;
    }
    .layout-content .main-container{
        margin-left: 160px;
        min-height: 100%;
    }
</style>