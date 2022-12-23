import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors } from "../shared/colors";
import { useTwitterAuthentication } from "./hooks/useTwitterAuthentication";

export default () => {
  const { promptAuth } = useTwitterAuthentication();

  return (
    <View style={styles.container}>
      <Pressable onPress={() => { promptAuth() }}>
        <Text style={styles.loginButton}>Login with Twitter</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white.normal,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "flex-end",
    paddingBottom: 128,
  },
  loginButton: {
    color: colors.blue.normal,
    textDecorationLine: "underline",
    fontFamily: "Lato-Regular",
    fontSize: 16,
  },
});
