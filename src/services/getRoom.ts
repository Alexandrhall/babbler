import { collection, query } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { database } from "../firebase";
import roomConverter, { userConverter } from "./postConverter";

export const getRoom = (collectionRef: string) => {
  const ref = collection(database, collectionRef).withConverter(roomConverter);
  const q = query(ref);
  const [room] = useCollectionData(q);

  return [room];
};
