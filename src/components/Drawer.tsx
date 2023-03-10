import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import CreateRoom from "./CreateRoom";
import { useAppSelector } from "../redux/hooks";
import { useGetRoom } from "../services/useGetRoom";
import { useGetUsers } from "../services/useGetUsers";
import { useEffect, useState } from "react";
import { TRoom } from "../services/postConverter";
import Link from "next/link";
import { ListItemButton } from "@mui/material";
import { v4 as uuidv4 } from "uuid";

const drawerWidth = {
  width: 120,
  "@media (min-width: 780px)": {
    width: 220,
  },
};

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth.width}px`,
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
  }, [dm, auth.user.id]);

  useEffect(() => {
    const res =
      rooms &&
      rooms.filter((room) => {
        if (room.users.includes(auth.user.id)) return room;
      });
    if (res) {
      setPersonalRooms(res);
    }
  }, [rooms, auth.user.id]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Box sx={{ display: "flex" }} key={uuidv4()}>
        <Drawer
          key={uuidv4()}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: "#1F1F1F",
              // marginTop: "60px",
              zIndex: 0,
            },
          }}
          variant="permanent"
          anchor="left"
          open={open}
        >
          <DrawerHeader key={uuidv4()} />
          <Divider />
          <List>
            <CreateRoom />
            <ListItemText className="text-white p-3">
              <h4 className="font-bold">Rooms</h4>
              {personalRooms &&
                personalRooms.map((room) => {
                  let num = 0;
                  room.messages.forEach((msg) => {
                    if (msg.recieved) {
                      msg.recieved.filter((rec) => {
                        if (rec.uid === auth.user.id && rec.open === false)
                          num++;
                      });
                    }
                  });

                  return (
                    <Link href={`/rooms/${room.id}`} key={uuidv4()}>
                      <ListItemButton>
                        <React.Fragment key={uuidv4()}>
                          <span id={room.roomName}>{room.roomName} </span>
                          <span className="ml-1 pl-1">
                            {" "}
                            {num === 0 ? null : num}
                          </span>
                        </React.Fragment>
                      </ListItemButton>
                    </Link>
                  );
                })}
            </ListItemText>

            <ListItemText className="text-white p-3">
              <h4 className="font-bold">Direct Messages</h4>
              {personalDm &&
                personalDm.map((room) => {
                  let num = 0;
                  room.messages.forEach((msg) => {
                    if (msg.recieved) {
                      msg.recieved.filter((rec) => {
                        if (rec.uid === auth.user.id && rec.open === false)
                          num++;
                      });
                    }
                  });

                  return (
                    <Link href={`/directmessage/${room.id}`} key={uuidv4()}>
                      <ListItemButton>
                        {usrr &&
                          usrr.map((usr) =>
                            room.users.includes(usr.id) &&
                            usr.id !== auth.user.id ? (
                              <React.Fragment key={uuidv4()}>
                                <span id={usr.username}>{usr.username} </span>
                                <span className="ml-1 pl-1">
                                  {" "}
                                  {num === 0 ? null : num}
                                </span>
                              </React.Fragment>
                            ) : null
                          )}
                      </ListItemButton>
                    </Link>
                  );
                })}
            </ListItemText>
          </List>
        </Drawer>
        {/* <Main open={open}> */}
        {/* <DrawerHeader /> */}
        {/* </Main> */}
      </Box>
    </div>
  );
}
