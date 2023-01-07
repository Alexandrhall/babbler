import { collection, query } from "firebase/firestore";
import React from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import * as S from "../../styles/styles";
import { database } from "../firebase";
import { useAppSelector } from "../redux/hooks";
import { TRoom, userConverter } from "../services/postConverter";

interface IProps {
  room: TRoom;
}

const MsgRoom = ({ room }: IProps) => {
  const auth = useAppSelector((state) => state.auth);
  const usrRef = collection(database, "users").withConverter(userConverter);
  const [usrr] = useCollectionData(query(usrRef));

  return (
    <div className="w-6/12 m-auto">
      {room.messages &&
        room.messages.map((msg, i) => {
          return (
            <div key={i}>
              <S.TextMessageFB className="w-64 m-3">
                <span className="text-white">
                  {usrr &&
                    usrr.map((usr) => {
                      if (msg.uid === usr.id) {
                        return usr.username;
                      }
                    })}
                </span>
                <span className="text-white pl-16">
                  {msg.createdAt &&
                    new Date(msg.createdAt.seconds * 1000)
                      .toLocaleString("sv-SE")
                      .substring(0, 16)}
                </span>
                <p>{msg.text}</p>
              </S.TextMessageFB>
            </div>
          );
        })}
    </div>
  );
};

export default MsgRoom;
