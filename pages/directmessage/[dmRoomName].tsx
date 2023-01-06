import { useRouter } from "next/router";
import React from "react";
import Navbar from "../../src/components/Navbar";

const dmRoomName = () => {
  const router = useRouter();
  const q = router.query.dmRoomName;

  return (
    <>
      <Navbar />
      <div>roomName {q}</div>
    </>
  );
};

export default dmRoomName;
