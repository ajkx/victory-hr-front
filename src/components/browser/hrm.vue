<template>
    <Modal v-model="showModal" width="600" class="browser" @on-cancel="handleCancel" @on-hidden="handleHidden">
        <div slot="header" style="text-align: center; color: #fff; background: #2d8cf0;padding: 14px 16px;font-size: 16px;">
            <span v-if="!openDep">员工列表</span>
            <span v-else>部门/员工列表</span>
        </div>
        <div v-if="showContent">
            <div style="height:80px;background: #fff;border: dashed 1px #e0e0e0;margin-bottom: 8px;overflow: auto;">
                <Tag v-for="(item, index) in currentChooseList" :name="item.id" :key="item.id" @on-close="closeItem(item.id, index)" closable :color="item.type === 'dep' ? 'green' : 'blue'" class="choose-tag" >
                    {{ item.name }}
                </Tag>
            </div>
            <div style="height: 40px;border: solid 1px #e0e0e0; position: relative">
                <input type="text" v-model="searchText" @keyup.enter="search" class="modal-input" placeholder="输入员工姓名、简称或部门名称，多个条件用逗号,分割"/>
                <Icon type="ios-search-strong" class="search-icon" @click.native="search"></Icon>
            </div>
            <div class="modal-panel">
                <div class="modal-org">
                    <div style="position: relative">
                        <Checkbox v-if="treeData.length > 0" v-model="includeChild" true-value="1" false-value="0" size="small" style="float: right;margin-bottom: -10px;margin-right: 0">包含下级部门</Checkbox>
                    </div>
                    <div style="clear: both"></div>
                    <my-tree v-if="treeData.length > 0" :data="treeData" :render="renderContent"></my-tree>
                </div>
                <div class="modal-resource">
                    <div class="resource-header">
                        <span>
                            姓名
                            <span v-if="currentList.length > 0" class="count-span">{{ currentList.length }}</span>
                        </span>
                        <span style="position: absolute;top: 0;left: 39%;">
                            部门
                            <span v-if="currentList.length > 0" class="count-span">{{ depLength }}</span>
                        </span>
                        <Checkbox :value="checkAll" :indeterminate="checkSome" v-if="!isSingle" class="checkAll" @click.prevent.native="chooseAll"></Checkbox>
                    </div>
                    <ul class="resource-choose">
                        <li v-for="item in currentList">
                            <span>{{ item.name }}</span>
                            <span class="dep-name">{{ item.department }}</span>
                            <Checkbox v-model="item.checked" class="checkItem" @on-change="chooseItem(item)"></Checkbox>

                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div slot="footer">
            <span style="float: left; font-size: 12px" v-if="currentChooseList.length > 0">已选 <span style="color: rgb(237, 63, 20);">{{ currentChooseList.length }}</span> 人</span>
            <Button type="ghost" size="large" @click="handleClear">清除</Button>
            <Button type="ghost" size="large" @click="handleCancel" style="margin-left: 15px">取消</Button>
            <Button type="primary" size="large" @click="handleConfirm" style="margin-left: 15px">确定</Button>
        </div>
    </Modal>
</template>

<script>
    import tree from 'components/tree/tree'
    import $ from 'jquery'
    import { getOrgTree, getListByDep, getListBySub, getListByName } from 'api/hrm'
    import { unique, CastChar, Trim, oneOf } from 'utils/assist'

