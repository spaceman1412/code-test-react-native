import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, InteractionManager } from "react-native";

const CloneWithAbsolutePosition = ({ children }: any) => {
  const [layout, setLayout] = useState(null);

  // Ensure there is only one child
  if (React.Children.count(children) !== 1) {
    console.error("CloneWithAbsolutePosition expects exactly one child.");
    return null;
  }

  // Clone the child with additional style
  const child = React.Children.only(children);
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
      {clonedChild}
    </>
  );
};

const styles = StyleSheet.create({
  absolute: {
    position: "absolute",
  },
});

export default CloneWithAbsolutePosition;
