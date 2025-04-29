


import React, { useEffect, useState } from "react";
import SideNavBar from "../components/SideNavBar";
import TopNav from "../components/TopNav";
import { useSelector } from "react-redux";
import axios from "axios";

function UserConnectionPage() {
  const userData = useSelector((store) => store.userDetailsReducer.userDetails);

  const [suggested, setSuggested] = useState([]);
  const [connections, setConnections] = useState([]); // accepted connections
  const [sentRequests, setSentRequests] = useState([]); // pending requests

  useEffect(() => {
    axios.defaults.baseURL = REACT_APP_API_URL;
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    await fetchMyConnections();
    await fetchSentRequests();
    await getUserSuggestions();
  };

  const fetchMyConnections = async () => {
    try {
      const response = await axios.post("/getMyConnections", {
        userId: userData._id,
      });

      const connectedUserIds = response.data.map((connection) => {
        // Find the connected user's ID (not self)
        return connection.senderId._id === userData._id
          ? connection.receiverId._id
          : connection.senderId._id;
      });

      setConnections(connectedUserIds);
    } catch (error) {
      console.error("Error fetching connections:", error);
    }
  };

  const fetchSentRequests = async () => {
    try {
      const response = await axios.post("/getSentRequests", {
        userId: userData._id,
      });

      const validReceiverIds = response.data
        .filter((req) => req.receiverId) // make sure receiverId exists
        .map((req) => req.receiverId);

      setSentRequests(validReceiverIds);
    } catch (error) {
      console.error("Error fetching sent requests:", error);
    }
  };

  const getUserSuggestions = async () => {
    try {
      const formData = new FormData();
      formData.append("userLocation", userData.location.state);
      formData.append("userId", userData._id);

      const response = await axios.post("/userSuggestions", formData);

      const filteredSuggestions = response.data.filter((user) => {
        return (
          user._id !== userData._id && // don't show yourself
          !connections.includes(user._id) // remove accepted users
          // Don't remove pending users!
        );
      });

      setSuggested(filteredSuggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const sendConnectRequest = async (receiverId) => {
    const formData = new FormData();
    formData.append("senderId", userData._id);
    formData.append("receiverId", receiverId);

    try {
      await axios.post("/sendConnectionRequest", formData);

      setSentRequests((prev) => [...prev, receiverId]);
    } catch (error) {
      console.error("Error sending connection request:", error);
      alert(error.response?.data?.message || "Failed to send request");
    }
  };

  const getButtonText = (userId) => {
    if (connections.includes(userId)) return "Connected";
    if (sentRequests.includes(userId)) return "Pending";
    return "Connect";
  };

  const isButtonDisabled = (userId) => {
    return connections.includes(userId) || sentRequests.includes(userId);
  };

  return (
    <>
      <SideNavBar />
      <TopNav />
      <div className="mainContentDiv">
        <h1>Hello, {userData?.name || "Guest"} - Connections Page</h1>

        {suggested.length > 0 ? (
          suggested.map((ele) => (
            <div className="user-card" key={ele._id}>
              <img
                className="profile-pic"
                src={`http://localhost:7386/${ele.profilePic}`}
                alt="User Pic"
              />
              <div className="user-info">
                <h3 className="user-name">{ele.name}</h3>
                <p className="user-mobile">{ele.mobile}</p>
                <p className="user-location">
                  {ele.location.city}, {ele.location.state}
                </p>
              </div>

              <button
                className={`connect-btn ${
                  isButtonDisabled(ele._id) ? "disabled" : ""
                }`}
                onClick={() =>
                  !isButtonDisabled(ele._id) && sendConnectRequest(ele._id)
                }
                disabled={isButtonDisabled(ele._id)}
              >
                {getButtonText(ele._id)}
              </button>
            </div>
          ))
        ) : (
          <p>No suggested users available.</p>
        )}
      </div>
    </>
  );
}

export default UserConnectionPage;
