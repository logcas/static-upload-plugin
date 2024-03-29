const path = require('path');
const QiniuUploader = require('./uploader/qiniu');
const UpyunUploader = require('./uploader/upyun');
const {
  readFile,
  validator: __validator__,
  filterFile
} = require('./utils');

const __uploader__ = {
  'qiniu': QiniuUploader,
  'upyun': UpyunUploader
};

module.exports = class UploadCdnPlugin {

  /**
   * 
   * @param {object} options 
   * @param {string} options.provider cdn提供者，必填，目前仅支持七牛云，可选项：['qiniu']
   * @param {string} options.config cdn配置信息，必填
   * @param {string} options.path 上传目录，可选，默认为 '/'
   * @param {regx|string|Array<string>} options.include 只上传匹配规则的文件，可选，默认为全部
   * @param {regx|string|Array<string>} options.exclude 不上传匹配规则的文件，可选，默认为空
   */

  constructor(options = {}) {
    if (!options.provider) {
      throw new Error('Cdn Provider should not be empty!');
    }
    if (!Reflect.ownKeys(__uploader__).includes(options.provider)) {
      throw new Error(`${options.provider} is not supported.`);
    }
    this.provider = options.provider;
    const validator = __validator__[this.provider];
    if (!validator || !validator(options.config)) {
      throw new Error('Cdn config is invalid, please check again!');
    }
    this.config = options.config;
    this.path = options.path || '/';
    this.include = options.include || null;
    this.exclude = options.exclude || null;
    this.outputDir = options.outputDir || 'dist';
  }

  apply(complier) {
    complier.plugin('done', () => {
      let fileList = readFile(path.join(process.cwd(), this.outputDir));
      fileList = filterFile(fileList, this.include, this.exclude);
      const inst = new __uploader__[this.provider](this.config);
      fileList.forEach(f => {
        let key = this.path + f[1];
        key = key.replace(/^([\/\\]+)/g, '');
        key = key.replace(/([\/\\]+)/g, '/');
        inst.upload(f[0], key).then(() => {
          console.log(key, '上传成功');
        }).catch(e => {
          console.log(key, '上传失败');
          console.log(e);
        });
      });
    });
  }
}