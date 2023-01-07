import React from "react";
import * as S from "../../styles/styles";
import { useAppSelector } from "../redux/hooks";
import { TRoom } from "../services/postConverter";

interface IProps {
  room: TRoom;
  dmUsers?: {
    user1: string;
    user2: string;
  };
}

const MsgRoom = ({ room, dmUsers }: IProps) => {
  const auth = useAppSelector((state) => state.auth);

  return (
    <div className="w-6/12 m-auto">
      {room.messages &&
        room.messages.map((msg, i) => {
          return (
            <div key={i}>
              <S.TextMessageFB className="w-64 m-3">
                <span className="text-white">
                  {dmUsers
                    ? msg.uid !== auth.user.id
                      ? dmUsers!.user2
                      : dmUsers!.user1
                    : null}
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
