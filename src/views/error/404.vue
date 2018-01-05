<template>
    <div style="margin-top: -20px;">

        <div class="wscn-http404">
            <div class="pic-404">
                <h1 class="text-404">404</h1>
                <!--<h1>已迷路人数: {{ }}</h1>-->
            </div>
            <div class="bullshit">
                <div class="bullshit__oops">OOPS!</div>
                <div class="bullshit__info">您要找的页面不存在!</div>
                <div class="bullshit__headline">Lost times <font :style="{color: color}">{{ count }}</font></div>
                <div class="bullshit__info">请检查您输入的网址是否正确，请点击以下按钮返回主页</div>
                <a href="/" class="bullshit__return-home">返回首页</a>
            </div>
        </div>
    </div>
</template>

<script>
    const numList = ['4', '0', '4']
    const ColorList = ['#ff9900', '#ed3f14', '#FF7373', '#FF4040', '#A60000', '#BF3030', '#FF0000']

    function plus (value) {
        value++
    }
    export default {
        name: 'error404',
        data () {
            return {
                info: numList[0],
                color: '#1482f0',
                count: 0
            }
        },
        mounted: function () {
            var that = this
            console.log(this.count)
            var timer = setInterval(function (value) {
                that.count++
                if (that.count === 500) {
                    that.color = ColorList[0]
                } else if (that.count === 1500) {
                    that.color = ColorList[1]
                } else if (that.count === 3000) {
                    that.color = ColorList[2]
                } else if (that.count === 5000) {
                    that.color = ColorList[3]
                } else if (that.count === 7500) {
                    that.color = ColorList[4]
                } else if (that.count === 10500) {
                    that.color = ColorList[5]
                } else if (that.count === 14000) {
                    that.color = ColorList[6]
                } else if (that.count > 18000) {
                    that.color = '#000'
                    that.count = '???'
                    clearInterval(timer)
                }
            }, 1)
        },
        methods: {
            plus () {
                this.count++
            }
        }
    }
</script>

<style>
    .wscn-http404 {
        position: relative;
        width: 900px;
        margin: 20px auto 60px;
        padding: 0 100px;
        overflow: hidden;
    }
    .pic-404{
        position: relative;
        float: left;
        width: 300px;
        padding: 150px 0;
        overflow: hidden;
    }
    .text-404{
        font-size: 100px;
        text-align: center;
        vertical-align: middle;
    }
    .bullshit {
        position: relative;
        float: left;
        width: 300px;
        padding: 150px 0;
        overflow: hidden;
    }
    .bullshit__oops{
        font-size: 32px;
        font-weight: bold;
        line-height: 40px;
        color: #1482f0;
        opacity: 0;
        margin-bottom: 20px;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-fill-mode: forwards;
    }
    .bullshit__headline{
        font-size: 16px;
        line-height: 24px;
        color: #1482f0;
        opacity: 0;
        margin-bottom: 10px;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-delay: 0.1s;
        animation-fill-mode: forwards;
    }
    .bullshit__info{
        font-size: 13px;
        line-height: 21px;
        color: grey;
        opacity: 0;
        margin-bottom: 30px;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-delay: 0.2s;
        animation-fill-mode: forwards;
    }
    .bullshit__return-home{
        display: block;
        float: left;
        width: 110px;
        height: 36px;
        background: #1482f0;
        border-radius: 100px;
        text-align: center;
        color: #ffffff;
        opacity: 0;
        font-size: 14px;
        line-height: 36px;
        cursor: pointer;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-delay: 0.3s;
        animation-fill-mode: forwards;
    }
    @keyframes slideUp {
        0% {
            transform: translateY(60px);
            opacity: 0;
        }
        100% {
            transform: translateY(0);
            opacity: 1;
        }
    }
</style>
