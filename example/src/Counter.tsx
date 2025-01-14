import { useState } from 'react';
import { Pressable, Text } from 'react-native';

const Counter = () => {
  const [count, setCount] = useState(0);
  return (
    <Pressable
      onPress={() => {
        setCount((prev) => prev + 1);
      }}
      style={{
        height: 50,
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>{count}</Text>
    </Pressable>
  );
};

export default Counter;
