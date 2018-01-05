<template>
    <div class="index">

        <div class="content">
            <div class="index-header">
                <h1 class="logo-text">Victory</h1>
            </div>
            <div class="index-content">
                <h1 class="auth-form-header">Sign in to Victory</h1>
                <div class="auth-form-body">
                    <Form ref="formLogin" :model="formLogin" :rules="formLoginRules" label-position="top">
                        <FormItem  prop="username" class="auth-div">
                            <Input type="text" v-model="formLogin.username" @on-enter="handleSubmit()" placeholder="Username"/>
                        </FormItem>

                        <FormItem  prop="password">
                            <Input type="password" v-model="formLogin.password" @on-enter="handleSubmit()" placeholder="Password"/>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" :loading="loading" @click="handleSubmit()" long>Sign in</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        </div>
        <div id="particles-js"></div>
    </div>
</template>

<script>
    import generateJs from '../js/login.js'

    export default {
        name: 'login',
        data () {
            return {
                formLogin: {
                    username: 'aa093',
                    password: '5607745'
                },
                formLoginRules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'change' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'change' }
                    ]
                },
                loading: false
            }
        },
        methods: {
            handleSubmit () {
                this.$refs.formLogin.validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.$store.dispatch('Login', this.formLogin).then(data => {
                            this.loading = false
                            this.$Message.success('登录成功!')
                            this.$router.push({ path: 'home' })
                        }).catch(() => {
                            this.loading = false
                        })
                    } else {
                        this.$Message.error('表单验证失败!')
                    }
                })
            }
        },
        mounted: function () {
            // 挂载完成加载背景粒子效果
            generateJs()
        }
    }
</script>

<style lang="scss" scoped>
    #particles-js {
        position: absolute;
        top: 0;
        z-index: -1;
        width: 100%;
        height: 100%;
        /*background-color: #F7FAFC;*/
        background-color:#F9F9F9
    }
    .content{
        color: #24292e;
        width: 300px;
        margin: 0 auto;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"
    }
    .index-header{
        text-align: center;
        padding-top: 32px;
        padding-bottom: 24px;
    }
    .index-header .logo-text{
        margin:0 auto;
        width: 48px;
        height: 48px;
        background: url(../assets/v-logo2.png) no-repeat;
        background-size: contain;
        font: 0/0 a;
    }
    .auth-form-header{
        font-size: 24px;
        font-weight: 300;
        letter-spacing: -0.5px;
        color: #333;
        text-shadow: none;
        text-align: center;

    }
    .auth-form-body{
        padding: 20px;
        font-size: 14px;
        background-color: #fff;
        border: 1px solid #d8dee2;
        border-radius: 5px;
        margin-top: 16px !important;

    }
    label{
        font-weight: 600;
    }
    /*.auth-div{*/
        /*margin-bottom: 15px !important;*/
    /*}*/

    /*重写label的样式*/
    /*.ivu-form-label-top .ivu-form-item-label{*/
        /*font-size: 14px !important;*/
        /*color: #24292e !important;*/
    /*}*/
    /*.ivu-form-item-required .ivu-form-item-label:before{*/
        /*content: '' !important;*/
    /*}*/
</style>
