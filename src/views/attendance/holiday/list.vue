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
            <ListHeader slot="header" mode="single">
                <ListSearch>
                    时间：
                    <DatePicker :value="listQuery.beginDate" @on-change="changeBeginDate" :clearable="false" :editable='false' format="yyyy-MM-dd" type="date" placeholder="开始日期" style="width: 120px"></DatePicker>
                    <span style="margin: 0 8px">至</span>
                    <DatePicker :value="listQuery.endDate" @on-change="changeEndDate" :clearable="false" :editable='false' format="yyyy-MM-dd" type="date" placeholder="结束日期" style="width: 120px"></DatePicker>
                    <Input size="small" v-model="listQuery.name" placeholder="输入说明" style="width: 200px; float: right"
                           @on-enter="GetList" icon="ios-search" class="">
                    </Input>
                </ListSearch>
                <ListOperations>
                    <Button type="primary" icon="plus-round" size="small" @click="$router.push('/attendance/holiday/create')">新增假日</Button>
                </ListOperations>
            </ListHeader>
        </List>
    </div>
</template>

<script>
    import List, { ListHeader, ListOperations, ListSearch } from 'components/list'

    import { del, get, create, update } from 'api/common'

    import hrm from 'components/browser/hrm'

    import Vue from 'vue'

    import { getTimeList } from 'utils/transform'

    const dateFmt = 'YYYY-MM-DD'

    export default {
        name: 'holidayList',
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
                listUrl: 'holiday',
                listQuery: {    // listQuery 最好都加上 page 和 size
                    page: 1,
                    size: 10,
                    sort: 'date,asc',
                    name: undefined,
                    beginDate: this.$moment().startOf('month').format(dateFmt),
                    endDate: this.$moment().endOf('month').format(dateFmt)
                },
                tableColumns: [
                    {
                        title: '类型',
                        key: 'typeName',
                        width: '200'
                    },
                    {
                        title: '日期',
                        key: 'date',
                        width: '200',
                        render: (h, params) => {
                            const date = params.row.date
                            return this.$moment(date).format(dateFmt)
                        }
                    },
                    {
                        title: '说明',
                        key: 'name',
                        width: '400'
                    },
                    {
                        title: '自动调休',
                        key: 'useRest',
                        width: '100',
                        render: (h, params) => {
                            const data = params.row
                            const useRest = data.useRest
                            if (useRest) {
                                return h('Tag', {
                                    props: {
                                        color: 'green'
                                    }
                                }, '启用')
                            }
                            return ''
                        }
                    },
                    {
                        title: '指定班次',
                        key: 'useClass',
                        width: '250',
                        render: (h, params) => {
                            const data = params.row
                            const useClass = data.useClass
                            if (useClass) {
                                const name = data.classes.name
                                const timeList = data.classes.timeList
                                return name + ': ' + getTimeList(timeList)
                            }
                            return ''
                        }
                    },

                    {
                        title: '操作',
                        key: 'action',
                        render: (h, params) => {
                            const data = params.row
                            const id = data.id
                            const canEdit = data.canEdit
                            let editAttr = {
                                on: {
                                    click: () => {
                                        this.update(id)
                                    }
                                }
                            }
                            let delAttr = {
                                on: {
                                    click: () => {
                                        this.currentDeleteId = id
                                        this.delModal = true
                                    }
                                }
                            }
                            if (canEdit !== 1) {
                                editAttr.attrs = {disabled: 'disabled'}
                                delAttr.attrs = {disabled: 'disabled'}
                            }
                            return h('div', [
                                h('a', editAttr, '编辑'),
                                h('span', {
                                    attrs: {
                                        class: 'divider'
                                    }
                                }),
                                h('a', delAttr, '删除')
                            ])
                        }
                    }
                ],
                showHrmModal: false,
                chooseItem: []
            }
        },
        created: function () {
        },
        computed: {
        },
        methods: {
            GetList () {
                // 先将当前页变为第一页 在进行搜索
                this.listQuery.page = 1
                this.$refs.list.GetList()
            },
            update (id) {
                // 模板字符串
                this.$router.push(`/attendance/holiday/edit/${id}`)
            },
            del () {
                if (this.currentDeleteId === null) return
                del('holiday', this.currentDeleteId).then(response => {
                    this.delModal = false
                    this.$Message.success('删除成功')
                    this.GetList()
                })
            },
            changeBeginDate (value) {
                if (value === '') {
                    this.$Message.error('开始日期不可为空')
                    return
                }
                if (value > this.listQuery.endDate) {
                    this.$Message.error('开始日期不可大于结束日期!')
                    return
                }
                this.listQuery.beginDate = value + ' 00:00:00'
                this.GetList()
            },
            changeEndDate (value) {
                if (value === '') {
                    this.$Message.error('结束日期不可为空')
                    return
                }
                if (value < this.listQuery.beginDate) {
                    this.$Message.error('开始日期不可大于结束日期!')
                    return
                }
                this.listQuery.endDate = value + ' 23:59:59'
                this.GetList()
            }
        }
    }
</script>

<style>

</style>
