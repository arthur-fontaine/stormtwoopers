import { useAssets } from "expo-asset"
import { useCallback, useEffect, useRef } from "react"
import { Dimensions, StyleSheet, View, Text, Pressable, Image, ImageSourcePropType } from "react-native"
import { useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated"

import { colors } from "../shared/colors"
import Header from "../shared/components/Header"
import { useTwitterApiClient } from "../shared/TwitterApiClient"
import ActionButton from "./components/ActionButton"
import Stack from "./components/Stack"
import UserCard from "./components/UserCard"
import { useCurrentUser } from "./hooks/useCurrentUser"
import { useFollowing } from "./hooks/useFollowing"

const Background = () => {
  return <View style={styles.background} />
}

export default () => {
  const twitterApiClient = useTwitterApiClient()

  const { fetchCurrentUser, currentUser } = useCurrentUser()
  const { fetchFollowing, following } = useFollowing()

  const currentItemRef = useRef<NonNullable<(typeof following)>[number] | null>(null)
  const swipeLeftRef = useRef<(() => void) | null>(null)
  const swipeRightRef = useRef<(() => void) | null>(null)

  const heartIcon = useAssets(require("../../assets/icons/heart.png"))[0]?.[0]
  const unfollowIcon = useAssets(require("../../assets/icons/unfollow.png"))[0]?.[0]

  const leftActionButtonScale = useSharedValue(1)
  const rightActionButtonScale = useSharedValue(1)

  const leftActionButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: leftActionButtonScale.value }],
  }))
  const rightActionButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rightActionButtonScale.value }],
  }))

  useEffect(() => {
    fetchCurrentUser()
  }, [])

  useEffect(() => {
    if (currentUser) {
      fetchFollowing(currentUser.id)
    }
  }, [currentUser])

  type Following = NonNullable<(typeof following)>[number]

  const handleSwipe = (handleSwipe: () => void, scale: typeof leftActionButtonScale | typeof rightActionButtonScale) => {
    scale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(1, { duration: 100 }),
    )
    handleSwipe()
  }

  const renderItem = useCallback((item: Following) => <UserCard user={item} />, [])
  const handleSwipeLeft = useCallback((item: Following) => {
    handleSwipe(() => {
    }, leftActionButtonScale)
  }, []);
  const handleSwipeRight = useCallback((item: Following) => {
    handleSwipe(() => {
      currentUser && twitterApiClient.unfollow(currentUser.id, item.id)
    }, rightActionButtonScale)
  }, [currentUser]);

  return <View style={styles.container}>
    <Background />
    <Header style={{ paddingBottom: 0 }} />
    <View style={styles.body}>
      {following && <>
        <Stack
          data={following}
          renderItem={renderItem}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          onNoMoreItems={() => {
            currentUser && fetchFollowing(currentUser.id)
          }}
          currentItemRef={currentItemRef}
          swipeLeftRef={swipeLeftRef}
          swipeRightRef={swipeRightRef}
        />
        <View style={styles.actions}>
          <ActionButton
            icon={heartIcon as ImageSourcePropType}
            onPress={() => {
              swipeLeftRef.current && swipeLeftRef.current()
              currentItemRef.current && handleSwipeLeft(currentItemRef.current)
            }}
            style={leftActionButtonStyle}
          />
          <ActionButton
            icon={unfollowIcon as ImageSourcePropType}
            onPress={() => {
              swipeRightRef.current && swipeRightRef.current()
              currentItemRef.current && handleSwipeRight(currentItemRef.current)
            }}
            style={rightActionButtonStyle}
          />
        </View>
      </>}
    </View>
  </View>
}

const { height: screenHeight } = Dimensions.get("window")
const backgroundCircleSize = screenHeight * 1.2

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white.normal,
    alignItems: "stretch",
    justifyContent: "flex-start",
  },
  background: {
    position: "absolute",
    zIndex: -1,
    bottom: 0,
    left: '50%',
    height: backgroundCircleSize,
    aspectRatio: 1,
    backgroundColor: colors.blue.light,
    borderRadius: backgroundCircleSize,
    transform: [{ translateX: -backgroundCircleSize / 2 }, { translateY: backgroundCircleSize / 2 }],
  },
  body: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    // marginVertical: 64,
  },
})
