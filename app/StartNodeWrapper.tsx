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
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { createAnimatedComponent } from "react-native-reanimated/lib/typescript/createAnimatedComponent";

export const StartNodeWrapper = ({ onNode, children, endNode, isStart }) => {
  const element = Children.only(children);
  const [layout, setLayout] = useState<any>();
  const translateY = useSharedValue<number>(0);
  const [delayIsStart, setDelayIsStart] = useState(isStart);

  React.Children.forEach(children, (element) => {
    if (!React.isValidElement(element)) return;
  });

  const hideChildren = cloneElement(element, {
    style: { opacity: 0 },
  });

  useEffect(() => {
    if (isStart) {
      setTimeout(() => setDelayIsStart(isStart), 300);
    } else setDelayIsStart(isStart);
  }, [isStart]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withTiming(translateY.value) }],
  }));

  const positionAbsoluteChildren = layout
    ? cloneElement(element, {
        style: [element.props.style],
      })
    : null;

  useEffect(() => {
    console.log("layout change", layout);
    const node = { element: element.props, ...layout };
    if (layout) onNode(node);
  }, [layout]);

  useEffect(() => {
    if (isStart && endNode && endNode.layout.y)
      translateY.value = endNode.layout.y;
    else translateY.value = 0;
  }, [isStart]);

  return (
    <View
      onLayout={({ nativeEvent }) => {
        setLayout(nativeEvent);
      }}
    >
      {hideChildren}

      {!delayIsStart && layout && (
        <Animated.View
          style={[
            {
              position: "absolute",
              top: layout.x,
              left: layout.y,
            },
            animatedStyle,
          ]}
        >
          {positionAbsoluteChildren}
        </Animated.View>
      )}
    </View>
  );
};
