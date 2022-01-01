/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import { ImageList, ImageListItem } from "@material-ui/core";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

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
    <ImageList cols={3} rowHeight={164}>
      {/* <FileDownloadIcon />
            <p>{item.name}</p> */}
      {/* <img src={item} alt={item} loading="lazy" /> */}
      {imageUrls.map((item) => (
        <ImageListItem key={item.name}>
          <img src={item} srcSet={item} alt={item} loading="lazy" />
        </ImageListItem>
      ))}
    </ImageList>
  );
}

export default FilePage;
