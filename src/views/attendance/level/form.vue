<template>
    <div style="position: relative">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="form" :model="formItem" :label-width="100" :rules="ruleValidate" style="margin-left: 10px">
            <FormItem label="请假人员:">
                <Row>
                    <Col span="6">
                        <Button type="ghost" @click="showHrmModal = true">{{ resourceValue }}</Button>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="请假类型:">
                    <Select v-model="formItem.type" style="width:120px">
                        <Option value="personal">事假</Option>
                        <Option value="rest">调休</Option>
                        <Option value="injury">工伤</Option>
                        <Option value="annual">年假</Option>
                        <Option value="funeral">丧假</Option>
                        <Option value="married">婚假</Option>
                        <Option value="delivery">产假</Option>
                        <Option value="cancel">销假</Option>
                    </Select>
            </FormItem>
            <FormItem label="开始时间:">
                <Row>
                    <Col span="10">
                        <DatePicker :value="formItem.beginDate" type="datetime" :clearable="false" :editable='false' format="yyyy-MM-dd HH:mm" @on-change="changeBeginDate" style="width: 200px"></DatePicker>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="结束时间:">
                <Row>
                    <Col span="10">
                    <DatePicker :value="formItem.endDate" type="datetime" :clearable="false" :editable='false' format="yyyy-MM-dd HH:mm" @on-change="changeEndDate" style="width: 200px"></DatePicker>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="合计时长:">
                <Row>
                    <Col span="10">
                    {{ totalTime }}
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="合计工作时:">
                <Row>
                    <Col span="10">
                    <InputNumber :max="300" :min="1" v-model="formItem.applyTime"></InputNumber>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="请假原因：" prop="reason">
                <Row>
                    <Col span="10">
                        <Input v-model="formItem.reason" type="textarea" :rows="3"></Input>
                    </Col>
                </Row>
            </FormItem>
            <FormItem>
                <Button type="ghost" @click="$router.push({path: '/attendance/level'})">取消</Button>
                <Button type="primary" @click="handleSubmit('form')" style="margin-left: 8px">保存</Button>
                <Button type="primary" @click="handleSubmitAndCreate('form')" style="margin-left: 8px">保存并新建</Button>
            </FormItem>
        </Form>
        <hrm :isShow="showHrmModal" :chooseList="formItem.resources" :isSingle="true" @on-close="showHrmModal = false" @on-confirm="confirmHrmModal"></hrm>
    </div>
</template>

