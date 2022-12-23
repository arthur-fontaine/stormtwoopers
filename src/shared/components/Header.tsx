import { useAssets } from "expo-asset"
import { Image, ImageSourcePropType, StyleSheet, View, ViewStyle } from "react-native"

import { colors } from "../colors"

export default ({ style }: { style?: ViewStyle }) => {
  const image = useAssets(require("../../../assets/icon.png"))[0]?.[0]

  return <View style={[styles.header, style]}>
    <Image source={image as ImageSourcePropType} style={styles.headerIcon} />
  </View>
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.white.normal,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    padding: 24,
  },
  headerIcon: {
    width: 48,
    height: 48,
  },
})
