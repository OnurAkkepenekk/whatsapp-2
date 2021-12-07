import { Avatar, IconButton } from "@material-ui/core";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../firebase";
import Message from "./Message";
import { useState, useEffect, useRef } from "react";
import getRecipientEmail from "../utils/getRecipientEmail";
import { InsertEmoticon, AttachFileSharp, Mic } from "@material-ui/icons/";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {
  doc,
  Timestamp,
  collection,
  query,
  orderBy,
  where,
  getDocs,
  setDoc,
  addDoc,
} from "@firebase/firestore";
import TimeAgo from "timeago-react";

function ChatScreen({ chat, messages }) {
  console.log(chat);
  console.log(messages);

  const [user] = useAuthState(auth);
  const [input, setInput] = useState("");
  const router = useRouter();
  const endOfMessagesRef = useRef(null);
  const [messagesSnapshot, setMessagesSnapshot] = useState(null);
  const [recipientSnapshot, setRecipientSnapshot] = useState(null);

  const recipientEmail = getRecipientEmail(chat.users, user);

  const getMessages = async () => {
    const chatRef = doc(db, "chats", router.query.id);
    const messagesRef = collection(chatRef, "messages");
    const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));
    const messagesDocs = (await getDocs(messagesQuery)).docs;
    return messagesDocs;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const messages = await getMessages();
    setMessagesSnapshot(messages);

    const recipientData = await getRecipientData();
    setRecipientSnapshot(recipientData);
  }, [router.query.id]);

  const getRecipientData = async () => {
    const recipientQuery = query(
      collection(db, "users"),
      where("email", "==", recipientEmail)
    );
    const usersDocs = (await getDocs(recipientQuery)).docs;
    return usersDocs[0]?.data();
  };
  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      return JSON.parse(messages).map((message) => {
        return (
          <Message key={message.id} user={message.user} message={message} />
        );
      });
    }
  };

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    // Update last seen...
    const userRef = doc(db, "users", user.uid);
    setDoc(userRef, { lastSeen: Timestamp.now() }, { merge: true });

    const chatRef = doc(db, "chats", router.query.id);
    const messagesRef = collection(chatRef, "messages");

    const docRef = await addDoc(messagesRef, {
      timestamp: Timestamp.now(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });

    setInput("");
    const messagesDocs = await getMessages();
    setMessagesSnapshot(messagesDocs);
    scrollToBottom();
  };

  return (
    <div>
      <Container>
        <Header>
          {recipientSnapshot ? (
            <Avatar src={recipientSnapshot.photoURL} />
          ) : (
            <Avatar src={recipientEmail[0]} />
          )}
          <HeaderInformation>
            <h3>{recipientEmail}</h3>
            {recipientSnapshot ? (
              <p>
                Last active: {""}
                {recipientSnapshot?.lastSeen?.toDate() ? (
                  <TimeAgo datetime={recipientSnapshot?.lastSeen?.toDate()} />
                ) : (
                  "Unavailable"
                )}
              </p>
            ) : (
              <p>Loading last active...</p>
            )}
          </HeaderInformation>
          <HeaderIcons>
            <IconButton>
              <AttachFileSharp />
            </IconButton>
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </HeaderIcons>
        </Header>

        <MessageContainer>
          {showMessages()}
          <EndOfMessage ref={endOfMessagesRef} />
        </MessageContainer>
        <InputContainer>
          <InsertEmoticon />
          <Input value={input} onChange={(e) => setInput(e.target.value)} />
          <button hidden disabled={!input} type="submit" onClick={sendMessage}>
            Send Message
          </button>
          <Mic />
        </InputContainer>
      </Container>
    </div>
  );
}
export default ChatScreen;

const Container = styled.div``;

const Input = styled.input`
  flex: 1;
  align-items: center;
  padding: 12px;
  position: sticky;
  bottom: 0;
  background-color: white;
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 12px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
`;

const Header = styled.div`
  position: sticky;
  background-color: white;
  z-index: 100;
  top: 0;
  display: flex;
  padding: 14px;
  height: 82px;
  align-items: center;
  border-bottom: 3px solid whitesmoke;
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

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  min-height: 90vh;
`;

const EndOfMessage = styled.div`
  margin-bottom: 50px;
`;