import React, { cloneElement, useEffect, useRef } from "react";
import { Children } from "react";

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

  const ChildrenHiddenWithRef = cloneElement(element, {
    ref: ref,
    style: [{ opacity: 0 }, element.props.style],
  });

  return (
    // <View ref={ref} style={{ opacity: 0 }}>
    //   {children}
    // </View>
    <>{ChildrenHiddenWithRef}</>
  );
};
