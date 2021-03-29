const path = require('path')


function resolve(dir) {
    //此处使用path.resolve 或path.join 可自行调整
    return path.join(__dirname, dir)
}

module.exports = {
    publicPath: '/',
    assetsDir: 'static',
    lintOnSave: false,
    runtimeCompiler: true,
    pages: {
        index: {
            // page 的入口
            entry: 'src/main.js',
            // 模板来源
            template: 'public/index.html',
            // 在 dist/index.html 的输出
            filename: 'index.html',
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            title: '首页',
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        },
    },
    // 设置Dev配置
    devServer: {
        port: '8081',
        proxy: {
            '/api': {
                target: 'http://zjktgl.zhijiao361.com', // 接口域名
                ws: true,
                changeOrigin: true, //是否跨域
                pathRewrite: {
                    '^/api': '/api'   //需要rewrite重写的,
                }
            },
        }
    },
    css: {
        // sourceMap: true
    },
    // webpack 配置
    chainWebpack: config => {
        config.module
            .rule('vue')
            .use('vue-loader')
            .loader('vue-loader')
            .options({
                compilerOptions: {
                    preserveWhitespace: true // 保留行类标签后至少一个空格
                }
            })

        config.resolve.alias
            .set('vue$', 'vue/dist/vue.esm.js')
            .set('@', resolve('src'))
    }
}