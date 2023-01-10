import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useGetUsers } from "../services/useGetUsers";
import { TUser } from "../services/postConverter";
import { useGetRoom } from "../services/useGetRoom";

export default function SearchUserBar() {
  const [usrr] = useGetUsers();
  const [dm] = useGetRoom("directMessages");
  let users: TUser[] = [];
  const [usrId, setUsrId] = React.useState("");

  if (usrr) {
    users = [...usrr];
  }

  const handleChange = (
    e: React.SyntheticEvent<Element, Event>,
    value: TUser | null
  ) => {
    if (value?.id !== undefined) {
      console.log(value.id);
      dm && dm;
    }
  };

  React.useEffect(() => {
    console.log(usrId);
  }, [usrId]);

  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={users.map((usr) => usr)}
      getOptionLabel={(usr) => usr.username}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={handleChange}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Users" />}
    />
  );
}
