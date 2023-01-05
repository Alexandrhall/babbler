import { useRouter } from "next/router";
import React from "react";

const dmRoomName = () => {
  const router = useRouter();
  const q = router.query.dmRoomName;

  return <div>roomName {q}</div>;
};

export default dmRoomName;
