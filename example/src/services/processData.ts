import Clipboard from '@react-native-clipboard/clipboard';

const processData = (data: string) => {
  Clipboard.setString(data);
};

export default processData;
