import React from "react";
import Navbar from "../../src/components/Navbar";
import RoomList from "../../src/components/RoomList";
import withAuth from "../../src/components/withAuth";
import { useAppSelector } from "../../src/redux/hooks";

const Profile = () => {
  const auth = useAppSelector((state) => state.auth);
  return (
    <>
      {/* <Navbar />
      <main className="flex flex-row">
        <RoomList /> */}
      <div className="text-white">
        <p>{auth.user.email}</p>
        <p>{auth.user.username}</p>
        <p>{auth.user.role}</p>
      </div>
      {/* </main> */}
    </>
  );
};

export default withAuth(Profile);
