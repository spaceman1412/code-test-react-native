import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  SafeAreaView,
  Pressable,
  ScrollView,
} from "react-native";
import Animated, {
  MeasuredDimensions,
  SharedTransition,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { TestNodeWrapper } from "../TestNodeWrapper";
import { LayoutWrapper } from "../LayoutWrapper";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView
        style={{}}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          paddingTop: 24,
        }}
      >
        <TodoItem />
        <View style={{ height: 10 }} />
        <TodoItem />
        <View style={{ height: 10 }} />

        <TodoItem />
        <View style={{ height: 10 }} />

        <TodoItem />
        <View style={{ height: 10 }} />

        <TodoItem />
        <View style={{ height: 10 }} />

        <TodoItem />
      </ScrollView>
      {/* </View> */}
    </SafeAreaView>
  );
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const TodoItem = () => {
  const [status, setStatus] = React.useState<"open" | "closed">("closed");

  const measurementValue = useSharedValue<MeasuredDimensions | null>(null);
  const transformY = useSharedValue(0);
  const [startNode, setStartNode] = useState<any[]>([]);
  const [endNode, setEndNode] = useState<any[]>([]);
  const [nodeArr, setNodeArr] = useState<any[]>([]);

  let testStartNode;
  let testEndNode;

  const isEnabled = useSharedValue(false);

  const onPress = () => {
    if (isEnabled.value === false) {
      height.value = withTiming(250);
      isEnabled.value = true;
      transformY.value = withTiming(17);
    } else if (isEnabled.value === true) {
      height.value = withTiming(150);
      isEnabled.value = false;

      transformY.value = withTiming(0);
    }
  };

  useEffect(() => {
    if (startNode.length === endNode.length) {
      startNode.forEach((element, index) => {
        if (element.shareId === endNode[index].shareId) {
          setNodeArr((prev) => [
            ...prev,
            {
              startNode: element,
              endNode: endNode[index],
              shareId: element.shareId,
            },
          ]);
        }
      });
    }
  }, [startNode, endNode]);

  const height = useSharedValue(150);

  const transition = SharedTransition.custom((values) => {
    "worklet";
    return {
      height: withSpring(values.targetHeight),
      width: withSpring(values.targetWidth),
    };
  });

  return (
    <AnimatedPressable
      style={{
        width: "80%",
        height: height,
        backgroundColor: "white",
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 50,
      }}
      onPress={onPress}
    >
      <LayoutWrapper
        startNode={startNode[0]}
        endNode={endNode[0]}
        nodeArr={nodeArr}
        isEnabled={isEnabled}
        startNodeContainer={<ClosedContent setStartNode={setStartNode} />}
        endNodeContainer={<OpenContent setEndNode={setEndNode} />}
        sharedTransitionStyle={transition}
      />
    </AnimatedPressable>
  );
};

const OpenContent = ({ setEndNode }: any) => {
  return (
    <Animated.View style={{ flex: 1 }}>
      <View style={{ width: "100%", alignItems: "flex-end" }}>
        <Text>Xoa</Text>
      </View>

      <View style={{ height: 20 }} />
      <TestNodeWrapper
        onNode={(node) => {
          setEndNode((prev) => [...prev, node]);
        }}
        shareId={"text"}
      >
        <Text
          style={{ fontSize: 24, fontWeight: "bold", color: "red" }}
          onLayout={(e) => {}}
        >
          Task 1
        </Text>
        {/* <Image
          source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
          style={{ width: 100, height: 100, resizeMode: "stretch" }}
        /> */}
        {/* <View
          style={{
            width: 50,
            height: 100,
            backgroundColor: "pink",
            transform: [{ rotateX: "10deg" }, { translateX: 30 }],
          }}
        /> */}
      </TestNodeWrapper>
      <View style={{ height: 20 }} />

      <TestNodeWrapper
        onNode={(node) => {
          setEndNode((prev) => [...prev, node]);
        }}
        shareId={"text2"}
      >
        <Text
          style={{ fontSize: 16, fontWeight: "bold", color: "black" }}
          onLayout={(e) => {}}
        >
          Task 1
        </Text>
      </TestNodeWrapper>
      <Button title="Xong" />
    </Animated.View>
  );
};

const ClosedContent = ({ setStartNode }) => {
  return (
    <Animated.View style={[{ flexDirection: "row", flex: 1 }]}>
      <View
        style={{
          width: 20,
          height: 20,
          backgroundColor: "gray",
          borderRadius: 5,
        }}
      />
      <View style={{ marginStart: 16 }}>
        {/* //TODO: Create a wrapper component for the user more convenient */}

        <TestNodeWrapper
          onNode={(node) => {
            setStartNode((prev) => [...prev, node]);
          }}
          shareId={"text"}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "black" }}>
            Task 1
          </Text>

          {/* <Image
            source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
            style={{ width: 100, height: 50, resizeMode: "stretch" }}
          /> */}

          {/* <View
            style={[
              {
                width: 50,
                height: 50,
                backgroundColor: "black",
                transform: [{ translateX: 45 }, { rotateX: "100deg" }],
              },
            ]}
            // style={{
            //   width: 50,
            //   height: 50,
            //   backgroundColor: "red",
            // }}
          /> */}
        </TestNodeWrapper>

        <TestNodeWrapper
          onNode={(node) => {
            setStartNode((prev) => [...prev, node]);
          }}
          shareId={"text2"}
        >
          <Text style={{ color: "green", marginTop: 16 }}>Uu tien cao</Text>
        </TestNodeWrapper>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "yellow",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    color: "white",
  },
});
