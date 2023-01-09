import React from "react";
import Navbar from "../src/components/Navbar";
import RoomList from "../src/components/RoomList";
import { useAppSelector } from "../src/redux/hooks";

const Profile = () => {
  const auth = useAppSelector((state) => state.auth);
  return (
    <>
      <Navbar />
      <RoomList />
      <div className="text-white">
        <p>{auth.user.email}</p>
        <p>{auth.user.username}</p>
        <p>{auth.user.role}</p>
      </div>
    </>
  );
};

export default Profile;
