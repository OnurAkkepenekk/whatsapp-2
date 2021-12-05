import styled from "styled-components";
import Head from "next/head";
import SideBar from "../../components/SideBar";
import ChatScreen from "../../components/ChatScreen";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  getDocs,
  collection,
  query,
  orderBy,
  getDoc,
  doc,
} from "@firebase/firestore";
import { auth, db } from "../../firebase";
import getRecipientEmail from "../../utils/getRecipientEmail";

function Chat({ chat, messages }) {
  const [user] = useAuthState(auth);

  return (
    <Container>
      <Head>
        <title>Chat with {getRecipientEmail(chat.users, user)}</title>
      </Head>
      <SideBar />
      <ChatContainer>
        <ChatScreen chat={chat} messages={messages} />
      </ChatContainer>
    </Container>
  );
}

export default Chat;

export async function getServerSideProps(context) {
  const chatRef = doc(db, "chats", context.query.id);

  // * Make a query and get an Array of Docs (records[])
  // * PREP the messages on the server
  const messagesRef = collection(chatRef, "messages");
  const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));
  const messagesDocs = (await getDocs(messagesQuery)).docs;

  const messages = messagesDocs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((messages) => ({
      ...messages,
      timestamp: messages.timestamp?.toDate().getTime(),
    }));

  // * PREP the chats
  const chatRes = await getDoc(chatRef);

  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  };
  console.log(chat, messages);

  return {
    props: {
      messages: JSON.stringify(messages),
      chat: chat,
    },
  };
}

const Container = styled.div`
  display: flex;
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;

  ::-webkit-scrollbar {
    display: none;
  }
  --ms-overflow-style: none;
  scrollbar-width: none;
`;
