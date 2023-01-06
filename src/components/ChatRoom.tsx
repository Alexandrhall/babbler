import {
  addDoc,
  collection,
  DocumentData,
  DocumentReference,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/authContext";
import { database } from "../firebase";
import React from "react";
import { Button, Input, TextField } from "@mui/material";
import { useAppSelector } from "../redux/hooks";
import { useCollectionData } from "react-firebase-hooks/firestore";
import * as S from "../../styles/styles";
import roomConverter from "../services/postConverter";

interface IProps {
  room: string;
  users: {};
}

const chatRoom = () => {
  //   const user = useAuth();
  const auth = useAppSelector((state) => state.auth);
  const dummy = useRef<HTMLSpanElement>();
  const messageRef = collection(database, "messages");
  const q = query(messageRef, orderBy("createdAt"), limit(25));
  // const [messArray, setMessArray] = useState<messageArray[]>([]);

  const [formValue, setFormValue] = useState<string>("");

  const [messages] = useCollectionData(q);

  const dmRef = collection(database, "directMessages").withConverter(
    roomConverter
  );

  const q3 = query(dmRef, where("users", "array-contains", auth.user.id));

  const q2 = query(dmRef);

  const [dm] = useCollectionData(q3);

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

  useEffect(() => {
    console.log(dm);
    // console.log(messages);
  }, [dm]);

  return (
    <>
      <div className="w-6/12 m-auto">
        {messages &&
          messages.map((msg, i) => {
            return (
              <div key={i}>
                {/* <p className="text-white">{msg.text}</p> */}
                <S.TextMessageFB className="w-64 m-3">
                  <span className="text-white">{msg.username}</span>
                  <span className="text-white pl-16">
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

export default chatRoom;
