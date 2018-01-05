<template>
    <div>
        <template v-for="item in routers">

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

                    <sidebar-item v-if="child.children&&child.children.length>0" :routers="[child]"></sidebar-item>

                    <MenuItem v-else :name="item.path+'/'+child.path" class="submenu-item">
                        <Icon v-if="child.icon" :type="child.icon"></Icon>
                        <span>{{ child.name }}</span>
                    </MenuItem>

                </template>
            </Submenu>

        </template>
    </div>
</template>

<script>
    export default {
        name: 'sidebarItem',
        props: {
            routers: {
                type: Array     // 限制传入的routers是数组 Vue会发警告
            }
        },
        data () {
            return {}
        },
        methods: {}
    }
</script>

<style scoped>
    .menu-item {
        font-size: 13px;
        color: #4a4a4a;
    }

    .menu-item i {
        margin-right: 8px !important;
        font-size: 16px;
        color: #b5b5b5;
        vertical-align: middle;
    }

    .ivu-menu-submenu-title a {
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
</style>
