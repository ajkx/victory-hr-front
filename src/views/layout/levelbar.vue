<template>
    <Breadcrumb>
        <BreadcrumbItem v-for="(item,index) in levelList" :key="item.path">
            <span v-if='item.redirect==="noredirect"||index==levelList.length-1' class="no-redirect">{{ item.name ? item.name : item.meta.name }}</span>
            <router-link v-else :to="item.redirect||item.path">{{ item.name ? item.name : item.meta.name }}</router-link>
        </BreadcrumbItem>

    </Breadcrumb>
</template>

<script>
    export default {
        name: 'levelbar',
        created () {
            this.getBreadcrumb()
        },
        data () {
            return {
                levelList: null
            }
        },
        methods: {
            getBreadcrumb () {
//                let matched = this.$route.matched.filter(item => item.name);
                let matched = this.$route.matched
                /* eslint-disable no-array-constructor */
                var array = new Array()
                // 这里复制一下matched 因为下面有删除数组的操作 这会导致vue的路由出错，
                for (var o of matched) {
                    array.push(o)
                }
//                console.log('before:' + array)
                for (var i = 0; i < array.length; i++) {
                    // 因为使用了默认的路由 所以要控制不重复显示菜单，如果不进行删除 路由会显示 如  系统管理 / 系统管理
//                    console.log(array[i].name + ' ' + array[i].path)
                    if (array[i].meta.index) {
                        // 如果有默认路由 则删除默认路由 如 /system 和 /system/ 删除了后者
                        array.splice(i, 1)
//                        console.log('splice:' + array)
                        break
                    }
                }
//                console.log('after:' + array)
                const first = array[0]
                if (first && first.path !== '') {
                    // 为非首页的路由加上首页链接
                    array = [{name: '首页', path: '/'}].concat(array)
                } else if (first && first.path === '') {
                    // 为首页的路由删除重复，因为这里使用了默认路由，即有children路由路径为'',所以matched的数据为 第一个path为'',第二个path为'/home'
                    // 所以会渲染出   / 首页 这个是为了删除第一个
                    array.splice(0, 1)
                }
                this.levelList = array
            }
        },
        watch: {
            $route () {
                this.getBreadcrumb()
            }
        }
    }
</script>

<style>

</style>
