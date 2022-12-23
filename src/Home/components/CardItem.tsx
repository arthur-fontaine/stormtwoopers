// https://github.com/Stormotion-Mobile/react-native-card-stack/blob/master/src/components/CardItem.tsx

import React, { memo, useMemo } from "react";
import {
  StyleProp,
  useWindowDimensions,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";

type ItemProps = Pick<ViewProps, "style"> & {
  children: React.ReactNode;
  key: string;
};

const CardItem = ({ children, style }: ItemProps) => {
  const { width: screenWidth } = useWindowDimensions();

  const containerStyle = useMemo<StyleProp<ViewStyle>>(
    () => [{ width: screenWidth - 16 * 2 }, style],
    [screenWidth, style]
  );

  return (
    <View style={containerStyle}>
      {children}
    </View>
  );
};

export default memo(CardItem);
