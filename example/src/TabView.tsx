import { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  AppState,
} from 'react-native';
import type { AppStateStatus } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

const tabItems = [
  {
    title: 'Clipboard',
  },
];

interface Props {
  onPress: (thingToBeTransmitted: string) => void;
}

const TabView = ({ onPress }: Props) => {
  const [clipboardItem, setClipboardItem] = useState<string>('');

  useEffect(() => {
    // 초기 로드 시 클립보드 내용 가져오기
    Clipboard.getString().then((text) => {
      setClipboardItem(text);
    });

    // 앱 상태 변경 이벤트 리스너
    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (nextAppState === 'active') {
          Clipboard.getString().then((text) => {
            console.log('active', text);
            setClipboardItem(text);
          });
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    // 클립보드 내용 변경 감지 리스너
    Clipboard.addListener(() => {
      Clipboard.getString().then((text) => {
        console.log('clipboard changed', text);
        setClipboardItem(text);
      });
    });

    return () => {
      Clipboard.removeAllListeners();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {tabItems.map((item) => (
          <View key={item.title}>
            <Text>{item.title}</Text>
          </View>
        ))}
      </View>

      <View style={styles.contentContainer}>
        <ScrollView>
          <TouchableOpacity
            style={styles.clipboardItem}
            onPress={() => {
              onPress(clipboardItem);
            }}
          >
            <Text>{clipboardItem}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  clipboardItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
});

export default TabView;
