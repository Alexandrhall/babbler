import { collection, query, queryEqual } from "firebase/firestore";
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
import roomConverter, { TRoom } from "../../src/services/postConverter";

const dmRoomName = () => {
  const router = useRouter();
  const param = router.query.dmRoomName;
  const [data, setData] = useState<TRoom>();

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

  return (
    <>
      <Navbar />
      <RoomList />
      <div className="text-white">roomName {param}</div>
      {data && <MsgRoom room={data} />}
    </>
  );
};

export default dmRoomName;
