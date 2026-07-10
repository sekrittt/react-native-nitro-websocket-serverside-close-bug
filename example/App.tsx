/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { useCallback,  useRef, useState } from 'react';
import {
  Button,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NitroWebSocket } from 'react-native-nitro-websockets';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

interface CloseInfo {
  code?: number;
  reason?: string;
  wasClean?: boolean;
}

function AppContent() {
  const websocket = useRef<NitroWebSocket>(null);
  const [lastMessage, setLastMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [closeInfo, setCloseInfo] = useState<CloseInfo | null>(null);

  const connect = useCallback(() => {
    if (websocket.current) return;
    websocket.current = new NitroWebSocket('ws://localhost:8000/socket');
    websocket.current.onclose = ({ code, reason, wasClean }) => {
      setIsConnected(false);
        setCloseInfo({ code, reason, wasClean });
        websocket.current = null
    };
    websocket.current.onmessage = ({ data, isBinary }) => {
      if (!isBinary) {
        setLastMessage(data);
      }
    };
    websocket.current.onopen = () => {
      setIsConnected(true);
      setCloseInfo(null);
      setLastMessage('');
    };
  }, []);

  const sendMessage = useCallback(() => {
    if (!websocket.current || !isConnected) return;
    websocket.current.send(`Message ${Math.floor(Math.random() * 100)}`);
  }, [isConnected]);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        State: {isConnected ? 'connected' : 'disconnected'}
      </Text>
      <Text style={styles.text}>
        Last Messaege: {lastMessage || 'No message'}
      </Text>
      {closeInfo && (
        <View style={{ rowGap: 10 }}>
          {closeInfo.code && (
            <Text style={styles.text}>Code: {closeInfo.code}</Text>
          )}
          {closeInfo.reason && (
            <Text style={styles.text}>Reason: {closeInfo.reason}</Text>
          )}
          {typeof closeInfo.wasClean === 'boolean' && (
            <Text style={styles.text}>
              Was Clean: {closeInfo.wasClean ? 'clean' : 'not clean'}
            </Text>
          )}
        </View>
      )}
      <Button disabled={isConnected} onPress={connect} title="Connect" />
      <Button
        disabled={!isConnected}
        onPress={sendMessage}
        title="Send message"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 10,
    rowGap: 10,
  },
  text: {
    fontSize: 24,
  },
});

export default App;
