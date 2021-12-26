import styled from "styled-components";
import IconButton from "@material-ui/core/IconButton";
import { Button, Avatar } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import * as EmailValidator from "email-validator";
import { auth, db } from "../firebase";
import { addDoc, getDocs, collection, query, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import Chat from "./Chat";

function SideBar() {
  const [user] = useAuthState(auth);
  const [flag, setFlag] = useState(0);
  const ChatRef = collection(db, "chats");
  const [userChats, setUserChats] = useState(null);

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

  const createChat = () => {
    const input = prompt(
      "Please enter a email adress for the user you wish to chat with."
    );

    if (!input) return null;

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
    }
  };
  return (
    <div>
      <Container>
        <Header>
          <UserAvatar src={user.photoURL} onClick={() => auth.signOut()} />

          <IconsContainer>
            <IconButton>
              <ChatIcon />
            </IconButton>
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </IconsContainer>
        </Header>

        <Search>
          <SearchIcon />
          <SearchInput placeholder="Search in chats" />
        </Search>

        <SidebarButton onClick={createChat}>Start a new chat</SidebarButton>

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

const SidebarButton = styled(Button)`
  width: 100%;
  &&& {
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
  }
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
