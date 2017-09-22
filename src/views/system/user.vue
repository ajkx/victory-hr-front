<template>
    <div>
        <div class="user-operation">

            <div style="float: right">
                <Input size="small" v-model="listQuery.name" placeholder="输入名称或简称" style="width: 200px" @on-enter="GetList"
                    icon="ios-search" class="">
                </Input>
            </div>
            <div class=""></div>
        </div>
        <div class="table-query">
            <Table :data="tableData" :columns="tableColumns" stripe></Table>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="total" :current="listQuery.page" :page-size="listQuery.size" @on-change="changePage" @on-page-size-change="changeSizePage" show-total show-sizer></Page>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { getUsers,updateUserRole,updateUserStatus } from 'api/sys'

    export default {
        name: 'user',
        data() {
            return {
                total: 0,
                tableData: [],
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
                                            this.lock(id,lockText)
                                        }
                                    }
                                },lockText)

                            ])
                        }
                    }
                ],
                listQuery: {
                    page: 1,
                    size: 10,
                    name: undefined,
                    sort: 'id,desc'
                },
            }
        },
        created() {
            this.GetList();
        },
        methods: {
            GetList(){
                this.listQuery.page -= 1;
                getUsers(this.listQuery).then(response => {
                    this.tableData = response.data.content;
                    this.total = response.data.totalElements;
                    this.listQuery.page += 1;
                });
            },
            changePage(val){
                this.listQuery.page = val;
                this.GetList();
            },
            changeSizePage(val) {
                this.listQuery.size = val;
                this.GetList();
            },
            update(id) {
            },
            lock(id,str){
                updateUserStatus(id).then(response =>{
                    this.GetList();
                }).catch(error => {
                    this.$Message.error(str+"失败！");
                });
            }
        }
    }
</script>

<style>

</style>