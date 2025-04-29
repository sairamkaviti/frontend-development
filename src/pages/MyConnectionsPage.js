import React, { useEffect, useState } from "react";
import SideNavBar from "../components/SideNavBar";
import TopNav from "../components/TopNav";
import { useSelector } from "react-redux";
import axios from "axios";

function MyConnectionsPage() {
  const userData = useSelector((store) => store.userDetailsReducer.userDetails);
  const [connections, setConnections] = useState([]);

  const getMyConnections = async () => {
    try {
      const formData = new FormData();
      formData.append("userId", userData._id);

      const response = await axios.post("/getMyConnections", formData);
      setConnections(response.data);
    } catch (error) {
      console.error("Error fetching connections:", error);
    }
  };

  useEffect(() => {
    axios.defaults.baseURL = "http://localhost:7386";
    getMyConnections();
  }, []);

  const seenUserIds = new Set(); // 👈

  const handleMessageClick = (userId) => {
    // You can either navigate to chat page or open chat popup
    window.location.href = `/chat/${userId}`; // Example: redirect to /chat/userId page
  };

  return (
    <>
      <SideNavBar />
      <TopNav />
      <div className="mainContentDiv">
        <h1>My Connections</h1>

        {connections.length > 0 ? (
          connections.map((connection) => {
            const connectedUser =
              connection.senderId._id === userData._id
                ? connection.receiverId
                : connection.senderId;

            if (seenUserIds.has(connectedUser._id)) {
              return null; // Already displayed
            }

            seenUserIds.add(connectedUser._id); // Mark this user as displayed

            return (
              <div
                className="user-card"
                key={connectedUser._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <img
                  className="profile-pic"
                  src={`http://localhost:7386/${connectedUser.profilePic}`}
                  alt="Connection Pic"
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    marginRight: "15px",
                  }}
                />
                <div className="user-info" style={{ flexGrow: 1 }}>
                  <h3 className="user-name">{connectedUser.name}</h3>
                  <p className="user-mobile">{connectedUser.mobile}</p>
                  <p className="user-location">
                    {connectedUser.location?.city},{" "}
                    {connectedUser.location?.state}
                  </p>
                </div>
                <button
                  className="message-btn"
                  onClick={() => handleMessageClick(connectedUser._id)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Message
                </button>
              </div>
            );
          })
        ) : (
          <p>No connections yet.</p>
        )}
      </div>
    </>
  );
}

export default MyConnectionsPage;
