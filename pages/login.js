import styled from "styled-components";
import Head from "next/head";
import { Button } from "@material-ui/core";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "@firebase/auth";
function Login() {
  const signIn = () => {
    signInWithPopup(auth, provider).catch(alert);
  };

  return (
    <div>
      <Container>
        <Head>
          <title>Login</title>
        </Head>

        <LoginContainer>
          <Logo src="https://user-images.githubusercontent.com/61885344/147849666-f005294c-83c9-4b48-9622-011f43cd4fbc.png" />
          <SignInButton onClick={signIn}>Sign in with Google</SignInButton>
        </LoginContainer>
      </Container>
    </div>
  );
}

export default Login;

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-color: whitesmoke;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: black;
  padding: 100px;
  border-radius: 15px;
  box-shadow: 0px 2px 10px -3px rgba(0, 0, 0, 0.7);
`;

const Logo = styled.img`
  height: 200px;
  width: 200px;
  margin-bottom: 50px;
  border: solid 2px white;
`;
const SignInButton = styled.button`
  margin-top: 50px;
  box-shadow: inset 0px 0px 7px 0px #29bbff;
  background-color: transparent;
  border-radius: 20px;
  display: inline-block;
  cursor: pointer;
  color: #ffffff;
  font-family: Arial;
  font-size: 15px;
  padding: 9px 23px;
  text-decoration: none;
  text-shadow: 0px 1px 0px #6b90ff;
`;
