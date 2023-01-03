import styles from "../styles/Home.module.css";
import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { database } from "../src/firebase";
import Button from "@mui/material/Button";
import { useAppDispatch, useAppSelector } from "../src/redux/hooks";
import {
  decrement,
  increment,
  incrementByAmount,
} from "../src/redux/counterSlice";
import Test from "../src/components/Test";
import { useRouter } from "next/router";
import { logout, useAuth } from "../src/contexts/authContext";
import { updateDetails } from "../src/redux/auth";
import { IUserDetails } from "../services/getUserDetails";
import ChatRoom from "../src/components/ChatRoom";

interface IChildren {
  children: JSX.Element[];
}

export default function Home({ children }: IChildren): ReactNode {
  // const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [number, setNumber] = useState(0);
  const user = useAuth();

  const handleClick = () => {
    try {
      addDoc(collection(database, "test"), {
        testing: "testing",
      }).then((data) => {
        console.log(data.id);
      });
    } catch (err) {
      console.error(err);
    }
  };

  interface messageArray {
    createdAt: number;
    uid: string;
    text: string;
  }

  const messageRef = collection(database, "messages");
  const q = query(messageRef, orderBy("createdAt"), limit(25));
  const array: messageArray[] = [];
  getDocs(q).then((snapshot) => {
    snapshot.forEach((doc) => {
      array.push(doc.data() as messageArray);
    });
  });

  // useEffect(() => {
  //   getDocs(collection(database, "users")).then((snapshot) => {
  //     snapshot.forEach((doc) => {
  //       console.log(doc.data());
  //     });
  //   });

  useEffect(() => {
    user === null ? router.push("/login") : router.push("/");
  }, [user]);

  return (
    <>
      <main className={styles.main}>
        <ChatRoom />
        <div>
          <Button
            variant="contained"
            onClick={async () => {
              await addDoc(collection(database, "messages"), {
                text: "dinjäkel",
                createdAt: serverTimestamp(),
                uid: user!.uid,
              });
            }}
          >
            Klicka här
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              dispatch(increment());
            }}
          >
            Öka med 1
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              dispatch(decrement());
            }}
          >
            Minska med 1
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              router.push("/login");
            }}
          >
            login
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              logout();
              dispatch(
                updateDetails({
                  user: {
                    id: "",
                    role: "",
                    email: "",
                  },
                  msg: "",
                })
              );
              router.push("/login");
            }}
          >
            logout
          </Button>
          {/* <div>
            <input
              type="number"
              name="number"
              onChange={(e) => {
                if (e.target.value === "") {
                  setNumber(0);
                } else {
                  setNumber(parseInt(e.target.value));
                }
              }}
              value={number}
            />
            <button
              onClick={() => {
                dispatch(incrementByAmount(number));
              }}
            >
              Öka med {number}
            </button>
          </div> */}
          <Test />
        </div>
      </main>
    </>
  );
}
