/* eslint-disable @next/next/no-img-element */
import { Circle } from "better-react-spinkit";
import styles from '../styles/loading.module.css'

function Loading() {
  return (
    <center style={{display:"grid", placeItems: "center",height: "100vh"}}>
      <div>
      <div className={styles.loader}>
        <span className={styles.span1}></span>
        <span className={styles.span2}></span>
        <span className={styles.span3}></span>
        <h2>Loading...</h2>
    </div>
      </div>
    </center>
  );
}

export default Loading;
