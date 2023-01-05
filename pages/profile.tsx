import React from "react";
import Navbar from "../src/components/Navbar";
import { useAppSelector } from "../src/redux/hooks";

const profile = () => {
  const auth = useAppSelector((state) => state.auth);
  return (
    <>
      <Navbar />
      <div className="text-white">
        <p>{auth.user.email}</p>
        <p>{auth.user.username}</p>
        <p>{auth.user.role}</p>
      </div>
    </>
  );
};

export default profile;
