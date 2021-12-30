import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth } from "../firebase";
import moment from "moment";
import { Button, Avatar } from "@material-ui/core";
function Message({ user, message }) {
  const [userLoggedIn] = useAuthState(auth);

  const TypeOfMessage = user.user === userLoggedIn.email ? Sender : Reciever;
  return (
    <Container>
      <TypeOfMessage>
        {TypeOfMessage === Reciever ? (
          <div>
            <div style={{ display: "inline-block" }}>
              <UserAvatar
                style={{
                  display: "inline-block",
                  margin: 5,
                  backgroundColor: "transparent",
                }}
                src={user.photoURL}
              />
            </div>
            <div style={{ display: "inline-block" }}>{message.message}</div>
          </div>
        ) : (
          <div>
            {message.message}
            <UserAvatar
              style={{ display: "inline-block" }}
              src={user.photoURL}
            />
          </div>
        )}

        <Timestamp>
          {message.timestamp ? moment(message.timestamp).format("LT") : "..."}
        </Timestamp>
      </TypeOfMessage>
    </Container>
  );
}

export default Message;

const Container = styled.div``;

const MessageElement = styled.p`
  width: fit-content;
  padding: 15px;
  border-radius: 35px;
  margin: 10px;
  min-width: 60px;
  padding-bottom: 26px;
  position: relative;
  text-align: right;  
`;

const Sender = styled(MessageElement)`
  margin-left: auto;
  background-color: #dcf8c6;
  box-shadow:inset 10px 10px 10px rgba(0,0,0,0.05),
  15px 25px 10px rgba(0,0,0,0.05),
  15px 20px 20px rgba(0,0,0,0.05),
  inset -10px -10px 15px rgba(220,248,198,0.9);
  ::before{
    content:'';
    position: absolute;
    top:-10px;
    right:0;
    width:30px;
    height:30px;
    border-radius:50%;
    background:black;
  }
`;

const Reciever = styled(MessageElement)`
  background-color: whitesmoke;
  text-align: left;
  box-shadow:inset 10px 10px 10px rgba(0,0,0,0.05),
  15px 25px 10px rgba(0,0,0,0.05),
  15px 20px 20px rgba(0,0,0,0.05),
  inset -10px -10px 15px rgba(255,255,255,0.9);
  ::before{
    content:'';
    position: absolute;
    top:-10px;
    left:0;
    width:30px;
    height:30px;
    border-radius:50%;
    background:black;
`;

const Timestamp = styled.span`
  position: absolute;
  color: gray;
  padding: 10px;
  font-size: 9px;
  bottom: 0;
  text-align: right;
  right: 0;
`;

const UserAvatar = styled(Avatar)`
  display: inline-block
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;
