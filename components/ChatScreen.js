import { Avatar, IconButton } from "@material-ui/core";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../firebase";
import Message from "./Message";
import { useState, useEffect, useRef } from "react";
import getRecipientEmail from "../utils/getRecipientEmail";
import {
  InsertEmoticon,
  AttachFileSharp,
  Mic,
  Close,
  Send,
} from "@material-ui/icons/";
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
  onSnapshot,
} from "firebase/firestore";
import TimeAgo from "timeago-react";
import dynamic from "next/dynamic";
import styles from "../styles/chatScreen.module.css";
const Picker = dynamic(() => import("emoji-picker-react"), { ssr: false });

function ChatScreen({ chat, messages }) {
  const [user] = useAuthState(auth);
  const [input, setInput] = useState("");
  const router = useRouter();
  const endOfMessagesRef = useRef(null);
  const [messagesSnapshot, setMessagesSnapshot] = useState(null);
  const [recipientSnapshot, setRecipientSnapshot] = useState(null);
  const recipientEmail = getRecipientEmail(chat.users, user);
  const [emojiOpen, setEmojiOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const messages = await getMessages();
      const recipientData = await getRecipientData();
      setMessagesSnapshot(messages);
      setRecipientSnapshot(recipientData);
    })();
  }, [router.query.id]);

  useEffect(() => {
    const chatRef = doc(db, "chats", router.query.id);
    const messagesRef = collection(chatRef, "messages");
    return onSnapshot(
      query(messagesRef, orderBy("timestamp", "asc")),
      (snapshot) => {
        setMessagesSnapshot(snapshot.docs);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  const getMessages = async () => {
    const chatRef = doc(db, "chats", router.query.id);
    const messagesRef = collection(chatRef, "messages");
    const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));
    const messagesDocs = (await getDocs(messagesQuery)).docs;
    console.log(messagesDocs);
    return messagesDocs;
  };

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
          user={message.data()}
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

    // Store Message
    const chatRef = doc(db, "chats", router.query.id);
    const messagesRef = collection(chatRef, "messages");

    const docRef = await addDoc(messagesRef, {
      timestamp: Timestamp.now(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });
    console.log("The new ID is " + docRef.id);

    setInput("");
    const messagesDocs = await getMessages();
    setMessagesSnapshot(messagesDocs);
    scrollToBottom();
  };
  useEffect(() => {
    scrollToBottom();
  }, [emojiOpen]);

  const handleEmojiClick = (e, emojiObject) => {
    scrollToBottom();
    setInput(input + emojiObject.emoji);
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
          <div
            className={styles.chatWindowemojiarea}
            style={{ height: emojiOpen ? "200px" : "0px", marginBottom: 5 }}
          >
            <Picker
              onEmojiClick={handleEmojiClick}
              disableSearchBar
              disableSkinTonePicker
            />
          </div>
        </MessageContainer>

        <InputContainer>
          <div
            className={styles.chatWindowbtn}
            onClick={() => setEmojiOpen(false)}
            style={{ width: emojiOpen ? 40 : 0 }}
          >
            <Close style={{ color: "#919191" }} />
          </div>

          <div
            className={styles.chatWindowbtn}
            onClick={() => setEmojiOpen(true)}
          >
            <InsertEmoticon
              style={{ color: emojiOpen ? "#009688" : "#919191" }}
            />
          </div>

          <Input
            value={input}
            placeholder="Type a message"
            onChange={(e) => setInput(e.target.value)}
          />
          <button hidden disabled={!input} type="submit" onClick={sendMessage}>
            Send Message
          </button>
          <Mic />

          <button hidden disabled={!input} type="submit" onClick={sendMessage}>
            Send Message
          </button>
        </InputContainer>
      </Container>
    </div>
  );
}
export default ChatScreen;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Input = styled.input`
  align-items: center;
  padding: 12px;
  position: sticky;
  bottom: 0;
  border: solid 0px;
  transition: 0.7s;
  border-radius: 50px;
  width: 350px;

  background: #ffffff;
  margin-right: 10px;
  margin-left: 10px;

  :focus {
    width: 100%;
    outline:none;
  }
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 12px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
  /* From https://css.glass */
  background: rgba(30, 36, 40, 1);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  
`;

const Header = styled.div`
  position: sticky;
  background-color: #323739;
  z-index: 100;
  top: 0;
  display: flex;
  padding: 14px;
  height: 82px;
  align-items: center;
  color:white;
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
  background:#11181c;
  
  min-height: 90vh;
  margin-left: 10px;
  
`;

const EndOfMessage = styled.div`
  margin-bottom: 50px;
`;
