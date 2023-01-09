import React, { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { TRoom } from "../services/postConverter";
import { useGetRoom } from "../services/useGetRoom";
import MsgRoom from "./MsgRoom";
import Navbar from "./Navbar";
import RoomList from "./RoomList";

const ChatRoom = () => {
  const [data, setData] = useState<TRoom>();
  const [room] = useGetRoom("chatroom");
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
