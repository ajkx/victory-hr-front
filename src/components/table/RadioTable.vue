<template>
    <div>
        <Table :columns="tableColumns" :data="tableData" class="table-panel"></Table>
    </div>
</template>

<script>
    const radioCol = {
        title: '',
        render: (h, params) => {
            const index = params.index
            return h('Radio', {
                props: {
                    value: this.tableData[index].checked
                }
            })
        }
    }
    export default {
        name: 'RadioTable',
        props: {
            columns: {
                type: Array,
                default () {
                    return []
                }
            },
            url: {
                type: String,
                required: true
            }
        },
        data () {
            return {
                total: 0,
                tableData: [],
                tableColumns: this.columns.unshift(radioCol)
            }
        },
        created () {
            this.GetList()
        },
        methods: {
            GetList () {

            }
        }
    }
</script>

<style lang="scss">

</style>
