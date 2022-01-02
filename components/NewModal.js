import { Modal, Box, Button } from "@material-ui/core";
import styled from "styled-components";
import FilePage from "./FilePage";
import { Row } from "antd";

function NewModal({ text, openModal, setOpenModal, itemRefs, chatId }) {
  const handleCloseModal = () => setOpenModal(false);
  console.log(itemRefs);
  return (
    <Modal
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <StyledBox>
        {itemRefs && text == "" && chatId && (
          <div
            className="site-card-wrapper"
            style={{ maxHeight: "600px", overflow: "scroll" , overflowX: "hidden" }}
          >
            <Row gutter={15} className="scrollable-container" style={{ backgroundColor: "black"}}>
              <FilePage itemRefs={itemRefs} chatId={chatId} />
            </Row>
          </div>
        )}
        {!itemRefs && !chatId && <p>{text}</p>}
        <Box>
          <StyledButton>
            <Button
              onClick={() => {
                handleCloseModal();
              }}
              variant="text"
              style={{
                color: "white",
                border: "1px solid gray",
                backgroundColor: "black"
                
              }}
            >
              CLOSE
            </Button>
          </StyledButton>
        </Box>
      </StyledBox>
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

const StyledBox = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1000;
  background-color: white;
  border: 2px solid #000;
  box-shadow: 24;
  p: 4;
`;
