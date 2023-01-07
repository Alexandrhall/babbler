import { collection, query, queryEqual } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import MsgRoom from "../../src/components/MsgRoom";
import Navbar from "../../src/components/Navbar";
import { database } from "../../src/firebase";
import roomConverter, { TRoom } from "../../src/services/postConverter";

const roomName = () => {
  const router = useRouter();
  const param = router.query.roomName;
  const [data, setData] = useState<TRoom>();

  const roomRef = collection(database, "rooms").withConverter(roomConverter);

  const q = query(roomRef);

  const [room] = useCollectionData(q);

  useEffect(() => {
    room?.forEach((snapshot, i, array) => {
      if (snapshot.id.includes(param!.toString())) {
        setData(snapshot);
      }
    });
  }, [room]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <>
      <Navbar />
      <div className="text-white">roomName {data?.roomName}</div>
      {data && <MsgRoom room={data} />}
    </>
  );
};

export default roomName;
