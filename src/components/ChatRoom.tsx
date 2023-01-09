import React, { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { getRoom } from "../services/getRoom";
import { TRoom } from "../services/postConverter";
import MsgRoom from "./MsgRoom";
import Navbar from "./Navbar";
import RoomList from "./RoomList";

const ChatRoom = () => {
  const [data, setData] = useState<TRoom>();
  const [room] = getRoom("chatroom");
  const auth = useAppSelector((state) => state.auth);

  useEffect(() => {
    room &&
      room.forEach((snapshot) => {
        if (snapshot.users.includes(auth.user.id)) {
          setData(snapshot);
        }
      });
  }, [room, auth.user.id]);

  return <>{data && <MsgRoom room={data} />}</>;
};

export default ChatRoom;
