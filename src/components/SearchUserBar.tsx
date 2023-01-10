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
  const [usrId, setUsrId] = React.useState("");

  if (usrr) {
    users = [...usrr];
  }

  const handleChange = async (
    e: React.SyntheticEvent<Element, Event>,
    value: TUser | null
  ) => {
    if (value?.id !== undefined && value?.id !== "") {
      let create = false;
      //   const res =
      dm &&
        dm.filter((room) => {
          if (
            room.users.includes(value.id) &&
            room.users.includes(auth.user.id)
          ) {
            router.push(`/directmessage/${room.id}`);
          } else {
            console.log("run");
            create = true;
          }
        });
      if (create) {
        try {
          await addDoc(collection(database, "directMessages"), {
            messages: [],
            users: [auth.user.id, value.id],
          });
          create = false;
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
