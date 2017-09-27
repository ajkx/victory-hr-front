<template>
    <Menu :theme="theme" :width="width" :active-name="this.$route.path" :open-names="openNames" class="sidebar"
          @on-select="menuItemSelect" @on-open-change="subMenuSelect" :accordion="true" ref="menu1">
        <!--<sidebar-item :routers="permission_routers"></sidebar-item>-->
        <template v-for="item in permission_routers">

            <MenuItem v-if="!item.hidden&&item.noDropDown&&item.children.length>0"
                      :name="item.path+item.children[0].path" class="menu-item">
                <Icon v-if="item.icon" :type="item.icon"></Icon>
                <span>{{ item.children[0].name }}</span>
            </MenuItem>
            <Submenu v-else-if="!item.noDropDown&&!item.hidden" :name="item.path" class="menu-item">
                <template slot="title">
                    <Icon v-if="item.icon" :type="item.icon"></Icon>
                    <span>{{ item.children[0].name }}</span>
                </template>
                <template v-for="child in item.children" v-if="!child.hidden">
                    <!--嵌套循环递归-->
                    <sidebar-item v-if="child.children&&child.children.length>0" :routers="[child]"></sidebar-item>

                    <MenuItem v-else :name="item.path+'/'+child.path" class="submenu-item">
                        <Icon v-if="child.icon" :type="child.icon"></Icon>
                        <span>{{ child.name }}</span>
                    </MenuItem>

                </template>
            </Submenu>

        </template>
    </Menu>
</template>

<script>
    import sidebarItem from './sidebarItem.vue';
    import {mapGetters} from 'vuex';

    var currentSubMenu = "";

    export default {
        name: 'sidebar',
        components: {
            sidebarItem
        },
        computed: {
            ...mapGetters([
                'permission_routers',
            ]),
        },
        data() {
            return {
                theme: 'light',
                width: "160px",
                openNames: [],
                accordion: true,
                theme2: 'light'
            }
        },
        created: function () {
            var str = this.$route.path;
            var index = str.search(/\b\//);
            if (index > -1) {
                str = str.substring(0, index);
            }
            this.openNames = [str];
        },
        methods: {
            menuItemSelect(name) {
                this.$router.push({path: name});
            },
            subMenuSelect(array) {
                var currentName = currentSubMenu;
                if (array.length == 0) {
//                    submenu不能折叠
//                    this.openNames = [currentName];
//                    this.$nextTick(function() {
//                        this.$refs.menu1.updateOpened();
//                    })
                } else {
                    currentSubMenu = array[0];
                    currentName = array[0];
                }
                //todo 使用路由跳转会导致submenu初次点击没有动画效果 原因未明
                //由于懒加载
                this.$router.push({path: currentName});
            },
            test() {
                console.log("test");
            }
        }
    }
</script>

<style>

    .sidebar {
        height: 100%;
    }

    .menu-item {
        font-size: 13px;
        color: #4a4a4a;
    }

    .ivu-menu-item {
        font-size: 13px !important;
    }

    .sidebar .ivu-menu-item-selected i {
        color: #2d8cf0 !important;
    }

    .menu-item .ivu-icon {
        margin-right: 8px !important;
        font-size: 14px;
        color: #b5b5b5;
        /*vertical-align: middle;*/
    }

    .ivu-icon-ios-arrow-down {
        font-size: 12px !important;
        /*margin-right: 0 !important;*/
    }

    .sidebar .ivu-menu-opened .ivu-menu-submenu-title {
        background: #ecf6fd !important;
        border-left: 2px solid #2d8cf0;
        /*z-index: 2 !important;*/
    }

    .sidebar .ivu-menu-opened .ivu-menu-submenu-title .ivu-icon {
        color: #2d8cf0 !important;
    }

    .sidebar .ivu-menu-opened .ivu-menu-item {
        padding-left: 52px !important;
    }

    .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
        border-right: 0 !important;
        z-index: 0 !important;
    }

    .sidebar .ivu-menu-submenu-title a {
        display: block;
        width: 100%;
        height: 100%;
        font-size: 13px;
        color: #4a4a4a;
    }

    .submenu-item {
        font-size: 13px;
        color: #898989;
    }

    .sidebar .ivu-menu-vertical .ivu-menu-item:hover, .ivu-menu-vertical .ivu-menu-submenu-title:hover {
        background: rgba(148, 199, 236, 0.11) !important;
    }
</style>