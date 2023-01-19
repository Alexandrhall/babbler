import React from "react";
import withAuth from "../src/components/withAuth";
import Profile from "../src/components/Profile";

const Home = () => {
  return (
    <div>
      <Profile />
    </div>
  );
};

export default withAuth(Home);
