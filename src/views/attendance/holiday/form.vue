<template>
    <div style="position: relative">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="form" :model="formItem" :label-width="100" :rules="ruleValidate" style="margin-left: 10px">
            <FormItem label="类型:">
                <RadioGroup v-model="formItem.type" vertical>
                    <Radio label="official" style="margin-right: 20px">
                        <span>法定假日</span>
                    </Radio>
                    <p class="infoText">法定假日不会算作出勤日</p>
                    <Radio label="rest" style="margin-right: 20px">调配休息日</Radio>
                    <p class="infoText">出勤类型为请假，如果开启自动调休，即会判断当日剩余的可调休额度（年假、加班转调休额度，）进行计算</p>
                    <Radio label="work" style="margin-right: 20px">调配工作日</Radio>
                    <p class="infoText">指定该日期进行正常的出勤，如果指定班次，则全公司的人当天都使用该班次，否则会使用其所在考勤组的默认班次</p>
                </RadioGroup>
            </FormItem>
            <FormItem label="日期：">
                <Row>
                    <Col span="10">
                        <DatePicker :value="formItem.date" type="date" @on-change="changeDate" :clearable="false" :editable='false' format="yyyy-MM-dd" style="width: 120px"></DatePicker>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="说明：" prop="name">
                <Row>
                    <Col span="10">
                        <Input v-model="formItem.name" type="text"></Input>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="自动调休：" v-if="formItem.type === 'rest'">
                <Row>
                    <Col span="10">
                        <i-switch v-model="formItem.useRest" :true-value=1 :false-value=0></i-switch>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="指定工作班次：" v-if="formItem.type === 'work'">
                <Row>
                    <Col span="10">
                        <i-switch v-model="formItem.useClass" :true-value=1 :false-value=0></i-switch>
                        <span v-if="formItem.useClass === 1">
                            <a style="margin-left: 10px;" @click="showClassModal = true">选择班次</a>
                            {{ classValue }}
                        </span>
                    </Col>
                </Row>
            </FormItem>
            <FormItem>
                <Button type="ghost" @click="$router.push({path: '/attendance/holiday'})">取消</Button>
                <Button type="primary" @click="handleSubmit('form')" style="margin-left: 8px">保存</Button>
                <Button type="primary" @click="handleSubmitAndCreate('form')" style="margin-left: 8px">保存并新建</Button>
            </FormItem>
        </Form>
        <classes :isShow="showClassModal" :chooseClass="formItem.classes"  @on-close="showClassModal = false" @on-confirm="confirmClassModal"></classes>
    </div>
</template>

<script>
    import PermissionList from 'components/collapsetree/PermissionList.vue'
    import { get, create, update } from 'api/common'
    import List from 'components/list'

    import classes from 'components/browser/classes'

    import { deepCopy, unique, isEmpty } from 'utils/assist'

    import { getTimeList } from 'utils/transform'

    import Vue from 'vue'

    export default {
        components: {List, classes},
        name: 'holidayForm',
        data () {
            return {
                loading: false,
                collapseValue: '1',
                formItem: {
                    id: '',
                    name: '',
                    type: 'official',
                    date: '',
                    useRest: 0,
                    useClass: 0,
                    classes: {}
                },
                ruleValidate: {
                    name: [
                        {type: 'string', max: 20, message: '不能大于20字', trigger: 'blur'}
                    ]
                },
                // 选择考勤人员属性
                showClassModal: false,
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
            classValue: function () {
                return isEmpty(this.formItem.classes) ? '' : this.formItem.classes.name + ': ' + getTimeList(this.formItem.classes.timeList)
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
                get('holiday', id).then(data => {
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
                            update('holiday', postData).then(data => {
                                this.$Message.success('更新成功!')
                                this.$router.push({path: '/attendance/holiday'})
                            })
                        } else {
                            create('holiday', postData).then(data => {
                                this.$Message.success('创建成功!')
                                this.$router.push({path: '/attendance/holiday'})
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
                            update('holiday', postData).then(data => {
                                this.$Message.success('更新成功!')
                                this.clearFormItem()
                            })
                        } else {
                            create('holiday', postData).then(data => {
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
                if (isEmpty(this.formItem.date)) {
                    this.$Message.error('请选择日期!')
                    return false
                }
                if (this.formItem.type === 'work' && this.formItem.useClass === 1 && isEmpty(this.formItem.classes)) {
                    this.$Message.error('请选择班次!')
                    return false
                }
                return true
            },
            changeDate (value) {
                this.formItem.date = value
            },
            clearFormItem () {
                this.formItem.id = undefined
                this.formItem.type = 'official'
                this.formItem.date = ''
                this.formItem.name = ''
                this.formItem.useRest = 0
                this.formItem.useClass = 0
                this.formItem.classes = {}
            },
            setFormItem (data) {
                this.formItem.id = data.id
                this.formItem.type = data.type
                this.formItem.date = data.date
                this.formItem.name = data.name
                this.formItem.useRest = isEmpty(data.useRest) ? 0 : data.useRest
                this.formItem.useClass = isEmpty(data.useClass) ? 0 : data.useClass
                this.formItem.classes = data.classes
            },
            packFormItem () {
                let data = {}
                if (this.formItem.id) data.id = this.formItem.id
                data.name = this.formItem.name
                data.type = this.formItem.type
                data.date = this.formItem.date
                if (data.type === 'rest') {
                    data.useRest = this.formItem.useRest
                } else if (data.type === 'work') {
                    data.useClass = this.formItem.useClass
                    if (data.useClass === 1) {
                        data.classes = {}
                        data.classes.id = this.formItem.classes.id
                    }
                }
                return data
            },
            // 人员选择相关方法
            confirmClassModal (value) {
                this.showClassModal = false
                this.formItem.classes = value
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
