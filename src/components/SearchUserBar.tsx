import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useGetUsers } from "../services/useGetUsers";
import { TUser } from "../services/postConverter";
import { useGetRoom } from "../services/useGetRoom";
import { useAppSelector } from "../redux/hooks";
import router from "next/router";
import { addDoc, collection } from "firebase/firestore";
import { database } from "../firebase";

export default function SearchUserBar() {
  const [usrr] = useGetUsers();
  const [dm] = useGetRoom("directMessages");
  const auth = useAppSelector((state) => state.auth);
  let users: TUser[] = [];

  if (usrr) {
    users = [...usrr];
  }

  const handleChange = async (
    e: React.SyntheticEvent<Element, Event>,
    value: TUser | null
  ) => {
    if (value?.id !== undefined && value?.id !== "") {
      const res =
        dm &&
        dm.filter((room) => {
          if (
            room.users.includes(value.id) &&
            room.users.includes(auth.user.id)
          ) {
            return room;
          }
        });
      if (res) {
        res.forEach((room) => {
          if (
            room.users.includes(value.id) &&
            room.users.includes(auth.user.id)
          ) {
            router.push(`/directmessage/${room.id}`);
          }
        });
      }
      if (res && res.length === 0) {
        try {
          const addRef = await addDoc(collection(database, "directMessages"), {
            messages: [],
            users: [auth.user.id, value.id],
          });
          router.push(`/directmessage/${addRef.id}`);
        } catch (err) {
          console.error(err);
        }
      }
    }
  };

  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={users.filter((usr) => {
        if (usr.id !== auth.user.id) return usr;
      })}
      getOptionLabel={(usr) => usr.username}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={handleChange}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Users" />}
    />
  );
}
