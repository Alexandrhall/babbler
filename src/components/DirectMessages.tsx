import {
  collection,
  CollectionReference,
  query,
  where,
} from "firebase/firestore";
import React from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { database } from "../firebase";
import { useAppSelector } from "../redux/hooks";
import roomConverter from "../services/postConverter";

interface IProps {
  collectionRef: string;
}

const DirectMessages = ({ collectionRef }: IProps) => {
  const auth = useAppSelector((state) => state.auth);

  const queryRef = collection(database, collectionRef).withConverter(
    roomConverter
  );

  const q = query(queryRef, where("users", "array-contains", auth.user.id));

  const [data] = useCollectionData(q);

  return <div>DirectMessages</div>;
};

export default DirectMessages;
