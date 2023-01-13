import { Button, List, ListItemText } from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { TRoom } from "../services/postConverter";
import { useGetRoom } from "../services/useGetRoom";
import { useGetUsers } from "../services/useGetUsers";
import CreateRoom from "./CreateRoom";
import SearchUserBar from "./SearchUserBar";

const RoomList = () => {
  const auth = useAppSelector((state) => state.auth);
  const [dm] = useGetRoom("directMessages");
  const [rooms] = useGetRoom("rooms");
  const [usrr] = useGetUsers();
  const [searchText, setSearchText] = useState<string>("Search...");
  const [personalDm, setPersonalDm] = useState<TRoom[]>();
  const [personalRooms, setPersonalRooms] = useState<TRoom[]>();

  useEffect(() => {
    const res =
      dm &&
      dm.filter((room) => {
        if (room.users.includes(auth.user.id)) return room;
      });
    if (res) {
      setPersonalDm(res);
    }
  }, [dm]);

  useEffect(() => {
    const res =
      rooms &&
      rooms.filter((room) => {
        if (room.users.includes(auth.user.id)) return room;
      });
    if (res) {
      setPersonalRooms(res);
    }
  }, [rooms]);

  return (
    <div className="w-64 h-screen" style={{ backgroundColor: "#3F4E4F" }}>
      <List>
        <CreateRoom />
        <SearchUserBar />
        {/* <input
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
        /> */}

        <ListItemText className="text-white p-3">
          <h4 className="font-bold">Rooms</h4>
          {personalRooms &&
            personalRooms.map((room, i) => {
              let num = 0;
              room.messages.forEach((msg) => {
                if (msg.recieved) {
                  msg.recieved.filter((rec) => {
                    if (rec.uid === auth.user.id && rec.open === false) num++;
                  });
                }
              });

              return (
                <Link href={`/rooms/${room.id}`} key={i}>
                  <p>
                    {room.roomName}
                    {num === 0 ? null : num}
                  </p>
                </Link>
              );
            })}
        </ListItemText>
        <ListItemText className="text-white p-3">
          <h4 className="font-bold">Direct Messages</h4>
          {personalDm &&
            personalDm.map((room, i) => {
              let num = 0;
              room.messages.forEach((msg) => {
                if (msg.recieved) {
                  msg.recieved.filter((rec) => {
                    if (rec.uid === auth.user.id && rec.open === false) num++;
                  });
                }
              });

              return (
                <div key={i}>
                  <Link href={`/directmessage/${room.id}`}>
                    {usrr &&
                      usrr.map((usr, i) =>
                        room.users.includes(usr.id) &&
                        usr.id !== auth.user.id ? (
                          <p key={i}>
                            {usr.username}
                            {num === 0 ? null : num}
                          </p>
                        ) : null
                      )}
                  </Link>
                </div>
              );
            })}
        </ListItemText>
      </List>
    </div>
  );
};

export default RoomList;
