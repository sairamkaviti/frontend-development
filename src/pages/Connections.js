import React, { useEffect, useState } from "react";
import SideNavBar from "../components/SideNavBar";
import TopNav from "../components/TopNav";
import { useSelector } from "react-redux";
import axios from "axios";

function Connections() {
  const userData = useSelector((store) => store.userDetailsReducer.userDetails);
  const [activeTab, setActiveTab] = useState("suggested");

  const [suggested, setSuggested] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [connections, setConnections] = useState([]);

 useEffect(() => {
   axios.defaults.baseURL = REACT_APP_API_URL;
   if (userData && userData._id) {
     fetchAllData();
   }
 }, [userData]);

  const fetchAllData = async () => {
    await fetchMyConnections();
    await fetchSentRequests();
    await fetchReceivedRequests();
    await getUserSuggestions();
  };

  const fetchMyConnections = async () => {
    try {
      const res = await axios.post("/getMyConnections", {
        userId: userData._id,
      });
      setConnections(res.data);
    } catch (error) {
      console.error("Error fetching connections:", error);
    }
  };

  const fetchSentRequests = async () => {
    try {
      const res = await axios.post("/getSentRequests", {
        userId: userData._id,
      });
      const validReceiverIds = res.data
        .filter((r) => r.receiverId)
        .map((r) => r.receiverId);
      setSentRequests(validReceiverIds);
    } catch (error) {
      console.error("Error fetching sent requests:", error);
    }
  };

  const fetchReceivedRequests = async () => {
    try {
      const formData = new FormData();
      formData.append("receiverId", userData._id);
      const res = await axios.post("/getReceivedRequests", formData);
      setReceivedRequests(res.data);
    } catch (error) {
      console.error("Error fetching received requests:", error);
    }
  };

  const getUserSuggestions = async () => {
    try {
      const formData = new FormData();
      formData.append("userLocation", userData.location.state);
      formData.append("userId", userData._id);
      const res = await axios.post("/userSuggestions", formData);

      const connectedIds = connections.map((c) =>
        c.senderId._id === userData._id ? c.receiverId._id : c.senderId._id
      );

      const filtered = res.data.filter(
        (u) => u._id !== userData._id && !connectedIds.includes(u._id)
      );

      setSuggested(filtered);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const sendConnectRequest = async (receiverId) => {
    try {
      const formData = new FormData();
      formData.append("senderId", userData._id);
      formData.append("receiverId", receiverId);

      await axios.post("/sendConnectionRequest", formData);
      setSentRequests((prev) => [...prev, receiverId]);
    } catch (error) {
      console.error("Error sending request:", error);
      alert(error.response?.data?.message || "Request failed");
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      const formData = new FormData();
      formData.append("requestId", requestId);
      await axios.post("/acceptConnectionRequest", formData);
      fetchAllData();
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      const formData = new FormData();
      formData.append("requestId", requestId);
      await axios.post("/rejectConnectionRequest", formData);
      fetchAllData();
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  const handleMessageClick = (userId) => {
    window.location.href = `/chat/${userId}`;
  };

  const getButtonText = (userId) => {
    const connectedIds = connections.map((c) =>
      c.senderId._id === userData._id ? c.receiverId._id : c.senderId._id
    );
    if (connectedIds.includes(userId)) return "Connected";
    if (sentRequests.includes(userId)) return "Pending";
    return "Connect";
  };

  const isButtonDisabled = (userId) => {
    return (
      sentRequests.includes(userId) ||
      connections.some(
        (c) => c.senderId._id === userId || c.receiverId._id === userId
      )
    );
  };
  


  return (
    <>
      <SideNavBar />
      <TopNav />
      <div className="mainContentDiv">
        <h1>Connections</h1>

        <div
          className="tabs"
          style={{ display: "flex", gap: "20px", marginBottom: "20px" }}
        >
          {["suggested", "requested", "myconnections"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            >
              {tab === "suggested" && `Suggested (${suggested.length})`}
              {tab === "requested" && `Requested (${receivedRequests.length})`}
              {tab === "myconnections" &&
                `My Connections (${connections.length})`}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        {activeTab === "suggested" && (
          <>
            {suggested.length > 0 ? (
              suggested.map((ele) => (
                <div className="user-card" key={ele._id}>
                  <img
                    className="profile-pic"
                    src={`http://localhost:7386/${ele.profilePic}`}
                    alt="User Pic"
                    style={{ width: 60, height: 60, borderRadius: "50%" }}
                  />
                  <div className="user-info" style={{ marginLeft: "15px" }}>
                    <h3>{ele.name}</h3>
                    <p>{ele.mobile}</p>
                    <p>
                      {ele.location?.city}, {ele.location?.state}
                    </p>
                  </div>
                  <button
                    className="connect-btn"
                    onClick={() => sendConnectRequest(ele._id)}
                    disabled={isButtonDisabled(ele._id)}
                  >
                    {getButtonText(ele._id)}
                  </button>
                </div>
              ))
            ) : (
              <p>No suggested users available.</p>
            )}
          </>
        )}

        {activeTab === "requested" && (
          <>
            {receivedRequests.length > 0 ? (
              receivedRequests.map((request) => (
                <div className="user-card" key={request._id}>
                  <img
                    src={`http://localhost:7386/${request.senderId.profilePic}`}
                    alt="Sender Pic"
                    className="profile-pic"
                    style={{ width: 60, height: 60, borderRadius: "50%" }}
                  />
                  <div className="user-info" style={{ marginLeft: "15px" }}>
                    <h3>{request.senderId.name}</h3>
                    <p>{request.senderId.mobile}</p>
                    <p>
                      {request.senderId.location.city},{" "}
                      {request.senderId.location.state}
                    </p>
                  </div>
                  <button onClick={() => acceptRequest(request._id)}>
                    Accept
                  </button>
                  <button onClick={() => rejectRequest(request._id)}>
                    Reject
                  </button>
                </div>
              ))
            ) : (
              <p>No received requests available.</p>
            )}
          </>
        )}

        {activeTab === "myconnections" && (
          <>
            {connections.length > 0 ? (
              connections.map((connection) => {
                const connectedUser =
                  connection.senderId._id === userData._id
                    ? connection.receiverId
                    : connection.senderId;

                return (
                  <div className="user-card" key={connectedUser._id}>
                    <img
                      src={`http://localhost:7386/${connectedUser.profilePic}`}
                      alt="Connection Pic"
                      className="profile-pic"
                      style={{ width: 60, height: 60, borderRadius: "50%" }}
                    />
                    <div className="user-info" style={{ marginLeft: "15px" }}>
                      <h3>{connectedUser.name}</h3>
                      <p>{connectedUser.mobile}</p>
                      <p>
                        {connectedUser.location?.city},{" "}
                        {connectedUser.location?.state}
                      </p>
                    </div>
                    <button
                      onClick={() => handleMessageClick(connectedUser._id)}
                    >
                      Message
                    </button>
                  </div>
                );
              })
            ) : (
              <p>No connections yet.</p>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Connections;
