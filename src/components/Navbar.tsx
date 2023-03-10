import {
  AppBar,
  Button,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";
import { logout } from "../contexts/authContext";
import { updateDetails } from "../redux/auth";
import { useAppDispatch } from "../redux/hooks";
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
            backgroundColor: "#141414",
            display: "flex",
            zIndex: 1,
          }}
        >
          <Typography variant="h6" color="white" sx={{ marginLeft: "20px" }}>
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
              <Link href="/" id="profLink">
                Profile
              </Link>
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
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
