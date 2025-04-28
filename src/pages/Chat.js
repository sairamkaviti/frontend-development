import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Avatar,
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import SideNavBar from "../components/SideNavBar";
import TopNav from "../components/TopNav";
import { motion } from "framer-motion";
import Paper from "@mui/material/Paper";

const socket = io(process.env.REACT_APP_API_BASE_URL);

const Chat = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    axios.defaults.baseURL = "http://localhost:7386";
    fetchMessages();

    socket.emit("join", localStorage.getItem("userId"));

    socket.on("receive_message", (data) => {
      if (data.senderId === userId || data.receiverId === userId) {
        setMessages((prev) => [
          ...prev,
          {
            sender: data.senderId,
            message: data.message,
            createdAt: new Date().toISOString(),
            senderName: data.senderName || "User",
            senderProfilePic: data.senderProfilePic || "/default-avatar.png",
          },
        ]);
      }
    });

    socket.on("user_typing", (data) => {
      if (data.userId === userId) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000);
      }
    });

    return () => {
      socket.off("receive_message");
      socket.off("user_typing");
    };
  }, [userId]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`/chats/messages/${userId}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await axios.post(`/chats/send/${userId}`, { message: newMessage });

      socket.emit("send_message", {
        senderId: localStorage.getItem("userId"),
        receiverId: userId,
        message: newMessage,
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: localStorage.getItem("userId"),
          message: newMessage,
          createdAt: new Date().toISOString(),
          senderName: "You",
          senderProfilePic: "/default-avatar.png",
        },
      ]);

      setNewMessage("");
      scrollToBottom();
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const handleTyping = () => {
    socket.emit("typing", {
      userId: localStorage.getItem("userId"),
      toUserId: userId,
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      <SideNavBar />
      <TopNav />

      <Box
        sx={{
          height: "100vh",
          width: "100%",
          background: "linear-gradient(135deg, #c3ecf9 0%, #a1c4fd 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            height: "70vh",
            width: { xs: "95%", sm: "80%", md: "50%" },
            display: "flex",
            flexDirection: "column",
            borderRadius: 4,
            overflow: "hidden",
            backgroundColor: "white",
          }}
        >
          <Box
            sx={{ p: 2, borderBottom: "1px solid #ddd", textAlign: "center" }}
          >
            <Typography variant="h5" fontWeight="bold">
              Chat Room
            </Typography>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              p: 2,
              bgcolor: "#f7f9fc",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Stack spacing={2}>
              {messages.length === 0 && (
                <Typography variant="body2" color="gray">
                  No messages yet. Start the conversation!
                </Typography>
              )}
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    alignSelf:
                      msg.sender === localStorage.getItem("userId")
                        ? "flex-end"
                        : "flex-start",
                    backgroundColor:
                      msg.sender === localStorage.getItem("userId")
                        ? "#1976d2"
                        : "#e0e0e0",
                    color:
                      msg.sender === localStorage.getItem("userId")
                        ? "white"
                        : "black",
                    padding: "10px 15px",
                    borderRadius: "20px",
                    maxWidth: "70%",
                    wordBreak: "break-word",
                    fontSize: "14px",
                    position: "relative",
                  }}
                >
                  {msg.sender !== localStorage.getItem("userId") && (
                    <Box display="flex" alignItems="center" mb={0.5}>
                      <Avatar
                        src={msg.senderProfilePic}
                        alt="Profile"
                        sx={{ width: 24, height: 24, mr: 1 }}
                      />
                      <Typography variant="subtitle2" fontWeight="bold">
                        {msg.senderName}
                      </Typography>
                    </Box>
                  )}
                  <div>{msg.message}</div>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      mt: 0.5,
                      opacity: 0.7,
                      fontSize: "10px",
                      textAlign:
                        msg.sender === localStorage.getItem("userId")
                          ? "right"
                          : "left",
                    }}
                  >
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </Typography>
                </motion.div>
              ))}
              {isTyping && (
                <Typography
                  variant="body2"
                  sx={{ color: "gray", fontStyle: "italic", p: 1 }}
                >
                  User is typing... 💬
                </Typography>
              )}
              <div ref={messagesEndRef} />
            </Stack>
          </Box>

          <Box
            sx={{
              display: "flex",
              p: 2,
              borderTop: "1px solid #ddd",
              bgcolor: "#fff",
            }}
          >
            <TextField
              fullWidth
              placeholder="Type a message..."
              variant="outlined"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              sx={{
                borderRadius: "20px",
              }}
            />
            <Button
              onClick={handleSendMessage}
              variant="contained"
              sx={{ ml: 2, borderRadius: "20px" }}
            >
              Send
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default Chat;
