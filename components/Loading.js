/* eslint-disable @next/next/no-img-element */
import { Circle } from "better-react-spinkit";

function Loading() {
  return (
    <center style={{display:"grid", placeItems: "center",height: "100vh"}}>
      <div>
        <img
          src="https://user-images.githubusercontent.com/61885344/144241841-5bf7c7ab-5703-46db-93c6-0f2f5a214c48.png"
          alt=""
          height={200}
          style={{ marginBottom: 10 }}
        />
        <Circle color="#3CBC28" size={60} />
      </div>
    </center>
  );
}

export default Loading;
