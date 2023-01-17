import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import CreateRoom from "./CreateRoom";
import { useAppSelector } from "../redux/hooks";
import { useGetRoom } from "../services/useGetRoom";
import { useGetUsers } from "../services/useGetUsers";
import { useEffect, useState } from "react";
import { TRoom } from "../services/postConverter";
import Link from "next/link";
import { ListItemButton } from "@mui/material";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const auth = useAppSelector((state) => state.auth);
  const [dm] = useGetRoom("directMessages");
  const [rooms] = useGetRoom("rooms");
  const [usrr] = useGetUsers();
  const [personalDm, setPersonalDm] = useState<TRoom[]>();
  const [personalRooms, setPersonalRooms] = useState<TRoom[]>();

  useEffect(() => {
    const res =
      dm &&
      dm.filter((room) => {
        if (room.users.includes(auth.user.id)) return room;
      });
    if (res) {
      setPersonalDm(res);
    }
  }, [dm]);

  useEffect(() => {
    const res =
      rooms &&
      rooms.filter((room) => {
        if (room.users.includes(auth.user.id)) return room;
      });
    if (res) {
      setPersonalRooms(res);
    }
  }, [rooms]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <IconButton
        aria-label="open drawer"
        onClick={handleDrawerOpen}
        edge="start"
        sx={{
          mr: 2,
          ...(open && { display: "none" }),
          position: "absolute",
          color: "white",
          top: "10px",
          left: "10px",
        }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "inherit",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose} sx={{ color: "white" }}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <CreateRoom />

          <ListItemText className="text-white p-3">
            <h4 className="font-bold">Rooms</h4>
            {personalRooms &&
              personalRooms.map((room, i) => {
                let num = 0;
                room.messages.forEach((msg) => {
                  if (msg.recieved) {
                    msg.recieved.filter((rec) => {
                      if (rec.uid === auth.user.id && rec.open === false) num++;
                    });
                  }
                });

                return (
                  <Link href={`/rooms/${room.id}`} key={i}>
                    <ListItemButton>
                      <p>
                        {room.roomName}
                        {num === 0 ? null : num}
                      </p>
                    </ListItemButton>
                  </Link>
                );
              })}
          </ListItemText>

          <ListItemText className="text-white p-3">
            <h4 className="font-bold">Direct Messages</h4>
            {personalDm &&
              personalDm.map((room, i) => {
                let num = 0;
                room.messages.forEach((msg) => {
                  if (msg.recieved) {
                    msg.recieved.filter((rec) => {
                      if (rec.uid === auth.user.id && rec.open === false) num++;
                    });
                  }
                });

                return (
                  <Link href={`/directmessage/${room.id}`}>
                    <ListItemButton key={i}>
                      {usrr &&
                        usrr.map((usr, i) =>
                          room.users.includes(usr.id) &&
                          usr.id !== auth.user.id ? (
                            <>
                              <span key={i}>{usr.username} </span>
                              <span
                                className="ml-3 text-xl"
                                style={{
                                  backgroundColor: "gray",
                                  borderRadius: "30%",
                                }}
                              >
                                {" "}
                                {num === 0 ? null : num}
                              </span>
                            </>
                          ) : null
                        )}
                    </ListItemButton>
                  </Link>
                );
              })}
          </ListItemText>
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
      </Main>
    </Box>
  );
}
