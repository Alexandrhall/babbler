import React, { useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { TRoom } from "../services/postConverter";
import { useGetUsers } from "../services/useGetUsers";
import * as S from "../../styles/styles";
import { v4 as uuidv4, v1 } from "uuid";

interface IProps {
  room: TRoom;
}

const returnMessage = ({ room }: IProps) => {
  const auth = useAppSelector((state) => state.auth);
  const [usrr] = useGetUsers();
  let classRender = "";

  const render =
    room.messages &&
    room.messages.map((msg, i) => {
      const dateTime = new Date(msg.createdAt.seconds * 1000)
        .toLocaleString("sv-SE")
        .substring(0, 16)
        .slice(5)
        .replace("-", "/");

      if (msg.uid === auth.user.id) {
        classRender = "flex flex-row-reverse";
      } else {
        classRender = "flex flex-row";
      }

      return (
        <div key={uuidv4()} className={classRender}>
          {usrr &&
            usrr.map((usr) => {
              if (msg.uid === usr.id) {
                return (
                  <img
                    src={usr.photoUrl}
                    alt={usr.username}
                    style={{
                      height: "35px",
                      borderRadius: "50%",
                      display: "inline",
                      marginTop: "20px",
                    }}
                    key={uuidv4()}
                  />
                );
              }
            })}
          <S.TextMessageFB className="w-full m-3" key={uuidv4()}>
            {usrr &&
              usrr.map((usr) => {
                if (msg.uid === usr.id) {
                  return (
                    <span className="text-white pl-2" key={uuidv4()}>
                      {usr.username}
                    </span>
                  );
                }
              })}

            <span className="text-white pl-16 float-right" key={uuidv4()}>
              {dateTime && dateTime}
            </span>
            {msg.text.startsWith("https") ? (
              <a
                href={msg.text}
                target="_blank"
                className="text-blue-800 block"
                rel="noreferrer"
                key={uuidv4()}
              >
                Link to file
              </a>
            ) : (
              <p className="p-1" key={uuidv4()}>
                {msg.text}
              </p>
            )}
          </S.TextMessageFB>
        </div>
      );
    });
  return <>{render}</>;
};

export default returnMessage;
