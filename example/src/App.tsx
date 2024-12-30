import { StyleSheet, View, Text } from 'react-native';
import { evaluateJavascript } from 'react-native-esbuild';

setTimeout(() => {
  evaluateJavascript(`console.log("hello");`);
});

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Hello</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
