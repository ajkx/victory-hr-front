<template>
    <div>
        <Modal v-model="delModal" width="360">
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
        <List :listUrl="listUrl" :columns="tableColumns" ref="list" :query="listQuery" :data="listData" :border="true" :customUrl="true" class="tableList">
            <ListHeader slot="header" mode="single">
                <ListSearch>
                    时间：
                    <DatePicker :value="listQuery.beginDate" @on-change="changeBeginDate" :clearable="false"
                                :editable='false' format="yyyy-MM" type="month" placeholder="月份"
                                style="width: 120px"></DatePicker>
                    <span style="margin-left: 50px">部门/人员：</span>
                    <Button type="ghost" @click="showHrmModal = true">{{ chooseText }}</Button>
                    <hrm :isShow="showHrmModal" :openDep="true" :chooseList="chooseItem"
                         @on-close="showHrmModal = false" @on-confirm="confirmHrmModal"></hrm>
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
    import $ from 'jquery'
    const dateFmt = 'YYYY-MM'

    let that

    export default {
        name: 'resultList',
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
                listUrl: 'result/collect',
                listQuery: {    // listQuery 最好都加上 page 和 size
                    page: 1,
                    size: 10,
                    beginDate: this.$moment().startOf('month').format(dateFmt)
                },
                listData: {
                    resources: [],
                    deps: []
                },
                tableColumns: [
                    {
                        title: '姓名',
                        align: 'center',
//                        fixed: 'left',
                        width: '100',
                        key: 'resourceName'
                    },
                    {
                        title: '部门',
                        align: 'center',
                        width: '120',
                        key: 'departmentName'
                    },
                    {
                        title: '工号',
                        align: 'center',
                        width: '100',
                        key: 'workCode'
                    },
                    {
                        title: '应出勤天数',
                        align: 'center',
                        key: 'shouldWorkDay',
                        width: '100'
                    },
                    {
                        title: '实出勤天数',
                        align: 'center',
                        key: 'actualWorkDay',
                        width: '100'
                    },
                    {
                        title: '应出勤时长',
                        align: 'center',
                        key: 'beginResultDesc_1',
                        width: '100'
                    },
                    {
                        title: '实出勤时长',
                        align: 'center',
                        key: 'actualEndTime_1',
                        width: '100'
                    },
                    {
                        title: '迟到次数',
                        align: 'center',
                        key: 'lateCount',
                        width: '100'
                    },
                    {
                        title: '迟到时长',
                        align: 'center',
                        key: 'lateTime',
                        width: '100'
                    },
                    {
                        title: '早退次数',
                        align: 'center',
                        key: 'earlyCount',
                        width: '100'
                    },
                    {
                        title: '早退时长',
                        align: 'center',
                        key: 'earlyTime',
                        width: '100'
                    },
                    {
                        title: '旷工次数',
                        align: 'center',
                        key: 'absentCount',
                        width: '100'
                    },
                    {
                        title: '旷工时长',
                        align: 'center',
                        key: 'absentTime',
                        width: '100'
                    },
                    {
                        title: '平时加班',
                        align: 'center',
                        key: 'normalOvertime',
                        width: '100'
                    },
                    {
                        title: '周末加班',
                        align: 'center',
                        key: 'weekendOvertime',
                        width: '100'
                    },
                    {
                        title: '节日加班',
                        align: 'center',
                        key: 'festivalOvertime',
                        width: '100'
                    },
                    {
                        title: '事假',
                        align: 'center',
                        key: 'personalLevel',
                        width: '100 '
                    },
                    {
                        title: '调休',
                        align: 'center',
                        key: 'restLevel',
                        width: '100'
                    },
                    {
                        title: '年假',
                        align: 'center',
                        key: 'annualLevel',
                        width: '100'
                    },
                    {
                        title: '工伤',
                        align: 'center',
                        key: 'injuryLevel',
                        width: '100'
                    },
                    {
                        title: '销假',
                        align: 'center',
                        key: 'cancelLevel',
                        width: '100'
                    },
                    {
                        title: '产假',
                        align: 'center',
                        key: 'deliveryLevel',
                        width: '100'
                    },
                    {
                        title: '婚假',
                        align: 'center',
                        key: 'maritalLevel',
                        width: '100'
                    },
                    {
                        title: '丧假',
                        align: 'center',
                        key: 'funeralLevel',
                        width: '100'
                    }
                ],
                showHrmModal: false,
                chooseItem: []
            }
        },
        created: function () {

        },
        mounted: function () {
//            let th = $('.table-panel thead')
//            let tds = $(th).find('th')
//            let tr = $('<tr></tr>')
//            for (let i = 0; i < 26; i++) {
//                let td = $('<th class="ivu-table-column-center"></th>')
//                let div = $('<div class="ivu-table-cell"></div>')
//                let span = $('<span></span>')
//                if (i === 5 || i === 7 || i === 9 || i === 11 || i === 13 || i === 15) {
//                    $(tds[i]).attr('colspan', '2')
//                    $(tds[i + 1]).remove()
//                } else {
//                    $(tds[i]).attr('rowspan', '2')
//                }
//                if (i > 4 && i < 17) {
//                    if (i % 2 === 0) span.text('打卡结果')
//                    else span.text('打卡时间')
//                    div.append(span)
//                    td.append(div)
//                    tr.append(td)
//                }
//            }
//            th.append(tr)
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
            changeBeginDate (value) {
                if (value === '') {
                    this.$Message.error('日期不可为空')
                    return
                }
                this.listQuery.beginDate = value
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
    .tableList .table-panel {
        border-top: 1px solid #dddee1 !important;
        border-left: 1px solid #dddee1 !important;
    }
    .tableList .ivu-table-cell{
        white-space: inherit;
    }
    .tableList table{
        /*不设置iview的table width会出错*/
        width: 2000px !important;
    }
</style>
