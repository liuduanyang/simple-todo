import Vue from 'vue';
import App from './app.vue';

// 引入非js前端资源
// import './assets/styles/test.css';
// import './assets/images/bg.jpg';
// import './assets/styles/test-stylus.styl';

import './assets/styles/global.styl'

    const root=document.createElement('div');
    document.body.appendChild(root);

new Vue({   
  render:(h)=>h(App)  // h就是createApp
})  // 声明了组件渲染的是App的内容
.$mount(root)  //挂载到html节点 将内容插入到root这个div里