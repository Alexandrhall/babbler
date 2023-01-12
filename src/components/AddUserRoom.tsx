import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { TUser } from "../services/postConverter";
import { useGetUsers } from "../services/useGetUsers";

const AddUserRoom = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [usrr] = useGetUsers();
  const auth = useAppSelector((state) => state.auth);
  let users: TUser[] = [];
  const router = useRouter();
  const param = router.query.RoomName;

  if (usrr) {
    users = [...usrr];
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleChange = (
    e: React.SyntheticEvent<Element, Event>,
    value: TUser | null
  ) => {
    console.log(value);
    console.log(param);
  };

  return (
    <div>
      <Button
        sx={{
          marginLeft: "10px",
          backgroundColor: "green",
        }}
        variant="contained"
        onClick={handleClickOpen}
      >
        Invite
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Invite</DialogTitle>
        <DialogContent>
          <DialogContentText>Invite people.</DialogContentText>
          {/* här ska du sätta in searchbar */}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddUserRoom;
