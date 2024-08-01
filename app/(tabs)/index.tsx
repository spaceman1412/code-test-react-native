import React, {
  ComponentClass,
  ComponentType,
  FunctionComponent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  FlatList,
  SafeAreaView,
  Pressable,
  ScrollView,
  TextInput,
  findNodeHandle,
  TouchableOpacity,
  Image,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInLeft,
  FadeOut,
  measure,
  MeasuredDimensions,
  runOnUI,
  useAnimatedRef,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import CloneWithAbsolutePosition from "./CloneWithAbsolutePosition";
import { AnimatedComponentRef } from "react-native-reanimated/lib/typescript/createAnimatedComponent/commonTypes";

import CloneTextAbsolute from "./CloneTextAbsolute";
import Wrapper from "../Wrapper";
import { createAnimatedComponent } from "react-native-reanimated/lib/typescript/createAnimatedComponent";
import { StartNodeWrapper, TestWrapper } from "../StartNodeWrapper";
import { EndNodeWrapper } from "../EndNodeWrapper";
import { TestNodeWrapper } from "../TestNode";
import { LayoutWrapper } from "../LayoutWrapper";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* <View
        style={{
          width: "100%",
          height: 50,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={styles.title}>Todo list</Text>
      </View> */}

      {/* <View style={{ flex: 1, alignItems: "center", paddingTop: 24 }}> */}
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
        {/* <Text
          style={{ fontSize: 16, fontWeight: "bold", color: "black" }}
          onLayout={(e) => {}}
        >
          Task 1
        </Text> */}
        {/* <Image
          source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
          style={{ width: 100, height: 100, resizeMode: "stretch" }}
        /> */}
        <View
          style={{
            width: 50,
            height: 100,
            backgroundColor: "pink",
            transform: [{ rotateX: "10deg" }, { translateX: 30 }],
          }}
        />
      </TestNodeWrapper>
      <View style={{ height: 20 }} />

      <Text style={{ fontSize: 16, fontWeight: "bold" }} onLayout={(e) => {}}>
        Task 1
      </Text>
      <Button title="Xong" />
    </Animated.View>
  );
};

const ClosedContentTest = ({ status }) => {
  const [startNode, setStartNode] = useState<any>();
  const [endNode, setEndNode] = useState<any>();

  if (startNode) {
    // console.log(startNode.layout);
  }

  return (
    <>
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
          <StartNodeWrapper
            onNode={(node) => setStartNode(node)}
            endNode={endNode}
            isStart={status === "open" ? true : false}
          >
            <TouchableOpacity onPress={() => console.log("start node")}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>Task 1</Text>
            </TouchableOpacity>
          </StartNodeWrapper>

          <EndNodeWrapper
            onNode={(node) => setEndNode(node)}
            isStart={status === "open" ? true : false}
          >
            <TouchableOpacity onPress={() => console.log("end node")}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>Task 1</Text>
            </TouchableOpacity>
          </EndNodeWrapper>
          <Text style={{ color: "green", marginTop: 16 }}>Uu tien cao</Text>
        </View>
      </Animated.View>

      {/* {startNode && (
        <View
          style={[
            { backgroundColor: "black", width: 10, height: 10 },
            StyleSheet.absoluteFill,
            { left: startNode.layout.x, top: startNode.layout.y },
          ]}
        />
      )} */}
    </>
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
          {/* <Text style={{ fontSize: 16, fontWeight: "bold", color: "black" }}>
            Task 1
          </Text> */}

          {/* <Image
            source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
            style={{ width: 100, height: 50, resizeMode: "stretch" }}
          /> */}

          <View
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
          />
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
