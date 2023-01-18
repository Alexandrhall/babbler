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
  const [searchText, setSearchText] = useState<string>("Search...");

  useEffect(() => {
    room &&
      room.forEach((snapshot) => {
        if (snapshot.users.includes(auth.user.id)) {
          setData(snapshot);
        }
      });
  }, [room, auth.user.id]);

  return (
    <>
      {/* <div>
        <input
          className="ml-3 mt-3 p-1 rounded relative"
          type="text"
          maxLength={48}
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
          onClick={() => {
            setSearchText("");
          }}
          onBlur={() => {
            if (searchText === "") setSearchText("Search...");
          }}
        />

        <div className="absolute mt-1 w-full p-2 bg-white shadow-lg rounded-bl rounded-br max-h-56 overflow-y-auto">
          <ul>
            <li>hej</li>
          </ul>
        </div>
      </div> */}
      {data && <MsgRoom room={data} />}
    </>
  );
};

export default ChatRoom;
