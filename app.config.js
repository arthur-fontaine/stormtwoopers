module.exports = {
  expo: {
    name: "stormtwoopers",
    slug: "stormtwoopers",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#1DA1F2"
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      showLogs: process.env.LOG != 0,
      eas: {
        projectId: "6b666bc5-ca31-4d31-9833-e242af69082f"
      }
    },
    owner: "arthur-fontaine"
  }
}
