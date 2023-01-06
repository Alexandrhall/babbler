import { useRouter } from "next/router";
import React from "react";
import Navbar from "../../src/components/Navbar";

const roomName = () => {
  const router = useRouter();
  const q = router.query.roomName;

  //   console.log(router.query);

  return (
    <>
      <Navbar />
      <div className="text-white">roomName {q}</div>
    </>
  );
};

export default roomName;
