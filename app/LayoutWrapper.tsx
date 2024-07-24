import React, {
  Children,
  cloneElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { Animated, findNodeHandle, View } from "react-native";

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
  const [nodeLayout, setNodeLayout] = useState<any>();

  const [endNodeLayout, setEndNodeLayout] = useState<any>();

  // const translateCoordinate = useSharedValue<any>(startNodeLayout);
  let startNodeCoor;
  let endNodeCoor;

  // console.log("layout", endNode);

  const animatedStyle = nodeLayout
    ? {
        transform: [
          {
            translateY: nodeLayout.y,
          },
          {
            translateX: nodeLayout.x,
          },
        ],
      }
    : null;

  useEffect(() => {
    if (ref && startNode) {
      setTimeout(() => {
        startNode.ref?.current?.measureLayout(
          findNodeHandle(ref.current),
          (x, y, width, height) => {
            console.log("got measurement startnode", x, y, width, height);

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
            console.log("got measurement endnode", x, y, width, height);
            setEndNodeLayout({ x, y });
            // runOnUI(() => {
            //   translateCoordinate.value = { x, y };
            // })();
            // endNodeCoor = { x: x, y: y, width: width, height: height };
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
              top:
                isEnabled && endNodeLayout
                  ? endNodeLayout.y
                  : startNodeLayout.y,
              left:
                isEnabled && endNodeLayout
                  ? endNodeLayout.x
                  : startNodeLayout.x,
            },
            // animatedStyle,
          ]}
        >
          {startNode.element}
        </Animated.View>
      )}
    </View>
  );
};
