<template>
    <div>
        <Collapse value="1">
            <Panel name="1">
                {{ module.name }}
                <div slot="content">
                    <div style="border-bottom: 1px solid rgb(233, 233, 233);">
                        <Checkbox
                            :value="checkAll"
                            :indeterminate="indeterminate"
                            @click.prevent.native="handleCheckAll">全部权限
                        </Checkbox>
                    </div>
                    <br/>
                    <div>
                        <CheckboxGroup v-model="currentValue"
                                       @on-change="checkAllGroupChange">
                            <Checkbox
                                v-for="item in module.children"
                                :key="item.id"
                                :label="item.id">{{ item.name }}
                            </Checkbox>
                        </CheckboxGroup>
                    </div>
                </div>
            </Panel>
        </Collapse>
    </div>
</template>

<script>
    export default {
        name: 'PermissionList',
        props: {
            module: {
                type: Object,
                default () {
                    return {}
                }
            },
            value: {
                type: Array,
                default () {
                    return []
                }
            }
        },
        created () {

        },
        data () {
            return {
                currentValue: this.value,
                checkAll: false,
                indeterminate: false
            }
        },
        methods: {
            handleCheckAll () {
                if (this.checkAll) {
                    this.checkAll = false
                } else {
                    this.checkAll = true
                }
                this.indeterminate = false
                let group = this.module.children.map(node => node.id)
                if (this.checkAll) {
                    let newList = this.currentValue ? this.currentValue.concat(group) : group
                    this.currentValue = Array.from(new Set(newList))
                } else {
                    this.currentValue = []
//                    this.formItem.resources[index] = this.formItem.resources[index].filter(value => !group.some(id => id === value))
                }
                this.$emit('updateChange', this.currentValue, this.module.id)
            },
            // todo  父组件监听子组件的回调 要添加参数时不想丢失原有参数，可以使用 $event来代表原有参数 那如果多个呢？ 用数组表示》
            checkAllGroupChange (data) {
                if (data.length === this.module.children.length) {
                    this.indeterminate = false
                    this.checkAll = true
                } else if (data.length > 0) {
                    this.indeterminate = true
                    this.checkAll = false
                } else {
                    this.indeterminate = false
                    this.checkAll = false
                }
                this.$emit('updateChange', this.currentValue, this.module.id)
            }
        }
    }
</script>

<style lang="scss">

</style>
