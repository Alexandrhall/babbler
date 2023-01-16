import { Button, Input } from "@mui/material";
import { arrayUnion, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import * as S from "../../styles/styles";
import { useAppSelector } from "../redux/hooks";
import { TRoom } from "../services/postConverter";
import { useGetUsers } from "../services/useGetUsers";
import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import UploadIcon from "@mui/icons-material/Upload";

interface IProps {
  room: TRoom;
}

const MsgRoom = ({ room }: IProps) => {
  const auth = useAppSelector((state) => state.auth);
  const [usrr] = useGetUsers();
  const [formValue, setFormValue] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File>();
  const dummy = useRef<HTMLSpanElement>(null);

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formValue !== "") {
      const tempUser = room.users.map((usr) => {
        if (usr !== auth.user.id) {
          return { uid: usr, open: false };
        }
      });
      const filteredUsers = tempUser.filter((usr) => {
        if (usr !== undefined) return usr;
      });

      try {
        await updateDoc(room.ref, {
          messages: arrayUnion(
            ...[
              {
                text: formValue,
                createdAt: Timestamp.now(),
                uid: auth.user.id,
                recieved: filteredUsers,
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

    await uploadBytes(storageRef, selectedFile!).then((snapshot) => {
      console.log(snapshot);
      console.log("Uploaded a blob or file!");
    });

    await getDownloadURL(storageRef).then(async (url) => {
      console.log(url);

      const tempUser = room.users.map((usr) => {
        if (usr !== auth.user.id) {
          return { uid: usr, open: false };
        }
      });
      const filteredUsers = tempUser.filter((usr) => {
        if (usr !== undefined) return usr;
      });

      try {
        await updateDoc(room.ref, {
          messages: arrayUnion(
            ...[
              {
                text: url,
                createdAt: Timestamp.now(),
                uid: auth.user.id,
                recieved: filteredUsers,
              },
            ]
          ),
          users: room.users,
        });
      } catch (err) {
        console.error(err);
      }
    });
  };

  useEffect(() => {
    dummy.current?.scrollIntoView();
  }, [room]);

  return (
    <div
      className="w-9/12 m-auto"
      style={{
        height: "80vh",
        overflow: "auto",
      }}
    >
      {room.messages &&
        room.messages.map((msg, i) => {
          const dateTime = new Date(msg.createdAt.seconds * 1000)
            .toLocaleString("sv-SE")
            .substring(0, 16)
            .slice(5)
            .replace("-", "/");

          return (
            <>
              {msg.uid === auth.user.id ? (
                <div key={i} className="flex flex-row-reverse">
                  {usrr &&
                    usrr.map((usr, i) => {
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
                            key={i}
                          />
                        );
                      }
                    })}
                  <S.TextMessageFB className="w-full m-3">
                    <span className="text-white pl-2">
                      {usrr &&
                        usrr.map((usr) => {
                          if (msg.uid === usr.id) {
                            return usr.username;
                          }
                        })}
                    </span>
                    <span className="text-white pl-16 float-right">
                      {dateTime && dateTime}
                    </span>
                    {msg.text.startsWith("https") ? (
                      <a
                        href={msg.text}
                        target="_blank"
                        className="text-blue-800 block"
                      >
                        Link to file
                      </a>
                    ) : (
                      <p className="p-1">{msg.text}</p>
                    )}
                  </S.TextMessageFB>
                </div>
              ) : (
                <div key={i} className="flex flex-row">
                  {usrr &&
                    usrr.map((usr, i) => {
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
                            key={i}
                          />
                        );
                      }
                    })}
                  <S.TextMessageFB className="w-64 m-3">
                    <span className="text-white pl-2">
                      {usrr &&
                        usrr.map((usr) => {
                          if (msg.uid === usr.id) {
                            return usr.username;
                          }
                        })}
                    </span>
                    <span className="text-white pl-16 float-right">
                      {dateTime && dateTime}
                    </span>
                    {msg.text.startsWith("https") ? (
                      <a
                        href={msg.text}
                        target="_blank"
                        className="text-blue-800 block"
                      >
                        Link to file
                      </a>
                    ) : (
                      <p className="p-1">{msg.text}</p>
                    )}
                  </S.TextMessageFB>
                  {/* <span ref={dummy}></span> */}
                </div>
              )}
            </>
          );
        })}
      <div>
        <div className="ml-1 text-white pt-8">
          <input
            type="file"
            name="file"
            id="file"
            onChange={handleFile}
            style={{ display: "none" }}
          />
          <label htmlFor="file">
            <UploadIcon />
          </label>
          {selectedFile ? (
            <button
              onClick={handleUpload}
              className="text-green-800 hover:text-green-400"
            >
              Send
            </button>
          ) : (
            <button className="text-red-800 hover:text-red-400">Send</button>
          )}
          {/* <button onClick={handleUpload}>Send</button> */}
        </div>
        <form onSubmit={sendMessage} className="m-auto w-full">
          <Input
            ref={dummy}
            sx={{
              margin: "3px",
              padding: "2px",
              backgroundColor: "white",
              width: "90%",
              height: "40px",
            }}
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="Write something.."
            inputProps={{ maxLength: 96 }}
          />
          <Button
            type="submit"
            variant="text"
            sx={{
              backgroundColor: "lightblue",
              height: "40px",
              marginBottom: "5px",
              ":hover": {
                backgroundColor: "darkblue",
                color: "lightblue",
              },
            }}
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

export default MsgRoom;
