import styles from "../styles/Home.module.css";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../src/redux/hooks";
import { useRouter } from "next/router";
import { useAuth } from "../src/contexts/authContext";
import Navbar from "../src/components/Navbar";
import RoomList from "../src/components/RoomList";
import ChatRoom from "../src/components/ChatRoom";
import withAuth from "../src/components/withAuth";

interface IChildren {
  children: JSX.Element[];
}

function Home({ children }: IChildren) {
  const router = useRouter();
  const user = useAuth();
  const auth = useAppSelector((state) => state.auth);

  // useEffect(() => {
  //   if (user === null && auth.user.id === "") {
  //     router.replace("/login");
  //   }
  //   /* eslint-disable */
  // }, [auth, user]);

  return (
    <>
      <Navbar />
      <main className="flex flex-row">
        <RoomList />
        <div className="w-full">
          <ChatRoom />
        </div>
      </main>
    </>
  );
}

export default withAuth(Home);
