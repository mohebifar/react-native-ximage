# react-native-ximage
**XImage** is an alternative to react native's Image component with cache support. It offers a component and a storage class.

# Usage
XImage depends on [react-native-fs](https://github.com/johanneslumpe/react-native-fs). You need to install this package frist and link the library using rnpm.

```
npm i -S react-native-fs
rnpm link
```

Then install react-native-ximage:
```
npm i -S react-native-ximage
```

# XImage component
To make XImage download and cache an image, you need to set `url` prop.

```jsx
import XImage from 'react-native-ximage`;

// ...
<XImage url="https://facebook.github.io/react/img/logo_og.png"/>
```

If you want XImage to show a default image while the image is being downloaded or in case for some reason the download process failed, you can set the `defaultSource` prop as well:


```jsx
<XImage 
  url="https://facebook.github.io/react/img/logo_og.png"
  defaultSource={require('./images/defaultLogo.jpg')}
/>
```

# Storage options configuration
XImage by default stores the downloaded images in `BASE_DIR/.images/` and hashes the URL with md5. If you want to change any of those options you can call two methods on Storage singleton.

```
import { Storage } from 'react-native-ximage';
import sha512 from 'some-crypt-lib';

Storage.storage.setCacheDirectory('path/to');
Storage.storage.setHashFunction(sha512);
```
