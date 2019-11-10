const fs = require('fs');
const path = require('path');
const fileList = [];

function readAllFilePath(dir, baseDir = '') {
  if (!fs.existsSync(dir)) {
    throw new Error(`${dir} is not exist.`);
  }
  const files = fs.readdirSync(path.resolve(dir));
  files.forEach(f => {
    const stat = fs.statSync(path.join(dir, f));
    if (stat.isFile()) {
      fileList.push([path.join(dir, f), baseDir + '/' + f]);
    }
    if (stat.isDirectory()) {
      readAllFilePath(path.join(dir, f), baseDir + '/' + f);
    }
  });
}

function validateQiniuConfig(config) {
  if (!config || !config.accessKey || !config.secretKey || !config.bucket) {
    return false;
  }
  return true;
}

function validateUpyunConfig(config) {
  if (!config || !config.operator || !config.password || !config.serviceName) {
    return false;
  }
  return true;
}

function getType(o) {
  return Object.prototype.toString.call(o);
}

function filterFile(fileList, include, exclude) {
  let list = [...fileList];
  if (include) {
    const type = getType(include);
    if (type === '[object RegExp]') {
      list = list.filter(f => {
        return include.test(f);
      });
    }
    if (type === '[object String]') {
      list = list.filter(f => {
        return f.endsWith(include);
      });
    }
    if (type === '[object Array]' && include.length > 0 && getType(include[0]) === '[object String]') {
      list = list.filter(f => {
        return include.some(ext => {
          return f.endsWith(ext);
        });
      });
    }
  }
  if (exclude) {
    const type = getType(exclude);
    if (type === '[object RegExp]') {
      list = list.filter(f => {
        return !exclude.test(f);
      });
    }
    if (type === '[object String]') {
      list = list.filter(f => {
        return !f.endsWith(exclude);
      });
    }
    if (type === '[object Array]' && exclude.length > 0 && getType(exclude[0]) === '[object String]') {
      list = list.filter(f => {
        return exclude.every(ext => {
          return !f.endsWith(ext);
        });
      });
    }
  }
  return list;
}

module.exports = {
  readFile: function (dir) {
    readAllFilePath(dir);
    return fileList;
  },
  validator: {
    'qiniu': validateQiniuConfig,
    'upyun': validateUpyunConfig
  },
  filterFile
};