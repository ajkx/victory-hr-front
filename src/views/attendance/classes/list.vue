<template>
    <div>
        <List :listUrl="listUrl" :columns="tableColumns" ref="list" :query="listQuery">
            <ListHeader slot="header" mode="both">
                <ListSearch>
                    <Input size="small" v-model="listQuery.name" placeholder="输入班次名" style="width: 200px"
                           @on-enter="GetList" icon="ios-search" class="">
                    </Input>
                </ListSearch>
                <ListOperations>
                    <Button type="primary" icon="plus-round" size="small" @click="edit(-1)">新增班次</Button>
                </ListOperations>
            </ListHeader>
        </List>

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

        <Modal v-model="editModal" width="800" title="">
            <p slot="header">
                <span v-if="currIndex==-1">新增班次</span>
                <span v-if="currIndex!=-1">编辑班次</span>
            </p>
            <div>
                <span>班次名称</span>
                <Input v-model="currEditData.name" placeholder="" style="width:140px; margin-left: 10px;"></Input>
                <div class="infoText" style="margin-left: 60px;margin-top: 10px;margin-bottom:30px">
                    最多10个字符（中英文或数字），首个字符会作为班次简称
                </div>
                <span style="margin-right: 20px">设置该班次一天内上下班的次数</span>
                <RadioGroup v-model="classesType" type="button" @on-change="radioChange">
                    <Radio :label=1>1天1次上下班</Radio>
                    <Radio :label=2>1天2次上下班</Radio>
                    <Radio :label=3>1天3次上下班</Radio>
                </RadioGroup>
                <Checkbox v-model="rangeSet" style="margin-left: 15px">打卡范围设置</Checkbox>

                <div style="margin-top: 15px" v-for="(item,index) in currEditData.timeList" :key="index">
                    <div style="min-width: 240px; display: inline-block;">
                        <span style="margin-right: 10px">第{{index + 1}}次</span>上班:
                        <MyTimePicker property="beginTime" :index="index" type="list"
                                      @timechange="timeChange" :value="item.beginTime"></MyTimePicker>
                        <Checkbox v-model="item.beginAcross" :true-value=1 :false-value=0>次日</Checkbox>
                        <!--<Tag v-if="item.beginAcross === 1" color="red">次日</Tag>-->
                        <span v-if="rangeSet">
                            <Select v-model="item.beginMinute" style="width:55px;" placeholder="--">
                                <Option :value="-1" :key="-1">--</Option>
                                <Option v-for="n in 72" :value="n*10" :key="n*10"> {{ n * 10 }}</Option>
                            </Select>
                            分钟前开始打卡
                        </span>

                    </div>
                    <div style="margin-left: 5px; min-width: 320px; display: inline-block; float: right;">
                        下班:
                        <MyTimePicker property="endTime" :index="index" type="list"
                                      @timechange="timeChange" :value="item.endTime"></MyTimePicker>
                        <Checkbox v-model="item.endAcross" :true-value=1 :false-value=0>次日</Checkbox>
                        <!--<Tag v-if="item.endAcross === 1" color="red">次日</Tag>-->
                        <span v-if="rangeSet">
                            <Select v-model="item.endMinute" style="width:55px;" placeholder="--">
                                <Option :value="-1" :key="-1">--</Option>
                                <Option v-for="n in 72" :value="n*10" :key="n*10"> {{ n * 10 }}</Option>
                            </Select>
                            分钟后结束打卡
                        </span>
                    </div>
                </div>

                <!--休息时间设置-->
                <div style="margin-top: 10px" v-if="classesType === 1">
                    <Checkbox v-model="currEditData.haveRest" :true-value=1 :false-value=0>休息时间</Checkbox>
                    <div style="margin-left: 5px; width: 225px; display: inline-block;">
                        休息开始:
                        <MyTimePicker property="beginTime" type="rest"
                                      @restchange="onRestTimeChange" :value="currEditData.restTime.beginTime"></MyTimePicker>
                        <Tag color="red" v-if="currEditData.restTime.endAcross === 1">次日</Tag>
                    </div>
                    <div style="margin-left: 5px; width: 225px; display: inline-block;">
                        休息结束:
                        <MyTimePicker property="endTime" type="rest"
                                      @restchange="onRestTimeChange" :value="currEditData.restTime.beginTime"></MyTimePicker>
                        <Tag color="red" v-if="currEditData.restTime.endAcross === 1" >次日</Tag>
                    </div>
                </div>

                <!--合计时间显示-->
                <div style="margin-top: 10px;">
                    合计工作时长{{ totalTime }}
                    <span style="color: rgb(196, 196, 196);">（考勤统计工作时长，会以此时间为准）</span>
                </div>

                <!--下班不用打卡-->
                <div style="margin-top: 30px;">
                    <Checkbox v-model="currEditData.offDutyCheck" :true-value=1 :false-value=0>下班不用打卡（开启后，下班不打卡也不会记作异常）</Checkbox>
                </div>

                <div style="margin-top: 20px; margin-bottom: 10px; border-top: 1px solid rgb(228, 228, 228);"></div>

                <div style="margin-top: 0px; color: rgb(148, 148, 148);">限定时间设置</div>

                <div style="margin-top: 10px;">
                    <span style="margin-right: 16px">迟到限定时间（超出记作旷工）</span>
                    <InputNumber :max="300" :min="1" v-model="currEditData.lateMinute"></InputNumber>
                </div>
                <div style="margin-top: 10px;">
                    <span style="margin-right: 16px">早退限定时间（超出记作旷工）</span>
                    <InputNumber :max="300" :min="1" v-model="currEditData.earlyMinute"></InputNumber>
                </div>
            </div>
            <div slot="footer">
                <Button type="ghost" size="large" @click="editModal = false">取消</Button>
                <Button type="primary" size="large" @click="handleSubmit" style="margin-left: 15px">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import List, { ListHeader, ListOperations, ListSearch } from 'components/list'

    import MyTimePicker from './MyTimePicker.vue'

    import { del, get, create, update } from 'api/common'

    import { updateRoleStatus } from 'api/sys'

    const DEFAULT_TIMELIST_ONE = [
        {
            beginTime: '09:00',
            beginAcross: 0,
            beginMinute: -1,
            endTime: '18:00',
            endAcross: 0,
            endMinute: -1
        }
    ]
    const DEFAULT_SECTIONS_TWO = [
        {
            beginTime: '09:00',
            beginAcross: 0,
            beginMinute: -1,
            endTime: '12:00',
            endAcross: 0,
            endMinute: -1

        },
        {
            beginTime: '14:00',
            beginAcross: 0,
            beginMinute: -1,
            endTime: '18:00',
            endAcross: 0,
            endMinute: -1
        }
    ]
    const DEFAULT_SECTIONS_THREE = [
        {
            beginTime: '09:00',
            beginAcross: 0,
            beginMinute: -1,
            endTime: '11:00',
            endAcross: 0,
            endMinute: -1
        },
        {
            beginTime: '12:00',
            beginAcross: 0,
            beginMinute: -1,
            endTime: '15:00',
            endAcross: 0,
            endMinute: -1
        },
        {
            beginTime: '16:00',
            beginAcross: 0,
            beginMinute: -1,
            endTime: '18:00',
            endAcross: 0,
            endMinute: -1
        }
    ]
    const DEFAULT_REST = {
        beginTime: '12:00',
        beginAcross: 0,
        endTime: '13:00',
        endAcross: 0
    }
    export default {
        name: 'attendanceClasses',
        components: {
            List,
            ListHeader,
            ListOperations,
            ListSearch,
            MyTimePicker
        },
        data () {
            return {
                delModal: false,

                editModal: false,

                currentDeleteId: null,
                currIndex: 0,

                currMinuteData: [],
                currEditData: {
                    name: '',
                    haveRest: 0,
                    offDutyCheck: 0,
                    lateMinute: 30,
                    earlyMinute: 30,
                    workTime: 0,
                    restTime: DEFAULT_REST,
                    timeList: DEFAULT_TIMELIST_ONE
                },

                classesType: 1,
//                this.getWorkTime(this.currEditData.haveRest, this.currEditData.timeList, this.currEditData.restTime)
                rangeSet: false,    // 打卡范围设置

                listUrl: 'attendanceClasses',
                listQuery: {    // listQuery 最好都加上 page 和 size
                    name: undefined,
                    page: 1,
                    size: 10
                },
                tableColumns: [
                    {
                        title: '班次名',
                        key: 'name'
                    },
                    {
                        title: '考勤时间',
                        key: 'timeList',
                        render: (h, params) => {
                            const data = params.row
                            const timeList = data.timeList
                            let result = ''
                            for (var t of timeList) {
                                let beginTime = t.beginTime
                                let beginAcross = t.beginAcross
                                let endTime = t.endTime
                                let endAcross = t.endAcross
                                if (beginAcross) result += '次日'
                                result += beginTime + '-'
                                if (endAcross) result += '次日'
                                result += endTime + ' '
                            }
                            return result
                        }
                    },
                    {
                        title: '合计时间',
                        key: 'workTime',
                        render: (h, params) => {
                            const data = params.row
                            const workTime = data.workTime
                            const hour = Math.floor(workTime / 60)
                            const minute = workTime % 60
                            let result = ''
                            if (hour > 0) result += hour + '小时'
                            if (minute > 0) result += minute + '分钟'
                            return result
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        render: (h, params) => {
                            const data = params.row
                            const id = data.id
                            return h('div', [
                                h('a', {
                                    attrs: {
                                        href: '#'
                                    },
                                    on: {
                                        click: () => {
                                            this.edit(params.index)
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
        computed: {
            totalTime: function () {
                var h = Math.floor(this.currEditData.workTime / 60)
                var m = this.currEditData.workTime % 60
                return h + '小时' + m + '分钟'
            }
        },
        methods: {
            GetList () {
                // 先将当前页变为第一页 在进行搜索
                this.listQuery.page = 1
                this.$refs.list.GetList()
            },
            edit (index) {
                this.editModal = true
                this.currIndex = index
                if (index === -1) {
                    this.currEditData = {
                        name: '',
                        haveRest: 0,
                        offDutyCheck: 0,
                        lateMinute: 30,
                        earlyMinute: 30,
                        workTime: 0,
                        restTime: DEFAULT_REST,
                        timeList: DEFAULT_TIMELIST_ONE
                    }
                    this.classesType = 1
                    this.rangeSet = false
                } else {
                    this.currEditData = this.$refs.list.tableData[index]
                    this.classesType = this.currEditData.timeList.length
                    for (var item of this.currEditData.timeList) {
                        if (item.beginMinute !== -1 || item.beginMinute !== -1) {
                            this.rangeSet = true
                            break
                        }
                    }
                }
            },
            del () {
                if (this.currentDeleteId === null) return
                del('attendanceClasses', this.currentDeleteId).then(response => {
                    this.delModal = false
                    this.$Message.success('删除成功')
                    this.GetList()
                })
            },
            handleSubmit () {
                let data = {}
                if (this.currEditData.id !== -1) data.id = this.currEditData.id
                data.name = this.currEditData.name
                data.haveRest = 0
                data.offDutyCheck = this.currEditData.offDutyCheck
                data.lateMinute = this.currEditData.lateMinute
                data.earlyMinute = this.currEditData.earlyMinute
                data.workTime = this.currEditData.workTime
                data.timeList = this.currEditData.timeList
                if (this.classesType === 1) {
                    data.haveRest = this.currEditData.haveRest
                    if (data.haveRest === 1) {
                        data.restTime = this.currEditData.restTime
                    }
                }
                if (!this.currEditData.id) {
                    create('attendanceClasses', data).then(data => {
                        this.$Message.success('创建成功!')
                        this.editModal = false
                        this.GetList()
                    })
                } else {
                    update('attendanceClasses', data).then(data => {
                        this.$Message.success('更新成功!')
                        this.editModal = false
                        this.GetList()
                    })
                }
            },
            radioChange (value) {
                var data = this.currEditData.timeList
                switch (value) {
                case 1:
                    data.length > 1 && data.splice(1, data.length - 1)
                    break
                case 2:
                    data.length > 2 ? data.splice(2, data.length - 1) : data.length === 1 && !this.currEditData.id
                            ? data = JSON.parse(JSON.stringify(DEFAULT_SECTIONS_TWO)) : data.push(this.getDefaultTime(data[0]))
                    break
                case 3:
                    if (!this.currEditData.id) {
                        data = JSON.parse(JSON.stringify(DEFAULT_SECTIONS_THREE))
                    } else {
                        for (var n = data.length, i = 0; i < 3 - n; i++) {
                            data.push(this.getDefaultTime(data[data.length - 1]))
                        }
                        data[n - 1].endMinute = -1
                    }
                }
                this.currEditData.timeList = data
            },
            onRestTimeChange (value, property) {
                this.currEditData.restTime[property] = value
                this.currEditData.workTime = this.getWorkTime(this.currEditData.haveRest, this.currEditData.timeList, this.currEditData.restTime)
            },
            timeChange (value, index, property) {
                this.currEditData.timeList[index][property] = value
                this.currEditData.workTime = this.getWorkTime(this.currEditData.haveRest, this.currEditData.timeList, this.currEditData.restTime)
            },
            getDefaultTime: function (time) {
                if (!time || !time.endTime) return null          // 判断传入的time数据是否合法
                var endTimeArray = time.endTime.split(':')
                if (endTimeArray.length !== 2) return null
                // +1 代表下个班次的上班时间至少大于beginHour1小时
                var beginAcross = time.endAcross
                var beginHour = parseInt(endTimeArray[0]) + 1
                if (beginHour >= 24) {
                    beginAcross += 1
                    beginHour -= 24
                }
                // +3 代表下个班次的下班时间至少大于endHour3个小时，即一个班次的上班时间至少2小时
                var endAcross = beginAcross
                var endHour = beginHour + 3
                if (endHour >= 24) {
                    endAcross += 1
                    endHour -= 24
                }
                return {
                    beginTime: this.getFormatTime(beginHour) + ':' + endTimeArray[1],
                    beginAcross: beginAcross,
                    beginMinute: -1,
                    endTime: this.getFormatTime(endHour) + ':' + endTimeArray[1],
                    endAcross: endAcross,
                    endMinute: -1
                }
            },
            getFormatTime: function (value) {    // 限制格式为 xx
                var result = value + ''
                return result.length === 2 ? result : '0' + result
            },
            renderOption: function (currentRow, beginOrEnd) {   // 用于动态渲染选择打卡范围的option 但目前iview没有支持select的visible-change事件，所以固定720
                var timeList = this.currEditData.timeList
                var getDiff = function (beginTime, endTime) {
                    // 最小的分隔数
                    var minGap = arguments.length > 2 && undefined !== arguments[2] ? arguments[2] : 0
                    var oldBeginMinute = arguments.length > 3 && undefined === arguments[3] ? arguments[3] : 0
                    var beginTimeArray = beginTime.split(':')
                    var endTimeArray = endTime.split(':')
                    var timeDiff = 60 * (parseInt(beginTimeArray[0]) - parseInt(endTimeArray[0])) + (parseInt(beginTimeArray[1]) - parseInt(endTimeArray[1])) - (oldBeginMinute > 0 ? oldBeginMinute : 0)
                    if (timeDiff < 0) {
                        timeDiff += 1440
                    }
                    // 将时间差 减去 10 分钟（即最小的时差为10分钟）
                    if (!oldBeginMinute && minGap && timeDiff > minGap) timeDiff -= minGap
                    // 去除个位数
                    timeDiff = 10 * parseInt(timeDiff / 10)
                    // 最大返回720
                    return Math.min(i, 720)
                }
                var beginResult
                var endResult
                if (beginOrEnd) {
                    var index = currentRow - 1 < 0 ? timeList.length - 1 : currentRow - 1
                    beginResult = getDiff(timeList[currentRow].beginTime, timeList[index].endTime, 10, timeList[index].endMinute)
                    endResult = timeList[currentRow].beginMinute
                } else {
                    index = currentRow === timeList.length - 1 ? 0 : currentRow + 1
                    beginResult = getDiff(timeList[index].beginTime, timeList[currentRow].endTime, 10, timeList[index].beginMinute)
                    endResult = timeList[currentRow].endMinute
                }
                var result = [{value: -1, label: '--'}]
                for (var i = 10; i < beginResult; i += 10) { result.push({value: i, label: i + ''}) }
                this.currMinuteData = result
            },
            getTimeDuring: function (time) {      // 获取每个班次的事件差
                if (!(time && time.beginTime && time.endTime)) return 0
                var beginTimeArray = time.beginTime.split(':')
                var endTimeArray = time.endTime.split(':')
                if (beginTimeArray.length !== 2 || endTimeArray.length !== 2) return 0

                var firstTime = 60 * parseInt(beginTimeArray[0]) + parseInt(beginTimeArray[1]) + 24 * time.beginAcross * 60
                var secondTime = 60 * parseInt(endTimeArray[0]) + parseInt(endTimeArray[1]) + 24 * time.endAcross * 60

                return secondTime > firstTime ? secondTime - firstTime : 0
            },
            getWorkTime: function (haveRest, timeList, RestTime) {  // 获取合计工作时间
                for (var result = 0, i = 0; i < timeList.length; i++) { result += this.getTimeDuring(timeList[i]) }
                if (haveRest === 1 && timeList.length === 1 && RestTime) {    // 判断休息时间的
                    result -= this.getTimeDuring(RestTime)
                }
                return result
            }
        }
    }
</script>

<style>

</style>
