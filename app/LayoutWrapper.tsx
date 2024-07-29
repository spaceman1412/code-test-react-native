import React, {
  Children,
  cloneElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { findNodeHandle, View, Image } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { createAnimatedComponent } from "react-native-reanimated/lib/typescript/createAnimatedComponent";

// Check for first mount
export const useIsMount = () => {
  const isMountRef = useRef(true);
  useEffect(() => {
    isMountRef.current = false;
  }, []);
  return isMountRef.current;
};

export const LayoutWrapper = ({
  startNode,
  endNode,
  children,
  isEnabled,
  startNodeContainer,
  endNodeContainer,
}: any) => {
  React.Children.forEach(children, (element) => {
    if (!React.isValidElement(element)) return;
  });

  const ref = useRef<any>();
  const [startNodeLayout, setStartNodeLayout] = useState<any>();

  const [endNodeLayout, setEndNodeLayout] = useState<any>();

  // Animated base on position of startNode and endNode
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY:
          isEnabled && endNodeLayout
            ? withTiming(endNodeLayout.y - startNodeLayout.y, { duration: 500 })
            : withTiming(0, { duration: 500 }),
      },
      {
        translateX:
          isEnabled && endNodeLayout
            ? withTiming(endNodeLayout.x - startNodeLayout.x, { duration: 500 })
            : withTiming(0, { duration: 500 }),
      },
    ],

    width:
      isEnabled && endNodeLayout
        ? withTiming(endNodeLayout.width, { duration: 500 })
        : withTiming(startNodeLayout?.width, { duration: 500 }),
    height:
      isEnabled && endNodeLayout
        ? withTiming(endNodeLayout.height, { duration: 500 })
        : withTiming(startNodeLayout?.height, { duration: 500 }),
  }));

  useEffect(() => {
    if (ref) {
      // Measure layout of startNode and endNode
      if (startNode) {
        setTimeout(() => {
          startNode.ref?.current?.measureLayout(
            findNodeHandle(ref.current),
            (x, y, width, height) => {
              setStartNodeLayout({ x, y, width, height });
            },
            () => {
              console.log("measureLayout error");
            }
          );
        }, 0);
      }

      if (endNode) {
        setTimeout(() => {
          endNode.ref?.current?.measureLayout(
            findNodeHandle(ref.current),
            (x, y, width, height) => {
              setEndNodeLayout({ x, y, width, height });
            },
            () => {
              console.log("measureLayout error");
            }
          );
        }, 0);
      }
    }
  }, [startNode, ref, endNode]);

  const animatedStyleStartNode = useAnimatedStyle(
    () => ({
      opacity: isEnabled
        ? withTiming(0, { duration: 400 })
        : withTiming(1, { duration: 300 }),
    }),
    [isEnabled]
  );

  const animatedStyleEndNode = useAnimatedStyle(
    () => ({
      opacity: isEnabled
        ? withTiming(1, { duration: 300 })
        : withTiming(0, { duration: 400 }),
    }),
    [isEnabled]
  );

  const StartNodeComponent = useCallback(
    () => (
      <Animated.View
        style={[
          { flex: 1 },
          animatedStyleStartNode,
          {
            position: "absolute",
            width: "100%",
          },
        ]}
      >
        {startNodeContainer}
      </Animated.View>
    ),
    []
  );

  const EndNodeComponent = useCallback(
    () => (
      <Animated.View
        style={[
          { flex: 1 },
          animatedStyleEndNode,
          { position: "absolute", width: "100%" },
        ]}
      >
        {endNodeContainer}
      </Animated.View>
    ),
    []
  );

  return (
    <View ref={ref} style={{ flex: 1 }}>
      <StartNodeComponent />
      <EndNodeComponent />

      {startNodeLayout && (
        <Animated.View
          style={[
            {
              position: "absolute",
              top: startNodeLayout.y,
              left: startNodeLayout.x,
              overflow: "hidden",
            },
            animatedStyle,
          ]}
        >
          {isEnabled && endNode ? endNode.element : startNode.element}
        </Animated.View>
      )}
    </View>
  );
};
