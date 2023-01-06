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
} from "react-firebase-hooks/firestore";

interface IChildren {
  children: JSX.Element[];
}

export default function Home({ children }: IChildren) {
  // const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [number, setNumber] = useState(0);
  const user = useAuth();
  const auth = useAppSelector((state) => state.auth);

  // useEffect(() => {
  //   user === null ? router.push("/login") : router.push("/");
  // }, [user]);

  const dmRef = collection(database, "rooms");

  const q3 = query(dmRef, where("users", "array-contains", auth.user.id));

  const [dm] = useCollectionData(q3);

  useEffect(() => {
    if (user === null && auth.user.id === "") {
      router.push("/login");
    }
  }, [auth, user]);

  useEffect(() => {
    console.log(dm);
  }, []);

  return (
    <>
      <Navbar />
      <main className="flex flex-row">
        <div className="w-64" style={{ backgroundColor: "#3F4E4F" }}>
          <List>
            <ListItemText className="text-white">
              <h4 className="font-bold">Rooms</h4>
              <p>rooms:id</p>
              {dm &&
                dm.map((room, i) => {
                  return (
                    <Link href={`/rooms/${room.id}`}>
                      <p key={i}>{room.roomName}</p>
                    </Link>
                  );
                })}
            </ListItemText>
            <ListItemText className="text-white">
              <h4 className="font-bold">DM</h4>
              <p>user:id</p>
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
