import styled from "styled-components";
import Head from "next/head";
import { Button } from "@material-ui/core";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "@firebase/auth";
import styles from '../styles/loading.module.css'
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
          <div className={styles.btndiv}>
          <SignInButton onClick={signIn} className={styles.btn}>Sign in with Google</SignInButton></div>
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
  background-color: #000;
  padding: 100px;
  border-radius: 15px;
  align-items:center;
  box-shadow: 0px 2px 10px -3px rgba(0, 0, 0, 0.7);
`;

const Logo = styled.img`
  height: 200px;
  width: 200px;
  margin-bottom: 50px;
  border: solid 2px #ff1f71;
`;
const SignInButton = styled.button`
width:200px;
height:50px;
background: rgba(255,255,255,0.05);
box-shadow: 0 15px 35px rgba(0,0,0,0.2);
border: 1px solid rgba(255,255,255,0.1);
border-radius:30px;
color:#fff;
z-index:1;
font-weight:400;
letter-spacing:1px;
overflow:hidden;
transition:0.5s;
position:relative;
backdrop-filter:blur(15px);
:hover{
  letter-spacing: 3px;
}
::before{
  content:'';
  position:absolute;
  top:0;
  left:0;
  width:50%;
  height:100%;
  background:linear-gradient(to left, rgba(255,255,255,0.15),transparent);
  transform:skewX(45deg) translateX(0);
  transition:0.5s;
}

`;
