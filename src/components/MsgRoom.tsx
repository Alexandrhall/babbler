import React from "react";
import * as S from "../../styles/styles";
import { TRoom } from "../services/postConverter";

interface IProps {
  room: TRoom;
}

const MsgRoom = ({ room }: IProps) => {
  return (
    <div className="w-6/12 m-auto">
      {room.messages &&
        room.messages.map((msg, i) => {
          return (
            <div key={i}>
              <S.TextMessageFB className="w-64 m-3">
                {/* <span className="text-white">{msg.username}</span> */}
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
