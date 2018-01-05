<template>
    <Form ref="roleForm" :model="formItem" :label-width="100" :rules="ruleValidate" style="margin-left: 10px">
        <FormItem label="角色名：" prop="name">
            <Row>
                <Col span="6">
                <Input v-model="formItem.name" placeholder="请输入名称"></Input>
                </Col>
            </Row>
        </FormItem>
        <FormItem label="是否启用：" prop="available">
            <RadioGroup v-model="formItem.available">
                <Radio :label=1 >启用</Radio>
                <Radio :label=0 >禁用</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="权限分配：">
            <Row class="permission-list">
                <Col :sm="24" :md="6" v-for="(module, index) in treeData" :key="module.id"
                     style="padding-left: 8px; padding-right: 8px; margin-top: 8px; margin-bottom: 8px;">
                <PermissionList ref="list"
                                :module="module"
                                :value="formItem.resources[index]" v-on:updateChange="updateChange"></PermissionList>
                </Col>
            </Row>
        </FormItem>
        <FormItem label="描述：" prop="description">
            <Row>
                <Col span="10">
                <Input v-model="formItem.description" type="textarea" :rows="3"></Input>
                </Col>
            </Row>
        </FormItem>
        <FormItem>
            <Button type="ghost" @click="$router.push({path: '/system/role'})">取消</Button>
            <Button type="primary" @click="handleSubmit('roleForm')" style="margin-left: 8px">提交</Button>
        </FormItem>
    </Form>
</template>

<script>
    import PermissionList from 'components/collapsetree/PermissionList.vue'
    import { get, create, update } from 'api/common'
    import { getPermissionTree } from 'api/sys'
    import Vue from 'vue'

    export default {
        components: {PermissionList},
        name: 'form',
        data () {
            return {
                collapseValue: '1',
                formItem: {
                    id: '',
                    name: '',
                    available: 1,
                    resources: [],
                    description: ''
                },
                ruleValidate: {
                    name: [
                        {required: true, message: '名称不可为空', trigger: 'blur'},
                        {type: 'string', max: 10, message: '字数不可大于10个', trigger: 'blur'}
                    ],
                    available: [
//                        {required: true, message: '状态不可为空', trigger: 'blur'}
                    ],
                    description: [
                        {type: 'string', max: 200, message: '介绍不能大于200字', trigger: 'blur'}
                    ]
                },
                treeData: []
            }
        },
        created () {
            this.formItem.id = this.$route.params.id
            if (this.formItem.id) {
                this.getInfo(this.formItem.id)
            } else {
                this.getTree()
            }
        },
        methods: {
            async getInfo (id) {
                // 初始化treeData
                const res1 = await getPermissionTree()
                this.treeData = res1

                // 初始化formItem的数据
                const res = await get('role', id)
                const data = res
                this.formItem.name = data.name
                this.formItem.available = data.available
                this.formItem.description = data.description
                let arr = []
                this.treeData.forEach((module, index) => {
                    arr[index] = module.children.filter(item => {
                        return data.resources.some(resource => resource.id === item.id)
                    }).map(node => node.id)
                    this.formItem.resources[index] = arr[index]
                })
                // 这里是对子组件的回调，因为该方法是异步的 导致created是不会等待数据加载完成的，而PermissionList
                // 里的currentValue 获取 value时 value的值还没有更新
                this.$refs.list.forEach((item, index) => {
                    item.currentValue = arr[index]
                    if (arr[index].length === this.treeData[index].children.length) {
                        item.checkAll = true
                        item.indeterminate = false
                    } else if (arr[index].length > 0) {
                        item.checkAll = false
                        item.indeterminate = true
                    } else {
                        item.checkAll = false
                        item.indeterminate = false
                    }
                })
            },
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let data = {}
                        data.name = this.formItem.name
                        if (this.formItem.id) data.id = this.formItem.id
                        data.available = this.formItem.available
                        let arr = []
                        this.formItem.resources.forEach(item => {
                            item.forEach(childrenItem => {
                                arr.push({id: childrenItem})
                            })
                        })
                        data.resources = arr
                        data.description = this.formItem.description
                        if (this.formItem.id) {
                            update('role', data).then(data => {
                                this.$Message.success('更新成功!')
                                this.$router.push({path: '/system/role'})
                            })
                        } else {
                            create('role', data).then(data => {
                                this.$Message.success('创建成功!')
                                this.$router.push({path: '/system/role'})
                            })
                        }
                    } else {
                        this.$Message.error('表单验证失败!')
                    }
                })
            },
            handleCancel (name) {

            },
            async getTree () {
                this.treeData = await getPermissionTree()
            },
            updateChange (value, id) {
                let index1
                this.treeData.some((item, index) => {
                    if (item.id === id) {
                        index1 = index
                        return true
                    }
                })
                // 方便vue对数组变化的检测
                Vue.set(this.formItem.resources, index1, value)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .permission-list {
        margin-left: -8px;
        margin-right: -8px;
        .ivu-checkbox-group-item {
            display: block;
        }
        .ivu-checkbox-group {
            height: 210px;
            overflow-y: scroll;
        }
    }
</style>
