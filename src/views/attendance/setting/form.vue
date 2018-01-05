<template>
    <div style="position: relative">
        <Spin size="large" fix v-if="loading"></Spin>
        <Tabs value="base" size="small" :animated="false">
            <TabPane label="基础设置" name="base">
                <Form :model="formItem" :label-width="100"  style="margin-left: 10px">
                    <FormItem label="时间计算单位:">
                        <Row>
                            <Col span="6">
                                <Select v-model="formItem.unitType" style="width:120px">
                                    <Option value="min">按分钟计算</Option>
                                    <Option value="halfHour">按半小时计算</Option>
                                    <Option value="hour">按一小时计算</Option>
                                </Select>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem label="忽略考勤人员:">
                        <Row>
                            <Col>
                            <Button type="ghost" @click="showHrmModalIgnore = true">{{ resourceValueIgnore }}</Button>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="handleSubmit('base')">保存设置</Button>
                    </FormItem>
                </Form>
            </TabPane>
            <TabPane label="大小周设置" name="week">
                <Form :model="formItem" :label-width="100"  style="margin-left: 10px">
                    <FormItem label="启用大小周:">
                        <Row>
                            <Col span="6">
                                <i-switch v-model="formItem.oddEvenWeek" :true-value=1 :false-value=0></i-switch>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem label="单周人员:">
                        <Row>
                            <Col>
                                <Button type="ghost" @click="showHrmModalOdd = true">{{ resourceValueOdd }}</Button>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem label="双周人员:">
                        <Row>
                            <Col>
                                <Button type="ghost" @click="showHrmModalEven = true">{{ resourceValueEven }}</Button>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="handleSubmit('week')">保存设置</Button>
                    </FormItem>
                </Form>
            </TabPane>
            <TabPane label="加班设置" name="ot">
                <Form :model="formItem" :label-width="180" style="height:500px">
                    <FormItem label="加班时数计算方式:">
                        <RadioGroup v-model="formItem.calculateType">
                            <Radio label="regist" style="margin-right: 20px">按登记时间计算</Radio>
                            <Radio label="punch" style="margin-right: 20px">按打卡时间计算</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="打卡有效时段设置(分):">
                        <span>上班提前范围: </span><InputNumber size="small" :max="720" :min="10" :step="1" v-model="formItem.beginMinute"></InputNumber>
                        <span style="margin-left: 10px">下班延后范围: </span><InputNumber size="small" :max="720" :min="10" :step="1" v-model="formItem.endMinute"></InputNumber>
                    </FormItem>
                    <FormItem label="加班时数可调休有效期设置(月):">
                        <p>平时加班: <InputNumber size="small" :max="36" :min="0" :step="1" v-model="formItem.normalPeriod"></InputNumber></p>
                        <p>周末加班: <InputNumber size="small" :max="36" :min="0" :step="1" v-model="formItem.weekendPeriod"></InputNumber></p>
                        <p>节日加班: <InputNumber size="small":max="36" :min="0" :step="1" v-model="formItem.festivalPeriod"></InputNumber></p>
                        <p class="infoText">0即代表仅当月有效</p>
                    </FormItem>
                    <FormItem label="特殊设置:">
                        <Checkbox v-model="formItem.acrossDay" :true-value=1 :false-value=0>加班时间小于设定时间计入昨天的考勤明细</Checkbox>
                        <TimePicker format="HH:mm" :clearable='false' :editable='false' style="width:80px;margin-left: 5px; margin-right: 10px;"
                                    @on-change="changeTime" :value="formItem.acrossOffset"></TimePicker>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="handleSubmit('ot')">保存设置</Button>
                    </FormItem>
                </Form>
            </TabPane>
        </Tabs>
        <hrm :isShow="showHrmModalIgnore" :chooseList="formItem.ignoreResources"  @on-close="showHrmModalIgnore = false" @on-confirm="confirmHrmModalIgnore"></hrm>
        <hrm :isShow="showHrmModalOdd" :chooseList="formItem.oddResource"  @on-close="showHrmModalOdd = false" @on-confirm="confirmHrmModalOdd"></hrm>
        <hrm :isShow="showHrmModalEven" :chooseList="formItem.evenResource"  @on-close="showHrmModalEven = false" @on-confirm="confirmHrmModalEven"></hrm>
    </div>
</template>

