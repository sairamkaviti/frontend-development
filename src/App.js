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
import Chat from './pages/Chat';

function App() {
   const dispatch = useDispatch();

   useEffect(() => {
     const savedUser = localStorage.getItem("userDetails");

     if (savedUser) {
       // Parse the saved user details from localStorage
       const parsedUser = JSON.parse(savedUser);

       // Dispatch the user data to Redux store to update the global state
       dispatch({ type: "userDetails", data: parsedUser });
     }
   }, [dispatch]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/forgotPassword" element={<ForgotPassword />}></Route>
        <Route path="/registerForm" element={<RegisterForm />}></Route>
        <Route path="/navBar" element={<SideNavBar />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/editProfile" element={<EditProfile />}></Route>
        <Route path="/viewProfile" element={<ViewProfile />}></Route>
        <Route path="/connections" element={<Connections />}></Route>
        <Route path="/chat" element={<Chat />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
