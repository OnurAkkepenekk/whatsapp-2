/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import {
  Button,
  IconButton,
  ImageList,
  ImageListItem,
} from "@material-ui/core";
import { ref, getDownloadURL } from "firebase/storage";
//import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileDownloadIcon from "@material-ui/icons/FileCopy";
import { storage } from "../firebase";

function FilePage({ itemRefs }) {
  const downloadFiles = (url) => {
    const gsReference = ref(storage, `gs://bucket/images/${url}`);
    //const httpsReference = ref(storage, `https://firebasestorage.googleapis.com/b/bucket/o/images${url}`);

    getDownloadURL(gsReference)
      .then((url) => {
        // `url` is the download URL for 'images/stars.jpg'

        // This can be downloaded directly:
        const xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = (event) => {
          const blob = xhr.response;
        };
        xhr.open("GET", url);
        xhr.send();

        // Or inserted into an <img> element
        // const img = document.getElementById(url);
        // img.setAttribute("src", url);
        // setImages(url);

        setImages((arr) => [...arr, url]);
      })
      .catch((error) => {
        // Handle any errors
        console.log(error);
      });
  };
  return (
    <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
      {itemRefs.map((item) => (
        <ImageListItem key={item.name}>
          <IconButton onClick={() => downloadFiles(item.name)}>
            <FileDownloadIcon />
            <p>{item.name}</p>
            {/* <img src={`${item.fullPath}`} alt={item.name} loading="lazy" /> */}
          </IconButton>
        </ImageListItem>
      ))}
    </ImageList>
  );
}

export default FilePage;
