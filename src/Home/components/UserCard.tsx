import { Image, StyleSheet, Text, View } from "react-native";

import { colors } from "../../shared/colors";
import { TwitterApiClient } from "../../shared/TwitterApiClient";
import CardItem from "./CardItem";

export default ({ user }: { user: NonNullable<Awaited<ReturnType<TwitterApiClient['getFollowing']>>['data']>[number] }) => {
  return <CardItem key={user.id} style={styles.card}>
    <View>
      <View style={styles.header}>
        <Image source={{ uri: undefined }} style={styles.banner} />
        <Image source={{ uri: user.profile_image_url }} style={styles.avatar} />
      </View>
      <View style={styles.names}>
        <Text style={styles.name} numberOfLines={1}>{user.name}</Text>
        <View>
          <Text style={styles.username} numberOfLines={1}>@{user.username}</Text>
          <View>{/* TODO: Follows you */}</View>
        </View>
      </View>
      <Text style={styles.bio} numberOfLines={5}>{user.description}</Text>
    </View>
    {user.public_metrics && <>
      <View style={styles.divider} />
      <View style={styles.stats}>
        <Text style={styles.stat}>{user.public_metrics.followers_count} <Text style={styles.statLabel}>Followers</Text></Text>
        <Text style={styles.stat}>{user.public_metrics.following_count} <Text style={styles.statLabel}>Following</Text></Text>
      </View>
    </>}
  </CardItem>
};

const cardPadding = 24;

const styles = StyleSheet.create({
  card: {
    elevation: 6,
    shadowColor: colors.black.normal,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.7,
    shadowRadius: 7,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: colors.white.normal,
    paddingBottom: cardPadding,
    flex: 1,
  },
  header: {
    height: 128 + 64,
    width: '100%',
    position: 'relative',
    marginBottom: 12,
  },
  banner: {
    width: "100%",
    height: 128,
    backgroundColor: colors.blue.normal,
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    position: "absolute",
    bottom: 0,
    left: '50%',
    marginLeft: -64,
    borderWidth: 3,
    borderColor: colors.white.normal,
  },
  names: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    paddingHorizontal: cardPadding,
  },
  name: {
    fontSize: 32,
    fontFamily: "Lato-Black",
    color: colors.black.normal,
    textAlign: "center",
  },
  username: {
    fontSize: 16,
    fontFamily: "Lato-Regular",
    color: colors.gray.dark,
    textAlign: "center",
  },
  bio: {
    fontSize: 16,
    fontFamily: "Lato-Regular",
    color: colors.black.normal,
    textAlign: "center",
    paddingHorizontal: cardPadding,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray.normal,
    marginVertical: 24,
    marginHorizontal: cardPadding,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: cardPadding,
  },
  stat: {
    fontSize: 16,
    fontFamily: "Lato-Regular",
    color: colors.black.normal,
  },
  statLabel: {
    fontSize: 16,
    fontFamily: "Lato-Regular",
    color: colors.gray.dark,
  },
});