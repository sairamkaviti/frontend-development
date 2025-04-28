import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import profilePic from "../assets/images/defaultPic.png"
import { useSelector } from "react-redux";

function TopNav() {
  let navigate = useNavigate();
   let storeObj = useSelector((store) => {
     return store;
   });
  console.log(storeObj);
  let userData = storeObj.userDetailsReducer.userDetails;
  // console.log(userData.email)
;

  return (
    <div>
      <nav className="topNavBar">
        <h3 className="wlcmHead">{userData.name}</h3>
        <div className="profileContainer">
          <img
            src={
              userData && userData.profilePic
                ? `http://localhost:7386/${userData.profilePic}`
                : profilePic
            }
            className="profilePic"
            alt="profilePic"
          />
          <div className="dropdownMenu" style={{ display: "none" }}>
            <button onClick={() => navigate("/viewProfile")}>
              <i className="fa-solid fa-user dropIcon"></i> View Profile
            </button>
            <button onClick={() => navigate("/")}>
              <i className="fa-solid fa-arrow-right-from-bracket dropIcon"></i>
              Sign Out
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default TopNav;
