// https://github.com/Stormotion-Mobile/react-native-card-stack/blob/master/src/components/Stack.tsx

import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { useWindowDimensions, View, ViewProps, StyleSheet } from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const ROTATION_ANGLE = 60;
const SWIPE_VELOCITY = 800;

export type StackProps<T> = Pick<ViewProps, "style"> & {
  data: T[];
  renderItem: (item: T, index: number) => ReactNode;
  onSwipeRight?: (item: T) => void;
  onSwipeLeft?: (item: T) => void;
};

export default function <T>({ renderItem, data, onSwipeLeft, onSwipeRight, onNoMoreItems, swipeLeftRef, swipeRightRef, currentItemRef }: {
  data: T[];
  renderItem: (item: T, index: number) => ReactNode;
  onSwipeRight?: (item: T) => void;
  onSwipeLeft?: (item: T) => void;
  onNoMoreItems?: () => void;
  swipeLeftRef?: React.MutableRefObject<(() => void) | null>;
  swipeRightRef?: React.MutableRefObject<(() => void) | null>;
  currentItemRef?: React.MutableRefObject<T | null>;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(currentIndex + 1);

  const currentItem = data[currentIndex];
  const nextItem = data[nextIndex];

  currentItemRef && (currentItemRef.current = currentItem);

  if (nextItem === undefined) {
    onNoMoreItems && onNoMoreItems();
  }

  const translateX = useSharedValue(0);

  const { width: screenWidth } = useWindowDimensions();
  const hiddenTranslateX = 2 * screenWidth;

  const rotate = useDerivedValue(() => `${interpolate(translateX.value, [0, hiddenTranslateX], [0, ROTATION_ANGLE])}deg`);

  const swipe = useCallback((velocityX: number) => {
    const onSwipe = velocityX > 0 ? onSwipeRight : onSwipeLeft;

    onSwipe && runOnJS(onSwipe)(currentItem);

    translateX.value = withSpring(
      Math.sign(velocityX) * hiddenTranslateX,
      {},
      () => runOnJS(setCurrentIndex)(currentIndex + 1)
    );
  }, [translateX, onSwipeRight, onSwipeLeft, currentItem, currentIndex]);

  swipeLeftRef && (swipeLeftRef.current = () => { swipe(-SWIPE_VELOCITY); });
  swipeRightRef && (swipeRightRef.current = () => { swipe(SWIPE_VELOCITY); });

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, { startX: number }>({
    onStart: (_, context) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
    },
    onEnd: ({ velocityX }) => {
      if (Math.abs(velocityX) < SWIPE_VELOCITY) {
        translateX.value = withSpring(0);
        return;
      }

      runOnJS(swipe)(velocityX);
    },
  });

  const currentItemAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: rotate.value },
    ],
  }));

  const nextItemAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(translateX.value, [-hiddenTranslateX, 0, hiddenTranslateX], [1, 0.8, 1]) }],
    opacity: interpolate(translateX.value, [-hiddenTranslateX, 0, hiddenTranslateX], [1, 0.6, 1]),
  }));

  useEffect(() => {
    translateX.value = withTiming(0, { duration: 0 }, () => runOnJS(setNextIndex)(currentIndex + 1));
  }, [currentIndex, translateX]);

  return (
    <View style={styles.container}>
      <View style={styles.nextItemContainer}>
        {nextItem && (
          <Animated.View style={nextItemAnimatedStyle}>
            {renderItem(nextItem, nextIndex)}
          </Animated.View>
        )}
      </View>
      <GestureHandlerRootView>
        {currentItem && (
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={currentItemAnimatedStyle}>
              {renderItem(currentItem, currentIndex)}
            </Animated.View>
          </PanGestureHandler>
        )}
      </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: "66%",
  },
  nextItemContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
});
