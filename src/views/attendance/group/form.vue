<template>
    <div style="position: relative">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="groupForm" :model="formItem" :label-width="100" :rules="ruleValidate" style="margin-left: 10px">
            <FormItem label="考勤组名称:" prop="name">
                <Row>
                    <Col span="6">
                    <Input v-model="formItem.name" placeholder="请输入名称"></Input>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="考勤人员:" prop="name">
                <Row>
                    <Col span="6">
                        <Button type="ghost" @click="showHrmModal = true">{{ resourceValue }}</Button>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="考勤类型:" prop="type">
                <RadioGroup v-model="formItem.type">
                    <Radio label="fixed" style="margin-right: 20px">固定班制</Radio>
                    <Radio label="arrange" style="margin-right: 20px">排班制</Radio>
                    <Radio label="free" style="margin-right: 20px">自由工时</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="工作日设置:">
                设置默认班次：{{ defaultClassValue }} <a style="margin-left: 10px;" @click="showClassesModal(-1)">更改班次</a> <span style="margin-left: 12px; font-size: 12px; color: rgb(153, 153, 153);">可用于全局特殊日期的默认班次</span>
                <div style="width: 670px">
                    <Table ref="weekTable" :columns="weekColumns" :data="weekData" class="child-table"
                        @on-select="selectWeek"
                        @on-select-cancel="unSelectWeek"
                        @on-select-all="selectAll"
                        @on-selection-change="selectChange"></Table>
                </div>
                <div style="margin-top: 5px">
                    <Checkbox v-model="formItem.holidayRest" :true-value=1 :false-value=0>节假日自动转换</Checkbox>
                </div>
            </FormItem>
            <FormItem label="特殊日期:">
                <div>
                    <Button type="ghost" @click="showDateModal(0, -1)">添加</Button>
                    <span style="margin-left: 12px; font-size: 12px; color: rgb(153, 153, 153);">必须打卡的日期</span>
                </div>
                <div style="width: 550px; padding-top: 10px; padding-bottom: 10px;">
                    <Table :columns="OnDateColumns" :data="formItem.specialOnDate" v-if="formItem.specialOnDate.length > 0" class="child-table"></Table>
                </div>
                <div>
                    <Button type="ghost" @click="showDateModal(1, -1)">添加</Button>
                    <span style="margin-left: 12px; font-size: 12px; color: rgb(153, 153, 153);">不用打卡的日期</span>
                </div>
                <div style="width: 550px; padding-top: 10px; padding-bottom: 0px;">
                    <Table :columns="OffDateColumns" :data="formItem.specialOffDate" v-if="formItem.specialOffDate.length > 0" class="child-table"></Table>
                </div>
            </FormItem>
            <FormItem label="描述：" prop="description">
                <Row>
                    <Col span="10">
                    <Input v-model="formItem.description" type="textarea" :rows="3"></Input>
                    </Col>
                </Row>
            </FormItem>
            <FormItem>
                <Button type="ghost" @click="$router.push({path: '/attendance/group'})">取消</Button>
                <Button type="primary" @click="handleSubmit('groupForm')" style="margin-left: 8px">提交</Button>
            </FormItem>
        </Form>
        <Modal v-if="classesFirstRender" v-model="classesModal" width="520">
            <p slot="header">
                <span>选择班次</span>
            </p>
            <div>
                <List listUrl="attendanceClasses"
                        :columns="classesColumns"
                        ref="classesTable"
                        :query="classesQuery"
                        :showSizer="false"
                        type="radio"
                        :isAll="true"
                        :currentDataId="currentChooseClassId">

                </List>
            </div>
            <div slot="footer">
                <Button type="ghost" @click="classesModal = false">取消</Button>
                <Button type="primary" @click="chooseClasses" style="margin-left: 15px">确定</Button>
            </div>
        </Modal>
        <Modal v-if="dateFirstRender" v-model="dateModal" width="520">
            <p slot="header">
                <span>{{ currentChooseDateType === 0 ? '必须打卡日期' : '不用打卡日期' }}</span>
            </p>
            <div>
                <div>
                    日期
                    <DatePicker :value="currentChooseDate" @on-change="changeDate" type="date" :options="dateOption" placeholder="Select date" style="margin-left: 10px; width: 110px; margin-right: 10px;"></DatePicker>
                    <!--<span style="font-size: 12px; color: rgb(255, 65, 65);">该日期已被指定为不需要打卡</span>-->
                </div>
                <div v-if="dateClassFirstRender" v-show="currentChooseDateType === 0" style="margin-top: 10px">
                    <List listUrl="attendanceClasses"
                          :columns="classesColumns1"
                          ref="dateClassesTable"
                          :query="classesQuery1"
                          :showSizer="false"
                          type="radio"
                          :isAll="true"
                          :currentDataId="currentChooseClassId"></List>
                </div>
            </div>
            <div slot="footer">
                <Button type="ghost" @click="dateModal = false">取消</Button>
                <Button type="primary" @click="chooseDate" style="margin-left: 15px">确定</Button>
            </div>
        </Modal>
        <hrm :isShow="showHrmModal" :chooseList="formItem.resources" @on-close="showHrmModal = false" @on-confirm="confirmHrmModal"></hrm>
    </div>
