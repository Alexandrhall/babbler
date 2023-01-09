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
import { getRoom } from "../../src/services/getRoom";
import { getUsers } from "../../src/services/getUsers";
import roomConverter, {
  TRoom,
  userConverter,
} from "../../src/services/postConverter";

const DmRoomName = () => {
  const auth = useAppSelector((state) => state.auth);
  const router = useRouter();
  const param = router.query.DmRoomName;
  const [data, setData] = useState<TRoom>();
  const [dm] = getRoom("directMessages");
  const [usrr] = getUsers();

  useEffect(() => {
    dm &&
      dm.forEach((snapshot) => {
        if (snapshot.id.includes(param!.toString())) {
          setData(snapshot);
        }
      });
  }, [dm, param]);

  let otherid: string = "";

  data &&
    data.users.forEach((id) => {
      if (id !== auth.user.id) otherid = id;
    });

  return (
    <>
      <Navbar />
      <RoomList />
      <div className="text-white">
        roomName{" "}
        {usrr &&
          usrr.map((usr) => {
            if (otherid === usr.id) {
              return usr.username;
            }
          })}
      </div>
      {data && <MsgRoom room={data} />}
    </>
  );
};

export default DmRoomName;