//    const subStyle = {
//        props: {
//            type: 'android-home'
//        },
//        style: {
//            color: '#f7c893',
//            fontSize: '14px',
//            marginRight: '6px'
//        }
//    }
//
//    const depStyle = {
//        props: {
//            type: 'ios-folder'
//        },
//        style: {
//            color: '#6D6C6A',
//            fontSize: '12px',
//            marginRight: '6px'
//        }
//    }

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
        name: 'hrm',
        components: {
            'my-tree': tree
        },
        props: {
            isShow: {
                type: Boolean,
                default: false
            },
            openDep: {
                type: Boolean,
                default: false
            },
            chooseList: {
                type: Array,
                default: function () {
                    return []
                }
            },
            isSingle: {     // 是否单选 单选即关闭全选按钮和调整选择人员和选择部门事件
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                showModal: this.isShow,
                showContent: false,
                searchText: '',
                treeData: [],
                checkAll: false,
                currentList: [],
                currentChooseList: JSON.parse(JSON.stringify(this.chooseList)),
                includeChild: '0',
                isAll: '0',
                currentDep: undefined
            }
        },
        computed: {
            checkSome: function () {
                let chooseLength = 0
                this.currentList.map(item => {
                    if (item.checked) {
                        chooseLength++
                    }
                })
                return chooseLength > 0 && chooseLength < this.currentList.length
            },
            depLength: function () {
                let arr = []
                let hash = {}
                this.currentList.map(item => {
                    if (!hash[item.department]) {
                        arr.push(item.department)
                        hash[item.department] = true
                    }
                })
                return arr.length
            }
        },
        created () {
//            getOrgTree().then(data => {
//                this.treeData = this.generateTree(true, data)
//            })
        },
        watch: {
            isShow: function (val) {
                if (val) {
                    this.showModal = val
                    this.showContent = val
                    getOrgTree().then(data => {
                        this.treeData = this.generateTree(true, data)
                    })
                    this.currentList = []
                    this.checkAll = false
                }
            },
            chooseList: function (val) {
                this.currentChooseList = val
            }
        },
        methods: {
            // 因为使用分部查询数据多导致双向绑定太卡，所以暂时取消分部查人员
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
                                attrs: {
                                    class: 'tree-span'
                                }
//                                on: {
//                                    click: (event) => {
//                                        let span = $(event.target)
//                                        let parent = span.parents('.tree-span')
//                                        if (span.hasClass('tree-span-selected')) {
//                                            span.removeClass('tree-span-selected')
//                                        } else {
//                                            $('.tree-span-selected').removeClass('tree-span-selected')
//                                            span.addClass('tree-span-selected')
//                                            this.searchResourceBySub(data.id)
//                                        }
//                                    }
//                                }
                            }, [
                                h('span', [
                                    h('Icon', subStyle),
                                    h('span', {
                                        attrs: {
//                                            class: 'ivu-tree-title'
                                        }
                                    }, data.title)
                                ])
                            ])
                        }
                    }
                    // 当为开启选择部门时，进行tree的checked属性判断
                    if (this.openDep) {
                        // 不能命名为checked
                        node.check = false
                        this.currentChooseList.some(item1 => {
                            if (item1.type === item.type && item1.id === item.id) {
                                node.check = true
                                return true
                            }
                        })
                    }
                    node.children = this.generateTree(false, item.children)
                    result.push(node)
                }
                return result
            },
            forwardArray (data) {
                let result = []
                result.push(data)
                if (data.children && data.children.length > 0) {
                    data.children.forEach(item => {
                        result.push(this.forwardArray(item))
                    })
                }
                return result
            },
            renderContent (h, {root, node, data}) {     // 每次展开都会触发
                let subNodes = []
                let depNodes = []
                let wrapDepNodes = []
                if (!this.openDep) {
                    depNodes.push(h('Icon', depStyle))
                } else {
                    wrapDepNodes.push(h('Checkbox', {
                        props: {
                            value: data.check
                        },
                        on: {
                            'on-change': (val) => {
                                // todo 部门自动选取下属部门
                                if (this.includeChild === '2') {
                                    let dataArray = this.forwardArray(data)
//                                    console.log(dataArray)
                                    dataArray.forEach(item => {
                                        item.checked = val
                                        if (val) {
                                            let item = {}
                                            item.id = data.id
                                            item.name = data.title
                                            item.type = data.type
                                            this.currentChooseList.push(item)
                                        } else {
                                            this.currentChooseList.some((item1, index) => {
                                                if (item1.type === item.type && item1.id === item.id) {
                                                    this.currentChooseList.splice(index, 1)
                                                }
                                            })
                                        }
                                    })
                                } else {
                                    data.check = val
                                    if (val) {
                                        if (this.isSingle) {
                                            this.currentChooseList = []
                                            if (this.currentDep) {
                                                console.log(this.currentDep.check)
                                                this.currentDep.check = false
                                            }
                                        }
                                        this.currentDep = data
                                        let item = {}
                                        item.id = data.id
                                        item.name = data.title
                                        item.type = data.type
//                                    item.checked = data.check
                                        this.currentChooseList.push(item)
                                    } else {
                                        this.currentChooseList.some((item, index) => {
                                            if (item.id === data.id) {
                                                this.currentChooseList.splice(index, 1)
                                            }
                                        })
                                    }
                                }
                            }
                        }
                    }))
                }
                subNodes.push(h('Icon', subStyle))
                subNodes.push(h('span', {
                    attrs: {
//                                    class: 'ivu-tree-title'
                    }
                }, data.title))
                depNodes.push(h('span', {
                    attrs: {
                        class: data.highlight ? 'tree-title highlight-tree-span' : 'tree-title',
                        id: 'dep' + data.id
                    }
                }, data.title))

                if (data.type === 'sub') {
                    return h('span', {
                        attrs: {
                            class: 'tree-span'
                        }
                    }, [
                        h('span', subNodes)
                    ])
                } else {
                    wrapDepNodes.push(h('span', {
                        attrs: {
                            class: 'tree-span'
                        },
                        on: {
                            click: (event) => {
                                let span = $(event.target)
                                if (span.hasClass('tree-title')) span = span.parent().parent()
                                if (span.hasClass('tree-span-selected')) {
                                    span.removeClass('tree-span-selected')
                                } else {
                                    $('.tree-span-selected').removeClass('tree-span-selected')
                                    span.addClass('tree-span-selected')
                                    if (data.type === 'sub') {
                                        this.searchResourceBySub(data.id)
                                    } else {
                                        this.searchResourceByDep(data.id)
                                    }
                                }
                            }
                        }
                    }, [
                        h('span', depNodes)
                    ]))
                    return h('span', wrapDepNodes)
                }
            },
            handleConfirm () {
                this.showModal = false
                this.$emit('on-confirm', JSON.parse(JSON.stringify(this.currentChooseList)))
            },
            handleCancel () {
                this.showModal = false
                this.$emit('on-close')
            },
            handleClear () {
                this.currentChooseList = []
                this.currentList.map(item => {
                    item.checked = false
                })
                this.checkAll = false
            },
            // 将搜索出来的数据和已选的进行比较
            compareSameItem (data, type) {
                let chooseLength = 0
                data.map(item => {
                    item.type = type
                    this.currentChooseList.some(item1 => {
                        if (item1.id === item.id && item1.type === item.type) {
                            item.checked = true
                            chooseLength++
                            return true
                        }
                    })
                })
                this.currentList = data
                this.checkAll = chooseLength > 0 && chooseLength === data.length
            },
            search () {
                let searchText = Trim(this.searchText, 'g')
                searchText = CastChar(searchText)
                if (searchText === '') return
                getListByName({name: searchText, isAll: this.isAll}).then(data => {
                    this.compareSameItem(data, 'res')
                })
                this.searchTree(this.treeData, searchText.split(','))
            },
            searchTree (tree, values) {
                let flag = false
                tree.map(item => {
                    if (item.children.length > 0) {
                        let isExpand = this.searchTree(item.children, values)
                        if (isExpand) {
                            this.$set(item, 'expand', true)
//                            item.expand = true    因为expand原先不存在，这种赋值方式是添加属性，vue是检测不到的
                            flag = true
                        }
                    }
                    if (item.type === 'dep') {
                        item.highlight = values.some(str => {
                            if (str !== '' && item.title.indexOf(str) > -1) {
                                flag = true
                                return true
                            }
                            return false
                        })
                    }
                })
                return flag
            },
            searchResourceBySub (id) {
                getListBySub(id, this.isAll).then(data => {
                    this.compareSameItem(data, 'res')
                })
            },
            searchResourceByDep (id) {
                getListByDep(id, this.includeChild, this.isAll).then(data => {
                    this.compareSameItem(data, 'res')
                })
            },
            chooseAll () {
                console.time('chooseAll')
                if (this.checkSome) {
                    this.checkAll = false
                } else {
                    this.checkAll = !this.checkAll
                }
                if (this.checkAll) {
                    this.currentList.map(item => {
                        if (!item.checked) {
                            item.checked = true
                            this.currentChooseList.push(item)
                        }
                    })
                } else {
                    this.currentList.map(item => {
                        if (item.checked) {
                            item.checked = false
                            this.currentChooseList.some((item1, index) => {
                                if (item1.id === item.id) {
                                    this.currentChooseList.splice(index, 1)
                                    return true
                                }
                            })
                        }
                    })
                }
                console.timeEnd('chooseAll')
            },
            chooseItem (item) {
                console.time('chooseItem')

                // 多选模式下逻辑
                if (!this.isSingle) {
                    // 是否全选的判断
                    let chooseLength = 0
                    this.currentList.map(item1 => {
                        if (item1.checked) {
                            chooseLength++
                        }
                    })
                    if (chooseLength === this.currentList.length) {
                        this.checkAll = true
                    } else {
                        this.checkAll = false
                    }
                    //  更新选择的列表
                    if (item.checked) {
                        this.currentChooseList.push(item)
                    } else {
                        this.currentChooseList.some((item1, index) => {
                            if (item1.id === item.id) {
                                this.currentChooseList.splice(index, 1)
                                return true
                            }
                        })
                    }
                } else {                 // 单选下的逻辑
                    if (item.checked) {
                        this.currentList.some(item1 => {
                            if (item1.id !== item.id && item1.checked) {
                                item1.checked = false
                                return true
                            }
                        })
                        // 单选切换 存在动画残留
//                        this.currentChooseList = []
                        this.currentChooseList.splice(0, 1, item)
                    } else {
                        this.currentChooseList = []
                    }
                }
                console.timeEnd('chooseItem')
            },
            closeItem (id, index) {
                this.currentChooseList.splice(index, 1)
                this.currentList.some(item => {
                    if (item.id === id) {
                        item.checked = false
                        this.checkAll = false
                        return true
                    }
                })
            },
            handleHidden () {
                this.showContent = false
                this.initData()
            },
            handleCheck (value) {
                console.log(value)
            },
            initData () {
                this.treeData = []
                this.currentList = []
                this.checkAll = false
                this.searchText = ''
                this.includeChild = '0'
            }
        }
    }
