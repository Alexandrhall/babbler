import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { signInWithEmailAndPassword, User } from "firebase/auth";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { auth, database } from "../firebase";
import { updateDetails } from "../redux/auth";
import getUserDetails from "../services/getUserDetails";

interface IChildren {
  children: JSX.Element | JSX.Element[];
}

export interface IUserDetails {
  id: string;
  role: string;
  email: string;
  username: string;
}

export const AuthContext = createContext<User | null>(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function login(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
  return auth.signOut();
}

export const AuthProvider = ({ children }: IChildren) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const authRedux = useAppSelector((state) => state.auth);

  const logoutFailedLogin = useCallback(() => {
    logout();
    dispatch(
      updateDetails({
        user: {
          id: "",
          role: "",
          email: "",
          username: "",
        },
        msg: "Failed to login",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (currentUser) {
      const getUser = async () => {
        try {
          const promise = await getUserDetails(currentUser.uid);
          // const promise = await getDoc(doc(database, "users", currentUser.uid))
          if (promise && promise) {
            dispatch(
              updateDetails({
                user: {
                  id: promise.id,
                  role: promise.role,
                  email: promise.email,
                  username: promise.username,
                } as IUserDetails,
                msg: "",
              })
            );
          } else {
            logoutFailedLogin();
          }
        } catch (err) {
          logoutFailedLogin();
          console.log("Promise error", err);
        }
      };
      getUser();
    }
  }, [currentUser, dispatch, logoutFailedLogin]);

  // useEffect(() => {
  //   console.log(currentUser?.uid);
  // }, [currentUser]);

  return (
    <AuthContext.Provider value={currentUser}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
