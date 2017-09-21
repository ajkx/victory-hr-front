<template>
    <div class="layout-header">
        <Menu mode="horizontal" :theme="theme">
            <div class="layout-header-nav">
                <router-link to="/" class="layout-logo">
                    <img class="layout-logo-img" src="/src/asset/v-logo2.png"/>
                </router-link>
                <div class="layout-nav-search">
                    <Select v-model="searchValue" filterable remote :remote-method="searchInfo" :loading="loading"
                            placeholder="搜索功能...">
                        <Option v-for="(option,index) in options" :value="option.value" :key="index">
                            {{ option.label }}
                        </Option>
                    </Select>
                </div>
                <div class="layout-nav-list">
                    <div class="layout-nav-list-item">
                        <Button type="ghost">考勤计算</Button>
                    </div>
                    <div class="layout-nav-list-item">
                        <Icon type="ios-help-outline" size="24" class="icon-middle"></Icon>
                    </div>
                    <div class="layout-nav-list-item">
                        <Icon type="ios-bell-outline" size="24" class="icon-middle"></Icon>
                    </div>
                    <div class="layout-nav-list-item padding-li">
                        <Dropdown>
                            <div style="padding: 0 20px">
                                <Icon type="ios-grid-view-outline" size="24" class="icon-middle"></Icon>
                            </div>
                            <DropdownMenu slot="list">
                                <DropdownItem>{{ userInfo }}</DropdownItem>
                                <DropdownItem divided="">修改密码</DropdownItem>
                                <DropdownItem><span @click="logout()">退出</span></DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </Menu>
    </div>
</template>

<script>
    export default {
        name: 'navbar',
        data() {
            return {
                theme: 'light',
                searchValue: '',
                loading: false,
                options: [],
                list: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New hampshire', 'New jersey', 'New mexico', 'New york', 'North carolina', 'North dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode island', 'South carolina', 'South dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West virginia', 'Wisconsin', 'Wyoming']
            }
        },
        computed: {
            userInfo() {
                return this.$store.getters.name + "(" + this.$store.getters.account + ")";
            }
        },
        methods: {
            searchInfo(query) {
                if (query !== '') {
                    this.loading = true;
                    setTimeout(() => {
                        this.loading = false;
                        const list = this.list.map(item => {
                            return {
                                value: item,
                                label: item
                            };
                        });
                        this.options = list.filter(item => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1);
                    }, 200);
                } else {
                    this.options = [];
                }
            },
            logout() {
                this.$store.dispatch('LogOut').then(() => {
                    location.reload();
                });
            }
        }
    }
</script>

<style>
    .layout-header {
        box-shadow: 0 1px 1px rgba(0, 0, 0, .08);
    }

    .layout-header-nav {
        width: 100%;
        height: 60px;
        padding: 0 30px;
    }

    .layout-logo {
        height: 36px;
        margin-top: 12px;
        float: left;
    }

    .layout-logo-img {
        margin-left: 30px;
        height: 100%;
    }

    .layout-nav-search {
        float: left;
        margin-left: 70px;
    }

    .layout-nav-list {
        height: inherit;
        float: right;
    }


    .ivu-select-input {
        outline: 0;
    }

    .layout-nav-search .ivu-select .ivu-select-selection {
        box-shadow: none !important;
        border: 0 !important;
    }

    .layout-nav-list-item {
        height: inherit;
        line-height: inherit;
        border-bottom: 2px solid transparent;
        color: #495060;
        float: left;
        padding: 0 20px;
        position: relative;
        cursor: pointer;
        z-index: 3;
        transition: all .2s ease-in-out;
        display: block;
        outline: 0;
        list-style: none;
        font-size: 14px;
    }

    .layout-nav-list-item:hover {
        color: #2d8cf0;
        border-bottom: 2px solid #2d8cf0;
    }

    .layout-nav-list-item i {
        vertical-align: middle;
    }

    .icon-middle{
        vertical-align: middle;
    }

    .padding-li{
        padding: 0 !important;
    }
</style>