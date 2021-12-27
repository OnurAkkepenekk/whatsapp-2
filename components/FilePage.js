/* eslint-disable @next/next/no-img-element */
import { ImageList, ImageListItem } from "@material-ui/core";
import { ref, getDownloadURL } from "firebase/storage";

function FilePage({ itemRefs }) {
  return (
    <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
      {itemRefs.map((item) => (
        <ImageListItem key={item.name}>
          <img
            src={`${item.fullPath}`}
            alt={item.name}
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}

export default FilePage;
