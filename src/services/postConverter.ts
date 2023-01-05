import {
  DocumentData,
  DocumentReference,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from "firebase/firestore";

// type Post = {
//   author: string;
//   id: string;
//   ref: DocumentReference<DocumentData>;
//   title: string;
// };

interface messageArray {
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  id: string;
  text: string;
  username: string;
  ref: DocumentReference<DocumentData>;
}

type Post = {
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  id: string;
  text: string;
  username: string;
};

const postConverter: FirestoreDataConverter<Post> = {
  toFirestore(post: WithFieldValue<Post>): DocumentData {
    return { id: post.id, username: post.username };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Post {
    const data = snapshot.data(options);
    return {
      createdAt: data.createdAt,
      id: snapshot.id,
      username: data.username,
      text: data.text,
    };
  },
};

export default postConverter;
