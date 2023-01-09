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
import { useGetRoom } from "../../src/services/useGetRoom";

const RoomName = () => {
  const router = useRouter();
  const param = router.query.RoomName;
  const [data, setData] = useState<TRoom>();
  const [room] = useGetRoom("rooms");

  useEffect(() => {
    room?.forEach((snapshot) => {
      if (snapshot.id.includes(param!.toString())) {
        setData(snapshot);
      }
    });
  }, [room, param]);

  return (
    <>
      <Navbar />
      <RoomList />
      <div className="text-white">roomName {data?.roomName}</div>
      {data && <MsgRoom room={data} />}
    </>
  );
};

export default RoomName;
