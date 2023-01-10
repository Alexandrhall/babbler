import { Button, List, ListItemText } from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { useGetRoom } from "../services/useGetRoom";
import { useGetUsers } from "../services/useGetUsers";
import CreateRoom from "./CreateRoom";

const RoomList = () => {
  const auth = useAppSelector((state) => state.auth);
  const [dm] = useGetRoom("directMessages");
  const [room] = useGetRoom("rooms");
  const [usrr] = useGetUsers();
  const [searchText, setSearchText] = useState<string>("Search...");

  return (
    <div className="w-64 h-screen" style={{ backgroundColor: "#3F4E4F" }}>
      <List>
        {/* <Button
          sx={{
            marginLeft: "10px",
          }}
          variant="contained"
        >
          Create Room
        </Button> */}
        <CreateRoom />
        <input
          className="ml-3 mt-3 p-1 rounded"
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
        <ListItemText className="text-white p-3">
          <h4 className="font-bold">Rooms</h4>
          {room &&
            room.map((room, i) => {
              return (
                <Link href={`/rooms/${room.id}`} key={i}>
                  <p>{room.roomName}</p>
                </Link>
              );
            })}
        </ListItemText>
        <ListItemText className="text-white p-3">
          <h4 className="font-bold">Direct Messages</h4>
          {dm &&
            dm.map((room, i) => {
              return (
                <div key={i}>
                  <Link href={`/directmessage/${room.id}`}>
                    {usrr &&
                      usrr.map((usr, i) =>
                        room.users.includes(usr.id) &&
                        usr.id !== auth.user.id ? (
                          <p key={i}>{usr.username}</p>
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
