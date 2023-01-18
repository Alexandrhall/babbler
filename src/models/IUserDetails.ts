import { DocumentData, DocumentReference } from "firebase/firestore";

export interface IUserDetails {
  username: string;
  id: string;
  role: string;
  email: string;
  ref: DocumentReference<DocumentData>;
}
