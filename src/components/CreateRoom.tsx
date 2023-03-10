import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { database } from "../firebase";
import { useAppSelector } from "../redux/hooks";

export default function FormDialog() {
  const auth = useAppSelector((state) => state.auth);
  const [open, setOpen] = useState<boolean>(false);
  const [formValue, setFormValue] = useState<string>("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCreate = async () => {
    if (formValue !== "") {
      try {
        await addDoc(collection(database, "rooms"), {
          messages: [],
          roomName: formValue,
          users: [auth.user.id],
        });

        setFormValue("");
      } catch (err) {
        console.error(err);
      }
    }
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        id="addRoom"
        sx={{
          backgroundColor: "#323348",
          color: "lightblue",
          height: "40px",
          marginLeft: "10px",
          ":hover": {
            backgroundColor: "lightblue",
            color: "darkblue",
          },
        }}
        variant="contained"
        onClick={handleClickOpen}
        // style={}
      >
        Create Room
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create room</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Name your room and invite people.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Room name"
            type="text"
            fullWidth
            variant="standard"
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            onKeyUp={(e) => {
              if (e.keyCode === 13) {
                handleCreate();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreate} id="createBtn" autoFocus>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
