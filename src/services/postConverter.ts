import {
  DocumentData,
  DocumentReference,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from "firebase/firestore";

type TRoom = {
  messages: [
    {
      message: string;
      uid: string;
    }
  ];
  users: string[];
  id: string;
  roomName?: string;
};

type TUser = {
  id: string;
  email: string;
  role: string;
  username: string;
};

export const roomConverter: FirestoreDataConverter<TRoom> = {
  toFirestore(post: WithFieldValue<TRoom>): DocumentData {
    return { id: post.id };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): TRoom {
    const data = snapshot.data();
    return {
      messages: data.messages,
      users: data.users,
      id: snapshot.id,
      roomName: data?.roomName,
    };
  },
};

export const userConverter: FirestoreDataConverter<TUser> = {
  toFirestore(post: WithFieldValue<TUser>): DocumentData {
    return { id: post.id };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): TUser {
    const data = snapshot.data();
    return {
      email: data.email,
      role: data.role,
      id: snapshot.id,
      username: data.username,
    };
  },
};

export default roomConverter;
