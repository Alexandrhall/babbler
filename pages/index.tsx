import styles from "../styles/Home.module.css";
import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  where,
  getDoc,
} from "firebase/firestore";
import { database } from "../src/firebase";
import Button from "@mui/material/Button";
import { useAppDispatch, useAppSelector } from "../src/redux/hooks";
import { useRouter } from "next/router";
import { useAuth } from "../src/contexts/authContext";
import ChatRoom from "../src/components/ChatRoom";
import { List, ListItemText } from "@mui/material";
import Navbar from "../src/components/Navbar";
import Link from "next/link";
import {
  useCollection,
  useCollectionData,
  useCollectionDataOnce,
} from "react-firebase-hooks/firestore";
import roomConverter, { userConverter } from "../src/services/postConverter";

interface IChildren {
  children: JSX.Element[];
}

export default function Home({ children }: IChildren) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAuth();
  const auth = useAppSelector((state) => state.auth);

  const roomRef = collection(database, "rooms").withConverter(roomConverter);

  const q3 = query(roomRef, where("users", "array-contains", auth.user.id));

  const dmRef = collection(database, "directMessages").withConverter(
    roomConverter
  );

  const q5 = query(dmRef, where("users", "array-contains", auth.user.id));

  const [room] = useCollectionData(q3);

  const [dm] = useCollectionData(q5);

  const usrRef = collection(database, "users").withConverter(userConverter);

  const q7 = query(usrRef, where("username", "!=", auth.user.username));

  const [usrr] = useCollectionData(q7);

  useEffect(() => {
    if (user === null && auth.user.id === "") {
      router.push("/login");
    }
  }, [auth, user]);

  return (
    <>
      <Navbar />
      <main className="flex flex-row">
        <div className="w-64" style={{ backgroundColor: "#3F4E4F" }}>
          <List>
            <ListItemText className="text-white">
              <h4 className="font-bold">Rooms</h4>
              {room &&
                room.map((room, i) => {
                  return (
                    <Link href={`/rooms/${room.id}`}>
                      <p key={i}>{room.roomName}</p>
                    </Link>
                  );
                })}
            </ListItemText>
            <ListItemText className="text-white">
              <h4 className="font-bold">DM</h4>
              {dm &&
                dm.map((room, i) => {
                  return (
                    <Link href={`/rooms/${room.id}`}>
                      <p key={i}>
                        {usrr &&
                          usrr.map((usr) =>
                            room.users.includes(usr.id) ? usr.username : null
                          )}
                      </p>
                    </Link>
                  );
                })}
            </ListItemText>
          </List>
        </div>
        <div className="w-full">
          <ChatRoom />
        </div>
      </main>
    </>
  );
}
