import { collection, query } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { database } from "../firebase";
import { userConverter } from "./postConverter";

export const useGetUsers = () => {
  const usrRef = collection(database, "users").withConverter(userConverter);
  const [usrr] = useCollectionData(query(usrRef));

  return [usrr];
};
