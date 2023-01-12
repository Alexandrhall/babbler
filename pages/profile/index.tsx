import { Button, Card, CardContent, TextField } from "@mui/material";
import {
  DocumentData,
  DocumentReference,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import withAuth from "../../src/components/withAuth";
import { storage } from "../../src/firebase";
import { useAppSelector } from "../../src/redux/hooks";
import { useGetUsers } from "../../src/services/useGetUsers";

const Profile = () => {
  const auth = useAppSelector((state) => state.auth);
  const [usrr] = useGetUsers();
  const [selectedFile, setSelectedFile] = useState<File>();
  const fileInput = useRef<HTMLInputElement>(null);
  const [usrPhoto, setUsrPhoto] = useState("");
  const [usrRef, setUsrRef] = useState<DocumentReference<DocumentData>>();

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const time = Timestamp.now();
    // if (e.target.files) setSelectedFile(e.target.files[0]);
    console.log(selectedFile);
    if (selectedFile) {
      try {
        // const storageRef = ref(
        //   storage,
        //   `images/${selectedFile.name.replace(" ", "-")}`
        // );

        const storageRef = ref(
          storage,
          `images/profilepic-${time.seconds}.jpg`
        );

        await uploadBytes(storageRef, selectedFile).then((snapshot) => {
          console.log(snapshot);
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
      photoUrl: "",
    });
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

  useEffect(() => {
    console.log(usrPhoto);
  }, [usrPhoto]);

  return (
    <>
      <div
        className="text-white w-screen flex flex-col"
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <Card sx={{ width: "35vw", display: "flex", justifyContent: "center" }}>
          <CardContent>
            <div>
              <label className="font-bold">Profile Picture: </label>
              <img
                src={
                  usrPhoto === ""
                    ? "https://firebasestorage.googleapis.com/v0/b/babbler-af9c3.appspot.com/o/images%2Fdefault-avatar.jpg?alt=media&token=bcebfc0d-2e0c-403a-8cfb-b388dd25f952"
                    : usrPhoto
                }
                alt="test"
                style={{ height: "100px", borderRadius: "50%" }}
              ></img>
              <input
                type="file"
                name="file"
                // style={{ display: "none" }}
                ref={fileInput}
                onChange={handleFile}
              />
              <Button variant="outlined" onClick={handleUpload}>
                Change
              </Button>
              <Button variant="outlined" onClick={removePicture}>
                Remove
              </Button>
            </div>
            <div>
              <label className="font-bold">Email: </label>
              <span style={{ alignSelf: "center" }}>{auth.user.email}</span>
            </div>
            <div>
              <label className="font-bold">Username: </label>
              <span style={{ alignSelf: "center" }}>{auth.user.username}</span>
              <Button variant="outlined">Change</Button>
            </div>
            <div>
              <label className="font-bold">Role: </label>
              <span style={{ alignSelf: "center" }}>{auth.user.role}</span>
            </div>
            {/* <TextField
              id="outlined-basic"
              label={auth.user.username}
              variant="outlined"
              size="small"
              sx={{
                backgroundColor: "white",
                width: "300px",
                display: "flex",
                alignSelf: "center",
              }}
            /> */}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default withAuth(Profile);
