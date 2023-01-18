import { arrayUnion, Timestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { storage } from "../firebase";
import { useAppSelector } from "../redux/hooks";
import { TRoom } from "../services/postConverter";
import { useGetUsers } from "../services/useGetUsers";
import UploadIcon from "@mui/icons-material/Upload";
import { Button, Input } from "@mui/material";

interface IProps {
  room: TRoom;
}

const SendMessage = ({ room }: IProps) => {
  const auth = useAppSelector((state) => state.auth);
  const [usrr] = useGetUsers();
  const [formValue, setFormValue] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File>();

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
      console.log("Uploaded a file!");
    });

    await getDownloadURL(storageRef).then(async (url) => {
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

  return (
    <div
      style={{
        position: "fixed",
        bottom: "15px",
        right: "14%",
        width: "40%",
        marginLeft: "1em",
      }}
    >
      <div className="ml-1 text-white pt-8">
        <input
          type="file"
          name="file"
          id="file"
          onChange={handleFile}
          style={{ display: "none" }}
        />
        <label htmlFor="file" className="hover:text-blue-300">
          <UploadIcon />
        </label>
        {selectedFile ? (
          <button
            onClick={handleUpload}
            className="text-green-800 hover:text-green-400 pl-1"
          >
            Send file
          </button>
        ) : (
          <button className="text-red-800 hover:text-red-400 pl-1">
            Send file
          </button>
        )}
      </div>
      <form onSubmit={sendMessage} className="m-auto w-full flex flex-row">
        {/* <Button
          type="submit"
          variant="text"
          sx={{
            backgroundColor: "#323348",
            color: "lightblue",
            height: "40px",
            marginBottom: "5px",
            ":hover": {
              backgroundColor: "lightblue",
              color: "darkblue",
            },
          }}
        >
          Send
        </Button> */}

        <Input
          sx={{
            margin: "3px",
            padding: "2px",
            backgroundColor: "white",
            width: "90%",
            height: "50px",
            borderRadius: "10px",
          }}
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Write something.."
          id="msgSend"
          inputProps={{
            maxLength: 96,
          }}
        />
        <button
          id="msgBtn"
          type="submit"
          className="text-blue-400 hover:text-blue-200 pl-2"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default SendMessage;