</template>

<script>
    import PermissionList from 'components/collapsetree/PermissionList.vue'
    import { get, create, update } from 'api/common'
    import List from 'components/list'

    import hrm from 'components/browser/hrm'

    import { deepCopy, unique } from 'utils/assist'

    import Vue from 'vue'

    export default {
        components: {List, hrm},
        name: 'form',
        data () {
            return {
                loading: false,
                collapseValue: '1',
                formItem: {
                    id: '',
                    name: '',
                    type: 'fixed',
                    holidayRest: 0,
                    classes: [],
                    defaultClassId: 0,
                    workDayList: [],
                    specialOffDate: [],
                    specialOnDate: [],
                    resources: [],
                    description: ''
                },
                defaultClass: {
                    id: 0,
                    name: '休息',
                    timeList: ''
                },
                ruleValidate: {
                    name: [
                        {type: 'string', min: 1, max: 20, message: '名称字数不可少于1或大于20', trigger: 'blur'}
                    ],
                    description: [
                        {type: 'string', max: 200, message: '介绍不能大于200字', trigger: 'blur'}
                    ]
                },

                // 选择考勤人员属性
                showHrmModal: false,

                // 周班次的相关属性
                weekColumns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '工作日',
                        width: 80,
                        render: (h, params) => {
                            const index = params.index
                            let result = ''
                            switch (index) {
                            case 0:
                                result = '周一'
                                break
                            case 1:
                                result = '周二'
                                break
                            case 2:
                                result = '周三'
                                break
                            case 3:
                                result = '周四'
                                break
                            case 4:
                                result = '周五'
                                break
                            case 5:
                                result = '周六'
                                break
                            case 6:
                                result = '周日'
                                break
                            }
                            return result
                        }
                    },
                    {
                        title: '班次时间段',
                        key: 'timeList',
                        width: 300,
                        render: (h, params) => {
                            const data = params.row
                            const id = data.id
                            const name = data.name
                            const timeList = data.timeList
                            return id <= 0 ? '休息' : name + ': ' + this.getTimeList(timeList)
                        }
                    },
                    {
                        title: '操作',
                        width: 222,
                        render: (h, params) => {
                            const index = params.index
                            return h('a', {
                                on: {
                                    click: () => {
                                        this.showClassesModal(index)
                                    }
                                }
                            }, '更改班次')
                        }
                    }
                ],
                weekData: [     // 因为iview的select时间不能知道当前行数，所以加上index
                    {id: 0, timeList: '', index: 0},
                    {id: 0, timeList: '', index: 1},
                    {id: 0, timeList: '', index: 2},
                    {id: 0, timeList: '', index: 3},
                    {id: 0, timeList: '', index: 4},
                    {id: 0, timeList: '', index: 5},
                    {id: 0, timeList: '', index: 6}
                ],

                // 选择班次的相关属性
                classesModal: false,
                classesFirstRender: false,      // 使用v-if按需加载
                currentChooseClassIndex: -1,    // 哪个触发modal的
                currentChooseClassId: 0,       // 已选的班次ID 动态
                classesColumns: [
                    {
                        title: '班次名称',
                        key: 'name'
                    },
                    {
                        title: '考勤时间',
                        key: 'timeList',
                        width: '260',
                        render: (h, params) => {
                            const data = params.row
                            const timeList = data.timeList
                            return this.getTimeList(timeList)
                        }
                    }
                ],          // 弹出的列格式
                classesQuery: {     // 控制弹出的表格的条件
                    name: undefined,
                    page: 1,
                    size: 5
                },
                classesColumns1: [
                    {
                        title: '班次名称',
                        key: 'name'
                    },
                    {
                        title: '考勤时间',
                        key: 'timeList',
                        width: '260',
                        render: (h, params) => {
                            const data = params.row
                            const timeList = data.timeList
                            return this.getTimeList(timeList)
                        }
                    }
                ],          // 弹出的列格式
                classesQuery1: {     // 控制弹出的表格的条件
                    name: undefined,
                    page: 1,
                    size: 5
                },

                // 选择特殊日期的相关属性
                dateFirstRender: false,
                dateClassFirstRender: false,    // dateModal里的classList首次加载
                dateModal: false,
                currentChooseDateType: 0,
                currentChooseDate: new Date().Format('yyyy-MM-dd'),
                mustCurrentIndex: -1,   // 必须打卡的列表 当前选择的index
                OnDateColumns: [
                    {
                        title: '日期',
                        width: '110',
                        key: 'date'
                    },
                    {
                        title: '考勤时间',
                        key: 'description'
                    },
                    {
                        title: '操作',
                        width: '150',
                        render: (h, params) => {
                            const data = params.row
                            const index = params.index
                            return h('span', [
                                h('a', {
                                    on: {
                                        click: () => {
                                            this.showDateModal(0, index)
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
                                            this.deleteOnDate(index)
                                        }
                                    }
                                }, '删除')
                            ])
                        }
                    }
                ],
                OffDateColumns: [
                    {
                        title: '日期',
                        width: '110',
                        key: 'date'
                    },
                    {
                        title: '考勤时间',
                        render: (h, params) => {
                            return '休息'
                        }
                    },
                    {
                        title: '操作',
                        width: '150',
                        render: (h, params) => {
                            const data = params.row
                            const index = params.index
                            return h('span', [
                                h('a', {
                                    on: {
                                        click: () => {
                                            this.deleteOffDate(index)
                                        }
                                    }
                                }, '删除')
                            ])
                        }
                    }
                ],
                dateOption: {
                    shortcuts: [
                        {
                            text: '今天',
                            value () {
                                return new Date()
                            }
                        }
                    ]
                }
            }
        },
        computed: {
            resourceValue: function () {
                var resourceSize = this.formItem.resources.length
                return resourceSize > 0 ? resourceSize + '人' : '请选择'
            },
            defaultClassValue: function () {
                return this.defaultClass.id === 0 ? '休息' : this.defaultClass.name + ': ' + this.getTimeList(this.defaultClass.timeList)
            }
        },
        created () {
            this.formItem.id = this.$route.params.id
            if (this.formItem.id) {
                this.loading = true
                this.getInfo(this.formItem.id)
            } else {

            }
        },
        methods: {
            getInfo (id) {
                get('attendanceGroup', id).then(data => {
                    this.loading = false
                    this.formItem.id = data.id
                    this.formItem.name = data.name
                    this.formItem.description = data.description
                    this.formItem.type = data.type
                    this.formItem.holidayRest = data.holidayRest
                    this.formItem.specialOnDate = data.specialOnDate
                    this.formItem.resources = data.resources
                    this.formItem.resources.forEach(item => {
                        item.type = 'res'
                    })
                    this.formItem.classes = data.classes
                    // 将不打卡的日期转为对象数组
                    let specialOffDate = []
                    data.specialOffDate.map(item => {
                        specialOffDate.push({date: item})
                    })
                    this.formItem.specialOffDate = specialOffDate

                    data.classes.some(item => {
                        if (item.id === data.defaultClassId) {
                            this.defaultClass = item
                            return true
                        }
                    })

                    data.workDayList.forEach((item, index) => {
                        data.classes.some(item1 => {
                            if (item === item1.id) {
                                let weekData = {}
                                weekData.id = item1.id
                                weekData.name = item1.name
                                weekData.timeList = item1.timeList
                                weekData.index = index
                                weekData._checked = true
                                Vue.set(this.weekData, index, weekData)
                                return true
                            }
                        })
                    })
                })
            },
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let data = {}
                        if (this.formItem.id) data.id = this.formItem.id
                        data.name = this.formItem.name
                        data.type = this.formItem.type
                        data.holidayRest = this.formItem.holidayRest
                        data.specialOnDate = this.formItem.specialOnDate
                        data.description = this.formItem.description

                        // 选择人员
                        data.resources = []
                        this.formItem.resources.forEach(item => {
                            data.resources.push({id: item.id})
                        })

                        // 有关联的班次列表
                        let classes = []
                        if (this.defaultClass.id !== 0) classes.push(this.defaultClass.id)

                        // 周循环列表
                        let week = []
                        this.weekData.forEach(item => {
                            week.push(item.id)
                            if (item.id !== 0) classes.push(item.id)
                        })
                        // 有关联的班次列表
                        classes = unique(classes)
                        data.classes = []
                        classes.forEach(item => {
                            data.classes.push({id: item})
                        })

                        data.workDayList = week

                        // 特殊不上班的日期
                        let arr = []
                        this.formItem.specialOffDate.forEach(item => {
                            arr.push(item.date)
                        })
                        data.specialOffDate = arr

                        // 默认classID
                        data.defaultClassId = this.defaultClass.id
                        if (this.formItem.id) {
                            update('attendanceGroup', data).then(data => {
                                this.$Message.success('更新成功!')
                                this.$router.push({path: '/attendance/group'})
                            })
                        } else {
                            create('attendanceGroup', data).then(data => {
                                this.$Message.success('创建成功!')
                                this.$router.push({path: '/attendance/group'})
                            })
                        }
                    } else {
                        this.$Message.error('表单验证失败!')
                    }
                })
            },
            handleCancel (name) {

            },
            showClassesModal (index) {      // 打开modal的数据同步
                this.currentChooseClassIndex = index
                this.classesModal = true
                if (index === -1) this.currentChooseClassId = this.defaultClass.id
                else {
                    this.currentChooseClassId = this.weekData[index].id
                }
                // 更新对应的数组项
                if (this.classesFirstRender) this.$refs.classesTable.resetTableAllData(this.currentChooseClassId)
                this.classesFirstRender = true
            },
            updateClasses (item, type) {  //  更新formItem的classes
            },
            chooseClasses () {     // modal确定按钮，更改班次
                this.classesModal = false
                if (this.currentChooseClassIndex === -1) {
                    this.defaultClass = this.$refs.classesTable.currentObject
                } else {
                    this.weekData[this.currentChooseClassIndex].id = this.$refs.classesTable.currentObject.id
                    this.weekData[this.currentChooseClassIndex].name = this.$refs.classesTable.currentObject.name
                    this.weekData[this.currentChooseClassIndex].timeList = this.$refs.classesTable.currentObject.timeList
                    this.weekData[this.currentChooseClassIndex]._checked = true
                    Vue.set(this.weekData, this.currentChooseClassIndex, this.weekData[this.currentChooseClassIndex])
                }
            },
            // 复选框事件
            selectWeek (selection, row) {       // 选择项
                if (this.defaultClass.id === 0) return
                row.id = this.defaultClass.id
                row.name = this.defaultClass.name
                row.timeList = this.defaultClass.timeList
                row._checked = true
                Vue.set(this.weekData, row.index, row)
            },
            unSelectWeek (selection, row) {     // 取消选择项
                row.id = 0
                row.name = '休息'
                row.timeList = ''
                row._checked = false
//                this.weekData[row.index] = row
                Vue.set(this.weekData, row.index, row)
            },
            selectAll (selection) {     // 全选逻辑，将所有数据变为defaultClass
                if (this.defaultClass.id === 0) {
                    this.weekData.map((item, index) => {
                        item.id = 0
                        item.name = '休息'
                        item.timeList = ''
                        item._checked = false
                    })
                } else {
                    this.weekData.map(item => {
                        item.id = this.defaultClass.id
                        item.name = this.defaultClass.name
                        item.timeList = this.defaultClass.timeList
                        item._checked = true
                    })
                }
            },
            selectChange (selection) {      // 取消全选将所有数据变为休息
                if (selection.length === 0) {
                    this.weekData.map(item => {
                        item.id = 0
                        item.name = '休息'
                        item.timeList = ''
                        item._checked = false
                    })
                }
            },

            showDateModal (type, index) {
                this.currentChooseDateType = type
                this.dateModal = true
                if (type === 0) {
                    // 判断当前操作的列表索引 -1代表添加 0以上代表编辑
                    this.mustCurrentIndex = index
                    this.dateClassFirstRender = true
                    if (this.mustCurrentIndex === -1) {     // 添加
                        this.currentChooseClassId = 0
                    } else {       // 编辑
                        this.currentChooseClassId = this.formItem.specialOnDate[index].classId
                    }
                    // 更新当前操作的值，即让list显示当前选择的班次， 0则不显示
                    if (this.dateFirstRender && this.$refs.dateClassesTable !== undefined) this.$refs.dateClassesTable.resetTableAllData(this.currentChooseClassId)
                }
                this.dateFirstRender = true
            },
            deleteOnDate (index) {
                this.formItem.specialOnDate.splice(index, 1)
            },
            deleteOffDate (index) {
                this.formItem.specialOffDate.splice(index, 1)
            },
            chooseDate () {
                if (this.currentChooseDate === '') {
                    this.$Message.error('请选择日期')
                    return
                }
                for (var i = 0; i < this.formItem.specialOnDate; i++) {
                    if (this.formItem.specialOnDate[i].date === this.currentChooseDate && i !== this.mustCurrentIndex) {
                        this.$Message.error('该日期已被指定，请重新选择')
                        return
                    }
                }
                this.formItem.specialOnDate.forEach((item, index) => {

                })
                for (let item1 of this.formItem.specialOffDate) {
                    if (item1.date === this.currentChooseDate) {
                        this.$Message.error('该日期已被指定，请重新选择')
                        return
                    }
                }
                if (this.currentChooseDateType === 0) {
                    if (!this.$refs.dateClassesTable.currentObject.id) {
                        this.$Message.error('请选择班次')
                        return
                    }
                    let item = {}
                    item.date = this.currentChooseDate
                    item.classId = this.$refs.dateClassesTable.currentObject.id
                    item.description = this.$refs.dateClassesTable.currentObject.name + ': ' + this.getTimeList(this.$refs.dateClassesTable.currentObject.timeList)
                    if (this.mustCurrentIndex === -1) {     // 添加
                        this.formItem.specialOnDate.push(item)
                    } else {            // 编辑
                        Vue.set(this.formItem.specialOnDate, this.mustCurrentIndex, item)
                    }
                } else {
                    let item = {}
                    item.date = this.currentChooseDate
                    this.formItem.specialOffDate.push(item)
                }
                this.dateModal = false
            },
            changeDate (value) {     // 选择日期触发的事件
                this.currentChooseDate = value
            },
            getTimeList (timeList) {
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
            },
            // 人员选择相关方法
            confirmHrmModal (value) {
                this.showHrmModal = false
                let newValue = []
                value.forEach(item => {
                    newValue.push({id: item.id, name: item.name, type: item.type})
                })
                this.formItem.resources = newValue
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
