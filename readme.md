本项目主要功能是将 JSX 渲染到页面上。

手写简易React过程：

* 设置项目
* 设置 webpack 
* 设置 Babel 搭建 React 环境
* 测试 JSX
* 开始手写简易 React 

<h3>设置项目</h3>

创建项目：

	mkdir webpack-react-simple
    
进入项目并创建目录结构:

	cd webpack-react-simpl && mkdir src
 
使用 npm 初始化项目：
	
    npm init -y
    
<h3>设置 webpack</h3>

安装 webpack 和 webpack-cli

	npm install --save-dev webpack webpack-cli
    
安装 webpack-dev-server 和 html-webpack-plugin

	npm install --save-dev webpack-dev-server html-webpack-plugin
    
在 package.json 文件中添加 webpack 命令

	"scripts": {
        "start": "webpack serve --open Chrome.exe",
        "build": "webpack --mode production"
  	},
    
<h3>设置 Babel 搭建 React 环境</h3>

Babel是一个工具链，主要用于在当前和较旧的浏览器或环境中将ECMAScript 2015+代码转换为JavaScript的向后兼容版本。

babel-loader是负责与Babel对话的 webpack loader。同时 Babel必须配置预设（preset，预先配置好的一组插件）：

* `@babel/preset-env` 用于将现代 JavaScript 编译为 ES5
* `@babel/preset-react` 可将 JSX 和其他内容编译为 JavaScript

安装 Babel 及其依赖

	npm install --save-dev @babel/core babel-loader @babel/preset-env @babel/preset-react
    
 以上工具的作用：webpack 项目里当 import 一个 `.jsx` 文件时，使用 `babel-loader` 来处理这个文件， `babel-loader` 使用 `@babel/core` 来执行转换， 在转换的过程中使用了 babel 的 `@babel/preset-env` 插件用于把最新的 ES 转换为 ES5，使用 `@babel/preset-react` 把 JSX 转换为正常的 JavaScript。

在项目根目录创建 .babelrc 文件，目的是告诉 `babel-core` 在执行转换的时候使用以下插件：

	{
      "presets": ["@babel/preset-env","@babel/preset-react"]
    }

创建 webpack.config.js 文件：

	const path = require('path')
    const HtmlWebpackPlugin = require('html-webpack-plugin')

    module.exports = {
      entry: './src/index.js',
      module: {
        rules:[
          {
            test: /\.(js|jsx)$/,
            exclude: /node_module/,
            use: ['babel-loader']
          }
        ]
      },
      plugins: [
        new HtmlWebpackPlugin()
      ],
      output:{
        filename: '[name].[hash:5].bundle.js',
        path: path.resolve(__dirname, 'dist')
      },

      devtool: 'inline-source-map',
      devServer: { contentBase: './dist' }
    }

其中：

	{
      test: /\.(js|jsx)$/,
      exclude: /node_module/,
      use: ['babel-loader']
    }
    
作用: 对于每个带有 js 或 jsx 扩展名的文件，Webpack 都会通过 `babel-loader` 处理代码。

<h3>测试 JSX</h3>

创建 `src/index.js` 文件

    const React = {
      createElement(...args) {
      	console.log(args)
      }
    };

    let div = <div> hello </div>;
    console.log(div);
    
测试：

	npm start

<h3>开始手写简易 React </h3>

让我们先来看看React使用组件需要的一些基本功能：

1. React 组件使用一个名为 render() 的方法，接收输入的数据并返回需要展示的内容。被传入的数据可在组件中通过 this.props 在 render() 访问。

2. 除了使用外部数据（通过 this.props 访问）以外，组件还可以维护其内部的状态数据（通过 this.state 访问）。当组件的状态数据改变时，组件会再次调用 render() 方法重新渲染对应的标记。

