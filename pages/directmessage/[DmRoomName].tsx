import { setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import MsgRoom from "../../src/components/MsgRoom";
import withAuth from "../../src/components/withAuth";
import { useAppSelector } from "../../src/redux/hooks";
import { TRoom } from "../../src/services/postConverter";
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

  return (
    <div className="flex flex-col w-screen">
      <div className="text-white flex flex-row">
        {usrr &&
          usrr.map((usr) => {
            if (data?.users.includes(usr.id) && usr.id !== auth.user.id) {
              return (
                <h1
                  className="text-4xl w-full h-full"
                  style={{ textAlign: "center" }}
                >
                  {usr.username}
                </h1>
              );
            }
          })}
      </div>
      {data && <MsgRoom room={data} />}
    </div>
  );
};

export default withAuth(DmRoomName);
