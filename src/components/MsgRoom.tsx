import React, { useEffect, useRef } from "react";
import { TRoom } from "../services/postConverter";
import ReturnMessage from "./ReturnMessage";
import SendMessage from "./SendMessage";

interface IProps {
  room: TRoom;
}

const MsgRoom = ({ room }: IProps) => {
  const dummy = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    dummy.current?.scrollIntoView();
  }, [room]);

  return (
    <div
      className="w-9/12 m-auto"
      style={{
        height: "80vh",
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="mb-24">
        <ReturnMessage room={room} />
      </div>
      <SendMessage room={room} />

      <span ref={dummy}></span>
    </div>
  );
};

export default MsgRoom;
