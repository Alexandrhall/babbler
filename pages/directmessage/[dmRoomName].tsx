import { collection, query, queryEqual, where } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import MsgRoom from "../../src/components/MsgRoom";
import Navbar from "../../src/components/Navbar";
import RoomList from "../../src/components/RoomList";
import { database } from "../../src/firebase";
import { useAppSelector } from "../../src/redux/hooks";
import roomConverter, {
  TRoom,
  userConverter,
} from "../../src/services/postConverter";

interface IDmUsers {
  user1: string;
  user2: string;
}

const dmRoomName = () => {
  const auth = useAppSelector((state) => state.auth);
  const router = useRouter();
  const param = router.query.dmRoomName;
  const [data, setData] = useState<TRoom>();
  const [usrObject, setUsrObject] = useState<IDmUsers>();

  const dmRef = collection(database, "directMessages").withConverter(
    roomConverter
  );

  const q = query(dmRef);

  const [dm] = useCollectionData(q);

  useEffect(() => {
    dm?.forEach((snapshot, i, array) => {
      if (snapshot.id.includes(param!.toString())) {
        setData(snapshot);
      }
    });
  }, [dm, param]);

  const usrRef = collection(database, "users").withConverter(userConverter);

  const q7 = query(usrRef, where("username", "!=", auth.user.username));
  const q8 = query(usrRef);

  const [usrr] = useCollectionData(q8);

  useEffect(() => {
    let otherid: string = "";

    data &&
      data.users.forEach((id) => {
        if (id !== auth.user.id) otherid = id;
      });

    usrr &&
      usrr.forEach((usr) => {
        if (usr.id === otherid) {
          setUsrObject({
            user1: auth.user.username,
            user2: usr.username,
          });
        }
      });
  }, [usrr, param, data]);

  return (
    <>
      <Navbar />
      <RoomList />
      <div className="text-white">roomName {param}</div>
      {data && <MsgRoom room={data} dmUsers={usrObject} />}
    </>
  );
};

export default dmRoomName;
