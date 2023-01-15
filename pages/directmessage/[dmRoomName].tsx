import { Button } from "@mui/material";
import {
  arrayUnion,
  collection,
  query,
  queryEqual,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import MsgRoom from "../../src/components/MsgRoom";
import Navbar from "../../src/components/Navbar";
import RoomList from "../../src/components/RoomList";
import withAuth from "../../src/components/withAuth";
import { database } from "../../src/firebase";
import { useAppSelector } from "../../src/redux/hooks";
import roomConverter, {
  TRoom,
  userConverter,
} from "../../src/services/postConverter";
import { useGetRoom } from "../../src/services/useGetRoom";
import { useGetUsers } from "../../src/services/useGetUsers";

const DmRoomName = () => {
  const auth = useAppSelector((state) => state.auth);
  const router = useRouter();
  const param = router.query.DmRoomName;
  const [data, setData] = useState<TRoom>();
  const [dm] = useGetRoom("directMessages");
  const [usrr] = useGetUsers();

  useEffect(() => {
    dm &&
      dm.forEach((snapshot) => {
        if (snapshot.id.includes(param!.toString())) {
          setData(snapshot);
        }
      });
  }, [dm, param]);

  useEffect(() => {
    if (data && !data.users.includes(auth.user.id)) {
      router.replace("/");
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      const newData = data?.messages.map((msg) => {
        msg.recieved?.map((rec) => {
          if (rec.uid === auth.user.id && rec.open === false) {
            rec.open = true;
          }
        });
        return msg;
      });
      console.log(newData);
      const setNewRecieved = async () => {
        try {
          await setDoc(
            data.ref,
            {
              messages: newData,
            },
            { merge: true }
          );
        } catch (err) {
          console.error(err);
        }
      };
      setNewRecieved();
    }
  }, [data]);

  return (
    <>
      <div className="text-white">
        RoomName{" "}
        {usrr &&
          usrr.map((usr) => {
            if (data?.users.includes(usr.id) && usr.id !== auth.user.id) {
              return usr.username;
            }
          })}
      </div>
      {data && <MsgRoom room={data} />}
    </>
  );
};

export default withAuth(DmRoomName);
