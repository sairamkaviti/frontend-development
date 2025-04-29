import logo from './logo.svg';
import './App.css';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import RegisterForm from './pages/RegisterForm';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import SideNavBar from './components/SideNavBar';
import Dashboard from './pages/Dashboard';
import EditProfile from './pages/EditProfile';
import ViewProfile from './pages/ViewProfile';
import Connections from './pages/Connections';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

import UserConnectionPage from './pages/UserConnectionPage';
import ReceivedRequestsPage from './pages/ReceivedRequestsPage';
import MyConnectionsPage from './pages/MyConnectionsPage';
import ChatComponent from './pages/ChatComponent';

function App() {
   const dispatch = useDispatch();

   

   useEffect(() => {
     const savedUser = localStorage.getItem("userData");
     if (savedUser) {
       dispatch({ type: "userDetails", data: JSON.parse(savedUser) });
     }
   }, [dispatch]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/myConnections" element={<MyConnectionsPage />}></Route>

        <Route
          path="/requestsRecieved"
          element={<ReceivedRequestsPage />}
        ></Route>

        <Route
          path="/userConnectionsPage"
          element={<UserConnectionPage />}
        ></Route>

        <Route path="/forgotPassword" element={<ForgotPassword />}></Route>
        <Route path="/registerForm" element={<RegisterForm />}></Route>
        <Route path="/navBar" element={<SideNavBar />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/editProfile" element={<EditProfile />}></Route>
        <Route path="/viewProfile" element={<ViewProfile />}></Route>
        <Route path="/connections" element={<Connections />}></Route>
        {/* <Route path="/chat" element={<ChatComponent />}></Route> */}
        <Route path="/chat/:userId" element={<ChatComponent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
