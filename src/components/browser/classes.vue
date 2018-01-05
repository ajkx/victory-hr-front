<template>
    <Modal v-model="showModal" width="520" @on-cancel="handleCancel" @on-hidden="handleHidden">
        <div slot="header" style="font-size: 14px; color: #1c2438;">
            <span>选择班次</span>
        </div>
        <div v-if="showContent">
            <List listUrl="attendanceClasses"
                  :columns="classesColumns"
                  ref="classesTable"
                  :query="classesQuery"
                  :showSizer="false"
                  type="radio"
                  :isAll="true"
                  :currentDataId="currentChooseClass.id">
            </List>
        </div>
        <div slot="footer">
            <Button type="ghost"  @click="handleCancel" style="margin-left: 15px">取消</Button>
            <Button type="primary"  @click="handleConfirm" style="margin-left: 15px">确定</Button>
        </div>
    </Modal>
</template>

<script>
    import { get, create, update } from 'api/common'
    import List from 'components/list'
    import { getTimeList } from 'utils/transform'
    export default {
        components: {List},
        name: 'class',
        props: {
            isShow: {
                type: Boolean,
                default: false
            },
            chooseClass: {
                type: Object,
                default: function () {
                    return {}
                }
            }
        },
        data () {
            return {
                showModal: this.isShow,
                showContent: false,
                currentChooseClass: JSON.parse(JSON.stringify(this.chooseClass)),
                classesColumns: [
                    {
                        title: '班次名称',
                        key: 'name'
                    },
                    {
                        title: '考勤时间',
                        key: 'timeList',
                        width: '260',
                        render: (h, params) => {
                            const data = params.row
                            const timeList = data.timeList
                            return getTimeList(timeList)
                        }
                    }
                ],
                classesQuery: {
                    name: undefined,
                    page: 1,
                    size: 5
                }
            }
        },
        watch: {
            isShow: function (val) {
                if (val) {
                    this.showModal = val
                    if (this.showContent) this.$refs.classesTable.resetTableAllData(this.currentChooseClass.id)
                    this.showContent = val
                }
            },
            chooseClass: function (val) {
                this.currentChooseClass = val
            }
        },
        methods: {
            handleConfirm () {
                this.showModal = false
                this.$emit('on-confirm', JSON.parse(JSON.stringify(this.$refs.classesTable.currentObject)))
            },
            handleCancel () {
                this.showModal = false
                this.$emit('on-close')
            },
            handleHidden () {
            }
        }
    }
</script>

<style lang="scss">

</style>
