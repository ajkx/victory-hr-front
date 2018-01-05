<template>
    <div>
        <Modal v-model="delModal" width="360" >
            <p slot="header" style="color:#ed3f14">
                <Icon type="information-circled"></Icon>
                <span>删除确认</span>
            </p>
            <div style="text-align:center;font-size: 14px">
                <p>该操作不可恢复,是否继续？</p>
            </div>
            <div slot="footer" style="text-align: center">
                <Button type="ghost" @click="delModal = false">取消</Button>
                <Button type="error" @click="del" style="margin-left: 15px">删除</Button>
            </div>
        </Modal>
        <List :listUrl="listUrl" :columns="tableColumns" ref="list" :query="listQuery">
            <ListHeader slot="header" mode="both">
                <ListSearch>
                    <Input size="small" v-model="listQuery.name" placeholder="输入名称" style="width: 200px"
                           @on-enter="GetList" icon="ios-search" class="">
                    </Input>
                </ListSearch>
                <ListOperations>
                    <Button type="primary" icon="plus-round" size="small" @click="$router.push('/attendance/group/create')">新增考勤组</Button>
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
        name: 'attendanceGroup',
        components: {
            List,
            ListHeader,
            ListOperations,
            ListSearch
        },
        data () {
            return {
                delModal: false,
                currentDeleteId: null,
                listUrl: 'attendanceGroup',
                listQuery: {    // listQuery 最好都加上 page 和 size
                    name: undefined,
                    page: 1,
                    size: 10
                },
                tableColumns: [
                    {
                        title: '名称',
                        key: 'name'
                    },
                    {
                        title: '人数',
                        key: 'resourceCount'
                    },
                    {
                        title: '类型',
                        key: 'type',
                        render: (h, params) => {
                            const data = params.row
                            const type = data.type
                            let result = ''
                            switch (type) {
                            case 'fixed':
                                result = '固定班制'
                                break
                            case 'arrange':
                                result = '排班制'
                                break
                            case 'free':
                                result = '自由打卡'
                                break
                            }
                            return result
                        }
                    },
                    {
                        title: '考勤时间',
                        key: 'timeList',
                        width: '500',
                        render: (h, params) => {
                            const data = params.row.timeList
                            return h('ul', {style: {padding: '10px 5px'}}, data.map(item => {
                                let arr = []
                                let nameStr = item.time.name
                                // 排除休息时list为underfine数组map报错
                                let timeList = item.time.list ? item.time.list : []
                                if (timeList.length > 0) nameStr += ':'
                                let name = h('span', {
                                    style: {marginRight: '3px'}
                                }, nameStr)
                                arr.push(name)
                                arr.push(timeList.map(item1 => {
                                    return h('span', {
                                        style: {marginRight: '5px'}
                                    }, item1)
                                }))
                                return h('li', [
                                    h('span', {
                                        style: {
                                            marginRight: '10px'
                                        }
                                    }, item.week),
                                    h('span', arr)
                                ])
                            }))
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        render: (h, params) => {
                            const data = params.row
                            const id = data.id
                            const type = data.type
                            var a = {}
                            if (type === 'arrange') {
                                a.attrs = {
                                    href: '#',
                                    disabled: ''
                                }
                                a.on = {
                                    click: () => {
                                        this.editArrange(id)
                                    }
                                }
                            } else {
                                a.attrs = {
                                    href: '#'
                                }
                                a.on = {
                                    click: () => {
                                        this.editArrange(id)
                                    }
                                }
                            }
                            return h('div', [
                                h('a', a, '排班调整'),
                                h('span', {
                                    attrs: {
                                        class: 'divider'
                                    }
                                }),
                                h('a', {
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
            editArrange () {    // 编辑排班
                console.log('editArrange')
            },
            update (id) {
                // 模板字符串
                this.$router.push(`/attendance/group/edit/${id}`)
            },
            del () {
                if (this.currentDeleteId === null) return
                del('attendanceGroup', this.currentDeleteId).then(response => {
                    this.delModal = false
                    this.$Message.success('删除成功')
                    this.GetList()
                })
            }
        }
    }
</script>

<style>

</style>
