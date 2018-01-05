<template>
    <div :class="classes">
        <slot></slot>
    </div>
</template>

<script>
    import { oneOf } from 'utils/assist'

    const prefixCls = 'table-header'

    export default {
        name: 'ListHeader',
        props: {
            mode: {
                validator (value) {
                    return oneOf(value, ['single', 'both'])
                },
                default: 'single'
            }
        },
        data () {
            return {}
        },
        computed: {
            classes () {
                return [`${prefixCls}`, `${prefixCls}-${this.mode}`]
            }
        }
    }
</script>

<style lang="scss" scoped>
    .table-header {
        overflow: hidden;
        padding: 0px 0px 10px 0;
    }
    .table-header-single .search-panel {
        border-bottom: 1px solid #e4e4e4;
        padding-bottom: 15px;
        margin-bottom: 15px;
    }
    .table-header-both .search-panel {
        float: right;
    }
</style>
