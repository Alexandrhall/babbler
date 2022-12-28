import Button from "@mui/material/Button";
import router from "next/router";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { login, useAuth } from "../src/contexts/authContext";
import { updateDetails } from "../src/redux/auth";
import { useAppDispatch, useAppSelector } from "../src/redux/hooks";

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
  }, [auth, user, router]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="email" ref={emailRef} required />
        <input type="password" ref={passwordRef} required />
        <button type="submit">Login</button>
      </form>
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

export default Login;
