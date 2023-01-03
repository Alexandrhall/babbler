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
import { useAuth } from "../contexts/authContext";
import { database } from "../firebase";
import React from "react";

interface userObj {
  uid: string;
  photoUrl?: string | null;
}

interface messageArray {
  createdAt: number;
  uid: string;
  text: string;
}

const chatRoom = async (): Promise<JSX.Element> => {
  const user = useAuth();
  const dummy = useRef<HTMLSpanElement>();
  const messageRef = collection(database, "messages");
  const q = query(messageRef, orderBy("createdAt"), limit(25));
  const array: messageArray[] = [];
  await getDocs(q).then((snapshot) => {
    snapshot.forEach((doc) => {
      array.push(doc.data() as messageArray);
    });
  });

  //   useEffect(() => {
  //     const messageRef = collection(database, "messages");
  //     const q = query(messageRef, orderBy("createdAt"), limit(25));
  //     const querySnapshot = getDocs(q).then((snapshot) => {
  //       snapshot.forEach((doc) => {
  //         array.push(doc.data() as messageArray);
  //       });
  //     });
  //     console.log(array);
  //   }, []);

  // const [formValue, setFormValue] = useState<string>('');

  //   const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
  //     e.preventDefault();

  //     const obj: userObj = {
  //       uid: user!.uid,
  //       photoUrl: user!.photoURL,
  //     };

  //     await addDoc(messageRef, {
  //       text: "hejjhej",
  //       createdAt: serverTimestamp(),
  //       uid: obj.uid,
  //     });
  //   };

  return (
    <>
      {array.forEach((msg) => {
        <div>
          <span key={msg.uid}>{msg.text}</span>;
        </div>;
      })}
    </>
  );
};

export default chatRoom;
