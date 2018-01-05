// 按需加载
// import语法要加载babel的syntax-dynamic-import插件

module.exports = file => () => import('@/views/' + file + '.vue')
