import * as React from "react";
import { Avatar, Button, IconButton, Tooltip } from "@material-ui/core";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import Message from "./Message";
import { useState, useEffect, useRef } from "react";
import getRecipientEmail from "../utils/getRecipientEmail";
import { InsertEmoticon, Mic, Close, Send } from "@material-ui/icons/";
import { AddPhotoAlternate, AttachFile } from "@material-ui/icons";
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
import { ref, uploadBytes, listAll } from "firebase/storage";
import dynamic from "next/dynamic";
import styles from "../styles/chatScreen.module.css";
import NewModal from "./NewModal";

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
  const [itemRefs, setItemRefs] = useState([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);

  useEffect(() => {
    (async () => {
      const messages = await getMessages();
      const recipientData = await getRecipientData();
      setMessagesSnapshot(messages);
      setRecipientSnapshot(recipientData);
      showFiles();
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

  useEffect(() => {
    scrollToBottom();
  }, [emojiOpen]);

  const getMessages = async () => {
    const chatRef = doc(db, "chats", router.query.id);
    const messagesRef = collection(chatRef, "messages");
    const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));
    const messagesDocs = (await getDocs(messagesQuery)).docs;
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

  const showFiles = () => {
    const listRef = ref(storage, "/images/" + router.query.id);
    listAll(listRef)
      .then((res) => {
        setItemRefs(res.items);
      })
      .catch((error) => {
        console.log(error);
      });
    console.log(itemRefs);
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
    if (isUploaded) {
      //mesaj kaydetsin
    }

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

  const uploadFiles = (e) => {
    const file = e.target.files[0];
    const fileName = `images/${router.query.id}/${e.target.files[0].name}`;
    const storageRef = ref(storage, fileName);
    uploadBytes(storageRef, file)
      .then((snapshot) => {
        setOpenModal(true);
        setIsUploaded(true);
        setItemRefs((arr) => [...arr, storageRef]);
      })
      .catch(() => {
        setOpenModal(true);
        setIsUploaded(false);
      });
  };

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
            <input
              name="btn-upload"
              type="file"
              id="files"
              onChange={uploadFiles}
              hidden
            />
            <IconButton style={{ color: "white" }}>
              <label htmlFor="files">
                <Tooltip title="Send image">
                  <AddPhotoAlternate />
                </Tooltip>
              </label>
            </IconButton>
            <NewModal
              text="File uploaded successfully!"
              openModal={openModal}
              setOpenModal={setOpenModal}
            />
            <IconButton
              style={{ color: "white" }}
              onClick={() => {
                setOpenImageModal(true);
              }}
            >
              <Tooltip title="Show images">
                <AttachFile />
              </Tooltip>
            </IconButton>
            <NewModal
              text=""
              openModal={openImageModal}
              setOpenModal={setOpenImageModal}
              itemRefs={itemRefs}
              chatId={router.query.id}
            ></NewModal>
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
            <Tooltip title="Open emoji board">
              <InsertEmoticon
                style={{ color: emojiOpen ? "#009688" : "white" }}
              />
            </Tooltip>
          </div>

          <Input
            value={input}
            placeholder="Type a message"
            onChange={(e) => setInput(e.target.value)}
          />
          <Button disabled={!input} type="submit" onClick={sendMessage}>
            <Tooltip title="Send Message">
              <Send style={{ color: input ? "#009688" : "white" }} />
            </Tooltip>
          </Button>
          <Tooltip title="Send voice message">
            <Mic style={{ color: "white" }} />
          </Tooltip>
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
    outline: none;
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
  color: white;
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
  background:url("https://user-images.githubusercontent.com/61885344/147869080-3d7b7dcb-a073-483e-85c7-3d4695e39d82.png");
  background-attachment: fixed;
  min-height: 90vh;
  margin-left: 10px;
  background-size:1900px;
`;

const EndOfMessage = styled.div`
  margin-bottom: 50px;
`;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
