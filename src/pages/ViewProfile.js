import React from 'react'
import SideNavBar from '../components/SideNavBar';
import TopNav from '../components/TopNav';
import { useSelector } from 'react-redux';
import profilePic from "../assets/images/defaultPic.png";


function ViewProfile() {
  let storeObj = useSelector((store) => {
      return store;
    });
    console.log(storeObj);
  let user = storeObj.userDetailsReducer.userDetails;
  

  
  return (
    <>
      <SideNavBar />
      <TopNav />
      <div className="mainContentDiv">
        <form className="leaveActionForm">
          <h2 className="contentHeading">User Details</h2>
          <img
            src={
              user && user.profilePic
                ? `process.env.REACT_APP_API_URL/${user.profilePic}`
                : profilePic
            }
            className="leaveImg"
          ></img>
          <div>
            <div className="leavesChildDiv">
              <label className="detailsLabel">User Name</label>
              <label className="empDtataLeaveLabel">{user.name}</label>
            </div>
            <div className="leavesChildDiv">
              <label className="detailsLabel">Phone No</label>
              <label className="empDtataLeaveLabel">{user.mobile}</label>
            </div>

            <div className="leavesChildDiv">
              <label className="detailsLabel">Email ID</label>
              <label className="empDtataLeaveLabel">{user.email}</label>
            </div>
            <div className="leavesChildDiv">
              <label className="detailsLabel">State</label>
              <label className="empDtataLeaveLabel">
                {user.location.state}
              </label>
            </div>
            <div className="leavesChildDiv">
              <label className="detailsLabel">City</label>
              <label className="empDtataLeaveLabel">{user.location.city}</label>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default ViewProfile