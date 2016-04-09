import fs from 'react-native-fs';
import md5 from 'blueimp-md5';

const singleton = Symbol();
const singletonEnforcer = Symbol();

export default class Storage {
  constructor(enforcer) {
    if (enforcer !== singletonEnforcer) {
      throw new Error('Cannot construct an object of Storage');
    }

    this.hashFunction = md5;
    this.setCacheDirectory('images');
  }

  static get singleton() {
    if (!this[singleton]) {
      this[singleton] = new Storage(singletonEnforcer);
    }

    return this[singleton];
  }

  setCacheDirectory(directory) {
    this.cacheDirectory = directory;
    this.createCacheDirectory();
  }

  getCacheDirectory() {
    return `${fs.DocumentDirectoryPath}/${this.cacheDirectory}`;
  }

  createCacheDirectory() {
    fs.mkdir(this.getCacheDirectory());
  }

  setHashFunction(hashFunction) {
    this.hashFunction = hashFunction;
  }

  hashUrl(url) {
    return this.hashFunction(url);
  }

  getFilePath(url) {
    return `${this.getCacheDirectory()}/${this.hashUrl(url)}`;
  }

  download(url) {
    return fs.downloadFile(url, this.getFilePath(url));
  }

  load(url) {
    const filePath = this.getFilePath(url);

    return fs
      .exists(filePath)
      .then(exists => exists ? filePath : this.download(url).then(() => filePath));
  }
}

export const storage = Storage.singleton;
