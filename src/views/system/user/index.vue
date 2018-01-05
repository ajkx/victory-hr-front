<template>
    <router-view></router-view>
</template>

<script>
    import List, { ListHeader, ListOperations, ListSearch } from 'components/list'

    import {getRoles, updateRole, updateRoleStatus, deleteRole} from 'api/sys'

    export default {
        name: 'user',
        data () {
            return {
            }
        },
        methods: {
        }
    }
</script>

<style>

</style>
