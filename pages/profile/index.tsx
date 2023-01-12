import React from "react";
import Navbar from "../../src/components/Navbar";
import RoomList from "../../src/components/RoomList";
import withAuth from "../../src/components/withAuth";
import { useAppSelector } from "../../src/redux/hooks";

const Profile = () => {
  const auth = useAppSelector((state) => state.auth);
  return (
    <>
      <div className="text-white">
        <p>{auth.user.email}</p>
        <p>{auth.user.username}</p>
        <p>{auth.user.role}</p>
      </div>
    </>
  );
};

export default withAuth(Profile);
