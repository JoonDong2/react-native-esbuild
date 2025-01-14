import { View } from 'react-native';
import Counter from './Counter';
import OpacityAnimation from './OpacityAnimation';
import Navigation from './Navigation';

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <Counter />
      {/* <OpacityAnimation /> */}
      {/* <Navigation /> */}
    </View>
  );
}
