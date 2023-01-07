import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import router from "next/router";
import React from "react";
import { logout } from "../contexts/authContext";
import { updateDetails } from "../redux/auth";
import { useAppDispatch } from "../redux/hooks";
import { Link as Mlink } from "@mui/material";

const Navbar = () => {
  const dispatch = useAppDispatch();

  return (
    <>
      <AppBar position="relative" className="w-auto">
        {/* <CssBaseline /> */}
        <Toolbar
          sx={{
            height: "60px",
            // backgroundColor: "#484848",
            backgroundColor: "#1B2430",
            display: "flex",
          }}
        >
          <Typography variant="h6" color="white">
            <Link href="/">BabbleR</Link>
          </Typography>
          <Typography
            sx={{
              display: "flex",
              position: "relative",
              alignItems: "flex-end",
              left: "80%",
            }}
          >
            <Link href="/">Home</Link>
          </Typography>

          <Typography
            sx={{
              display: "flex",
              position: "relative",
              alignItems: "flex-end",
              left: "80%",
              marginLeft: "10px",
            }}
          >
            <Link href="/profile">Profile</Link>
          </Typography>
          <Button
            sx={{
              left: "81%",
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
              router.push("/login");
            }}
          >
            logout
          </Button>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