在开始之前我们需要了解以下 [JSX 被编译成 javaScript](https://babeljs.io/repl/#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&spec=false&loose=false&code_lz=MYewdgzgLgBApgGzgWzmWBeGAeAFgRhmAQEMIIA5E1DAcl0QRFoD4AJRkAGhgHcQATggAmAQmwB6AiwDcAKFCRYiqCQCWYOAJhZhIYAFdU6AHQAjEMICe8gEpwSwKABEA8gFkTAtMK0AKRBQ0KB4VdU0BAEoZIA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=react&prettier=false&targets=&version=7.12.9&externalPlugins=) 代码的步骤：


```JSX
// 编译前
const element = <h1 className='hello'>Hello, world!</h1>;
const container = document.body;
ReactDOM.render(element, container);
```
```javaScript
// 编译后
const element = /*#__PURE__*/React.createElement("h1", {
  className: "hello"
}, "Hello, world!");
const container = document.body;
ReactDOM.render(element, container);
```

可以看出 JSX 被编译成 javaScript 是调用 React 对象的 createElement 方法。向其中传入三个参数（`string/ReactClass type`, `[object props]`, `[children ...]`），那我们就需要在 react.js 中写入：

```javaScript
// react.js
function createElement(tag, attrs, ...children){
  return {
    tag,
    attrs,
    children
  }
}
export default { createElement }
```

接下来我们就需要编写一个 `render` 方法来将 JSX 渲染到页面上:

```javaScript
// react-dom.js
function render(vdom, container){
  let node = createDomFromVdom(vdom)
  container.appendChild(node)
}

function createDomFromVdom(vdom){
  let node
  if(typeof vdom === 'string'){
    node = document.createTextNode(vdom)
  }else if(typeof vdom === 'object'){
    node = document.createElement(vdom.tag)
    setAttribute(vdom.attrs, node)
    vdom.children.forEach( children => render(children, node) )
  }
  return node
}

function setAttribute(attrs, node){
  if(!attrs) return

  for(let key in attrs){
    if(key.startsWith('on')){
      node[key.toLowerCase()] = attrs[key]
    }else if(key === 'style'){
      Object.assign(node.style, attrs[key])
    }else{
      node[key] = attrs[key]
    }
  }
}

export default { render }
```

做一个简单测试：

```javaScript
// index.js
let div = (<h1 className='hello' id='h1' onClick={ () => console.log('click me') }  style={ {color:'red'} }>
<span>Hello World!</span>
</h1>)
Reactdom.render(div, document.body)
```

接下来便是组件的实现：

```javaScript
// React.js
class Component{
  constructor(props){
    this.props = props
  }
}
```

```javaScript
// index.js
class App extends React.Component{
  constructor(props){
    super(props)
  } 

  bundleClick(){
    console.log('hello!')
  }

  render(){
    return (<div id='app'>
              <p>welcome!</p>
              <button onClick={this.bundleClick}>click me!</button>
            </div>)
  }
}
```

完善 createDomFromVdom （组件自定义标签的渲染）:

```javaScript
function createDomFromVdom(vdom,){
  let node
  if(typeof vdom === 'string'){
    node = document.createTextNode(vdom)
  }else if(typeof vdom === 'object'){
    if(typeof vdom.tag === 'function'){
       let component = new vdom.tag(vdom.attrs)
      // let component = getComponent(vdom.tag, vdom.attrs)
      let vnode = component.render()
      node = createDomFromVdom(vnode)
      component.$root = node
    }else{
      node = document.createElement(vdom.tag)
    }
    setAttribute(vdom.attrs, node)
    vdom.children.forEach( children => render(children, node) )
  }
  return node
}
```

设置 state 后重新渲染：

```javaScript
// react.js
class Component{
  constructor(props){
    this.props = props
    this.state = {}
  }

  setState(newState){
    Object.assign(this.state, newState)
    ReactDom.renderComponent(this)
  }
}
```

```javaScript
// index.js
class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      title: 'its me '
    }
  } 

  bundleClick(){
    this.setState({
      title: `i'm zhizhi777`
    })
  }

  render(){
    return (<div id='app'>
              <p>{ this.state.title }</p>
              <button onClick={this.bundleClick.bind(this)}>click me!</button>
            </div>)
  }
}
```
当组件的状态数据改变时，组件会调用 renderComponent() 方法重新渲染对应的标记。

```javaScript
// react-dom.js
function renderComponent(component){
  let vdom = component.render()
  let node = createDomFromVdom(vdom)
  if(component.$root){
    component.$root.parentNode.replaceChild(node, component.$root)
  }
  component.$root = node 
}
```

简单测试：

```
let div =  (<div><App/><p>Hello React!</p></div>)
Reactdom.render(div, document.body)
```

到此 class 组件便已经完成了。接下来便是函数组件的实现：

```javaScript
// index.js
function Title(props){
  return <h2>title： { props.title }</h2>
}
```

```javaScript
// react-dom.js
function getComponent(tag, attrs){
  if(tag.prototype instanceof React.Component){
    return new tag(attrs)
  }else{
    let App = class extends React.Component{}
    App.prototype.render = function(){
      return tag(attrs)
    }
    return new App()
  }
}
```

使用外部数据功能测试：在 APP 组件中重新编写 render()

```javaScript
  render(){
    return (<div id='app'>
              <Title title = {this.state.title}></Title> 
              <p>{ this.state.title }</p>
              <button onClick={this.bundleClick.bind(this)}>click me!</button>
            </div>)
  }
```

运行发现当点击按钮时，`<p>` 标签中的内容发生变化时, `<Title>` 标签中的内容也会发生变化

 
到此，整个功能便已经实现了
