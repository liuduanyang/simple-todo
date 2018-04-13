const path=require('path');
const HTMLPlugin=require('html-webpack-plugin');
var webpack=require('webpack');
const ExtractPlugin=require('extract-text-webpack-plugin');

const isDev=process.env.NODE_ENV==='development' // 在package.json所设置的环境变量都保存在process.env中

const config={
    target:'web',
    entry:path.join(__dirname,'src/index.js'),  // 打包时的入口
    output:{
        filename:'bundle.[hash:8].js',  // 出口 把打包后的文件输出   指定输出文件名
        path:path.join(__dirname,'dist') // 输出路径  打包后的文件存放于project/dist/bundle.js
    },
    module:{
        rules:[{
            test:/\.vue$/,  // 检测文件类型
            loader:'vue-loader'  // 使用vue-loader处理.vue类型的文件
        },
        {
            test:/\.jsx$/,
            loader:'babel-loader'
        },
        {
            test:/\.css$/,
            use:[               // 采用use 是表示可能会使用多个loader
                'style-loader', // 如果编写时采用内联style标签形式 则使用此loader
                'css-loader'    // 如果编写时采用引用外部css文件形式 则使用此loader
            ]
        },
        {
            test:/\.(gif|jpg|jpeg|png|svg)$/,
            use:[{      // 这里采用对象形式是 采用options配置对象为loader(url-loader)进行配置
                loader:'url-loader',  // url-loader可将图片转换成base64代码，直接写在js内容里而不用生成新的文件
                options:{
                    limit:1024,   // 单位是字节，如果文件大小小于1K 对其进行转换即使用loader
                    name:'[name]-liu.[ext]'  // 指定输出文件的名字 [name]表示采用图片文件转换前的名字 [ext]表示扩展名 比如jpg 原来的扩展名
                }
            }]
        }]
    },
    plugins:[
        new webpack.DefinePlugin({
            'process.env':{
                NODE_ENV:isDev?'"development"':'"production"'  // 注意此处的写法 '" xx "' 因为调用时是调用''内的内容
            }
        }),  // 在使用vue react等框架时移动要加上这个,作用在webpack编译时以及自己写的js代码中都可据此判断所使用的的环境(调用process.env进行判断) 再者webpack可针对不同的环境打包不同的框架源码
        new HTMLPlugin()
    ]
}

if(isDev){
    config.module.rules.push({
        test:/\.styl/,
        use:[   // 顺序不能乱
            'style-loader',   // 用于处理stylus-loader 处理完后所得的css代码
            'css-loader',
            {
                loader:'postcss-loader',
                options:{
                    sourceMap:true  // stylus-loader会生成sourceMap 这里规定使用前面(stylus-loader生成的)已有sourceMap 避免重复浪费时间
                }
            },
            'stylus-loader'  // 用于处理stylus css预处理器 处理完后是标准的css代码
        ]
    });
    config.devtool='#cheap-module-eval-source-map'; // 可在浏览器调试es6代码 即编译前的代码 但会导致webpack编译较慢
    config.devServer={
        port: '8000',   // webpack-dev-server会作为一个服务启动 所以需要设置一个端口
        host: '0.0.0.0',  //使用 0.0.0.0 的好处：可通过locahost、127.0.0.1或内网ip进行访问 
        overlay:{
            errors: true, // 在使用webpack进行编译时如果有任何错误，我们都让它显示到网页上面
        },
        // open:true  //编译完后自动打开浏览器查看  更多配置查看文档
        hot:true // 虽然vue-loader自带热更新 但是重新刷新页面 而这个配置可达到局部刷新的效果 哪里改变刷新哪里
    }
    config.plugins.push(new webpack.HotModuleReplacementPlugin(),new webpack.NoEmitOnErrorsPlugin()); // 安装 hot:true需要的插件   
}else{
    config.entry={
        app:path.join(__dirname,'src/index.js'),
        vendor:['vue'] // 会单独打包成一个文件 比如vender.xxx.js
    };
    config.output.filename='[name].[chunkhash:8].js'
    config.module.rules.push({
        test:/\.styl/,
        use:ExtractPlugin.extract({
            fallback:'style-loader',  // 将css-loader处理出来的内容外面包了一层Js代码，这段代码的作用是把css写入style标签并保存到head
            use:[   // 顺序不能乱
                'css-loader',
                {
                    loader:'postcss-loader',
                    options:{
                        sourceMap:true 
                    }
                },
                'stylus-loader'
            ]
        })
    });
    config.plugins.push(
        new ExtractPlugin('styles.[contentHash:8].css'),
        new webpack.optimize.CommonsChunkPlugin({
          name: 'vendor'  // 和上面entry的vender属性对应
        }),
        new webpack.optimize.CommonsChunkPlugin({
          name: 'runtime' // vender必须放在runtime前面
        })
      )
};

module.exports=config;