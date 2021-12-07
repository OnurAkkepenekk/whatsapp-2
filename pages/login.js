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
          <Logo src="https://user-images.githubusercontent.com/61885344/144241841-5bf7c7ab-5703-46db-93c6-0f2f5a214c48.png" />
          <Button onClick={signIn} variant="outlined">
            Sign in with Google
          </Button>
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
  background-color: #b0ffb0;
  padding: 100px;
  border-radius: 15px;
  box-shadow: 0px 2px 10px -3px rgba(0, 0, 0, 0.7);
`;

const Logo = styled.img`
  height: 200px;
  width: 200px;
  margin-bottom: 50px;
`;
