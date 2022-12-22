import { NavigationContainerRefWithCurrent } from "@react-navigation/native"
import { Asset, useAssets } from "expo-asset"
import { View, Image, type ImageSourcePropType, Pressable, StyleSheet } from "react-native"

import { InNavbarRoute } from "../../types/Route"

type NavigationRef = NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>

const NavbarButton = ({ route, icons, onPress, navigationRef }: { route?: InNavbarRoute, icons: { active: Asset | undefined, inactive: Asset | undefined }, onPress?: () => void, navigationRef: NavigationRef }) => {
  const currentRoute = navigationRef.isReady() ? navigationRef.getCurrentRoute() : undefined

  const isActive = Boolean((currentRoute && route) && currentRoute.name === route.name)
  const icon = icons[isActive ? "active" : "inactive"] as ImageSourcePropType | undefined

  if (!icon) return null

  return (
    <Pressable onPress={onPress || (route && (() => navigationRef.navigate(route.name as never)))}>
      <View style={[styles.navbarButton, isActive && { backgroundColor: "green" }]}>
        <Image source={icon} style={styles.navbarIcon} />
      </View>
    </Pressable>
  )
}

export default ({ routes, navigationRef }: { routes: InNavbarRoute[]; navigationRef: NavigationRef }) => {
  const assets = [
    ...routes.map(({ icons }) => ({ active: useAssets(icons.active)[0]?.[0], inactive: useAssets(icons.inactive)[0]?.[0] })),
    {
      active: useAssets(require("../../../assets/icons/logout.png"))[0]?.[0],
      inactive: useAssets(require("../../../assets/icons/logout.png"))[0]?.[0],
    }
  ]

  return (
    <View style={styles.navbar}>
      {
        assets && <>
          {routes.map(({ name }, index) => <NavbarButton key={name} route={routes[index]} icons={assets[index]} navigationRef={navigationRef} />)}
          <NavbarButton icons={assets[assets.length - 1]} onPress={() => {}} navigationRef={navigationRef} />
        </>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  navbar: {
    width: "100%",
    height: 80,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 80,
    paddingVertical: 24,
  },
  navbarButton: {
    height: '100%',
    aspectRatio: 1,
  },
  navbarIcon: {
    width: "100%",
    height: "100%",
  },
})
