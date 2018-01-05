<template>
    <div>
        <List :listUrl="listUrl" :columns="tableColumns" ref="list" :query="listQuery">
            <ListHeader slot="header" mode="both">
                <ListSearch>
                    <Input size="small" v-model="listQuery.name" placeholder="输入权限名" style="width: 200px"
                           @on-enter="GetList" icon="ios-search" class="">
                    </Input>
                </ListSearch>
            </ListHeader>
        </List>
    </div>
</template>

<script>
    import List, { ListHeader, ListOperations, ListSearch } from 'components/list'

    export default {
        name: 'permission',
        components: {
            List,
            ListHeader,
            ListOperations,
            ListSearch
        },
        data () {
            return {
                listUrl: 'permission',
                searchValue: undefined,
                listQuery: {    // listQuery 最好都加上 page 和 size
                    name: undefined,
                    page: 1,
                    size: 10
                },
                tableColumns: [
                    {
                        title: '权限名称',
                        key: 'name'
                    },
                    {
                        title: '描述',
                        key: 'description'
                    }
                ]
            }
        },
        methods: {
            GetList () {
                // 先将当前页变为第一页 在进行搜索
                this.listQuery.page = 1
                this.$refs.list.GetList()
            }
        }
    }
</script>

<style>

</style>
