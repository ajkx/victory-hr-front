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
        <List :listUrl="listUrl" :columns="tableColumns" ref="list" :query="listQuery" :data="listData">
            <ListHeader slot="header" mode="single">
                <ListSearch>
                    时间：
                    <DatePicker :value="listQuery.beginDate" @on-change="changeBeginDate" :clearable="false" :editable='false' format="yyyy-MM-dd" type="date" placeholder="开始日期" style="width: 120px"></DatePicker>
                    <span style="margin: 0 8px">至</span>
                    <DatePicker :value="listQuery.endDate" @on-change="changeEndDate" :clearable="false" :editable='false' format="yyyy-MM-dd" type="date" placeholder="结束日期" style="width: 120px"></DatePicker>
                    <span style="margin-left: 50px">部门/人员：</span>
                    <Button type="ghost" @click="showHrmModal = true">{{ chooseText }}</Button>
                    <hrm :isShow="showHrmModal" :openDep="true" :chooseList="chooseItem" @on-close="showHrmModal = false" @on-confirm="confirmHrmModal"></hrm>
                </ListSearch>
                <ListOperations>
                    <Button type="primary"  icon="plus-round"size="small" @click="$router.push('/attendance/overtime/create')">加班登记</Button>
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

    const dateFmt = 'YYYY-MM-DD HH:mm:ss'

    let that

    export default {
        name: 'overtimeRecord',
        components: {
            List,
            ListHeader,
            ListOperations,
            ListSearch,
            hrm
        },
        data () {
            return {
                delModal: false,
                currentDeleteId: null,
                listUrl: 'overtimeRecord',
                listQuery: {    // listQuery 最好都加上 page 和 size
                    page: 1,
                    size: 10,
                    beginDate: this.$moment().startOf('month').format(dateFmt),
                    endDate: this.$moment().endOf('day').format(dateFmt)
                },
                listData: {
                    resources: [],
                    deps: []
                },
                tableColumns: [
                    {
                        title: '姓名',
                        width: '100',
                        render: (h, params) => {
                            const resource = params.row.resource
                            return resource.name
                        }
                    },
                    {
                        title: '部门',
                        width: '100',
                        render: (h, params) => {
                            const resource = params.row.resource
                            return resource.departmentName
                        }
                    },
                    {
                        title: '加班类型',
                        key: 'typeName',
                        width: '100'
                    },
                    {
                        title: '开始时间',
                        key: 'beginDate',
                        width: '150',
                        render: (h, params) => {
                            const beginDate = params.row.beginDate
                            return this.$moment(beginDate).format('YYYY-MM-DD HH:mm')
                        }
                    },
                    {
                        title: '结束时间',
                        key: 'endDate',
                        width: '150',
                        render: (h, params) => {
                            const endDate = params.row.endDate
                            return this.$moment(endDate).format('YYYY-MM-DD HH:mm')
                        }
                    },
                    {
                        title: '上班打卡',
                        key: 'beginDate',
                        width: '150',
                        render: (h, params) => {
                            const beginDate = params.row.actualBeginDate
                            if (beginDate === '') return ''
                            return this.$moment(beginDate).format('YYYY-MM-DD HH:mm')
                        }
                    },
                    {
                        title: '下班打卡',
                        key: 'endDate',
                        width: '150',
                        render: (h, params) => {
                            const endDate = params.row.actualEndDate
                            if (endDate === '') return ''
                            return this.$moment(endDate).format('YYYY-MM-DD HH:mm')
                        }
                    },
                    {
                        title: '申请时数',
                        key: 'applyTime',
                        width: '100'
                    },
                    {
                        title: '实际时数',
                        key: 'actualTime',
                        width: '100'
                    },
                    {
                        title: '加班原因',
                        key: 'reason',
                        width: '150'
                    },
                    {
                        key: 'statusName',
                        title: '状态',
                        width: '80'
                    },
                    {
                        title: '异常备注',
                        key: 'remark'
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
            chooseText: function () {
                let depText = ''
                let resText = ''
                let resCount = 0
                this.chooseItem.forEach(item => {
                    if (item.type === 'dep') {
                        depText += item.name + ' '
                    } else if (item.type === 'res') {
                        resCount++
                    }
                })
                if (resCount > 0) {
                    resText = resCount + '人'
                }
                let result = depText + resText
                if (result === '') {
                    result = '全公司'
                } else if (result.length > 10) {
                    result = depText.substring(0, 9) + '....'
                }
                return result
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
                this.$router.push(`/attendance/overtime/edit/${id}`)
            },
            del () {
                if (this.currentDeleteId === null) return
                del('overtimeRecord', this.currentDeleteId).then(response => {
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
            },
            confirmHrmModal (value) {
                this.showHrmModal = false
                this.listData.resources = []
                this.listData.deps = []
                value.forEach(item => {
                    if (item.type === 'res') {
                        this.listData.resources.push(item.id)
                    } else if (item.type === 'dep') {
                        this.listData.deps.push(item.id)
                    }
                    this.chooseItem.push({id: item.id, name: item.name, type: item.type})
                })
                this.GetList()
            }
        }
    }
</script>

<style>

</style>
