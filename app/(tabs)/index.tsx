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
  useSharedValue,
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
  const [startNode, setStartNode] = useState<any>();
  const [endNode, setEndNode] = useState<any>();

  const isEnabled = status === "open" ? true : false;

  const onPress = () => {
    if (status === "closed") {
      height.value = withTiming(250);
      setStatus("open");
      transformY.value = withTiming(17);
    } else if (status === "open") {
      height.value = withTiming(150);
      setStatus("closed");
      transformY.value = withTiming(0);
    }
  };

  useEffect(() => {}, []);

  const height = useSharedValue(150);

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
        startNode={startNode}
        endNode={endNode}
        isEnabled={isEnabled}
        startNodeContainer={
          <ClosedContent
            onNode={(node) => {
              setStartNode(node);
            }}
          />
        }
        endNodeContainer={
          <OpenContent
            onNode={(node) => {
              setEndNode(node);
            }}
          />
        }
      />
    </AnimatedPressable>
  );
};

const OpenContent = ({ onNode }: any) => {
  return (
    <Animated.View style={{ flex: 1 }}>
      <View style={{ width: "100%", alignItems: "flex-end" }}>
        <Text>Xoa</Text>
      </View>

      <View style={{ height: 20 }} />
      <TestNodeWrapper onNode={onNode}>
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

      <Text style={{ fontSize: 16, fontWeight: "bold" }} onLayout={(e) => {}}>
        Task 1
      </Text>
      <Button title="Xong" />
    </Animated.View>
  );
};

const ClosedContent = ({ onNode }) => {
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

        <TestNodeWrapper onNode={onNode}>
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
        <Text style={{ color: "green", marginTop: 16 }}>Uu tien cao</Text>
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
