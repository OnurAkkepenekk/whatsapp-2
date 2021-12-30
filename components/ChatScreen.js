import * as React from "react";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Modal,
} from "@material-ui/core";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
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
  onSnapshot,
} from "firebase/firestore";
import TimeAgo from "timeago-react";
import { ref, uploadBytes, listAll } from "firebase/storage";
import { StyledButton } from "./SideBar";
import FilePage from "./FilePage";

function ChatScreen({ chat, messages }) {
  const [user] = useAuthState(auth);
  const [input, setInput] = useState("");
  const router = useRouter();
  const endOfMessagesRef = useRef(null);
  const [messagesSnapshot, setMessagesSnapshot] = useState(null);
  const [recipientSnapshot, setRecipientSnapshot] = useState(null);
  const recipientEmail = getRecipientEmail(chat.users, user);

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
    console.log("The new ID is " + docRef.id);

    setInput("");
    const messagesDocs = await getMessages();
    setMessagesSnapshot(messagesDocs);
    scrollToBottom();
  };
  useEffect(() => {
    scrollToBottom();
  });
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const [openModal, setOpenModal] = React.useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);
  const handleOpenImageModal = () => setOpenImageModal(true);
  const handleCloseImageModal = () => setOpenImageModal(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const [storageRef, setStorageRef] = useState("");
  const uploadFiles = (e) => {
    const file = e.target.files[0];
    const fileName = `images/${e.target.files[0].name}`;
    const storageRef = ref(storage, fileName);
    setStorageRef(storageRef);
    uploadBytes(storageRef, file)
      .then((snapshot) => {
        setOpenModal(true);
        setIsUploaded(true);
      })
      .catch(() => {
        setIsUploaded(false);
      });
  };
  const [images, setImages] = useState([]);
  useEffect(() => {
    showFiles();
  }, []);
  const showFiles = () => {
    const listRef = ref(storage, "/images");
    listAll(listRef)
      .then((res) => {
        res.prefixes.forEach((folderRef) => {
          // All the prefixes under listRef.
          // You may call listAll() recursively on them.
        });
        res.items.forEach((itemRef) => {
          // All the items under listRef.
          setImages((arr) => [...arr, itemRef]);
        });
        //return <FilePage itemRef={res.items} />;
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
        console.log(error);
      });
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
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
            <IconButton>
              <label htmlFor="files">
                <AttachFileSharp />
              </label>
            </IconButton>
            <Modal
              open={openModal}
              onClose={handleCloseModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                {isUploaded ? (
                  <p>File uploaded successfully!</p>
                ) : (
                  <p>File could not uploaded successfully!</p>
                )}
                <StyledButton>
                  <Button
                    onClick={() => {
                      handleCloseModal();
                    }}
                    variant="text"
                    style={{
                      color: "green",
                    }}
                  >
                    OK
                  </Button>
                </StyledButton>
              </Box>
            </Modal>
            <IconButton onClick={handleClick}>
              <MoreVertIcon />
              <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleOpenImageModal();
                  }}
                >
                  Files
                </MenuItem>
              </Menu>
            </IconButton>
            <Modal
              open={openImageModal}
              onClose={handleCloseImageModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                {images ? (
                  <FilePage itemRefs={images} />
                ) : (
                  console.log("image yok")
                )}
                <StyledButton>
                  <Button
                    onClick={() => {
                      handleCloseImageModal();
                    }}
                    variant="text"
                    style={{
                      color: "green",
                    }}
                  >
                    OK
                  </Button>
                </StyledButton>
              </Box>
            </Modal>
          </HeaderIcons>
        </Header>

        <MessageContainer>
          {showMessages()}
          <EndOfMessage ref={endOfMessagesRef} />
        </MessageContainer>
        <InputContainer>
          <InsertEmoticon />
          <Input
            value={input}
            placeholder="Type a message"
            onChange={(e) => setInput(e.target.value)}
          />
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
  align-items: center;
  padding: 12px;
  position: sticky;
  bottom: 0;
  border: solid 0px;
  transition: 0.7s;
  border-radius: 50px;
  width: 350px;

  background: #ffffff;
  box-shadow: 9px 9px 27px #b3b3b3, -9px -9px 27px #ffffff;
  margin-right: 10px;
  margin-left: 10px;

  :focus {
    width: 100%;
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
  background: rgba(255, 255, 255, 0.57);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.26);
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
