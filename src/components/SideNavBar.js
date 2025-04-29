import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUser,
  FaUserEdit,
  FaUsersCog,
  FaSignOutAlt,
} from "react-icons/fa";
import ssLogo from "../assets/images/ssLogo.png";

function SideNavBar() {
  return (
    <div>
      <nav className="sideNav">
        {/* <img src={ssLogo} alt="SS Logo" /> */}

        <NavLink
          to="/dashboard"
          className="navLinks"
          style={(ele) => {
            if (ele.isActive) {
              return {
                color: "yellow",
              };
            }
          }}
        >
          <FaTachometerAlt className="sideNavIcons" /> Dashboard
        </NavLink>

        <NavLink
          to="/viewProfile"
          className="navLinks"
          style={(ele) => {
            if (ele.isActive) {
              return {
                color: "yellow",
              };
            }
          }}
        >
          <FaUser className="sideNavIcons" /> View Profile
        </NavLink>

        <NavLink
          to="/editProfile"
          className="navLinks"
          style={(ele) => {
            if (ele.isActive) {
              return {
                color: "yellow",
              };
            }
          }}
        >
          <FaUserEdit className="sideNavIcons" /> Edit Profile
        </NavLink>

        <NavLink
          to="/connections"
          className="navLinks"
          style={(ele) => {
            if (ele.isActive) {
              return {
                color: "yellow",
              };
            }
          }}
        >
          <FaUsersCog className="sideNavIcons" /> Connections
        </NavLink>
        {/* <NavLink
          to="/userConnectionsPage"
          className="navLinks"
          style={(ele) => {
            if (ele.isActive) {
              return {
                color: "yellow",
              };
            }
          }}
        >
          <FaUsersCog className="sideNavIcons" /> User Connections
        </NavLink>
        <NavLink
          to="/requestsRecieved"
          className="navLinks"
          style={(ele) => {
            if (ele.isActive) {
              return {
                color: "yellow",
              };
            }
          }}
        >
          <FaUsersCog className="sideNavIcons" /> Requests
        </NavLink>
        <NavLink
          to="/myConnections"
          className="navLinks"
          style={(ele) => {
            if (ele.isActive) {
              return {
                color: "yellow",
              };
            }
          }}
        >
          <FaUsersCog className="sideNavIcons" /> MyConnections
        </NavLink> */}

        <NavLink to="/" className="navLinks">
          <FaSignOutAlt className="sideNavIcons" /> Logout
        </NavLink>
      </nav>
    </div>
  );
}

export default SideNavBar;
