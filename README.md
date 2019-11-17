# static-upload-plugin
快捷部署前端静态资源到CDN的Webpack插件

[![Build Status](https://travis-ci.com/logcas/static-upload-plugin.svg?branch=master)](https://travis-ci.com/logcas/static-upload-plugin)

- [x] 七牛云
- [x] 又拍云
- [ ] 阿里云OSS
- [ ] ...More

## 安装
```
npm i static-upload-plugin -D
```

## 使用方法
跟其他的Webpack插件使用方式一样：
```js
const StaticUploadPlugin = require('static-upload-plugin');
module.exports = {
  // 以七牛云为例
  // 其他配置
  plugins: [
    new StaticUploadPlugin({
      provider: 'qiniu',
      config: {
        accessKey: 'xxxxxx',
        secretKey: 'xxxxx',
        bucket: 'xxxxx'
      },
      path: '/testbuild/'
    })
  ]
}
```

## Options
### `options.provider`
CDN服务商，目前可选：qiniu（七牛云）、upyun（又拍云）。必须输入。

### `options.config`
CDN配置信息，对于不同的`provider`配置信息不同。必须输入且完整。

#### 七牛云
```js
{
  accessKey: 'xxxx',
  secretKey: 'xxxx',
  buckcet: 'xxxxx'
}
```

#### 又拍云
```js
{
  operator: 'xxxx', // 操作员
  password: 'xxxx', // 操作员密码
  service: 'xxxxx' // 服务名
}
```

### `options.path`
上传路径，默认为`/`，即上传至`http://www.xxx.com/`位置。可选。

### `options.outputDir`
Webpack出口（ouput）所在位置，相对路径，默认为`dist`，可选。

### `options.include`
过滤器，说明需要上传的文件。支持正则、字符串以及字符串数组的形式，其中字符串、字符串数组作为文件扩展名判断。

例如只上传`css`、`js`文件
```js
{
  // include: ['.css', '.js']
  include: /.(css|js)$/
}
```

### `options.exclude`
过滤器，说明不需要上传的文件。支持正则、字符串以及字符串数组的形式，其中字符串、字符串数组作为文件扩展名判断。

例如不上传`HTML`文件：
```js
{
  // exclude: ['.html']
  exclude: /.html$/
}
```

## License
MIT