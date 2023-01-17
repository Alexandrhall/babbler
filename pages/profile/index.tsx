import {
  DocumentData,
  DocumentReference,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import withAuth from "../../src/components/withAuth";
import { storage } from "../../src/firebase";
import { useAppDispatch, useAppSelector } from "../../src/redux/hooks";
import { useGetUsers } from "../../src/services/useGetUsers";
import UploadIcon from "@mui/icons-material/Upload";
import { updateDetails } from "../../src/redux/auth";

const Profile = () => {
  const auth = useAppSelector((state) => state.auth);
  const [usrr] = useGetUsers();
  const [selectedFile, setSelectedFile] = useState<File>();
  const fileInput = useRef<HTMLInputElement>(null);
  const [usrPhoto, setUsrPhoto] = useState("");
  const [usrRef, setUsrRef] = useState<DocumentReference<DocumentData>>();
  const [changeName, setChangeName] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>(auth.user.username);
  const dispatch = useAppDispatch();

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const time = Timestamp.now();
    if (selectedFile) {
      try {
        const storageRef = ref(
          storage,
          `images/profilepic-${time.seconds}.jpg`
        );

        await uploadBytes(storageRef, selectedFile).then((snapshot) => {
          // console.log(snapshot);
          console.log("Uploaded a file!");
        });

        const urlString = await getDownloadURL(storageRef).then((url) => {
          return url;
        });
        if (urlString) {
          await updateDoc(usrRef!, {
            photoUrl: urlString,
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const removePicture = async () => {
    await updateDoc(usrRef!, {
      photoUrl:
        "https://firebasestorage.googleapis.com/v0/b/babbler-af9c3.appspot.com/o/images%2Fdefault-avatar.jpg?alt=media&token=bcebfc0d-2e0c-403a-8cfb-b388dd25f952",
    });
  };

  const changeUsername = async () => {
    setChangeName(!changeName);
    if (newName !== auth.user.username) {
      await updateDoc(usrRef!, {
        username: newName,
      }).then(() => {
        dispatch(
          updateDetails({
            user: {
              id: auth.user.id,
              role: auth.user.role,
              email: auth.user.email,
              username: newName,
            },
            msg: "",
          })
        );
      });
    }
  };

  useEffect(() => {
    usrr &&
      usrr.forEach((usr) => {
        if (usr.id === auth.user.id) {
          setUsrRef(usr.ref);
          setUsrPhoto(usr.photoUrl);
        }
      });
  }, [usrr]);

  return (
    <>
      <div
        className="text-white w-screen flex flex-col"
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          width: "70vw",
        }}
      >
        {/* <Card sx={{ width: "35vw", display: "flex", justifyContent: "center" }}> */}
        {/* <CardContent> */}
        <div className="flex flex-col">
          <img
            className="m-auto"
            src={usrPhoto}
            alt="test"
            id="profileImage"
            style={{ height: "200px", width: "200px", borderRadius: "50%" }}
          ></img>
          <label className="font-bold m-auto" htmlFor="profileImage">
            Profile Picture
          </label>
          <div className="text-white pt-2 flex flex-row content-between">
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
                className="text-green-800 hover:text-green-400 pl-1 mr-2"
              >
                Change Picture
              </button>
            ) : (
              <button className="text-red-800 hover:text-red-400 pl-1 mr-2">
                Change Picture
              </button>
            )}
            <button onClick={removePicture} className="hover:text-red-400">
              Remove
            </button>
          </div>
        </div>
        <div>
          <label className="font-bold">Email: </label>
          <span style={{ alignSelf: "center" }}>{auth.user.email}</span>
        </div>
        <div>
          <label className="font-bold">Username: </label>
          {changeName ? (
            <input
              maxLength={18}
              className="text-black"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            ></input>
          ) : (
            <span style={{ alignSelf: "center" }}>{auth.user.username}</span>
          )}

          <button
            onClick={changeUsername}
            style={{ marginLeft: "5px" }}
            className="text-orange-300 hover:text-orange-700"
          >
            Change
          </button>
        </div>
      </div>
    </>
  );
};

export default withAuth(Profile);