</script>

<style lang="scss">
    .modal-input {
        height: 38px;
        padding: 0 30px 0 10px;
        border-radius: 0;
        border: solid 0px #e0e0e0;
        width: 100%;
        font-size: 14px;
    }

    .modal-panel {
        border: solid 1px #e0e0e0;
        border-bottom: none;
        border-top: none;
        height: 320px;
        position: relative
    }

    .modal-org {
        overflow: auto;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 50%;
        padding: 5px 10px;
    }

    .modal-resource {
        border-left: solid 1px #e0e0e0;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 50%;
    }

    .resource-header {
        background-color: rgb(247, 247, 247);
        padding: 0 0px 0 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        position: relative;
        line-height: 30px;
        font-size: 14px;
    }
    .resource-choose{
        overflow: auto;
        position: absolute;
        top: 30px;
        right: 0;
        bottom: 0;
        left: 0;
    }
    .resource-choose li{
        cursor: pointer;
        padding: 0 0px 0 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        position: relative;
        line-height: 30px;
        font-size: 12px;
    }
    .resource-choose li:hover{
        background: #eee;
    }
    .checkAll{
        position: absolute;
        right:0
    }
    .checkItem{
        position: absolute;
        right:0
    }
    .dep-name{
        position: absolute;
        top: 0;
        left: 40%;
    }
    .search-icon{
        line-height: 38px;
        color: #989898;
        cursor: pointer;
        font-size: 22px;
        position: absolute;
        top: 0;
        right: 10px;
    }
    .count-span{
        color: rgb(237, 63, 20);
        font-size: 12px
    }
    .choose-tag{
        margin: 4px 0 0 4px;
    }
    .modal-input::-moz-placeholder {
        color: #ccc;
        opacity: 1;
    }

    .modal-input:-ms-input-placeholder {
        color: #ccc;
    }

    .modal-input::-webkit-input-placeholder {
        color: #ccc;
    }
</style>
