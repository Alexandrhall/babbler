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
            <ListItemText className="text-white p-3">
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
        <div className="w-full">
          <ChatRoom />
        </div>
      </main>
    </>
  );
}
