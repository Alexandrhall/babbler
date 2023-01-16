import {
  AppBar,
  Button,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import Link from "next/link";
import router from "next/router";
import React, { useState } from "react";
import { logout } from "../contexts/authContext";
import { updateDetails } from "../redux/auth";
import { useAppDispatch } from "../redux/hooks";
import { Link as Mlink } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchUserBar from "./SearchUserBar";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="relative" className="w-auto">
        <Toolbar
          sx={{
            height: "60px",
            backgroundColor: "#1B2430",
            display: "flex",
          }}
        >
          <Typography variant="h6" color="white">
            <Link href="/">BabbleR</Link>
          </Typography>
          <div className="w-full flex" style={{ justifyContent: "center" }}>
            <SearchUserBar />
          </div>
          <Button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            sx={{ color: "white" }}
          >
            <AccountCircleIcon />
            <KeyboardArrowDownIcon />
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleClose}>
              <Link href="/profile">Profile</Link>
            </MenuItem>
            <MenuItem
              onClick={() => {
                logout();
                dispatch(
                  updateDetails({
                    user: {
                      id: "",
                      role: "",
                      email: "",
                      username: "",
                    },
                    msg: "",
                  })
                );
                handleClose();
              }}
            >
              Logout
            </MenuItem>
          </Menu>

          {/* <Typography
            sx={{
              display: "flex",
              position: "relative",
              alignItems: "flex-end",
              // left: "80%",
              float: "right",
            }}
          >
            <Link href="/">Home</Link>
          </Typography> */}

          {/* <Typography
            sx={{
              display: "flex",
              position: "relative",
              alignItems: "flex-end",
              // left: "80%",
              marginLeft: "10px",
            }}
          >
            <Link href="/profile">Profile</Link>
          </Typography>
          <Button
            sx={{
              // left: "81%",
              height: "30px",
              width: "80px",
            }}
            variant="contained"
            onClick={() => {
              logout();
              dispatch(
                updateDetails({
                  user: {
                    id: "",
                    role: "",
                    email: "",
                    username: "",
                  },
                  msg: "",
                })
              );
            }}
          >
            logout
          </Button> */}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
