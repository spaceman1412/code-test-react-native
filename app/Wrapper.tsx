import React, {
  useState,
  useRef,
  useEffect,
  cloneElement,
  Component,
  forwardRef,
  ComponentType,
  ReactNode,
} from "react";
import {
  View,
  StyleSheet,
  InteractionManager,
  findNodeHandle,
  UIManager,
} from "react-native";
import CloneWithAbsolutePosition from "./(tabs)/CloneWithAbsolutePosition";
import { createAnimatedComponent } from "react-native-reanimated/lib/typescript/createAnimatedComponent";
import Animated, {
  getRelativeCoords,
  measure,
  runOnUI,
  useAnimatedRef,
} from "react-native-reanimated";
import { opacity } from "react-native-reanimated/lib/typescript/reanimated2/Colors";

type WrapperProps = {
  StartNode: ComponentType<any>;
  EndNode: ComponentType<any>;
  isEnabled?: boolean;
  children?: ReactNode;
};

const Wrapper = ({ StartNode, EndNode, isEnabled, children }: WrapperProps) => {
  const [layout, setLayout] = useState<any | null>(null);

  {
    /* //TODO: Create a wrapper component for the user more convenient */
  }

  // Pass props for startnode and endnode through this component so we can
  // compare it right here and do the animation
  // TODO: Create react forward ref to this component like reanimated

  return (
    <>
      <View
        style={{ flex: 1 }}
        onLayout={(e) => setLayout(e.nativeEvent.layout)}
      >
        {isEnabled ? (
          <EndNode style={{ opacity: 0 }} />
        ) : (
          <StartNode style={{ opacity: 0 }} />
        )}
      </View>

      {layout &&
        (isEnabled ? (
          <EndNode
            style={{
              position: "absolute",
              top: layout.y,
              left: layout.x,
            }}
          />
        ) : (
          <StartNode
            style={{ position: "absolute", top: layout.y, left: layout.x }}
          />
        ))}
    </>
  );
};

const styles = StyleSheet.create({
  absolute: {
    position: "absolute",
  },
});

export default Wrapper;
