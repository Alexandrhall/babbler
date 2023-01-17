import { Button, List, ListItemText } from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { TRoom } from "../services/postConverter";
import { useGetRoom } from "../services/useGetRoom";
import { useGetUsers } from "../services/useGetUsers";
import CreateRoom from "./CreateRoom";
import Drawer from "./Drawer";
import SearchUserBar from "./SearchUserBar";

const RoomList = () => {
  const auth = useAppSelector((state) => state.auth);
  const [dm] = useGetRoom("directMessages");
  const [rooms] = useGetRoom("rooms");
  const [usrr] = useGetUsers();
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
  }, [dm, auth.user.id]);

  useEffect(() => {
    const res =
      rooms &&
      rooms.filter((room) => {
        if (room.users.includes(auth.user.id)) return room;
      });
    if (res) {
      setPersonalRooms(res);
    }
  }, [rooms, auth.user.id]);

  return (
    // 3F4E4F
    <div
      className="w-64"
      style={{ backgroundColor: "#2E2E2F", height: "92vh" }}
    >
      <List>
        <CreateRoom />
        {/* <SearchUserBar /> */}
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
