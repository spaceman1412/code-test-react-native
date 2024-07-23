import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, InteractionManager, Text } from "react-native";
import Animated from "react-native-reanimated";
import { opacity } from "react-native-reanimated/lib/typescript/reanimated2/Colors";

const CloneTextAbsolute = ({ children }: any) => {
  const [layout, setLayout] = useState(null);

  // Ensure there is only one child
  if (React.Children.count(children) !== 1) {
    console.error("CloneWithAbsolutePosition expects exactly one child.");
    return null;
  }

  const childText = CloneText({});

  // Clone the child with additional style
  const child = React.Children.only(childText);
  const refChild = React.cloneElement(child, {
    style: [{ opacity: 0 }, child.props.style],
    onLayout: (e) => {
      const { x, y, width, height } = e.nativeEvent.layout;
      setLayout({ x, y, width, height });
    },
  });
  const clonedChild = layout
    ? React.cloneElement(child, {
        style: [
          child.props.style,
          styles.absolute,
          { top: layout.y, left: layout.x },
        ],
      })
    : null;

  console.log("child", child);

  console.log("cloneChild", clonedChild);
  console.log("layout", layout);

  return (
    <>
      {refChild}
      <CloneText style={[styles.absolute, { top: layout.y, left: layout.x }]} />

      {/* <CloneText style={{ opacity: 0 }} /> */}

      {/* <CloneText style={{ position: "absolute" }} /> */}
    </>
  );
};

const styles = StyleSheet.create({
  absolute: {
    position: "absolute",
  },
});

const CloneText = ({ style }) => (
  <Animated.View style={[{ flexDirection: "row", flex: 1 }, style]}>
    <View
      style={{
        width: 20,
        height: 20,
        backgroundColor: "gray",
        borderRadius: 5,
      }}
    />
    <View style={{ marginStart: 16 }}>
      <Animated.Text style={{ fontSize: 16, fontWeight: "bold" }}>
        Task 1
      </Animated.Text>
      <Text style={{ color: "green", marginTop: 16 }}>Uu tien cao</Text>
    </View>
  </Animated.View>
);

export default CloneTextAbsolute;
