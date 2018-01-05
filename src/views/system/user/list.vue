<template>
    <div>
        <List :listUrl="listUrl" :columns="tableColumns" ref="list" :query="listQuery">
            <ListHeader slot="header" mode="both">
                <ListSearch>
                    <Input size="small" v-model="listQuery.name" placeholder="输入用户名" style="width: 200px"
                           @on-enter="GetList" icon="ios-search" class="">
                    </Input>
                </ListSearch>
                <ListOperations>
                </ListOperations>
            </ListHeader>
        </List>
    </div>
</template>

<script>
    import List, { ListHeader, ListOperations, ListSearch } from 'components/list'

    import { getUsers, updateUserRole, updateUserStatus } from 'api/sys'

    export default {
        name: 'user',
        components: {
            List,
            ListHeader,
            ListOperations,
            ListSearch
        },
        data () {
            return {
                listUrl: 'user',
                listQuery: {
                    page: 1,
                    size: 10,
                    name: undefined,
                    sort: 'id,desc'
                },
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
                            const data = params.row
                            const roles = data.roles
                            var str = ''
                            for (var i = 0; i < roles.length; i++) {
                                str += roles[i].name + ', '
                            }
                            str.substring(0)
                            return h('div', str.substring(0, str.length - 2))
                        }
                    },
                    {
                        title: '状态',
                        key: 'locked',
                        render: (h, params) => {
                            const data = params.row
                            const locked = data.locked
                            var text = '正常'
                            var color = 'green'
                            if (locked === 1) {
                                text = '锁定'
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
                            const locked = data.locked
                            var lockText = '锁定'
                            // 控制方法执行锁定操作还是解锁操作
                            var type = 1
                            if (locked === 1) {
                                lockText = '解锁'
                                type = 0
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
                                }, '编辑角色'),
                                h('span', {
                                    attrs: {
                                        class: 'divider'
                                    }

                                }),
                                h('a', {
                                    attrs: {
                                        href: '#'
                                    },
                                    on: {
                                        click: () => {
                                            this.lock(id, lockText)
                                        }
                                    }
                                }, lockText)

                            ])
                        }
                    }
                ]
            }
        },
        methods: {
            GetList () {
                this.listQuery.page = 1
                this.$refs.list.GetList()
            },
            update (id) {
            },
            lock (id, str) {
                updateUserStatus(id).then(response => {
                    this.$Message.success(str + '成功')

                    this.GetList()
                }).catch(error => {
                    this.$Message.error(str + '失败！')
                })
            }
        }
    }
</script>

<style>

</style>
