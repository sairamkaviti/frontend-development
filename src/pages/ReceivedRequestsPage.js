import React, { useEffect, useState } from "react";
import SideNavBar from "../components/SideNavBar";
import TopNav from "../components/TopNav";
import { useSelector } from "react-redux";
import axios from "axios";

function ReceivedRequestsPage() {
  const userData = useSelector((store) => store.userDetailsReducer.userDetails);
  const [receivedRequests, setReceivedRequests] = useState([]);

  const getReceivedRequests = async () => {
    try {
      let dataToSend = new FormData();
      dataToSend.append("receiverId", userData._id);

      const response = await axios.post("/getReceivedRequests", dataToSend);
      setReceivedRequests(response.data);
    } catch (error) {
      console.error("Error fetching received requests:", error);
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      let dataToSend = new FormData();
      dataToSend.append("requestId", requestId);

      await axios.post("/acceptConnectionRequest", dataToSend);
      getReceivedRequests(); // Refresh the list
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      let dataToSend = new FormData();
      dataToSend.append("requestId", requestId);

      await axios.post("/rejectConnectionRequest", dataToSend);
      getReceivedRequests(); // Refresh the list
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  useEffect(() => {
    axios.defaults.baseURL = REACT_APP_API_URL;
    getReceivedRequests();
  }, []);

  return (
    <>
      <SideNavBar />
      <TopNav />
      <div className="mainContentDiv">
        <h1>Received Connection Requests</h1>

        {receivedRequests.length > 0 ? (
          receivedRequests.map((request) => (
            <div className="user-card" key={request._id}>
              <img
                className="profile-pic"
                src={`http://localhost:7386/${request.senderId.profilePic}`}
                alt="Sender Pic"
              />

              <div className="user-info">
                <h3 className="user-name">{request.senderId.name}</h3>
                <p className="user-mobile">{request.senderId.mobile}</p>
                <p className="user-location">
                  {request.senderId.location.city},{" "}
                  {request.senderId.location.state}
                </p>
              </div>

              <button
                className="accept-btn"
                onClick={() => acceptRequest(request._id)}
              >
                Accept
              </button>
              <button
                className="reject-btn"
                onClick={() => rejectRequest(request._id)}
              >
                Reject
              </button>
            </div>
          ))
        ) : (
          <p>No received requests available.</p>
        )}
      </div>
    </>
  );
}

export default ReceivedRequestsPage;
