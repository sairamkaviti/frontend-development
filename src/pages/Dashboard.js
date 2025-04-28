import React, { useEffect } from 'react'
import SideNavBar from '../components/SideNavBar'
import TopNav from '../components/TopNav';
import { useSelector } from 'react-redux';

function Dashboard() {
 
 const userData = useSelector((store) => store.userDetailsReducer.userDetails);
  return (
    <>
      <SideNavBar />
      <TopNav />
      <div className="mainContentDiv">
        <h1>Hello, {userData?.name || "Guest"}</h1>
      </div>
    </>
  );
}

export default Dashboard