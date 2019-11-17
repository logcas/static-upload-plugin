const upyun = require('upyun');
const fs = require('fs');

module.exports = class UpyunUploader {

  constructor(config = {}) {
    if (!config.service || !config.operator || !config.password) {
      throw new Error('imcomplete config params');
    }
    const service = new upyun.Service(config.service, config.operator, config.password);
    this.client = new upyun.Client(service);
  }

  upload(filePath, remotePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          reject(err);
        }
        this.client.putFile(remotePath, data).then((res) => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    });
  }

}