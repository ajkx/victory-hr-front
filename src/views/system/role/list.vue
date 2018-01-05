<template>
    <div>
        <Modal v-model="delModal" width="360" >
            <p slot="header" style="color:#ed3f14">
                <Icon type="information-circled"></Icon>
                <span>删除确认</span>
            </p>
            <div style="text-align:center;font-size: 14px">
                <p>删除后，拥有该角色的人员将失去对应的权限</p>
                <p>该操作不可恢复,是否继续？</p>
            </div>
            <div slot="footer" style="text-align: center">
                <Button type="ghost" @click="delModal = false">取消</Button>
                <Button type="error" :loading="modal_loading" @click="del" style="margin-left: 15px">删除</Button>
            </div>
        </Modal>
        <List :listUrl="listUrl" :columns="tableColumns" ref="list" :query="listQuery">
            <ListHeader slot="header" mode="both">
                <ListSearch>
                    <Input size="small" v-model="listQuery.name" placeholder="输入角色名" style="width: 200px"
                           @on-enter="GetList" icon="ios-search" class="">
                    </Input>
                </ListSearch>
                <ListOperations>
                    <Button type="primary" icon="plus-round" size="small" @click="$router.push('/system/role/create')">新增角色</Button>
                </ListOperations>
            </ListHeader>
        </List>
    </div>
</template>

<script>
    import List, { ListHeader, ListOperations, ListSearch } from 'components/list'

    import { del } from 'api/common'

    import { updateRoleStatus } from 'api/sys'

    export default {
        name: 'role',
        components: {
            List,
            ListHeader,
            ListOperations,
            ListSearch
        },
        data () {
            return {
                delModal: false,
                modal_loading: false,
                currentDeleteId: null,
                listUrl: 'role',
                listQuery: {    // listQuery 最好都加上 page 和 size
                    name: undefined,
                    page: 1,
                    size: 10
                },
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
                            const data = params.row
                            const available = data.available
                            var text = '启用'
                            var color = 'green'
                            if (!available) {
                                text = '禁用'
                                color = 'red'
                            }
                            return h('Tag', {
                                props: {
                                    color: color
                                }
                            }, text)
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        render: (h, params) => {
                            const data = params.row
                            const id = data.id
                            const isSuper = data.super
                            const available = data.available
                            var availableText = '禁用'
                            // 判断是否超级管理员
                            if (isSuper === 1) return ''

                            // 控制方法执行锁定操作还是解锁操作
                            if (available === 0) {
                                availableText = '启用'
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
                                    }
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
                                    }
                                }),
                                h('a', {
                                    on: {
                                        click: () => {
                                            this.currentDeleteId = id
                                            this.delModal = true
                                        }
                                    }
                                }, '删除')
                            ])
                        }
                    }
                ]
            }
        },
        methods: {
            GetList () {
                // 先将当前页变为第一页 在进行搜索
                this.listQuery.page = 1
                this.$refs.list.GetList()
            },
            update (id) {
                // 模板字符串
                this.$router.push(`/system/role/edit/${id}`)
            },
            del () {
                if (this.currentDeleteId === null) return
//                this.modal_loading = true
                del('role', this.currentDeleteId).then(response => {
//                    this.modal_loading = false
                    this.delModal = false
                    this.$Message.success('删除成功')
                    this.GetList()
                })
            },
            lock (id, str) {
                updateRoleStatus(id).then(response => {
                    this.GetList()
                }).catch(error => {
//                    console.log(error);
//                    this.$Message.error(str+"失败！");
                })
            }
        }
    }
</script>

<style>

</style>
