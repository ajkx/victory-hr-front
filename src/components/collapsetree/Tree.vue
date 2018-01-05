<template>
    <div>
        <TreeNode
            v-for="item in data"
            :key="item.nodekey"
            :data="item">
        </TreeNode>
    </div>
</template>

<script>
    import TreeNode from './TreeNode.vue'

    import { findComponentsDownward } from 'utils/assist'
    import Emitter from 'utils/emit'
    let key = 1

    export default {
        name: 'index',
        mixins: [ Emitter ],
        components: {
            TreeNode
        },
        props: {
            data: {
                type: Array,
                default () {
                    return []
                }
            }
        },
        data () {
            return {}
        },
        methods: {
            getCheckedNodes () {
                const nodes = findComponentsDownward(this, 'TreeNode')
                return nodes.filter(node => node.data.checked).map(node => node.data)
            },
            updateData (isInit = true) {
                // init checked status
                function reverseChecked (data) {
                    // 初始化组件的key
                    if (!data.nodeKey) data.nodeKey = key++

                    if (data.children && data.children.length) {
                        // 子checkbox选中的个数
                        let checkedLength = 0
                        data.children.forEach(node => {
                            if (node.children) node = reverseChecked(node)
                            if (node.checked) checkedLength++
                        })
                        if (isInit) {
                            if (checkedLength >= data.children.length) data.checked = true
                        } else {
                            // 当前组件的checked决定于子组件是否全选
                            data.checked = checkedLength >= data.children.length
                        }
                        return data
                    } else {
                        return data
                    }
                }
                // 如果父组件的checked为true 则子组件全部为true
                function forwardChecked (data) {
                    if (data.children) {
                        data.children.forEach(node => {
                            if (data.checked) node.checked = true
                            if (node.children) node = forwardChecked(node)
                        })
                        return data
                    } else {
                        return data
                    }
                }
                this.data.map(node => reverseChecked(node)).map(node => forwardChecked(node))
                // 更新完checked后再全部更新indeterminate值
                this.broadcast('TreeNode', 'indeterminate')
            }
        },
        mounted () {
            this.updateData()
            this.$on('checked', () => {
                this.updateData(false)
            })
        }
    }
</script>

<style lang="scss">

</style>
