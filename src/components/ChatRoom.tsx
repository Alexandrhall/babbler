import {
  addDoc,
  collection,
  DocumentData,
  DocumentReference,
  FirestoreDataConverter,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  SnapshotOptions,
  WithFieldValue,
} from "firebase/firestore";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/authContext";
import { database } from "../firebase";
import React from "react";
import { Button, Input, TextField } from "@mui/material";
import { useAppSelector } from "../redux/hooks";
import { useCollectionData } from "react-firebase-hooks/firestore";

interface IProps {
  room: string;
  users: {};
}

interface messageArray {
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  id: string;
  text: string;
  username: string;
  ref: DocumentReference<DocumentData>;
}

// type Post = {
//   author: string;
//   id: string;
//   ref: DocumentReference<DocumentData>;
//   title: string;
// };

type Post = {
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  id: string;
  text: string;
  username: string;
};

const postConverter: FirestoreDataConverter<Post> = {
  toFirestore(post: WithFieldValue<Post>): DocumentData {
    return { id: post.id, username: post.username };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Post {
    const data = snapshot.data(options);
    return {
      createdAt: data.createdAt,
      id: snapshot.id,
      username: data.username,
      text: data.text,
    };
  },
};

const chatRoom = () => {
  //   const user = useAuth();
  const auth = useAppSelector((state) => state.auth);
  const dummy = useRef<HTMLSpanElement>();
  const messageRef = collection(database, "messages");
  const q = query(messageRef, orderBy("createdAt"), limit(25));
  const [messArray, setMessArray] = useState<messageArray[]>([]);

  const [formValue, setFormValue] = useState<string>("");

  const [messages] = useCollectionData(q);

  const q2 = query(collection(database, "directMessages"));
  const [dm] = useCollectionData(q2);

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await addDoc(messageRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid: auth.user.id,
      username: auth.user.username,
    });

    setFormValue("");
  };

  useEffect(() => {
    console.log(dm);
    console.log(messages);
  }, []);

  return (
    <>
      <div>
        {messages &&
          messages.map((msg, i) => {
            return (
              <div key={i}>
                <p className="text-white">{msg.username}</p>
                <p className="text-white">
                  {msg.createdAt &&
                    new Date(msg.createdAt.seconds * 1000)
                      .toLocaleString("sv-SE")
                      .substring(0, 16)}
                </p>
                <p className="text-white">{msg.text}</p>
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
