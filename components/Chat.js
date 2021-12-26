import { Avatar } from "@material-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import { getDocs, collection, query, where,onSnapshot,orderBy } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useRouter } from "next/dist/client/router";
import TimeAgo from "timeago-react";

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
    })();
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
    console.log(recipient);
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
      <HeaderInformation>
        <div>{recipientEmail}</div>
        {recipientData?.lastSeen?.toDate() ? (
          <p>
            <TimeAgo datetime={recipientData?.lastSeen?.toDate()} />
          </p>
        ) : (
          <p>Unavailable</p>
        )}
      </HeaderInformation>
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
  border-top: solid 0.1px white;

  :hover {
    background: rgba(244, 0, 0, 0.43);
box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
backdrop-filter: blur(11.1px);
-webkit-backdrop-filter: blur(11.1px);
  }
`;
const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`;

const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1;

  > h3 {
    margin-bottom: 3px;
  }
  > p {
    font-size: 14px;
    color: gray;
  }
`;
