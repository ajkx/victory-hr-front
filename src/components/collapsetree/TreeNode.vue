<template>
    <div>
        <Col span="7" style="margin-right: 5px">
            <Collapse value="1">
                <Panel name="1">
                    {{ data.name }}
                    <div slot="content">
                        <div style="border-bottom: 1px solid rgb(233, 233, 233);">
                            <Checkbox
                                :value="data.checked"
                                :indeterminate="indeterminate"
                                @click.native.prevent="handleCheck">全部权限</Checkbox>
                        </div>
                        <div>
                            <Checkbox
                                v-for="item in data.children"
                                v-if="item.type == 'item'"
                                :key="item.id"
                                :label="item.id"
                                :indeterminate="indeterminate"
                                @click.native.prevent="handleCheck">{{ item.name }}</Checkbox>
                        </div>
                        <TreeNode
                            v-for="item in data.children"
                            v-if="item.type == 'group'"
                            :key="item.id"
                            :data="item">
                        </TreeNode>
                    </div>
                </Panel>
            </Collapse>
        </Col>
    </div>
</template>

<script>
    import { getPermissionTree } from 'api/sys'
    import { findComponentsDownward } from 'utils/assist'
    import Emitter from 'utils/emit'
    export default {
        name: 'TreeNode',
        mixins: [ Emitter ],
        props: {
            data: {
                type: Object,
                default () {
                    return {}
                }
            }
        },
        data () {
            return {
                indeterminate: false
            }
        },
        methods: {
            handleCheck () {
                const checked = !this.data.checked
                if (!checked || this.indeterminate) {
                    /* eslint-disable */
                    findComponentsDownward(this, 'TreeNode').forEach(node => node.data.checked = false)
                } else {
                    /* eslint-disable */
                    findComponentsDownward(this, 'TreeNode').forEach(node => node.data.checked = true)
                }
                this.data.checked = checked
                this.dispatch('Tree', 'checked')
                this.dispatch('Tree', 'on-checked')
            },
            setIndeterminate () {
                this.indeterminate = this.data.checked ? false : findComponentsDownward(this, 'TreeNode').some(node => node.data.checked)
            },
            created () {
                // created node.vue first, mounted tree.vue second
                if (!this.data.checked) this.$set(this.data, 'checked', false)
            },
            mounted () {
                this.$on('indeterminate', () => {
                    this.broadcast('TreeNode', 'indeterminate');
                    this.setIndeterminate();
                });
            }
        }
    }
</script>

<style lang="scss">

</style>
