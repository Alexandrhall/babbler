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
import RoomList from "../src/components/RoomList";

interface IChildren {
  children: JSX.Element[];
}

export default function Home({ children }: IChildren) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAuth();
  const auth = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user === null && auth.user.id === "") {
      router.push("/login");
    }
  }, [auth, user]);

  return (
    <>
      <Navbar />
      <main className="flex flex-row">
        <RoomList />
        <div className="w-full">
          <ChatRoom />
        </div>
      </main>
    </>
  );
}
