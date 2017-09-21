<template>
    <div>
        <router-view></router-view>
    </div>
</template>
<script>
    export default {
        data() {
            return {

            };
        },
        mounted() {

        },
        beforeDestroy() {

        },
        methods: {

        }
    };
</script>

<style>
    .user-operation{
        overflow: hidden;
        padding: 10px 0px 10px 0;

    }
    .table-query .ivu-table-wrapper{
        /*清楚table的边框线，position不改的话右下边框变不了*/
        border:0px;
        position: inherit;
    }

    .ivu-table th{
        border-radius: 4px 4px 0 0;
    }

    .divider{
        margin: 0 6px !important;
        display: inline-block;
        height: 8px;
        width: 1px;
        background: #ccc;
    }
</style>
