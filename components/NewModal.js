import { Modal, Box, Button } from "@material-ui/core";
import styled from "styled-components";
import FilePage from "./FilePage";

function NewModal({ text, openModal, setOpenModal,itemRefs }) {
  const handleCloseModal = () => setOpenModal(false);
  return (
    <Modal
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {itemRefs && text == "" && <FilePage itemRefs={itemRefs} />}
        {!itemRefs && <p>{text}</p>}
        <StyledButton>
          <Button
            onClick={() => {
              handleCloseModal();
            }}
            variant="text"
            style={{
              color: "green",
            }}
          >
            OK
          </Button>
        </StyledButton>
      </Box>
    </Modal>
  );
}

export default NewModal;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export const StyledButton = styled.div`
  position: absolute;
  bottom: 24px;
  right: 24px;
  padding: 24px 0px 0px 0px;
`;
