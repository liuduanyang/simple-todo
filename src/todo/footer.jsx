// 使用jsx创建footer模块 练习使用jsx
// jsx就是把html写在js代码里面

import '../assets/styles/footer.styl'

export default {
  data(){
    return {
      author:'liuduanyang'
    }
  },
  render(){
    return (
      // 好处就是，在这里面可以写Js代码 从而实现比v-for更开放、更强大的功能
      <div id="footer">
        <span>written by {this.author}</span>
      </div>
    )
  }
}