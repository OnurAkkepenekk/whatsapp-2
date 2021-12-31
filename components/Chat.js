import { Avatar } from "@material-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import { getDocs, collection, query, where,onSnapshot,orderBy } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useRouter } from "next/dist/client/router";
import TimeAgo from "timeago-react";
import styles from '../styles/loading.module.css'

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
  position:relative;
  color:white;
  border-top:0.1px solid #30383c;
 

  :hover {
    background:#30383c;
    border-top-left-radius:30px;
    border-bottom-left-radius:30px;

    ::before{
      content:'';
      position: absolute;
      right:0;
      width:50px;
      height:50px;
      
      border-radius:50%;
      top:-50px;
      box-shadow:25px 25px 0 #30383c;
  }   
  ::after{
      content:'';
      position: absolute;
      right:0;
      width:50px;
      height:50px;
      
      border-radius:50%;
      bottom:-50px;
      box-shadow:25px -25px 0 #30383c;
  }
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
