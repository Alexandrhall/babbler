import { Button, Input } from "@mui/material";
import { arrayUnion, Timestamp, updateDoc } from "firebase/firestore";
import React, { ChangeEvent, FormEvent, useState } from "react";
import * as S from "../../styles/styles";
import { useAppSelector } from "../redux/hooks";
import { TRoom } from "../services/postConverter";
import { useGetUsers } from "../services/useGetUsers";
import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

interface IProps {
  room: TRoom;
}

const MsgRoom = ({ room }: IProps) => {
  const auth = useAppSelector((state) => state.auth);
  const [usrr] = useGetUsers();
  const [formValue, setFormValue] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File>();

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formValue !== "") {
      try {
        await updateDoc(room.ref, {
          messages: arrayUnion(
            ...[
              {
                text: formValue,
                createdAt: Timestamp.now(),
                uid: auth.user.id,
              },
            ]
          ),
          users: room.users,
        });

        setFormValue("");
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e: any) => {
    const storageRef = ref(storage, `images/${selectedFile!.name}`);

    uploadBytes(storageRef, selectedFile!).then((snapshot) => {
      console.log(snapshot);
      console.log("Uploaded a blob or file!");
    });

    getDownloadURL(storageRef).then((url) => {
      console.log(url);
    });
  };

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
                <span className="text-white pl-16 float-right">
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
      <form onSubmit={sendMessage} className="m-auto">
        <Input
          sx={{
            margin: "3px",
            padding: "2px",
            backgroundColor: "wheat",
          }}
          //   margin="normal"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Write something.."
        />
        <Button type="submit" variant="contained">
          Send
        </Button>
      </form>
      <div>
        <input type="file" name="file" onChange={handleFile} />
        <button onClick={handleUpload}>Upload</button>
      </div>
    </div>
  );
};

export default MsgRoom;
