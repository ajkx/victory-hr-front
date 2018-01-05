<template>
    <div class="errPage-container">
        <Button type="primary" class="pan-back-btn">
            <Icon type="chevron-left"></Icon>
            后退

        </Button>
        <Row>
            <Col :span="12">
                <h1 class="text-jumbo text-ginormous">Oops!</h1>
                gif来源<a href='https://zh.airbnb.com/' target='_blank'>airbnb</a> 页面
                <h2 class="margin-row">你没有权限查看该页面数据</h2>
                <h6 class="margin-row">如需权限请向管理员申请</h6>
                <ul class="list-unstyled margin-row">
                    <li>或者你可以去:</li>
                    <li class="link-type">
                        <router-link to="/home">回首页</router-link>
                    </li>
                </ul>
            </Col>
            <Col :span="12">
                <img src="/src/assets/401/401.gif" width="313" height="428" alt="Girl has dropped her ice cream.">
            </Col>
        </Row>
    </div>
</template>

<script>
    export default {
        name: 'error401',
        data () {
            return {

            }
        },
        methods: {
            back () {

            }
        }
    }
</script>

<style>
    .errPage-container {
        width: 800px;
        margin: 100px auto;
    }
    .pan-back-btn {
        background: #008489;
        color: #fff;
    }
    .margin-row{
        margin-top: 19px;
        margin-bottom: 19px;
    }
    .text-jumbo {
        font-size: 60px;
        font-weight: 700;
        color: #484848;
        margin-bottom: 40px;
        margin-top: 40px;
    }
    .list-unstyled {
        font-size: 14px;
    }
    .list-unstyled li {
        padding-bottom: 5px;
    }
    .list-unstyled a {
        text-decoration: none;
    }
    .list-unstyled a:hover {
         text-decoration: underline;

    }
</style>
