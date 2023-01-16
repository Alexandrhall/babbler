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
    <>
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
            <AddUserRoom room={data} />
          </>
        ) : null}
      </div>
      {data && <MsgRoom room={data} />}
    </>
  );
};

export default withAuth(RoomName);
