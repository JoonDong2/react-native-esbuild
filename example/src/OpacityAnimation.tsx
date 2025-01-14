import { useEffect } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const OpacityAnimation = () => {
  const opacity = useSharedValue(0);

  const style = useAnimatedStyle(() => {
    return {
      height: '100%',
      width: '100%',
      backgroundColor: 'tomato',
      opacity: opacity.value,
    };
  });

  const reset = () => {
    opacity.value = 0;
    opacity.value = withTiming(1, { duration: 5000 });
  };

  useEffect(() => {
    reset();
  }, []);

  return (
    <Pressable style={{ height: 50, width: '100%' }} onPress={reset}>
      <Animated.View style={style} />
    </Pressable>
  );
};

export default OpacityAnimation;
