import React, {
  cloneElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  findNodeHandle,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

// Check for first mount
export const useIsMount = () => {
  const isMountRef = useRef(true);
  useEffect(() => {
    isMountRef.current = false;
  }, []);
  return isMountRef.current;
};

type NodeTransform = {
  transform?: any;
  backgroundColor?: string;
  color?: string;
  fontSize?: number;
};

const getTransformWithKey = (transformMatrix, key) => {
  let value = null;

  if (transformMatrix) {
    transformMatrix?.forEach((element) => {
      if (element[key]) {
        value = element[key];
      }
    });

    return value;
  } else return null;
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

  const [startNodeTransform, setStartNodeTransform] = useState<NodeTransform>();
  const [endNodeTransform, setEndNodeTransform] = useState<NodeTransform>();

  const translateXStartNode = getTransformWithKey(
    startNodeTransform?.transform,
    "translateX"
  );
  const translateYStartNode = getTransformWithKey(
    startNodeTransform?.transform,
    "translateY"
  );

  const translateXEndNode = getTransformWithKey(
    endNodeTransform?.transform,
    "translateX"
  );
  const translateYEndNode = getTransformWithKey(
    endNodeTransform?.transform,
    "translateY"
  );

  const color = (() => {
    if (
      startNodeTransform?.backgroundColor &&
      endNodeTransform?.backgroundColor
    ) {
      return interpolateColor(
        isEnabled,
        [0, 1],
        [startNodeTransform.backgroundColor, endNodeTransform.backgroundColor]
      );
    } else return null;
  })();

  const nodeDefaultStyle = (() => {
    let startValue: any[] = [];
    let endValue: any[] = [];
    if (startNodeTransform?.transform) {
      startNodeTransform?.transform.forEach((startNode) => {
        const keyStart = Object.keys(startNode)[0];
        if (keyStart !== "translateX" && keyStart !== "translateY") {
          startValue.push({
            [keyStart]: startNode[keyStart],
          });
        }
      });
    }

    if (endNodeTransform?.transform) {
      endNodeTransform?.transform?.forEach((endNode) => {
        const keyEnd = Object.keys(endNode)[0];
        if (keyEnd !== "translateX" && keyEnd !== "translateY") {
          endValue.push({
            [keyEnd]: endNode[keyEnd],
          });
        }
      });
    }

    return {
      start: startValue,
      end: endValue,
    };
  })();

  // Animated base on position of startNode and endNode
  const animatedStyle = useAnimatedStyle(() => {
    const transformStyle = (() => {
      let value = {};
      if (color) {
        value = {
          ...value,
          backgroundColor: withTiming(color, { duration: 500 }),
        };
      }

      if (startNodeTransform?.fontSize && endNodeTransform?.fontSize) {
        value = {
          ...value,
          fontSize: isEnabled
            ? withTiming(endNodeTransform.fontSize, { duration: 500 })
            : withTiming(startNodeTransform.fontSize, { duration: 500 }),
        };
      }
      if (startNodeTransform?.color && endNodeTransform?.color) {
        value = {
          ...value,
          color: isEnabled
            ? withTiming(endNodeTransform.color, { duration: 500 })
            : withTiming(startNodeTransform.color, { duration: 500 }),
        };
      }

      return value;
    })();

    const nodeDefault = isEnabled
      ? nodeDefaultStyle.end
      : nodeDefaultStyle.start;

    const transformKey = (() => {
      let value: any[] = [];
      if (startNodeTransform?.transform && endNodeTransform?.transform) {
        //TODO: Need to add default style transform for this because the current
        // Transform is override the default style need to modify again

        startNodeTransform?.transform.forEach((startNode) => {
          endNodeTransform?.transform.forEach((endNode) => {
            const keyStart = Object.keys(startNode)[0];
            const keyEnd = Object.keys(endNode)[0];

            if (
              keyStart === keyEnd &&
              keyStart !== "translateX" &&
              keyStart !== "translateY"
            ) {
              value.push({
                [keyStart]: isEnabled
                  ? withTiming(endNode[keyEnd], { duration: 500 })
                  : withTiming(startNode[keyStart], { duration: 500 }),
              });
            }
          });
        });
      }

      return value;
    })();

    return {
      transform: [
        {
          translateY:
            isEnabled && endNodeLayout
              ? withTiming(
                  endNodeLayout.y -
                    startNodeLayout.y +
                    (translateYEndNode ?? 0),
                  { duration: 500 }
                )
              : withTiming(translateYStartNode ?? 0, { duration: 500 }),
        },
        {
          translateX:
            isEnabled && endNodeLayout
              ? withTiming(
                  endNodeLayout.x -
                    startNodeLayout.x +
                    (translateXEndNode ?? 0),
                  { duration: 500 }
                )
              : withTiming(translateXStartNode ?? 0, { duration: 500 }),
        },
        ...nodeDefault,
        ...transformKey,
      ],
      width:
        isEnabled && endNodeLayout
          ? withTiming(endNodeLayout.width, { duration: 500 })
          : withTiming(startNodeLayout?.width, { duration: 500 }),
      height:
        isEnabled && endNodeLayout
          ? withTiming(endNodeLayout.height, { duration: 500 })
          : withTiming(startNodeLayout?.height, { duration: 500 }),
      ...transformStyle,
    };
  });

  useEffect(() => {
    if (startNode) {
      const handleProps = (props: any, type: "start" | "end") => {
        // Style handler
        for (const key in props) {
          if (key === "style") {
            if (props.style.length > 0) {
              let style: ViewStyle & TextStyle = {};

              for (let i = 0; i < props.style.length; i++) {
                // Handle  style
                const propsStyle = props.style[i];
                style = { ...style, ...propsStyle };
              }

              if (style?.backgroundColor) {
                type === "start"
                  ? setStartNodeTransform((prevState) => ({
                      ...prevState,
                      backgroundColor: style?.backgroundColor?.toString(),
                    }))
                  : setEndNodeTransform((prevState) => ({
                      ...prevState,
                      backgroundColor: style?.backgroundColor?.toString(),
                    }));
              }
              if (style.transform) {
                type === "start"
                  ? setStartNodeTransform((prevState) => ({
                      ...prevState,
                      transform: style.transform,
                    }))
                  : setEndNodeTransform((prevState) => ({
                      ...prevState,
                      transform: style.transform,
                    }));
              }

              if (style?.backgroundColor) {
                type === "start"
                  ? setStartNodeTransform((prevState) => ({
                      ...prevState,
                      backgroundColor: style?.backgroundColor?.toString(),
                    }))
                  : setEndNodeTransform((prevState) => ({
                      ...prevState,
                      backgroundColor: style?.backgroundColor?.toString(),
                    }));
              }
              if (style.fontSize) {
                console.log(style.fontSize);
                type === "start"
                  ? setStartNodeTransform((prevState) => ({
                      ...prevState,
                      fontSize: style.fontSize,
                    }))
                  : setEndNodeTransform((prevState) => ({
                      ...prevState,
                      fontSize: style.fontSize,
                    }));
              }

              if (style.color) {
                type === "start"
                  ? setStartNodeTransform((prevState) => ({
                      ...prevState,
                      color: style.color?.toString(),
                    }))
                  : setEndNodeTransform((prevState) => ({
                      ...prevState,
                      color: style.color?.toString(),
                    }));
              }
            } else {
              // Handle single style
              if (props.style.backgroundColor) {
                type === "start"
                  ? setStartNodeTransform((prevState) => ({
                      ...prevState,
                      backgroundColor: props.style.backgroundColor,
                    }))
                  : setEndNodeTransform((prevState) => ({
                      ...prevState,
                      backgroundColor: props.style.backgroundColor,
                    }));
              }
              if (props.style.transform) {
                type === "start"
                  ? setStartNodeTransform((prevState) => ({
                      ...prevState,
                      transform: props.style.transform,
                    }))
                  : setEndNodeTransform((prevState) => ({
                      ...prevState,
                      transform: props.style.transform,
                    }));
              }
              if (props.style.fontSize) {
                type === "start"
                  ? setStartNodeTransform((prevState) => ({
                      ...prevState,
                      fontSize: props.style.fontSize,
                    }))
                  : setEndNodeTransform((prevState) => ({
                      ...prevState,
                      fontSize: props.style.fontSize,
                    }));
              }

              if (props.style.color) {
                type === "start"
                  ? setStartNodeTransform((prevState) => ({
                      ...prevState,
                      color: props.style.color,
                    }))
                  : setEndNodeTransform((prevState) => ({
                      ...prevState,
                      color: props.style.color,
                    }));
              }
            }
          }
        }
      };

      handleProps(startNode.element.props, "start");
      handleProps(endNode.element.props, "end");
    }
  }, [startNode, endNode]);

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

  const TestNodeR = React.forwardRef(
    (props: ViewProps, ref: React.LegacyRef<View>) => {
      const startNodeWithRef =
        startNode &&
        cloneElement(startNode.element, {
          ref: ref,
          style: [startNode.element.props.style, props.style],
        });

      return startNodeWithRef;
    }
  );

  const TestNodeAnimated = Animated.createAnimatedComponent(TestNodeR);

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
    //TODO: Add when finish the animation delete the clone and appear the current node

    //TODO: Do allow multiple animation element in the same layout
    <View ref={ref} style={{ flex: 1 }}>
      <StartNodeComponent />
      <EndNodeComponent />

      {/* {isEnabled ? endNodeContainer : startNodeContainer} */}

      {startNodeLayout && (
        <TestNodeAnimated
          style={[
            {
              position: "absolute",
              top: startNodeLayout.y,
              left: startNodeLayout.x,
              overflow: "hidden",
            },
            animatedStyle,
          ]}
        />
      )}

      {/* <Button onPress={handlePress} title="Click me" /> */}
    </View>
  );
};
