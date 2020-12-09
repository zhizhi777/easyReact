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