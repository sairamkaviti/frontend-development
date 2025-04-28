import React, { useState, useEffect } from "react";
import axios from "axios";
import SideNavBar from "../components/SideNavBar";
import TopNav from "../components/TopNav";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Tabs,
  Tab,
  Stack,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";

function Connections() {
  const [tabValue, setTabValue] = useState(0);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [myConnections, setMyConnections] = useState([]);
  const [loadingSuggested, setLoadingSuggested] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingConnections, setLoadingConnections] = useState(true);

  const myUserId = String(localStorage.getItem("userId"))?.trim();

  const fetchSuggested = async () => {
    try {
      const res = await axios.get("/connections/suggested", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSuggestedUsers(res.data);
    } catch (err) {
      toast.error("Failed to fetch suggested users");
    } finally {
      setLoadingSuggested(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get("/connections/requests");
      setRequests(res.data);
    } catch (err) {
      toast.error("Failed to fetch connection requests");
    } finally {
      setLoadingRequests(false);
    }
  };

  const fetchConnections = async () => {
    try {
      const res = await axios.get("/connections/my-connections");
      setMyConnections(res.data);
    } catch (err) {
      toast.error("Failed to fetch my connections");
    } finally {
      setLoadingConnections(false);
    }
  };

  const sendConnectionRequest = async (recipientId) => {
    try {
      await axios.post(`/connections/send-request/${recipientId}`);
      toast.success("Connection Request Sent");
      fetchSuggested(); // Refresh suggested users after sending request
    } catch (err) {
      toast.error("Failed to send connection request");
    }
  };

  const acceptConnectionRequest = async (requestId) => {
    try {
      await axios.post(`/connections/accept-request/${requestId}`);
      toast.success("Connection Accepted");
      fetchRequests(); 
      fetchConnections(); 
    } catch (err) {
      toast.error("Failed to accept request");
    }
  };

  const handleTabChange = (e, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    axios.defaults.baseURL = "http://localhost:7386";
    fetchSuggested();
    fetchRequests();
    fetchConnections();
  }, []);

  return (
    <>
      <SideNavBar />
      <TopNav />
      <div className="mainContentDiv">
       

        <Box sx={{ p: 4 }} className="connectionCard">
          <Typography variant="h4" gutterBottom>
            Connections
          </Typography>

          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label={`Suggested (${suggestedUsers.length})`} />
            <Tab label={`Requested (${requests.length})`} />
            <Tab label={`My Connections (${myConnections.length})`} />
          </Tabs>

          {/* Suggested Tab */}
          {tabValue === 0 && (
            <Stack spacing={2}>
              {loadingSuggested ? (
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <CircularProgress />
                </Box>
              ) : suggestedUsers.length > 0 ? (
                suggestedUsers.map((user) => (
                  <Box
                    key={user._id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={user.profilePicUrl || ""}
                        alt={user.name || "No Name"}
                        sx={{ mr: 2 }}
                      />
                      <Box>
                        <Typography>{user.name || "Unknown User"}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user.location?.state || "Unknown"},{" "}
                          {user.location?.city || "Unknown"}
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => sendConnectionRequest(user._id)}
                    >
                      Connect
                    </Button>
                  </Box>
                ))
              ) : (
                <Typography>No suggested users available.</Typography>
              )}
            </Stack>
          )}

          {/* Requested Tab */}
          {tabValue === 1 && (
            <Stack spacing={2}>
              {loadingRequests ? (
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <CircularProgress />
                </Box>
              ) : requests.length > 0 ? (
                requests.map((request) => (
                  <Box
                    key={request._id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={request.requester?.profilePicUrl || ""}
                        alt={request.requester?.name || "No Name"}
                        sx={{ mr: 2 }}
                      />
                      <Box>
                        <Typography>
                          {request.requester?.name || "Unknown User"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {request.requester?.location?.state || "Unknown"},{" "}
                          {request.requester?.location?.city || "Unknown"}
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => acceptConnectionRequest(request._id)}
                    >
                      Accept
                    </Button>
                  </Box>
                ))
              ) : (
                <Typography>No connection requests available.</Typography>
              )}
            </Stack>
          )}

          {/* My Connections Tab */}
          {tabValue === 2 && (
            <Stack spacing={2}>
              {loadingConnections ? (
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <CircularProgress />
                </Box>
              ) : myConnections.length > 0 ? (
                myConnections.map((connection) => {
                  const user =
                    String(connection.requester?._id) === myUserId
                      ? connection.recipient
                      : connection.requester;
                  return (
                    <Box
                      key={connection._id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          src={user?.profilePicUrl || ""}
                          alt={user?.name || "No Name"}
                          sx={{ mr: 2 }}
                        />
                        <Box>
                          <Typography>
                            {user?.name || "Unknown User"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {user?.location?.state || "Unknown"},{" "}
                            {user?.location?.city || "Unknown"}
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() =>
                          (window.location.href = `/chat/${user._id}`)
                        }
                      >
                        Message
                      </Button>
                    </Box>
                  );
                })
              ) : (
                <Typography>No connections available.</Typography>
              )}
            </Stack>
          )}
        </Box>
      </div>
    </>
  );
}

export default Connections;
