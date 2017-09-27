<template>
    <div>
        <div class="user-operation">
            <Button type="primary" icon="plus-round" size="small">新增角色</Button>
            <div style="float: right">
                <Input size="small" v-model="listQuery.name" placeholder="输入角色名" style="width: 200px"
                       @on-enter="GetList"
                       icon="ios-search" class="">
                </Input>
            </div>
            <div class=""></div>
        </div>
        <div class="table-query">
            <Table :data="tableData" :columns="tableColumns" stripe></Table>
            <div style="margin: 10px 10px 10px 0 ;overflow: hidden">
                <div style="float: right;">
                    <Page :total="total" :current="listQuery.page" :page-size="listQuery.size" @on-change="changePage"
                          @on-page-size-change="changeSizePage" show-total show-sizer></Page>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {getRoles, updateRole, updateRoleStatus,deleteRole} from 'api/sys'

    export default {
        name: 'role',
        data() {
            return {
                total: 0,
                tableData: [],
                tableColumns: [
                    {
                        title: '角色名',
                        key: 'name'
                    },
                    {
                        title: '描述',
                        key: 'description'
                    },
                    {
                        title: '状态',
                        key: 'available',
                        render: (h, params) => {
                            const data = params.row;
                            const available = data.available;
                            var text = "启用";
                            var color = "green";
                            if (!available) {
                                text = "禁用";
                                color = "red";
                            }
                            return h('Tag', {
                                props: {
                                    color: color,
                                }
                            }, text);
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        render: (h, params) => {
                            const data = params.row;
                            const id = data.id;
                            const isSuper = data.super;
                            const available = data.available
                            var availableText = "禁用";
                            //判断是否超级管理员
                            if (isSuper) return '';

                            //控制方法执行锁定操作还是解锁操作
                            if (!available) {
                                availableText = "启用";
                            }

                            return h('div', [
                                h('a', {
                                    attrs: {
                                        href: '#'
                                    },
                                    on: {
                                        click: () => {
                                            this.update(id)
                                        }
                                    }
                                }, '编辑'),
                                h('span', {
                                    attrs: {
                                        class: 'divider'
                                    },
                                }),
                                h('a', {
                                    on: {
                                        click: () => {
                                            this.lock(id, availableText)
                                        }
                                    }
                                }, availableText),
                                h('span', {
                                    attrs: {
                                        class: 'divider'
                                    },
                                }),
                                h('a', {
                                    on: {
                                        click: () => {
                                            this.delete(id)
                                        }
                                    }
                                }, '删除'),
                            ])
                        }
                    }
                ],
                listQuery: {
                    page: 1,
                    size: 10,
                    name: undefined,
                },
            }
        },
        created() {
            this.GetList();
        },
        methods: {
            GetList() {
                this.listQuery.page -= 1;
                getRoles(this.listQuery).then(response => {
                    this.tableData = response.data.content;
                    this.total = response.data.totalElements;
                    this.listQuery.page += 1;
                });
            },
            changePage(val) {
                this.listQuery.page = val;
                this.GetList();
            },
            changeSizePage(val) {
                this.listQuery.size = val;
                this.GetList();
            },
            update(id) {

            },
            delete(id) {
                deleteRole(id).then(response =>{
                    this.$Message.success("删除成功");
                    this.GetList();
                });
            },
            lock(id, str) {
                updateRoleStatus(id).then(response => {
                    this.GetList();
                }).catch(error => {
//                    console.log(error);
//                    this.$Message.error(str+"失败！");
                });
            }
        }
    };
</script>

<style>

</style>