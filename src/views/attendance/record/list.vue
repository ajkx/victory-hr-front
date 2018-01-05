<template>
    <div>
        <List :listUrl="listUrl" :columns="tableColumns" ref="list" :query="listQuery" :data="listData">
            <ListHeader slot="header" mode="single">
                <ListSearch>
                    <!--<DatePicker :value="[listQuery.beginDate,listQuery.endDate]" @on-change="changeDate" :options="options" :clearable="false" :editable='false' format="yyyy-MM-dd" type="daterange" placement="bottom-start" placeholder="选择日期范围" style="width: 200px"></DatePicker>-->
                    时间：
                    <DatePicker :value="listQuery.beginDate" @on-change="changeBeginDate" :clearable="false" :editable='false' format="yyyy-MM-dd" type="date" placeholder="开始日期" style="width: 120px"></DatePicker>
                    <span style="margin: 0 8px">至</span>
                    <DatePicker :value="listQuery.endDate" @on-change="changeEndDate" :clearable="false" :editable='false' format="yyyy-MM-dd" type="date" placeholder="结束日期" style="width: 120px"></DatePicker>
                    <span style="margin-left: 50px">部门/人员：</span>
                    <Button type="ghost" @click="showHrmModal = true">{{ chooseText }}</Button>
                    <hrm :isShow="showHrmModal" :openDep="true" :chooseList="chooseItem" @on-close="showHrmModal = false" @on-confirm="confirmHrmModal"></hrm>
                </ListSearch>
                <ListOperations>
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
        name: 'attendanceRecord',
        components: {
            List,
            ListHeader,
            ListOperations,
            ListSearch,
            hrm
        },
        data () {
            return {
                listUrl: 'attendanceRecord',
                listQuery: {    // listQuery 最好都加上 page 和 size
                    page: 1,
                    size: 10,
                    type: 'machine',
                    beginDate: this.$moment().startOf('month').format(dateFmt),
                    endDate: this.$moment().endOf('day').format(dateFmt)
                },
                listData: {
                    resources: [],
                    deps: []
                },
                tableColumns: [
                    {
                        title: '卡号',
                        key: 'card'
                    },
                    {
                        title: '姓名',
                        key: 'resourceName'
                    },
                    {
                        title: '部门',
                        key: 'departmentName'
                    },
                    {
                        title: '工号',
                        key: 'workCode'
                    },
                    {
                        title: '打卡时间',
                        key: 'date',
                        render: (h, params) => {
                            const date = params.row.date
                            return this.$moment(date).format('YYYY-MM-DD HH:mm')
                        }
                    },
                    {
                        title: '机器号',
                        key: 'machineNo'
                    }
                ],
                options: {
                    shortcuts: [
                        {
                            text: '当月',
                            value () {
                                const start = that.$moment().startOf('month').format(dateFmt)
                                const end = that.$moment().endOf('month').format(dateFmt)
                                return [start, end]
                            }
                        }
                    ]
                },
                showHrmModal: false,
                chooseItem: []
            }
        },
        created: function () {
            that = this
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
            changeDate (value) {
                if (value[0] !== '') {
                    this.listQuery.beginDate = value[0] + ' 00:00:00'
                    this.listQuery.endDate = value[1] + ' 23:59:59'
                    this.GetList()
                }
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