<script>
    import PermissionList from 'components/collapsetree/PermissionList.vue'
    import { get, create, update } from 'api/common'
    import List from 'components/list'

    import hrm from 'components/browser/hrm'

    import { deepCopy, unique, isEmpty } from 'utils/assist'

    import { getTimeDiffStr, getTimeDiff } from 'utils/dateUtils'

    import Vue from 'vue'

    export default {
        components: {List, hrm},
        name: 'levelForm',
        data () {
            return {
                loading: false,
                collapseValue: '1',
                formItem: {
                    id: '',
                    type: 'personal',
                    applyTime: 0,
                    beginDate: '',
                    endDate: '',
                    resources: [],   // 总是单数组
                    reason: ''
                },
                timeDiff: 0,
                ruleValidate: {
                    reason: [
                        {type: 'string', max: 200, message: '原因不能大于200字', trigger: 'blur'}
                    ]
                },
                // 选择考勤人员属性
                showHrmModal: false,
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
                return this.formItem.resources.length > 0 ? this.formItem.resources[0].name : '请选择'
            },
            totalTime: function () {
                if (this.timeDiff === 0) return ''
                var hour = Math.floor(this.timeDiff / 60)
                var min = this.timeDiff % 60
                return hour + '小时' + min + '分钟'
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
                get('levelRecord', id).then(data => {
                    this.loading = false
                    this.setFormItem(data)
                })
            },
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid && this.checkForm()) {
                        let postData = this.packFormItem()
                        // 有关联的班次列表
                        if (this.formItem.id) {
                            update('levelRecord', postData).then(data => {
                                this.$Message.success('更新成功!')
                                this.$router.push({path: '/attendance/level'})
                            })
                        } else {
                            create('levelRecord', postData).then(data => {
                                this.$Message.success('创建成功!')
                                this.$router.push({path: '/attendance/level'})
                            })
                        }
                    } else {
//                        this.$Message.error('表单验证失败!')
                    }
                })
            },
            handleCancel (name) {

            },
            handleSubmitAndCreate (name) {
                this.$refs[name].validate((valid) => {
                    if (valid && this.checkForm()) {
                        let postData = this.packFormItem()
                        // 有关联的班次列表
                        if (this.formItem.id) {
                            update('levelRecord', postData).then(data => {
                                this.$Message.success('更新成功!')
                                this.clearFormItem()
                            })
                        } else {
                            create('levelRecord', postData).then(data => {
                                this.$Message.success('创建成功!')
                                this.clearFormItem()
                            })
                        }
                    } else {
                        this.$Message.error('表单验证失败!')
                    }
                })
            },
            checkForm () {
                if (isEmpty(this.formItem.resources)) {
                    this.$Message.error('请选择请假人员!')
                    return false
                }
                if (isEmpty(this.formItem.beginDate)) {
                    this.$Message.error('请选择请假开始时间!')
                    return false
                }
                if (isEmpty(this.formItem.endDate)) {
                    this.$Message.error('请选择请假结束时间!')
                    return false
                }
                if (this.formItem.endDate <= this.formItem.beginDate) {
                    this.$Message.error('开始时间不可大于结束时间!')
                    return false
                }
                if (this.formItem.applyTime <= 0) {
                    this.$Message.error('请填写合计工作时!')
                    return false
                }
                if (this.formItem.applyTime * 60 > this.timeDiff) {
                    this.$Message.error('合计工作时不可大于合计时长!')
                    return false
                }
                return true
            },
            changeBeginDate (value) {
                if (value !== '' && this.formItem.endDate !== '' && value > this.formItem.endDate) {
                    this.$Message.error('开始时间不可大于结束时间!')
                    this.formItem.beginDate = ''
                    return
                }
                this.formItem.beginDate = value
                if (this.formItem.beginDate !== '' && this.formItem.endDate !== '') {
                    this.timeDiff = getTimeDiff(this.formItem.beginDate, this.formItem.endDate)
                }
            },
            changeEndDate (value) {
                if (value !== '' && this.formItem.beginDate !== '' && value < this.formItem.beginDate) {
                    this.$Message.error('开始时间不可大于结束时间!')
                    this.formItem.endDate = ''
                    return
                }
                this.formItem.endDate = value
                if (this.formItem.beginDate !== '' && this.formItem.endDate !== '') {
                    this.timeDiff = getTimeDiff(this.formItem.beginDate, this.formItem.endDate)
                }
            },
            clearFormItem () {
                this.formItem.id = undefined
                this.formItem.resources = []
                this.formItem.beginDate = ''
                this.formItem.endDate = ''
                this.formItem.applyTime = 0
                this.formItem.type = 'personal'
                this.formItem.reason = ''
            },
            setFormItem (data) {
                this.formItem.id = data.id
                let resources = []
                resources.push(data.resource)
                this.formItem.resources = resources
                this.formItem.beginDate = data.beginDate
                this.formItem.endDate = data.endDate
                this.formItem.type = data.type
                this.formItem.applyTime = data.applyTime
                this.formItem.reason = data.reason
                this.timeDiff = getTimeDiff(this.$moment(this.formItem.beginDate).format('YYYY-MM-DD HH:mm'), this.$moment(this.formItem.endDate).format('YYYY-MM-DD HH:mm'))
            },
            packFormItem () {
                let data = {}
                if (this.formItem.id) data.id = this.formItem.id
                data.reason = this.formItem.reason
                data.type = this.formItem.type
                data.beginDate = this.formItem.beginDate + ':00'
                data.endDate = this.formItem.endDate + ':00'
                data.applyTime = this.formItem.applyTime * 60
                // 选择人员
                data.resource = {}
                data.resource.id = this.formItem.resources[0].id
                return data
            },
            // 人员选择相关方法
            confirmHrmModal (value) {
                this.showHrmModal = false
                this.formItem.resources = value
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
