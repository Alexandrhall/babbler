import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import router from "next/router";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { login, useAuth } from "../contexts/authContext";
import { updateDetails } from "../redux/auth";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

function Login() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const user = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      await login(emailRef.current!.value, passwordRef.current!.value);
    } catch {
      dispatch(
        updateDetails({
          user: {
            id: "",
            role: "",
            email: "",
            username: "",
          },
          msg: "Failed to login",
        })
      );
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (user && auth.user.id !== "") {
      router.push("/");
    }
  }, [auth, user]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card
        sx={{
          width: "500px",
          height: "420px",
          borderRadius: "10px",
          backgroundColor: "#313131",
        }}
      >
        <CardContent>
          <form onSubmit={handleSubmit}>
            <input type="email" ref={emailRef} required />
            <input type="password" ref={passwordRef} required />
            <button type="submit">Login</button>
          </form>
          <p>login {count}</p>
        </CardContent>
      </Card>
      <Button
        variant="contained"
        onClick={() => {
          if (user) {
            router.push("/");
          }
        }}
      >
        Home
      </Button>
    </div>
  );
}

export default Login;
