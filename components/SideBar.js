import styled from "styled-components";
import IconButton from "@material-ui/core/IconButton";
import {
  Button,
  Avatar,
  Modal,
  Box,
  ButtonGroup,
  Input,
  TextField,
} from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import * as EmailValidator from "email-validator";
import { auth, db } from "../firebase";
import { addDoc, getDocs, collection, query, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import Chat from "./Chat";
import { Menu, MenuItem } from "@material-ui/core";
import * as React from "react";

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

function SideBar() {
  const [user] = useAuthState(auth);
  const [flag, setFlag] = useState(0);
  const ChatRef = collection(db, "chats");
  const [userChats, setUserChats] = useState(null);

  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const [email, setEmail] = useState(null);
  const handleChange = (e) => setEmail(e.target.value);

  useEffect(() => {
    (async () => {
      const chatsSnapshot = await getUserChats();
      setUserChats(chatsSnapshot);
    })();
  }, [flag]);
  // userChats
  const getUserChats = () => {
    const userChatRef = query(
      ChatRef,
      where("users", "array-contains", user.email)
    );
    const chatsSnapshot = getDocs(userChatRef);
    return chatsSnapshot;
  };

  const chatAlreadyExists = (recipientEmail) => {
    const data = userChats?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );

    return !!data;
  };

  const createChat = (input) => {
    console.log(input);
    if (!input) {
      setEmail(null);
      return alert("Please enter a input");
    }

    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExists(input) &&
      input !== user.email
    ) {
      // We need to add the chat into the DB 'chats' collection if it doesnt already exist and is valid
      const chatsRef = collection(db, "chats");
      addDoc(chatsRef, {
        users: [user.email, input],
      });
      let tmpFlag = flag + 1;
      setFlag(tmpFlag);
    } else {
      setEmail(null);
      return alert("Please enter a input");
    }
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
          <UserAvatar src={user.photoURL} />
          <IconsContainer>
            <IconButton onClick={handleOpenModal}>
              <ChatIcon />
            </IconButton>
            <Modal
              open={openModal}
              onClose={handleCloseModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <p>
                  Please enter an email adress for the user you wish to chat
                  with.
                </p>
                <TextField
                  id="standard-basic"
                  label="Email"
                  variant="standard"
                  onChange={handleChange}
                />
                <StyledButton>
                  <Button
                    onClick={() => {
                      createChat(email);
                      handleCloseModal();
                    }}
                    variant="text"
                    style={{
                      color: "green",
                    }}
                  >
                    Yes
                  </Button>
                  <Button
                    variant="text"
                    onClick={handleCloseModal}
                    style={{
                      color: "red",
                    }}
                  >
                    Cancel
                  </Button>
                </StyledButton>
              </Box>
            </Modal>
            <IconButton>
              <Button
                id="demo-positioned-button"
                aria-controls="demo-positioned-menu"
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              >
                <MoreVertIcon />
              </Button>
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
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={() => auth.signOut()}>Logout</MenuItem>
              </Menu>
            </IconButton>
          </IconsContainer>
        </Header>

        <Search>
          <SearchIcon />
          <SearchInput placeholder="Search in chats" />
        </Search>

        {/* List of chats */}
        {userChats?.docs.map((chat) => (
          <Chat key={chat.id} id={chat.id} users={chat.data().users} />
        ))}
      </Container>
    </div>
  );
}

export default SideBar;

const Container = styled.div`
  flex: 0.45;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }

  --ms-overflow-style: none;
  scrollbar-width: none;
`;

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;

const Search = styled.div`
  display: flex;
  align-items: center;
  padding: 5px;
  border-radius: 2px;
`;

const SearchInput = styled.input`
  outline-width: 0;
  border: none;
  flex: 1;
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }
`;

const IconsContainer = styled.div``;

const StyledButton = styled.div`
  position: absolute;
  bottom: 24px;
  right: 24px;
  padding: 24px 0px 0px 0px;
`;
