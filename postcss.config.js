const autoprefixer=require('autoprefixer');

module.exports={
  plugins:[
    autoprefixer()  // 自动添加css属性的前缀 比如-moz-等
  ]
}

// postcss用来优化css代码，优化的过程就是通过一系列的组件来优化