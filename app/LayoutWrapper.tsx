import React, {
  Children,
  cloneElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { findNodeHandle, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

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
  const [onAnimation, setOnAnimation] = useState(false);
  const [currentNode, setCurrentNode] = useState<"start" | "end">("start");

  const isMount = useIsMount();

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
    if (isMount) {
      return;
    } else {
      setOnAnimation(true);
    }
  }, [isEnabled]);

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

  const updateOnAnimation = () => {
    setOnAnimation(false);
  };

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

  useEffect(() => {
    if (isEnabled) {
      console.log("called");
      setTimeout(() => setCurrentNode("end"), 500);
    } else if (!isEnabled) {
      setTimeout(() => setCurrentNode("start"), 500);
    }
  }, [isEnabled]);

  console.log("onAnimation", onAnimation);

  return (
    <View ref={ref} style={{ flex: 1 }}>
      {/* {currentNode === "start" ? <StartNodeComponent /> : <EndNodeComponent />} */}
      {/* {!isEnabled ? <StartNodeComponent /> : <EndNodeComponent />} */}
      <StartNodeComponent />
      <EndNodeComponent />

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
          {isEnabled && endNode ? endNode.element : startNode.element}
        </Animated.View>
      )}
    </View>
  );
};
