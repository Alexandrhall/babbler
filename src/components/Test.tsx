import React from "react";
import { useAppSelector } from "../redux/hooks";

const Test = () => {
  const count = useAppSelector((state) => state.counter.value);
  return <div>{count}</div>;
};

export default Test;
