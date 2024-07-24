import React, {
  Children,
  cloneElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { findNodeHandle, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export const LayoutWrapper = ({
  startNode,
  endNode,
  children,
  isEnabled,
}: any) => {
  React.Children.forEach(children, (element) => {
    if (!React.isValidElement(element)) return;
  });
  const ref = useRef<any>();
  const [startNodeLayout, setStartNodeLayout] = useState<any>();

  const [endNodeLayout, setEndNodeLayout] = useState<any>();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY:
          isEnabled && endNodeLayout
            ? withTiming(endNodeLayout.y - startNodeLayout.y)
            : withTiming(0),
      },
      {
        translateX:
          isEnabled && endNodeLayout
            ? withTiming(endNodeLayout.x - startNodeLayout.x)
            : withTiming(0),
      },
    ],
  }));

  useEffect(() => {
    if (ref && startNode) {
      setTimeout(() => {
        startNode.ref?.current?.measureLayout(
          findNodeHandle(ref.current),
          (x, y, width, height) => {
            setStartNodeLayout({ x, y });
          },
          () => {
            console.log("measureLayout error");
          }
        );
      }, 0);
    }

    if (ref && endNode) {
      setTimeout(() => {
        endNode.ref?.current?.measureLayout(
          findNodeHandle(ref.current),
          (x, y, width, height) => {
            setEndNodeLayout({ x, y });
          },
          () => {
            console.log("measureLayout error");
          }
        );
      }, 0);
    }
  }, [startNode, ref, endNode]);

  return (
    <View ref={ref} style={{ flex: 1 }}>
      {children}
      {startNodeLayout && (
        <Animated.View
          style={[
            {
              position: "absolute",
              top: startNodeLayout.y,
              left: startNodeLayout.x,
            },
            animatedStyle,
          ]}
        >
          {startNode.element}
        </Animated.View>
      )}
    </View>
  );
};
