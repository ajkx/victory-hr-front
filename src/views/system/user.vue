<template>
    <div>
        <div class="user-operation">

            <div style="float: right">
                <Input size="small" v-model="searchValue" placeholder="请输入名称" style="width: 200px" on-enter=""
                    icon="ios-search" class="">

                </Input>
            </div>
            <div class=""></div>
        </div>
        <div class="table-query">
            <Table :data="tableData" :columns="tableColumns" stripe></Table>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="total" :current="page" @on-change="changePage" show-total show-sizer></Page>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'user',
        data() {
            return {
                total: 0,
                page: 1,
                tableData: [{
                    "id": 3,
                    "name": "陈本德",
                    "workCode": "SS071",
                    "status": "dismiss_self",
                    "createDate": "2014-09-22",
                    "roles":[{"id": 1, "name": "超级管理员"},{"id": 2, "name": "超级管理员a"}]
                }],
                tableColumns: [
                    {
                        title: '名称',
                        key: 'name'
                    },
                    {
                        title: '账号',
                        key: 'account'
                    },
                    {
                        title: '角色组',
                        key: 'roles',
                        render: (h, params) => {
                            const data = params.row;
                            const col = params.column;
                            const index = params.index;
                            const roles = data.roles;
                            var str = "";
                            console.log(roles);
                            for(var i = 0; i < roles.length; i++){
                                str += roles[i].name + ", ";
                            }
                            str.substring(0)
                            return h('div', str.substring(0,str.length - 2));
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        render: (h,params) => {
                            const data = params.row;
                            const id = data.id;
                            const locked = data.locked;
                            var lockText = "锁定";
                            //控制方法执行锁定操作还是解锁操作
                            var type = 1;
                            if(locked == 1){
                                lockText = "解锁";
                                type = 0;
                            }

                            return h('div',[
                                h('a',{
                                    attrs: {
                                        href:'#'
                                    },
                                    on: {
                                        click: () => {
                                            this.update(id)
                                        }
                                    }
                                },'编辑角色'),
                                h('span',{
                                    attrs: {
                                        class:'divider'
                                    },

                                }),
                                h('a',{
                                    attrs: {
                                        href:'#'
                                    },
                                    on: {
                                        click: () => {
                                            this.lock(id,type)
                                        }
                                    }
                                },lockText)

                            ])
                        }
                    }
                ],
                searchValue: '',
            }
        },
        methods: {
            changePage(){

            },
            searchByName() {

            },
            update(id) {
                console.log(id);
            },
            lock(id,type){
                console.log(id+ " "+type);
            }
        }
    }
</script>

<style>

</style>