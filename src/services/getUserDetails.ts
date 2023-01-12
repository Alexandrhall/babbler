import { doc, getDoc } from "firebase/firestore";
import { database } from "../firebase";
import { IUserDetails } from "../models/IUserDetails";

export const getUserDetails = async (
  id: string
): Promise<IUserDetails | undefined> => {
  const docRef = doc(database, "users", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // console.log("Document data:", docSnap.data());

    // return database.formatDoc(docSnap);
    return { id: id, ...docSnap.data() } as IUserDetails;
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
    return undefined;
  }
};

export default getUserDetails;
