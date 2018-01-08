<template>
    <div>
        <slot name="header"></slot>
        <Table :loading="loading" :columns="tableColumns" :data="tableData" class="table-panel" :border="border"></Table>
        <div class="footer-panel">
            <div class="footer-toolbar">
                <slot name="footer"></slot>
            </div>
            <Page :total="total" :current="listQuery.page" :page-size="listQuery.size" @on-change="changePage"
                  @on-page-size-change="changeSizePage" show-total :show-sizer="showSizer" class="footer-page"></Page>
        </div>
    </div>
</template>

<script>
    import { list } from 'api/common'

    import Vue from 'vue'

    export default {
        name: 'List',
        props: {
            columns: {
                type: Array,
                default () {
                    return []
                }
            },
            query: {
                type: Object,
                default: function () {
                    return {
                        page: 1,
                        size: 10
                    }
                }
            },
            data: {
                type: Object,
                default: function () {
                    return {}
                }
            },
            listUrl: {
                type: String,
                required: true
            },
            customUrl: {
                type: Boolean,
                default: false
            },
            border: {
                type: Boolean,
                default: false
            },
            showSizer: {    // 是否显示条数的选择
                type: Boolean,
                default: function () {
                    return true
                }
            },
            type: {     // radio表示为单选模式，默认为正常显示
                type: String
            },
            isAll: {    // 第一次搜索是否搜索全部，即分页只是切换数组
                type: Boolean,
                default: function () {
                    return false
                }
            },
            currentDataId: {    // 单选下 默认的选值
                type: Number,
                default: 0
            }
        },
        data () {
            return {
                total: 0,
                tableData: [],
                tableColumns: this.columns,
                tableAllData: [],       // 所有数据
                listQuery: this.query,   //  listQuery = query = parent.listQuery  因为这是对象 指向同一个内存空间
                listData: this.data,    // post的data
                loading: false,
                currentObject: {}       // 单选模式下选中的对象
            }
        },
        mounted () {
            const radioCol = {
                title: ' ',
                width: 60,
                render: (h, params) => {
                    const index = params.index
                    const currentIndex = (this.listQuery.page - 1) * this.listQuery.size + index
                    return h('Radio', {
                        props: {
                            value: this.tableAllData[currentIndex].checked
                        },
                        on: {
                            input: (event) => {
                                this.radioChange(currentIndex)
                            }
                        }
                    })
                }
            }
            if (this.type === 'radio') this.tableColumns.unshift(radioCol)      // 如果为单选模式，则加上单选的属性
            this.GetList()
        },
        computed: {

        },
        methods: {
            GetList () {
                this.listQuery.page -= 1
                if (this.isAll) {
                    // 不重新查询，只是切换结果
                    if (this.tableAllData.length > 0) {
                        this.listQuery.page += 1
                        this.tableData = this.tableAllData.slice((this.listQuery.page - 1) * this.listQuery.size, this.listQuery.page * this.listQuery.size)
                    } else {  // 首次载入，搜索全部的结果
                        this.listQuery.isAll = 1
                        this.loading = true
                        list(this.listUrl, this.listQuery, this.listData, this.customUrl).then(data => {
                            this.total = data.totalElements
                            this.listQuery.page += 1
                            this.tableAllData = data.content
                            this.tableData = this.tableAllData.slice(0, this.listQuery.page * this.listQuery.size)
                            this.tableAllData.map(item => {
                                if (item.id === this.currentDataId) {
                                    item.checked = true
                                    this.currentObject = item
                                } else item.checked = false
                            })
                            this.loading = false
                        })
                    }
                } else {
                    this.loading = true
                    // 每次都根据条件重新查询
                    list(this.listUrl, this.listQuery, this.listData, this.customUrl).then(data => {
                        this.tableData = data.content
                        this.total = data.totalElements
                        this.listQuery.page += 1
                        this.loading = false
                    })
                }
            },
            changePage (val) {
                this.listQuery.page = val
                this.GetList()
            },
            changeSizePage (val) {
                this.listQuery.size = val
                this.GetList()
            },
            radioChange (currentIndex) {
                this.tableAllData.map((item, index) => {
                    if (index === currentIndex) {
                        item.checked = true
                        this.currentObject = item
                    } else item.checked = false
                    Vue.set(this.tableAllData, index, item)
                })
            },
            resetTableAllData (value) {
//                console.log('a' + this.currentDataId)     这里不要使用currentDataId判断，因为父组件的值已经修改了，但可能还没有同步到这边来
                this.tableAllData.map((item, index) => {
                    if (item.id === value) {
                        item.checked = true
                        this.currentObject = item
                    } else {
                        item.checked = false
                        this.currentObject = {}
                    }
                    Vue.set(this.tableAllData, index, item)
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .table-panel {
        border: 0px;
    }

    .footer-panel {
        margin: 10px 10px 10px 0;
        overflow: hidden;
        .footer-toolbar {

        }
        .footer-page {
            float: right;
        }
    }
</style>
