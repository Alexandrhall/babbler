import React, { ElementType } from "react";
import { useAuth } from "../contexts/authContext";
import { useAppSelector } from "../redux/hooks";
import router from "next/router";

const withAuth = (Component: ElementType) => {
  const AuthComponent = () => {
    const user = useAuth();
    const auth = useAppSelector((state) => state.auth);

    if (user === null && auth.user.id === "") {
      router.push("/login");
      return null;
    } else {
      return <Component />;
    }
  };

  return AuthComponent;
};

export default withAuth;
