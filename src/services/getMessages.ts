import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { FormEvent, useEffect, useRef } from "react";
import React from "react";
import { useAuth } from "../contexts/authContext";
import { database } from "../firebase";

interface userObj {
  uid: string;
  photoUrl?: string | null;
}

interface messageArray {
  createdAt: number;
  uid: string;
  text: string;
}

export const getMessages = async () => {
  const user = useAuth();
  const dummy = useRef<HTMLSpanElement>();
  const messageRef = collection(database, "messages");
  const q = query(messageRef, orderBy("createdAt"), limit(25));
  let array: messageArray[] = [];
  await getDocs(q).then((snapshot) => {
    snapshot.forEach((doc) => {
      array.push(doc.data() as messageArray);
    });
  });

  return array;
};
