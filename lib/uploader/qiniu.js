const qn = require('qn');

const defaultConfig = {
  uploadURL: 'http://up-z2.qiniup.com'
};

module.exports = class QiniuUploader {
  constructor(config) {
    this.instance = qn.create(Object.assign({}, defaultConfig, config));
  }

  upload(filePath, key) {
    return new Promise((resolve, reject) => {
      this.instance.uploadFile(filePath, { key }, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  }
};