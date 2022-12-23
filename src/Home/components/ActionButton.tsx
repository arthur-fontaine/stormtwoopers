import { Image, Pressable, View, StyleSheet, ImageSourcePropType, ViewStyle } from "react-native"
import Animated, { AnimatedStyleProp, useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated"

import { colors } from "../../shared/colors"

export default ({ icon, onPress, style }: { icon: ImageSourcePropType, onPress: () => void, style: AnimatedStyleProp<ViewStyle> }) => {
  return (
    <Pressable onPress={onPress}>
      <Animated.View style={[styles.action, style]}>
        <Image source={icon} style={styles.actionIcon} />
      </Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  action: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.white.normal,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    elevation: 6,
    shadowColor: colors.black.normal,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.7,
    shadowRadius: 7,
  },
  actionIcon: {
    width: '100%',
    height: '100%',
    resizeMode: "contain",
  },
})
