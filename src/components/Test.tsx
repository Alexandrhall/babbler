import React from "react";
import { useAppSelector } from "../redux/hooks";

const Test = () => {
  const count = useAppSelector((state) => state.counter.value);

  //   const getStuff = async () => {
  //     await getDocs(q).then((snapshot) => {
  //       const array: messageArray[] = [];
  //       snapshot.forEach((doc) => {
  //         array.push(doc.data() as messageArray);
  //       });
  //       setMessArray([...array]);
  //     });
  //     console.log("complete");
  //   };

  // const messageRef = collection(database, "messages");
  // const q = query(messageRef, orderBy("createdAt"), limit(25));
  // const array: messageArray[] = [];
  // getDocs(q).then((snapshot) => {
  //   snapshot.forEach((doc) => {
  //     array.push(doc.data() as messageArray);
  //   });
  // });

  // useEffect(() => {
  //   getDocs(collection(database, "users")).then((snapshot) => {
  //     snapshot.forEach((doc) => {
  //       console.log(doc.data());
  //     });
  //   });

  return <h1 className="text-white">{count}</h1>;
};

export default Test;
