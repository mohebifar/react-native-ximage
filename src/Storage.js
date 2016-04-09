import fs from 'react-native-fs';
import md5 from 'blueimp-md5';

// simple constructor string param to prevent the user to create instance
const singleton = 'STORAGE_SINGLETON';

export default class Storage {
  constructor(enforcer) {
    if (enforcer !== singleton) {
      throw new Error('Cannot construct an object of Storage');
    }

    this.hashFunction = md5;
    this.setCacheDirectory('.images');
  }

  static get singleton() {
    if (!this[singleton]) {
      this[singleton] = new Storage(singleton);
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
      .then(exists => {
        let result;
        if (exists) {
          result = filePath;
        } else {
          result = this
            .download(url)
            .then(() => filePath);
        }

        return result;
      });
  }
}

export const storage = Storage.singleton;
