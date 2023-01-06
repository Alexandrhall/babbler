import { useRouter } from "next/router";
import React from "react";
import Navbar from "../../src/components/Navbar";
import { useAppSelector } from "../../src/redux/hooks";

const dmRoomName = () => {
  const router = useRouter();
  const auth = useAppSelector((state) => state.auth);
  const q = router.query.dmRoomName;

  return (
    <>
      <Navbar />
      <div className="text-white">roomName {q}</div>
    </>
  );
};

export default dmRoomName;
