/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import { ImageList, ImageListItem } from "@material-ui/core";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import { Card, Col, Image, Row } from "antd";
function FilePage({ itemRefs, chatId }) {
  const [imageUrls, setImageUrls] = React.useState([]);
  React.useEffect(() => {
    itemRefs.map((item) => {
      downloadFiles(item.name);
    });
  }, []);
  const downloadFiles = (url) => {
    const pathReference = ref(storage, "images/" + chatId + "/" + url);
    getDownloadURL(pathReference)
      .then((url) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = (event) => {
          const blob = xhr.response;
        };
        xhr.open("GET", url);
        xhr.send();
        //const image = document.getElementById("image");
        //image.src = url;
        setImageUrls((arr) => [...arr, url]);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      {imageUrls.map((item) => (
        <Col key={item.name} span={8} style={{ marginBottom: "10px"}}>
          <Card bordered={true} >
            <Image.PreviewGroup>
              <Image
                src={item}
                srcSet={item}
                alt={item}
                loading="lazy"
                style={{ height: "200px", width: "1000",padding: "5"}}
              />
            </Image.PreviewGroup>
          </Card>
        </Col>
      ))}
    </>
  );
}

export default FilePage;
