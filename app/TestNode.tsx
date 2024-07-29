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
  measure,
  runOnUI,
  useAnimatedRef,
  useAnimatedStyle,
  withDelay,
  withTiming,
} from "react-native-reanimated";

export const TestNodeWrapper = ({ onNode, children }) => {
  const element = Children.only(children);
  const ref = useRef<any>();
  // const [delayIsStart, setDelayIsStart] = useState(isStart);

  // useEffect(() => {
  //   if (isStart) {
  //     setTimeout(() => setDelayIsStart(isStart), 300);
  //   } else setDelayIsStart(isStart);
  // }, [isStart]);

  React.Children.forEach(children, (element) => {
    if (!React.isValidElement(element)) return;
  });

  useEffect(() => {
    if (ref) {
      const node = { element: element, ref: ref };
      if (ref.current !== null) {
        onNode(node);
      }
    }
  }, [ref]);

  return (
    <View ref={ref} style={{ opacity: 0 }}>
      {children}
    </View>
  );
};
