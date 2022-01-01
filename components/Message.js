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
          <div style={{display: 'flex', justifyContent: 'center'}}>
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
            <div style={{ display: "flex", justifyContent: "center",textAlign: "center",alignItems: "center",paddingLeft:10}}>{message.message}</div>
          </div>
        ) : (
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <div style={{ display: "flex", justifyContent: "center",textAlign: "center",alignItems: "center",paddingRight:10}}>{message.message}</div>
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
  background-color: #056162;
  box-shadow:inset 10px 10px 10px rgba(0,0,0,0.05),
  15px 25px 10px rgba(0,0,0,0.05),
  15px 20px 20px rgba(0,0,0,0.05),
  inset -10px -10px 15px rgba(5,97,98,0.9);
  color:white;
  }
`;

const Reciever = styled(MessageElement)`
  background-color: #262d31;
  text-align: left;
  box-shadow:inset 10px 10px 10px rgba(0,0,0,0.05),
  15px 25px 10px rgba(0,0,0,0.05),
  15px 20px 20px rgba(0,0,0,0.05),
  inset -10px -10px 15px rgba(38, 45, 49,0.9);
  color:white;
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
