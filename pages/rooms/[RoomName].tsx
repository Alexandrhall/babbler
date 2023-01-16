import { Button } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import MsgRoom from "../../src/components/MsgRoom";
import withAuth from "../../src/components/withAuth";
import { TRoom } from "../../src/services/postConverter";
import { useGetRoom } from "../../src/services/useGetRoom";
import { deleteDoc, updateDoc, setDoc } from "firebase/firestore";
import { useAppSelector } from "../../src/redux/hooks";
import AddUserRoom from "../../src/components/AddUserRoom";

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
      // console.log(newData);
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
    <div className="flex flex-col w-screen">
      <div className="text-white flex flex-row">
        <h1 className="text-4xl w-full h-full" style={{ textAlign: "center" }}>
          {data?.roomName}
        </h1>
        {data && data.roomName ? (
          <>
            <AddUserRoom room={data} />
            <Button
              variant="text"
              sx={{ color: "red", ":hover": { color: "lightblue" } }}
              onClick={leaveRoom}
            >
              Leave room
            </Button>
            <Button variant="text" sx={{ color: "red" }} onClick={deleteRoom}>
              Delete room
            </Button>
          </>
        ) : null}
      </div>
      {data && <MsgRoom room={data} />}
    </div>
  );
};

export default withAuth(RoomName);
