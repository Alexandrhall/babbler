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
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { database } from "../firebase";
import { useAppSelector } from "../redux/hooks";
import { TRoom, TUser } from "../services/postConverter";
import { useGetUsers } from "../services/useGetUsers";

interface IProps {
  room: TRoom;
}

const AddUserRoom = ({ room }: IProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [usrr] = useGetUsers();
  const auth = useAppSelector((state) => state.auth);
  const [formValue, setFormValue] = useState<string>("");
  let users: TUser[] = [];

  if (usrr) {
    users = [...usrr];
  }

  const handleAdd = async () => {
    if (formValue !== "") {
      await updateDoc(room.ref, {
        users: arrayUnion(formValue),
      });
      setOpen(false);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (
    e: React.SyntheticEvent<Element, Event>,
    value: TUser | null
  ) => {
    if (value) setFormValue(value.id);
  };

  return (
    <>
      <Button
        sx={{
          backgroundColor: "#323348",
          color: "lightblue",
          height: "40px",
          marginLeft: "10px",
          margin: "0px 5px 0px 5px",
          ":hover": {
            backgroundColor: "lightblue",
            color: "darkblue",
          },
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
              if (usr.id !== auth.user.id && !room.users.includes(usr.id))
                return usr;
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
          <Button onClick={handleAdd}>Create</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddUserRoom;
