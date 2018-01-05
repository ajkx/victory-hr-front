<template>
    <div style="position: relative">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="form" :model="formItem" :label-width="100" :rules="ruleValidate" style="margin-left: 10px">
            <FormItem label="补卡人员:">
                <Row>
                    <Col span="6">
                        <Button type="ghost" @click="showHrmModal = true">{{ resourceValue }}</Button>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="补卡日期:">
                <Row>
                    <Col span="10">
                        <DatePicker :value="formItem.date" type="date" :clearable="false" :editable='false' format="yyyy-MM-dd" @on-change="changeDate" style="width: 200px"></DatePicker>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="补卡时段:">
                <CheckboxGroup v-model="formItem.times">
                    <Checkbox :label="1">
                        <span>第一次上班</span>
                    </Checkbox>
                    <Checkbox :label="2">
                        <span>第一次下班</span>
                    </Checkbox>
                    <Checkbox :label="3">
                        <span>第二次上班</span>
                    </Checkbox>
                    <Checkbox :label="4">
                        <span>第二次下班</span>
                    </Checkbox>
                    <Checkbox :label="5">
                        <span>第三次上班</span>
                    </Checkbox>
                    <Checkbox :label="6">
                        <span>第三次下班</span>
                    </Checkbox>
                    <Checkbox :label="7">
                        <span>加班上班</span>
                    </Checkbox>
                    <Checkbox :label="8">
                        <span>加班下班</span>
                    </Checkbox>
                </CheckboxGroup>
            </FormItem>
            <FormItem label="补卡原因：" prop="reason">
                <Row>
                    <Col span="10">
                        <Input v-model="formItem.reason" type="textarea" :rows="3"></Input>
                    </Col>
                </Row>
            </FormItem>
            <FormItem>
                <Button type="ghost" @click="$router.push({path: '/attendance/repair'})">取消</Button>
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
        name: 'repairForm',
        data () {
            return {
                loading: false,
                collapseValue: '1',
                formItem: {
                    id: '',
                    date: '',
                    resources: [],   // 总是单数组
                    reason: '',
                    times: []
                },
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
                get('repairRecord', id).then(data => {
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
                            update('repairRecord', postData).then(data => {
                                this.$Message.success('更新成功!')
                                this.$router.push({path: '/attendance/repair'})
                            })
                        } else {
                            create('repairRecord', postData).then(data => {
                                this.$Message.success('创建成功!')
                                this.$router.push({path: '/attendance/repair'})
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
                            update('repairRecord', postData).then(data => {
                                this.$Message.success('更新成功!')
                                this.clearFormItem()
                            })
                        } else {
                            create('repairRecord', postData).then(data => {
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
                if (isEmpty(this.formItem.date)) {
                    this.$Message.error('请选择补卡!')
                    return false
                }
                if (isEmpty(this.formItem.times)) {
                    this.$Message.error('请选择补卡时段!')
                    return false
                }
                return true
            },
            changeDate (value) {
                this.formItem.date = value
            },
            clearFormItem () {
                this.formItem.id = undefined
                this.formItem.resources = []
                this.formItem.date = ''
                this.formItem.times = []
                this.formItem.reason = ''
            },
            setFormItem (data) {
                this.formItem.id = data.id
                let resources = []
                resources.push(data.resource)
                this.formItem.resources = resources
                this.formItem.date = data.date
                this.formItem.times = data.times
                this.formItem.reason = data.reason
            },
            packFormItem () {
                let data = {}
                if (this.formItem.id) data.id = this.formItem.id
                data.reason = this.formItem.reason
                data.date = this.formItem.date
                data.times = this.formItem.times
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
