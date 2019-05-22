# CSS Modules
css的模块化，加入了局部作用域和模块依赖，保证某个组件的样式不会影响到其他组件

## css modules支持的[插件](https://github.com/css-modules/css-modules/blob/master/docs/get-started.md)
1. Webpack：[css-loasder](https://github.com/webpack/css-loader)
2. Browserify:[css-modulesify](https://github.com/css-modules/css-modulesify)
3. JSPM: [jspm-loader-css-modules](https://github.com/geelen/jspm-loader-css-modules) 
4. NodeJS:[css-modules-require-hook](https://github.com/css-modules/css-modules-require-hook)

## 局部作用域
css设置的样式默认都是全局的，任何一个组件样式在全局都有效，这样就很容易造成样式覆盖，产生局部作用域的唯一方法就算使用一个独一无二的class名字。<br/>
css-loader提供了一个开关，可以开启CSS Modules功能：
```
module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            // 将css单独打包
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "./"
            }
          },
          {
            loader: "css-loader",
            options: {
             // 开启css modules
              modules: true
            }
          }
        ]
      }
    ]
}
```
通过上面的配置，webpack打包出的css所有的类名将会进行编码，如下所示：<br/>
在js中导入模块，可以得到一个css对象：
```
import index from "./index.css";
//{title: "lfEzW-QkJuIZ6SnG6kM-b"}
console.log(index);
```
打包后的css文件：
```
.lfEzW-QkJuIZ6SnG6kM-b {
    color: yellowgreen;
}
```
开启了CSS Modules后，html中必须使用编译后的类名样式才会生效

## 全局作用域
CSS Modules允许使用`:global(.className)`的语法声明一个全局类名，凡是被`:global`包裹的类名均不会被编码。<br/>
在index.css中加入下面的代码：
```
.title {
    color: yellowgreen;
}

:global(.global-title) {
    color: red
}
```
webpack打包后，
```
.lfEzW-QkJuIZ6SnG6kM-b {
    color: yellowgreen;
}

.global-title {
    color: red
}
```
CSS Modules还提供一种显式的局部作用域语法`:local(.className)`，等同于`.className`，index.css也可以写成下面这样:
```
:local(.title) {
    color: yellowgreen;
}

:global(.global-title) {
    color: red
}
```
上面的.title依旧会进行编码
## 定制哈希类名
css-loader默认的哈希算法是`[base:hash64]`,它提供了参数可以定制哈希字符串的格式：
```
{
    loader: "css-loader",
    options: {
      // 开启css modules
      modules: true,
      // 定制生成的哈希码
      localIdentName: "[path][name]__[local]--[hash:base64:5]"
    }
}
```
重新打包后，生成的类名如下:
```
.src-index__title--lfEzW {
    color: yellowgreen;
}
```
## composition class
在css modules模式中，一个选择器可以继承另一个选择器的样式，这样称为"组合"<br/>
在index.css中，写如下代码：
```
.background {
    background: orange
}

:local(.title) {
    /* 继承background的样式 */
    composes: background;
    color: yellowgreen;
}
```
在js中导入index.css，输入：
```
import index from "./index.css";
console.log(index);
```
发现在控制台title属性下有两个类名
```
{background: "src-index__background--3LW6J", title: "src-index__title--lfEzW src-index__background--3LW6J"}
```
上面代码中，使用`composes`继承了`.background`的样式，webpack打包后
## 导入其它模块
在选择器中可以导入其他的css文件，继承导入文件的样式<br/>
在index.css中导入other中的样式，
```
.header {
    <!-- 导入其它文件的样式写多个composes -->
    composes: fontSize from './other.css';
    composes: m-20 from './other.css';
    padding: 30px;
}
```
打包后在控制台输出的是
```
{title:_1JD7jO99Sd8C4dvhJW67W6 _3L9cnEVVB3RSfKoY5N5Hnj _2weTNhZdTzd4IqA_8_z35_}
```
## 输入变量
CSS Modules 支持使用变量，不过需要安装 PostCSS 和 [postcss-modules-values](https://cnpmjs.org/package/postcss-modules-values/v/3.0.0)。<br/>
配置webpack:
```
const webpack = require("webpack");
const postcssModulesValues = require("postcss-modules-values");
module.exports = {
  module: {
    rules: [
      {
            ...
            "postcss-loader"
        ]
      }
    ]
  },
  plugins: [
    //配置自定义属性
    new webpack.LoaderOptionsPlugin({
      test: /\.css$/,
      options: {
        postcss: [postcssModulesValues]
      }
    })
  ]
};
```
定义变量css,constants.css
```
@value b: #0c77f8;
@value r: #ff0000;
@value g: #aaf200;
```
在index.css中使用：
```
// 导入样式
@value constants: './constants.css';
//解构
@value b,r,g from constants;
:global(.global-title) {
    color: g;
}
```
webpack打包后，g将会变成对应的颜色