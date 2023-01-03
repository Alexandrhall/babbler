import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/authContext";
import { database } from "../firebase";
import React from "react";

interface messageArray {
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  uid: string;
  text: string;
}

const chatRoom = () => {
  const user = useAuth();
  const dummy = useRef<HTMLSpanElement>();
  const messageRef = collection(database, "messages");
  const q = query(messageRef, orderBy("createdAt"), limit(25));
  const [messArray, setMessArray] = useState<messageArray[]>([]);

  const [formValue, setFormValue] = useState<string>("");

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await addDoc(messageRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid: user!.uid,
    });

    setFormValue("");
  };

  useEffect(() => {
    const getStuff = async () => {
      await getDocs(q).then((snapshot) => {
        const array: messageArray[] = [];
        snapshot.forEach((doc) => {
          array.push(doc.data() as messageArray);
        });
        setMessArray([...array]);
      });
      console.log("complete");
    };
    getStuff();
  }, []);

  return (
    <>
      <div>
        {messArray.map((string, i) => {
          return (
            <div key={i}>
              <p>{string.uid}</p>
              <p>
                {string.createdAt &&
                  new Date(string.createdAt.seconds * 1000)
                    .toLocaleString("sv-SE")
                    .substring(0, 16)}
              </p>
              <p>{string.text}</p>
            </div>
          );
        })}
      </div>
      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Write something.."
        />
        <button type="submit">Send</button>
      </form>
    </>
  );
};

export default chatRoom;
