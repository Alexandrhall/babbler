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
import { Button, Input, TextField } from "@mui/material";
import { useAppSelector } from "../redux/hooks";

interface messageArray {
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  uid: string;
  text: string;
  username: string;
}

const chatRoom = () => {
  //   const user = useAuth();
  const auth = useAppSelector((state) => state.auth);
  const dummy = useRef<HTMLSpanElement>();
  const messageRef = collection(database, "messages");
  const q = query(messageRef, orderBy("createdAt"), limit(25));
  const [messArray, setMessArray] = useState<messageArray[]>([]);

  const [formValue, setFormValue] = useState<string>("");

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

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await addDoc(messageRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid: auth.user.id,
      username: auth.user.username,
    });

    setFormValue("");
    getStuff();
  };

  useEffect(() => {
    getStuff();
  }, []);

  return (
    <>
      <div>
        {messArray.map((string, i) => {
          return (
            <div key={i}>
              <p className="text-white">{string.username}</p>
              <p className="text-white">
                {string.createdAt &&
                  new Date(string.createdAt.seconds * 1000)
                    .toLocaleString("sv-SE")
                    .substring(0, 16)}
              </p>
              <p className="text-white">{string.text}</p>
            </div>
          );
        })}
      </div>
      <form onSubmit={sendMessage}>
        <TextField
          sx={{
            // height: "10px",
            backgroundColor: "wheat",
          }}
          //   margin="normal"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Write something.."
        />
        <Button type="submit" variant="contained">
          Send
        </Button>
      </form>
    </>
  );
};

export default chatRoom;
