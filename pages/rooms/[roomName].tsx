import { Button } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import MsgRoom from "../../src/components/MsgRoom";
import Navbar from "../../src/components/Navbar";
import RoomList from "../../src/components/RoomList";
import withAuth from "../../src/components/withAuth";
import roomConverter, { TRoom } from "../../src/services/postConverter";
import { useGetRoom } from "../../src/services/useGetRoom";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { useAppSelector } from "../../src/redux/hooks";

const RoomName = () => {
  const auth = useAppSelector((state) => state.auth);
  const router = useRouter();
  const param = router.query.RoomName;
  const [data, setData] = useState<TRoom>();
  const [rooms] = useGetRoom("rooms");

  useEffect(() => {
    rooms?.forEach((room) => {
      if (room.id.includes(param!.toString())) {
        setData(room);
      }
    });
  }, [rooms, param]);

  const deleteRoom = async () => {
    try {
      await deleteDoc(data!.ref);
      router.replace("/");
    } catch (err) {
      console.error(err);
    }
  };

  const leaveRoom = async () => {
    try {
      const tempUsr =
        data &&
        data.users.filter((usr) => {
          if (usr !== auth.user.id) return usr;
        });

      await updateDoc(data!.ref, {
        users: tempUsr,
      });
      router.replace("/");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (data && !data.users.includes(auth.user.id)) {
      router.replace("/");
    }
  }, [data]);

  return (
    <>
      <Navbar />
      <main className="flex flex-row">
        <RoomList />
        <div className="text-white">
          RoomName {data?.roomName}
          {data && data.roomName ? (
            <>
              <Button
                variant="contained"
                sx={{ backgroundColor: "red" }}
                onClick={deleteRoom}
              >
                Delete room
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: "red" }}
                onClick={leaveRoom}
              >
                Leave room
              </Button>
            </>
          ) : null}
        </div>
        {data && <MsgRoom room={data} />}
      </main>
    </>
  );
};

export default withAuth(RoomName);
