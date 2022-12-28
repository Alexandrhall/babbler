import React from "react";
import { useAppSelector } from "../redux/hooks";

const Test = () => {
  const count = useAppSelector((state) => state.counter.value);
  return <h1>{count}</h1>;
};

export default Test;
