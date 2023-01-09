import {
  addDoc,
  collection,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { FormEvent, useEffect, useRef, useState } from "react";
import { database } from "../firebase";
import React from "react";
import { Button, Input } from "@mui/material";
import { useAppSelector } from "../redux/hooks";
import { useCollectionData } from "react-firebase-hooks/firestore";
import * as S from "../../styles/styles";
import { getUsers } from "../services/getUsers";

interface IProps {
  room: string;
  users: {};
}

const ChatRoom = () => {
  //   const user = useAuth();
  const auth = useAppSelector((state) => state.auth);
  const dummy = useRef<HTMLSpanElement>();
  const messageRef = collection(database, "messages");
  const q = query(messageRef, orderBy("createdAt"), limit(25));
  const [messages] = useCollectionData(q);
  const [usrr] = getUsers();
  const [formValue, setFormValue] = useState<string>("");

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await addDoc(messageRef, {
        text: formValue,
        createdAt: serverTimestamp(),
        uid: auth.user.id,
        username: auth.user.username,
      });

      setFormValue("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="w-6/12 m-auto">
        {messages &&
          messages.map((msg, i) => {
            return (
              <div key={i}>
                <S.TextMessageFB className="w-64 m-3">
                  <span className="text-white">
                    {usrr &&
                      usrr.map((usr) => {
                        if (usr.id === msg.uid) return usr.username;
                      })}
                  </span>
                  <span className="text-white pl-16 float-right">
                    {msg.createdAt &&
                      new Date(msg.createdAt.seconds * 1000)
                        .toLocaleString("sv-SE")
                        .substring(0, 16)}
                  </span>
                  <p>{msg.text}</p>
                </S.TextMessageFB>
              </div>
            );
          })}
        <form onSubmit={sendMessage} className="m-auto">
          <Input
            sx={{
              margin: "3px",
              padding: "2px",
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
      </div>
    </>
  );
};

export default ChatRoom;
