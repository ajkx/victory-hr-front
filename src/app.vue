<template>
    <div>
        <router-view></router-view>
    </div>
</template>
<script>
    export default {
        data () {
            return {}
        },
        mounted () {

        },
        beforeDestroy () {

        },
        methods: {}
    }
</script>

<style>

    ::-webkit-scrollbar{-webkit-appearance:none;width:8px;height:8px}
    ::-webkit-scrollbar-thumb{
        border-radius:5px;background-color:rgba(0,0,0,.1);
        -webkit-box-shadow:0 0 1px hsla(0,0%,100%,.1)
    }

    .table-query .ivu-table-wrapper {
        /*清除table的边框线，position不改的话右下边框变不了*/
        border: 0px;
        position: inherit;
    }

    /* iview的样式覆盖 */
    .ivu-table th {
        border-radius: 4px 4px 0 0;
    }

    .table-panel .ivu-table:before,
    .table-panel .ivu-table:after {
        display: none !important;
    }

    /* 右边界的覆盖显示 */
    .sidebar .ivu-menu{
        z-index:0 !important;
    }
    .ivu-modal-content{
        border-radius: 4px;
    }
    .ivu-modal-header p{
        font-weight: 400;
    }
    .ivu-radio-group-button .ivu-radio-wrapper{
        height: 28px;
        line-height: 28px;
    }
    .ivu-input{
        height: 28px;
    }
    .ivu-input-icon{
        height: 28px;
        line-height: 28px;
    }
    .ivu-select-single .ivu-select-selection{
        height: 28px;
    }
    .ivu-select-single .ivu-select-selection .ivu-select-placeholder{
        height: 28px;
        line-height: 28px;
    }
    .ivu-input-small{
        height: 24px;
    }

    .browser .ivu-modal-header{
        padding: 0
    }
    .browser .ivu-modal{
        width:600px;
        height:550px
    }
    .browser .ivu-modal-body{
        padding: 10px;
        padding-bottom: 0;
    }
    .browser .ivu-modal-close .ivu-icon-ios-close-empty{
        color: #fff;
    }
    /*.ivu-tree-arrow-hidden i{*/
        /*color: transparent;*/
        /*cursor: default;*/
        /*display: inline;*/
    /*}*/
    /* 公用样式*/
    .divider {
        margin: 0 6px !important;
        display: inline-block;
        height: 8px;
        width: 1px;
        background: #ccc;
    }

    .divider-line{
        background-color: #e4e4e4;
        height: 1px;
        width: 100%;
        margin: 16px 0;
    }

    .user-operation {
        overflow: hidden;
        padding: 10px 0px 10px 0;

    }

    .del-modal-header{
        color:#ed3f14 !important;
    }

    .infoText{
        font-size: 12px;
        color: rgb(196, 196, 196);
    }
    /*自定义组件的样式*/
    .child-table{
        border-radius: 4px;
    }
    .child-table th{
        font-weight: 400;
        background: #fff;
        height: 50px;
    }
    /*树菜单样式*/
    .tree-span{
        display:inline-block;
        width: 95%;
    }
    .tree-span:hover{
        background: #eaf4fe;
    }
    .tree-span-selected{
        background: #d5e8fc;
    }
    .tree-span-selected:hover{
        background: #d5e8fc;
    }
    .tree-title{
        display: inline-block;
        margin: 0;
        padding: 0 4px;
        border-radius: 3px;
        cursor: pointer;
        vertical-align: top;
        color: #495060;
        transition: all .2s ease-in-out;
    }
    .highlight-tree-span{
        color: rgb(237, 63, 20)
    }
</style>
