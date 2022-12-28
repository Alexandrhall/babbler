import Button from "@mui/material/Button";
import router from "next/router";
import React from "react";
import { useAppSelector } from "../src/redux/hooks";

function login() {
  const count = useAppSelector((state) => state.counter.value);
  return (
    <div>
      <p>login {count}</p>
      <Button
        variant="contained"
        onClick={() => {
          router.push("/");
        }}
      >
        Home
      </Button>
    </div>
  );
}

export default login;
