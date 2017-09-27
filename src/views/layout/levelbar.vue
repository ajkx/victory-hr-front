<template>
    <Breadcrumb>
        <BreadcrumbItem v-for="(item,index) in levelList" :key="item.path">
            <span v-if='item.redirect==="noredirect"||index==levelList.length-1' class="no-redirect">{{item.name}}</span>
            <router-link v-else :to="item.redirect||item.path">{{ item.name ? item.name : item.meta.name }}</router-link>
        </BreadcrumbItem>

    </Breadcrumb>
</template>

<script>
    export default {
        name: 'levelbar',
        created() {
            this.getBreadcrumb();
        },
        data() {
            return {
                levelList: null
            }
        },
        methods: {
            getBreadcrumb() {
//                let matched = this.$route.matched.filter(item => item.name);
                let matched = this.$route.matched;
                var array = new Array();
                //这里复制一下matched 因为下面有删除数组的操作 这会导致vue的路由出错，
                for(var o of matched) {
                    array.push(o);
                }
                for(var o of array) {
                    //因为使用了默认的路由 所以要控制不重复显示菜单，如果不进行删除 路由会显示 如  系统管理 / 系统管理
//                    console.log(o.name + " " + o.path);
                    if(o.meta.index){
                        array.splice(0,1);
                        break;
                    }
                }
                const first = array[0];
                if( first &&  first.path !== ''){
                    //为非首页的路由加上首页链接
                    array = [{name: '首页', path: '/'}].concat(array);
                }else if( first && first.path == ''){
                    //为首页的路由删除重复，因为这里使用了默认路由，即有children路由路径为'',所以matched的数据为 第一个path为'',第二个path为'/home'
                    //所以会渲染出   / 首页 这个是为了删除第一个
                    array.splice(0, 1);
                }
                this.levelList = array;
            }
        },
        watch: {
            $route() {
                this.getBreadcrumb();
            }
        }
    }
</script>

<style>

</style>