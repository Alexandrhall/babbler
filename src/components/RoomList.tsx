import { List, ListItemText } from "@mui/material";
import { collection, query, where } from "firebase/firestore";
import Link from "next/link";
import React from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { database } from "../firebase";
import { useAppSelector } from "../redux/hooks";
import roomConverter, { userConverter } from "../services/postConverter";

const RoomList = () => {
  const auth = useAppSelector((state) => state.auth);
  const roomRef = collection(database, "rooms").withConverter(roomConverter);

  const q3 = query(roomRef, where("users", "array-contains", auth.user.id));

  const [room] = useCollectionData(q3);

  const dmRef = collection(database, "directMessages").withConverter(
    roomConverter
  );

  const q5 = query(dmRef, where("users", "array-contains", auth.user.id));

  const [dm] = useCollectionData(q5);

  const usrRef = collection(database, "users").withConverter(userConverter);

  const q7 = query(usrRef, where("username", "!=", auth.user.username));
  const q8 = query(usrRef);

  const [usrr] = useCollectionData(q8);

  return (
    <div className="w-64" style={{ backgroundColor: "#3F4E4F" }}>
      <List>
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