<script>
    import PermissionList from 'components/collapsetree/PermissionList.vue'
    import { getSetting, updateBaseSetting, updateWeekSetting, updateOTSetting } from 'api/attendance'

    import hrm from 'components/browser/hrm'

    import { deepCopy, unique, isEmpty } from 'utils/assist'

    import Vue from 'vue'

    export default {
        components: {hrm},
        name: 'settingForm',
        data () {
            return {
                loading: false,
                collapseValue: '1',
                formItem: {
                    unitType: 'min',
                    ignoreResources: [],
                    oddEvenWeek: 0,   // 是否开启大小周
                    oddResource: [],    // 单周 人员
                    evenResource: [],    // 双周 人员
                    calculateType: 'regist',
                    beginMinute: 30,
                    endMinute: 30,
                    acrossDay: 0,
                    acrossOffset: '',
                    normalPeriod: 0,
                    weekendPeriod: 3,
                    festivalPeriod: 3
                },
                // 选择考勤人员属性
                showHrmModalIgnore: false,
                showHrmModalOdd: false,
                showHrmModalEven: false
            }
        },
        computed: {
            resourceValueIgnore: function () {
                var resourceSize = this.formItem.ignoreResources.length
                return resourceSize > 0 ? resourceSize + '人' : '请选择'
            },
            resourceValueOdd: function () {
                var resourceSize = this.formItem.oddResource.length
                return resourceSize > 0 ? resourceSize + '人' : '请选择'
            },
            resourceValueEven: function () {
                var resourceSize = this.formItem.evenResource.length
                return resourceSize > 0 ? resourceSize + '人' : '请选择'
            }
        },
        created () {
            this.loading = true
            this.getInfo(this.formItem.id)
        },
        methods: {
            getInfo (id) {
                getSetting('attendanceSetting').then(data => {
                    this.loading = false
                    this.setFormItem(data)
                })
            },
            handleSubmit (name) {
                if (name === 'base') {
                    let data = {}
                    data.unitType = this.formItem.unitType
                    data.ignoreResources = []
                    this.formItem.ignoreResources.forEach(item => {
                        data.ignoreResources.push(item.id)
                    })
                    updateBaseSetting(data).then(data => {
                        this.$Message.success('更新成功!')
                    })
                } else if (name === 'week') {
                    let data = {}
                    data.oddEvenWeek = this.formItem.oddEvenWeek
                    data.oddResource = []
                    // 单周人员
                    this.formItem.oddResource.forEach(item => {
                        data.oddResource.push(item.id)
                    })
                    // 双周人员
                    data.evenResource = []
                    this.formItem.evenResource.forEach(item => {
                        data.evenResource.push(item.id)
                    })
                    updateWeekSetting(data).then(data => {
                        this.$Message.success('更新成功!')
                    })
                } else if (name === 'ot') {
                    let data = {}
                    data.calculateType = this.formItem.calculateType
                    data.beginMinute = this.formItem.beginMinute
                    data.endMinute = this.formItem.endMinute
                    data.acrossDay = this.formItem.acrossDay
                    if (data.acrossDay === 1) data.acrossOffset = this.formItem.acrossOffset
                    data.normalPeriod = this.formItem.normalPeriod
                    data.weekendPeriod = this.formItem.weekendPeriod
                    data.festivalPeriod = this.formItem.festivalPeriod
                    updateOTSetting(data).then(data => {
                        this.$Message.success('更新成功!')
                    })
                }
            },
            checkForm (name) {
                if (name === 'base') {

                } else if (name === 'week') {

                } else if (name === 'ot') {

                }
                return true
            },
            setFormItem (data) {
                this.formItem.unitType = data.unitType
                this.formItem.ignoreResources = data.ignoreResources
                this.formItem.oddEvenWeek = data.oddEvenWeek
                this.formItem.oddResource = data.oddResource
                this.formItem.evenResource = data.evenResource

                this.formItem.calculateType = data.calculateType
                this.formItem.beginMinute = data.beginMinute
                this.formItem.endMinute = data.endMinute
                this.formItem.acrossDay = data.acrossDay
                if (this.formItem.acrossDay === 1) this.formItem.acrossOffset = data.acrossOffset
                this.formItem.normalPeriod = data.normalPeriod
                this.formItem.weekendPeriod = data.weekendPeriod
                this.formItem.festivalPeriod = data.festivalPeriod
            },
            // 人员选择相关方法
            confirmHrmModalIgnore (value) {
                this.showHrmModalIgnore = false
                this.formItem.ignoreResources = value
            },
            confirmHrmModalOdd (value) {
                this.showHrmModalOdd = false
                this.formItem.oddResource = value
                this.formItem.oddResource.forEach(item => {
                    this.formItem.evenResource.forEach((item1, index) => {
                        if (item.id === item1.id) {
                            this.formItem.evenResource.splice(index, 1)
                        }
                    })
                })
            },
            confirmHrmModalEven (value) {
                this.showHrmModalEven = false
                this.formItem.evenResource = value
                this.formItem.evenResource.forEach(item => {
                    this.formItem.oddResource.forEach((item1, index) => {
                        if (item.id === item1.id) {
                            this.formItem.oddResource.splice(index, 1)
                        }
                    })
                })
            },
            changeTime (value) {
                this.formItem.acrossOffset = value
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
