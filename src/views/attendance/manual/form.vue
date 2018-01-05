<template>
    <div style="position: relative">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="form" :model="formItem" :label-width="100" :rules="ruleValidate" style="margin-left: 10px">
            <FormItem label="签卡人员:">
                <Row>
                    <Col span="6">
                        <Button type="ghost" @click="showHrmModal = true">{{ resourceValue }}</Button>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="签卡时间">
                <Row>
                    <Col span="10">
                        <DatePicker :value="formItem.date" type="datetime" @on-change="changeDate" placeholder="select date" style="width: 200px"></DatePicker>
                    </Col>
                </Row>

            </FormItem>
            <FormItem label="签卡原因：" prop="reason">
                <Row>
                    <Col span="10">
                        <Input v-model="formItem.reason" type="textarea" :rows="3"></Input>
                    </Col>
                </Row>
            </FormItem>
            <FormItem>
                <Button type="ghost" @click="$router.push({path: '/attendance/manual'})">取消</Button>
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

    import Vue from 'vue'

    export default {
        components: {List, hrm},
        name: 'manualForm',
        data () {
            return {
                loading: false,
                collapseValue: '1',
                formItem: {
                    id: '',
                    name: '',
                    type: 'manual',
                    date: '',
                    resources: [],   // 总是单数组
                    reason: ''
                },
                ruleValidate: {
                    reason: [
                        {type: 'string', max: 200, message: '介绍不能大于200字', trigger: 'blur'}
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
                get('attendanceRecord', id).then(data => {
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
                            update('attendanceRecord', postData).then(data => {
                                this.$Message.success('更新成功!')
                                this.$router.push({path: '/attendance/manual'})
                            })
                        } else {
                            create('attendanceRecord', postData).then(data => {
                                this.$Message.success('创建成功!')
                                this.$router.push({path: '/attendance/manual'})
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
                            update('attendanceRecord', postData).then(data => {
                                this.$Message.success('更新成功!')
                                this.clearFormItem()
                            })
                        } else {
                            create('attendanceRecord', postData).then(data => {
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
                    this.$Message.error('请选择签卡人员!')
                    return false
                }
                if (isEmpty(this.formItem.date)) {
                    this.$Message.error('请选择签卡时间!')
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
                this.formItem.reason = ''
            },
            setFormItem (data) {
                this.formItem.id = data.id
                let resources = []
                resources.push(data.resource)
                this.formItem.resources = resources
                this.formItem.date = data.date
                this.formItem.reason = data.reason
            },
            packFormItem () {
                let data = {}
                if (this.formItem.id) data.id = this.formItem.id
                data.reason = this.formItem.reason
                data.type = 'manual'
                data.date = this.formItem.date
                // 选择人员
                data.resource = this.formItem.resources[0].id
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
