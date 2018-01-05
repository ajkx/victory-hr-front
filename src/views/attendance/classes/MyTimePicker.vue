<template>
    <TimePicker ref="picker" format="HH:mm" :clearable='false' :editable='false' style="width:100px;margin-left: 5px; margin-right: 10px;"
                @on-change="onChange" :value="value"></TimePicker>
</template>

<script>
    export default {
        name: 'MyTimePicker',
        props: ['index', 'property', 'type', 'value'],
        data () {
            return {
                timeValue: this.value
            }
        },
        methods: {
            onChange (value) {
                if (this.type === 'rest') {
                    this.$emit('restchange', value, this.property)
                } else {
                    this.$emit('timechange', value, this.index, this.property)
                }
            },
            changeValue (value) {
                console.log(this.$refs.picker.visualValue)
//                this.$refs.picker.visualValue.set(value)
            }
        }
    }
</script>

<style lang="scss">

</style>
