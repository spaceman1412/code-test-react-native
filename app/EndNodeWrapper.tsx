import React, {
  cloneElement,
  Component,
  ComponentRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { Children } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withDelay,
  withTiming,
} from "react-native-reanimated";

export const EndNodeWrapper = ({ onNode, children, isStart }) => {
  const element = Children.only(children);
  const [layout, setLayout] = useState<any>();
  const [delayIsStart, setDelayIsStart] = useState(isStart);

  useEffect(() => {
    if (isStart) {
      setTimeout(() => setDelayIsStart(isStart), 300);
    } else setDelayIsStart(isStart);
  }, [isStart]);

  React.Children.forEach(children, (element) => {
    if (!React.isValidElement(element)) return;
  });

  useEffect(() => {
    const node = { element: element.props, ...layout };
    if (layout) onNode(node);
  }, [layout]);

  return (
    <View
      onLayout={({ nativeEvent }) => {
        setLayout(nativeEvent);
      }}
      style={{ opacity: delayIsStart ? 1 : 0 }}
    >
      {children}
    </View>
  );
};
