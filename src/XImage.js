import React, {
  Component,
  PropTypes,
  Image,
} from 'react-native';
import { storage } from './Storage';

export default class XImage extends Component {
  static propTypes = {
    url: PropTypes.string,
    defaultSource: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
    ]),
  };

  state = {
    loaded: false,
    loading: false,
  };

  componentWillMount() {
    const { url } = this.props;

    if (url) {
      this.loadLocalImage(url);
    }
  }

  loadLocalImage(url) {
    this.setState({loading: true});
    storage
      .load(url)
      .then(filePath => {
        this.setState({
          loading: false,
          loaded: true,
          source: {
            uri: `file:///${filePath}`,
          },
        });
      });
  }

  renderDefaultImage() {
    const { url, defaultSource, ...rest } = this.props;

    return (<Image
      {...rest}
      source={defaultSource}
    />);
  }

  renderLocalImage() {
    const { url, defaultSource, ...rest } = this.props;
    const { source } = this.state;

    return (<Image
      {...rest}
      source={source}
    />);
  }

  render() {
    const { loading, loaded } = this.state;
    let element;

    if (loading || !loaded) {
      element = this.renderDefaultImage();
    } else {
      element = this.renderLocalImage();
    }

    return element;
  }
}
