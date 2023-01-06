import {
  DocumentData,
  DocumentReference,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from "firebase/firestore";

type Post2 = {
  message: [];
  users: [];
  id: string;
  roomName?: string;
};

export const roomConverter: FirestoreDataConverter<Post2> = {
  toFirestore(post: WithFieldValue<Post2>): DocumentData {
    return { id: post.id };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Post2 {
    const data = snapshot.data();
    return {
      message: data.messages,
      users: data.users,
      id: snapshot.id,
      roomName: data?.roomName,
    };
  },
};

export default roomConverter;
