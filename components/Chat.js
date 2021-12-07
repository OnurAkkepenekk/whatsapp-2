import { Avatar } from "@material-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import { getDocs, collection, query, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useRouter } from "next/dist/client/router";

function Chat({ id, users }) {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [recipientData, setRecipientData] = useState(null);
  const recipientEmail = getRecipientEmail(users, user);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    (async () => {
      const recipientData = await getRecipientInformation();
      setRecipientData(recipientData);  
    })()
    console.log("Buraya baksana");
    console.log(recipientData);
  }, []);

  const getRecipientInformation = async () => {
    const usersRef = collection(db, "users");
    const recipientQuery = query(
      usersRef,
      where("email", "==", recipientEmail)
    );
    const recipientSnapshot = await getDocs(recipientQuery);
    const recpDoc = recipientSnapshot.docs.find(
      (user) => user.data().email === recipientEmail
    );
    console.log(recpDoc);
    const recipient = recipientSnapshot?.docs?.[0]?.data();
    return recipient;
  };
  const enterChat = () => {
    router.push(`/chat/${id}`);
  };
  return (
    <Container onClick={enterChat}>
      {recipientData ? (
        <UserAvatar src={recipientData?.photoURL} />
      ) : (
        <UserAvatar>{recipientEmail[0]}</UserAvatar>
      )}
      <p>{recipientEmail}</p>
    </Container>
  );
}

export default Chat;

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  word-break: break-word;

  :hover {
    background-color: #e9eaeb;
  }
`;
const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`;
