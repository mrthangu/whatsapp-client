import React, { useContext, useState, useEffect } from "react";
import { Box, styled, Typography, Button, Modal, List, ListItem, ListItemText } from "@mui/material";
import { GetApp as GetAppIcon, ArrowForward as ArrowForwardIcon } from "@mui/icons-material";

import { AccountContext } from "../../../context/AccountProvider";
import { getUsers, newMessages } from "../../../service/api";
import { downloadMedia, formatDate } from "../../../utils/common-utils";
import { iconPDF } from "../../../constants/data";

const Wrapper = styled(Box)`
  background: #ffffff;
  padding: 5px;
  max-width: 60%;
  width: fit-content;
  display: flex;
  border-radius: 10px;
  word-break: break-word;
`;

const Own = styled(Box)`
  background: #dcf8c6;
  padding: 5px;
  max-width: 60%;
  width: fit-content;
  margin-left: auto;
  display: flex;
  border-radius: 10px;
  word-break: break-word;
`;

const Text = styled(Typography)`
  font-size: 14px;
  padding: 0 25px 0 5px;
`;

const Time = styled(Typography)`
  font-size: 10px;
  color: #919191;
  margin-top: 6px;
  word-break: keep-all;
  margin-top: auto;
`;

const ForwardButton = styled(Button)`
  color: #1976d2;
  cursor: pointer;
`;

const ImageMessage = ({ message }) => {
  return (
    <div style={{ position: "relative" }}>
      {message?.text?.includes(".pdf") ? (
        <div style={{ display: "flex" }}>
          <img src={iconPDF} alt="pdf-icon" style={{ width: 80 }} />
          <Typography style={{ fontSize: 14 }}>
            {message.text.split("/").pop()}
          </Typography>
        </div>
      ) : (
        <img
          style={{ width: 300, height: "100%", objectFit: "cover" }}
          src={message.text}
          alt={message.text}
        />
      )}
      <Time style={{ position: "absolute", bottom: 0, right: 0 }}>
        <GetAppIcon
          onClick={(e) => downloadMedia(e, message.text)}
          fontSize="small"
          style={{
            marginRight: 10,
            border: "1px solid grey",
            borderRadius: "50%",
          }}
        />
        {formatDate(message.createdAt)}
      </Time>
    </div>
  );
};

const Message = ({ message }) => {
  const { account } = useContext(AccountContext);
  const [isForwardModalOpen, setForwardModalOpen] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, [setUsers]);

  const handleForward = async () => {
    try {
      const currentUser = account;
      const conv = "65585ba87c43e1a00b968616";

      const forwardData = {
        text: message.text,
        conversationId: conv,
        senderId: currentUser.sub,
        receiverId: selectedRecipient,
      };

      const response = await newMessages(forwardData);
      setForwardModalOpen(false);
      console.log("Forward Response:", response);
    } catch (error) {
      console.error('Error forwarding message:', error.message);
    }
  };

  const handleModalClose = () => {
    setForwardModalOpen(false);
  };

  return (
    <>
      {account.sub === message.senderId ? (
        <Own>
          {message.type === "file" ? (
            <ImageMessage message={message} />
          ) : (
            <TextMessage message={message} onForwardClick={() => setForwardModalOpen(true)} />
          )}
        </Own>
      ) : (
        <Wrapper>
          {message.type === "file" ? (
            <ImageMessage message={message} />
          ) : (
            <TextMessage message={message} onForwardClick={() => setForwardModalOpen(true)} />
          )}
        </Wrapper>
      )}

      {/* Forward Modal */}
      <Modal open={isForwardModalOpen} onClose={handleModalClose}>
        <Box sx={{ width: 300, padding: 2, position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <Typography variant="h6" gutterBottom>
            Forward to:
          </Typography>
          <List>
            {users.map((user) => (
              <ListItem button key={user.id} onClick={() => setSelectedRecipient(user.sub)}>
                <ListItemText primary={user.sub} />
              </ListItem>
            ))}
          </List>
          <ForwardButton onClick={handleForward}>
            <ArrowForwardIcon />
            Forward
          </ForwardButton>
        </Box>
      </Modal>
    </>
  );
};

const TextMessage = ({ message, onForwardClick }) => {
  return (
    <>
      <Text>{message.text}</Text>
      <Time>{formatDate(message.createdAt)}</Time>
      <ForwardButton onClick={onForwardClick}>
        <ArrowForwardIcon />
      </ForwardButton>
    </>
  );
};

export default Message;
