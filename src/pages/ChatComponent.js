


import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import TopNav from "../components/TopNav";
import SideNavBar from "../components/SideNavBar";

const ChatComponent = () => {
  const { userId } = useParams(); // receiverId from URL

    const loggedInUser = useSelector(
      (store) => store.userDetailsReducer.userDetails
    );
    console.log(loggedInUser._id)
  const socketRef = useRef(null);
  const chatEndRef = useRef(null);

  const [receiverDetails, setReceiverDetails] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Connect socket and fetch user/chat data
  useEffect(() => {
    socketRef.current = io(REACT_APP_API_URL);
    socketRef.current.emit("join", loggedInUser._id);

    // Fetch receiver details
    fetch("REACT_APP_API_URL/api/user/getUserDetails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    })
      .then((res) => res.json())
      .then((data) => setReceiverDetails(data));

    // Fetch chat history
    fetch("REACT_APP_API_URL/getChat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user1: loggedInUser._id, user2: userId }),
    })
      .then((res) => res.json())
      .then((data) => setMessages(data));

    // Listen to incoming messages
    socketRef.current.on("receive_message", (data) => {
      const isRelevant =
        (data.senderId === loggedInUser._id && data.receiverId === userId) ||
        (data.senderId === userId && data.receiverId === loggedInUser._id);

      if (isRelevant) {
        setMessages((prev) => [...prev, data]);
      }
    });
console.log(loggedInUser);
    return () => {
      socketRef.current.disconnect();
    };
  }, [loggedInUser._id, userId]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newMsg = {
      senderId: loggedInUser._id,
      receiverId: userId,
      message,
    };

    // Save to DB
    await fetch("REACT_APP_API_URL/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMsg),
    });

    // Emit real-time message
    socketRef.current.emit("send_message", newMsg);

    // Update local messages for sender
    setMessages((prev) => [...prev, newMsg]);
    setMessage("");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

    return (
      <>
        <TopNav />
        <SideNavBar />
        <div style={styles.container}>
          <div style={styles.header}>
            <h3>
              {receiverDetails
                ? `Chat with ${receiverDetails.name}`
                : "Loading..."}
            </h3>
          </div>

          <div style={styles.chatBox}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  ...styles.messageWrapper,
                  justifyContent:
                    msg.senderId === loggedInUser._id
                      ? "flex-end"
                      : "flex-start",
                }}
              >
                <div
                  style={{
                    ...styles.messageBubble,
                    backgroundColor:
                      msg.senderId === loggedInUser._id ? "#dcf8c6" : "#ffffff",
                  }}
                >
                  {msg.message}
                </div>
              </div>
            ))}
            <div ref={chatEndRef}></div>
          </div>

          <div style={styles.inputArea}>
            <textarea
              style={styles.textarea}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              rows="1"
            />
            <button style={styles.sendButton} onClick={handleSendMessage}>
              Send
            </button>
          </div>
        </div>
      </>
    );
};


// Styles (unchanged)
const styles = {
  container: {
    maxWidth: "600px",
    marginLeft: "450px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    height: "85vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f0f0f0",
    overflow: "hidden",
        boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
    marginTop:"90px",
  },
  header: {
    padding: "15px",
    borderBottom: "1px solid #ccc",
    backgroundColor: "#075e54",
    color: "white",
    fontWeight: "bold",
    fontSize: "18px",
    textAlign: "center",
  },
  chatBox: {
    flex: 1,
    padding: "10px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#ece5dd",
  },
  messageWrapper: {
    display: "flex",
    marginBottom: "10px",
  },
  messageBubble: {
    maxWidth: "65%",
    padding: "10px 15px",
    borderRadius: "8px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
    wordBreak: "break-word",
    fontSize: "15px",
  },
  inputArea: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #ccc",
    backgroundColor: "#f5f5f5",
  },
  textarea: {
    flex: 1,
    resize: "none",
    padding: "10px",
    borderRadius: "20px",
    border: "1px solid #ccc",
    fontSize: "16px",
    outline: "none",
  },
  sendButton: {
    backgroundColor: "#128c7e",
    color: "white",
    padding: "10px 20px",
    marginLeft: "10px",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
export default ChatComponent;
