import { useRouter } from "next/router";
import React from "react";

const roomName = () => {
  const router = useRouter();
  const q = router.query.roomName;

  return <div>roomName {q}</div>;
};

export default roomName;
