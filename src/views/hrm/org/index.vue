<template>
    <div>
        <my-tree v-if="treeData.length > 0" :data="treeData" :render="renderContent"></my-tree>


        <span @click="isShow = true">if open</span>
        <span @click="isShow = false">if close</span>
        <span @click="isModal = true">show open</span>
        <span @click="isModal = false">show close</span>
        <hrm :isShow="isShow" @on-close="showHrmModal = false" :openDep="true" :isSingle="true"></hrm>
    </div>

</template>

<script>
    import hrm from 'components/browser/hrm'
    import { getOrgTree } from 'api/hrm'
    import tree from 'components/tree/tree'

    const subStyle = {
        props: {
            type: 'ios-home-outline'
        },
        style: {
            color: '#f7c893',
            fontSize: '16px',
            marginRight: '6px'
        }
    }

    const depStyle = {
        props: {
            type: 'ios-folder-outline'
        },
        style: {
            color: '#6D6C6A',
            fontSize: '14px',
            marginRight: '6px'
        }
    }
    export default {
        name: 'index',
        components: {
            'my-tree': tree,
            'hrm': hrm
        },
        data () {
            return {
                treeData: [],
                isShow: false,
                isModal: false
            }
        },
        created () {
            getOrgTree().then(data => {
                this.treeData = this.generateTree(true, data)
            })
        },
        methods: {
            generateTree (isRoot, data) {
                var result = []
                for (var item of data) {
                    let node = {}
                    node.id = item.id
                    node.title = item.name
                    node.type = item.type
                    if (isRoot) {
                        node.expand = true
                        node.render = (h, {root, node, data}) => {
                            return h('span', {
                                style: {
                                    display: 'inline-block',
                                    width: '100%'
                                }
                            }, [
                                h('span', [
                                    h('Icon', subStyle),
                                    h('span', data.title)
                                ])
                            ])
                        }
                    }
                    node.children = this.generateTree(false, item.children)
                    result.push(node)
                }
                return result
            },
            renderContent (h, {root, node, data}) {
                let typeClass = depStyle
                if (data.type === 'sub') typeClass = subStyle
                return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%'
                    }
                }, [
                    h('span', [
                        h('Icon', typeClass),
                        h('span', data.title)
                    ])
                ])
            }
        }
    }
</script>

<style>

</style>
