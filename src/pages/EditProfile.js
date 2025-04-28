// import React, { useEffect, useRef, useState } from "react";
// import TopNav from "../components/TopNav";
// import SideNavBar from "../components/SideNavBar";
// import { useSelector, useDispatch } from "react-redux";
// import profilePic from "../assets/images/defaultPic.png";
// import axios from "axios";
// import Swal from "sweetalert2";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { useNavigate } from "react-router-dom";

// function EditProfile() {
//   const profilePicInputRef = useRef();
//   const nameRef = useRef();
//   const mobileRef = useRef();
//   const stateRef = useRef();
//   const cityRef = useRef();
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [dp, setDP] = useState(profilePic);
//   let navigate = useNavigate();

//   const storeObj = useSelector((store) => store);
//   const user = storeObj.userDetailsReducer.userDetails;
//   const dispatch = useDispatch();

//   useEffect(() => {

//     if (user.profilePic) {
//       setDP(`http://localhost:7386/${user.profilePic}`);
//     } else {
//       setDP(profilePic);
//     }

//     if (
//       nameRef.current &&
//       mobileRef.current &&
//       stateRef.current &&
//       cityRef.current
//     ) {
//       nameRef.current.value = user.name || "";
//       mobileRef.current.value = user.mobile || "";
//       stateRef.current.value = user.location?.state || "";
//       cityRef.current.value = user.location?.city || "";
//     }

//     axios.defaults.baseURL = "http://localhost:7386";
//   }, [user]);

// const updateUserDetails = async () => {
//   setIsUpdating(true);

//   const dataToSend = new FormData();
//   dataToSend.append("name", nameRef.current.value);
//   dataToSend.append("mobile", mobileRef.current.value);
//   dataToSend.append("city", cityRef.current.value);
//   dataToSend.append("state", stateRef.current.value);
//   dataToSend.append("_id", user._id);

//   if (profilePicInputRef.current.files.length > 0) {
//     const selectedFile = profilePicInputRef.current.files[0];
//     dataToSend.append("dp", selectedFile);
//   }

//   try {
//     const response = await axios.put("/updatingProfile", dataToSend);
//     const JSOData = await response.data;

//     if (JSOData.status === "Success") {
//       const updatedUser = {
//         ...user,
//         name: nameRef.current.value,
//         mobile: mobileRef.current.value,
//         location: {
//           state: stateRef.current.value,
//           city: cityRef.current.value,
//         },
//         profilePic: JSOData.updatedProfilePic
//           ? JSOData.updatedProfilePic
//           : user.profilePic,
//       };

//       // 1. Update Redux
//       dispatch({ type: "userDetails", data: updatedUser });

//       // 2. Update localStorage
//       localStorage.setItem("userDetails", JSON.stringify(updatedUser));

//       // 3. Show SweetAlert - wait until user clicks OK
//       await Swal.fire({
//         icon: "success",
//         title: "Profile Updated Successfully",
//         text: "Your profile details have been updated.Please agian login with your credentials",
//       });

//       // 4. After OK button is clicked, refresh user again from localStorage
//       const refreshedUser = JSON.parse(localStorage.getItem("userDetails"));
//       if (refreshedUser.profilePic) {
//         setDP(
//           `http://localhost:7386/${refreshedUser.profilePic}?t=${Date.now()}`

//         );
//       } else {
//         setDP(profilePic);
//       }
//     }

//     setTimeout(() => {
//       navigate("/");
//     }, 2000);
//   } catch (err) {
//     console.error(err);
//     Swal.fire({
//       icon: "error",
//       title: "Oops...",
//       text: "There was an error updating your profile. Please try again.",
//     });
//   } finally {
//     setIsUpdating(false);
//   }
// };



//   return (
//     <>
//       <TopNav />
//       <SideNavBar />
//       <div className="mainContentDiv">
//         <form className="leaveActionForm">
//           <h2 className="contentHeading">Update Details</h2>
//           <img src={dp} className="leaveImg" alt="Profile" />

//           <div>
//             <div className="leavesChildDiv">
//               <label htmlFor="pp" className="detailsLabel">
//                 Profile Pic
//               </label>
//               <input
//                 className="empDtataLeaveLabel"
//                 id="pp"
//                 type="file"
//                 ref={profilePicInputRef}
//                 onChange={() => {
//                   if (profilePicInputRef.current.files.length > 0) {
//                     const selectedDPUrl = URL.createObjectURL(
//                       profilePicInputRef.current.files[0]
//                     );
//                     setDP(selectedDPUrl);
//                   }
//                 }}
//               />
//             </div>
          
//             <div className="leavesChildDiv">
//               <label className="detailsLabel">User Name</label>
//               <input className="empDtataLeaveLabel" ref={nameRef} />
//             </div>
//             <div className="leavesChildDiv">
//               <label className="detailsLabel">Phone No</label>
//               <input className="empDtataLeaveLabel" ref={mobileRef} />
//             </div>
//             <div className="leavesChildDiv">
//               <label className="detailsLabel">State</label>
//               <input className="empDtataLeaveLabel" ref={stateRef} />
//             </div>
//             <div className="leavesChildDiv">
//               <label className="detailsLabel">City</label>
//               <input className="empDtataLeaveLabel" ref={cityRef} />
//             </div>
//           </div>
//           <button
//             className="updateBtn"
//             type="button"
//             onClick={updateUserDetails}
//             disabled={isUpdating}
//           >
//             {isUpdating ? (
//               <>
//                 <span className="spinner-border spinner-border-sm me-2"></span>
//                 Updating...
//               </>
//             ) : (
//               "Update Profile"
//             )}
//           </button>
//         </form>
//       </div>
//     </>
//   );
// }

// export default EditProfile;


// import React, { useEffect, useRef, useState } from "react";
// import TopNav from "../components/TopNav";
// import SideNavBar from "../components/SideNavBar";
// import { useSelector, useDispatch } from "react-redux";
// import profilePic from "../assets/images/defaultPic.png";
// import axios from "axios";
// import Swal from "sweetalert2";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";


// function EditProfile() {
//   const profilePicInputRef = useRef();
//   const [dp, setDP] = useState(profilePic);
//   const [isUpdating, setIsUpdating] = useState(false);
//   let navigate = useNavigate();

//   const storeObj = useSelector((store) => store);
//   const user = storeObj.userDetailsReducer.userDetails;
//   const dispatch = useDispatch();

//   // Initialize React Hook Form
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//   } = useForm();

//   useEffect(() => {
//     if (user.profilePic) {
//       setDP(`http://localhost:7386/${user.profilePic}`);
//     } else {
//       setDP(profilePic);
//     }

//     setValue("name", user.name || "");
//     setValue("mobile", user.mobile || "");
//     setValue("state", user.location?.state || "");
//     setValue("city", user.location?.city || "");

//     axios.defaults.baseURL = "http://localhost:7386";
//   }, [user, setValue]);

//   const updateUserDetails = async (data) => {
//     setIsUpdating(true);

//     const dataToSend = new FormData();
//     dataToSend.append("name", data.name);
//     dataToSend.append("mobile", data.mobile);
//     dataToSend.append("city", data.city);
//     dataToSend.append("state", data.state);
//     dataToSend.append("_id", user._id);

//     if (profilePicInputRef.current.files.length > 0) {
//       const selectedFile = profilePicInputRef.current.files[0];
//       dataToSend.append("dp", selectedFile);
//     }

//     try {
//       const response = await axios.put("/updatingProfile", dataToSend);
//       const JSOData = await response.data;

//       if (JSOData.status === "Success") {
//         const updatedUser = {
//           ...user,
//           name: data.name,
//           mobile: data.mobile,
//           location: {
//             state: data.state,
//             city: data.city,
//           },
//           profilePic: JSOData.updatedProfilePic
//             ? JSOData.updatedProfilePic
//             : user.profilePic,
//         };

//         // 1. Update Redux
//         dispatch({ type: "userDetails", data: updatedUser });

//         // 2. Update localStorage
//         localStorage.setItem("userDetails", JSON.stringify(updatedUser));

//         // 3. Show SweetAlert - wait until user clicks OK
//         await Swal.fire({
//           icon: "success",
//           title: "Profile Updated Successfully",
//           text: "Your profile details have been updated. Please login again with your credentials.",
//         });

//         // 4. After OK button is clicked, refresh user again from localStorage
//         const refreshedUser = JSON.parse(localStorage.getItem("userDetails"));
//         if (refreshedUser.profilePic) {
//           setDP(
//             `http://localhost:7386/${refreshedUser.profilePic}?t=${Date.now()}`
//           );
//         } else {
//           setDP(profilePic);
//         }
//       }

//       setTimeout(() => {
//         navigate("/");
//       }, 2000);
//     } catch (err) {
//       console.error(err);
//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: "There was an error updating your profile. Please try again.",
//       });
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   return (
//     <>
//       <TopNav />
//       <SideNavBar />
//       <div className="mainContentDiv">
//         <form
//           className="leaveActionForm"
//           onSubmit={handleSubmit(updateUserDetails)}
//         >
//           <h2 className="contentHeading">Update Details</h2>
//           <img src={dp} className="leaveImg" alt="Profile" />

//           <div>
//             <div className="leavesChildDiv ppDivEdit">
//               <label htmlFor="pp" className="detailsLabel">
//                 Profile Pic
//               </label>
//               <input
//                 className="empDtataLeaveLabel"
//                 id="pp"
//                 type="file"
//                 ref={profilePicInputRef}
//                 onChange={() => {
//                   if (profilePicInputRef.current.files.length > 0) {
//                     const selectedDPUrl = URL.createObjectURL(
//                       profilePicInputRef.current.files[0]
//                     );
//                     setDP(selectedDPUrl);
//                   }
//                 }}
//               />
//             </div>

//             <div className="leavesChildDiv">
//               <label className="detailsLabel">User Name</label>
//               <input
//                 className="empDtataLeaveLabel"
//                 {...register("name", { required: "Name is required" })}
//               />
//               {errors.name && (
//                 <p className="error-message">{errors.name.message}</p>
//               )}
//             </div>

//             <div className="leavesChildDiv">
//               <label className="detailsLabel">Phone No</label>
//               <input
//                 className="empDtataLeaveLabel"
//                 {...register("mobile", {
//                   required: "Mobile number is required",
//                   pattern: {
//                     value: /^[6-9]\d{9}$/,
//                     message:
//                       "Mobile number must start with 6, 7, 8, or 9 and be 10 digits long",
//                   },
//                 })}
//               />
//               {errors.mobile && (
//                 <p className="error-message">{errors.mobile.message}</p>
//               )}
//             </div>

//             <div className="leavesChildDiv">
//               <label className="detailsLabel">State</label>
//               <input
//                 className="empDtataLeaveLabel"
//                 {...register("state", { required: "State is required" })}
//               />
//               {errors.state && (
//                 <p className="error-message">{errors.state.message}</p>
//               )}
//             </div>

//             <div className="leavesChildDiv">
//               <label className="detailsLabel">City</label>
//               <input
//                 className="empDtataLeaveLabel"
//                 {...register("city", { required: "City is required" })}
//               />
//               {errors.city && (
//                 <p className="error-message">{errors.city.message}</p>
//               )}
//             </div>
//           </div>

//           <button className="updateBtn" type="submit" disabled={isUpdating}>
//             {isUpdating ? (
//               <>
//                 <span className="spinner-border spinner-border-sm me-2"></span>
//                 Updating...
//               </>
//             ) : (
//               "Update Profile"
//             )}
//           </button>
//         </form>
//       </div>
//     </>
//   );
// }

// export default EditProfile;

import React, { useEffect, useRef, useState } from "react";
import TopNav from "../components/TopNav";
import SideNavBar from "../components/SideNavBar";
import { useSelector, useDispatch } from "react-redux";
import profilePic from "../assets/images/defaultPic.png";
import axios from "axios";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

function EditProfile() {
  const profilePicInputRef = useRef();
  const [dp, setDP] = useState(profilePic);
  const [isUpdating, setIsUpdating] = useState(false);
  let navigate = useNavigate();

  const storeObj = useSelector((store) => store);
  const user = storeObj.userDetailsReducer.userDetails;
  const dispatch = useDispatch();

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  useEffect(() => {
    if (user.profilePic) {
      setDP(`http://localhost:7386/${user.profilePic}`);
    } else {
      setDP(profilePic);
    }

    setValue("name", user.name || "");
    setValue("mobile", user.mobile || "");
    setValue("state", user.location?.state || "");
    setValue("city", user.location?.city || "");

    axios.defaults.baseURL = "http://localhost:7386";
  }, [user, setValue]);

  const updateUserDetails = async (data) => {
    setIsUpdating(true);

    const dataToSend = new FormData();
    dataToSend.append("name", data.name);
    dataToSend.append("mobile", data.mobile);
    dataToSend.append("city", data.city);
    dataToSend.append("state", data.state);
    dataToSend.append("_id", user._id);

    if (profilePicInputRef.current.files.length > 0) {
      const selectedFile = profilePicInputRef.current.files[0];
      dataToSend.append("dp", selectedFile);
    }

    try {
      const response = await axios.put("/updatingProfile", dataToSend);
      const JSOData = await response.data;

      if (JSOData.status === "Success") {
        const updatedUser = {
          ...user,
          name: data.name,
          mobile: data.mobile,
          location: {
            state: data.state,
            city: data.city,
          },
          profilePic: JSOData.updatedProfilePic
            ? JSOData.updatedProfilePic
            : user.profilePic,
        };

        // 1. Update Redux
        dispatch({ type: "userDetails", data: updatedUser });

        // 2. Update localStorage
        localStorage.setItem("userDetails", JSON.stringify(updatedUser));

        // 3. Show SweetAlert - wait until user clicks OK
        await Swal.fire({
          icon: "success",
          title: "Profile Updated Successfully",
          text: "Your profile details have been updated. Please login again with your credentials.",
        });

        // 4. After OK button is clicked, refresh user again from localStorage
        const refreshedUser = JSON.parse(localStorage.getItem("userDetails"));
        if (refreshedUser.profilePic) {
          setDP(
            `http://localhost:7386/${refreshedUser.profilePic}?t=${Date.now()}`
          );
        } else {
          setDP(profilePic);
        }
      }

     
      navigate("/");
     
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "There was an error updating your profile. Please try again.",
      });
    } finally {
      setIsUpdating(false);
    }
 
  }


  return (
    <>
      <TopNav />
      <SideNavBar />
      <div className="mainContentDiv">
        <form
          className="leaveActionForm"
          onSubmit={handleSubmit(updateUserDetails)}
        >
          <h2 className="contentHeading">Update Details</h2>
          <img src={dp} className="leaveImg" alt="Profile" />

          <div>
            <div className="leavesChildDiv ppDivEdit">
              <label htmlFor="pp" className="detailsLabel">
                Profile Pic
              </label>
              <input
                className="empDtataLeaveLabel"
                id="pp"
                type="file"
                ref={profilePicInputRef}
                onChange={() => {
                  if (profilePicInputRef.current.files.length > 0) {
                    const selectedDPUrl = URL.createObjectURL(
                      profilePicInputRef.current.files[0]
                    );
                    setDP(selectedDPUrl);
                  }
                }}
              />
            </div>

            <div className="leavesChildDiv">
              <label className="detailsLabel">User Name</label>
              <input
                className="empDtataLeaveLabel"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="error-message">{errors.name.message}</p>
              )}
            </div>

            <div className="leavesChildDiv">
              <label className="detailsLabel">Phone No</label>
              <input
                className="empDtataLeaveLabel"
                {...register("mobile", {
                  required: "Mobile number is required",
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message:
                      "Mobile number must start with 6, 7, 8, or 9 and be 10 digits long",
                  },
                })}
              />
              {errors.mobile && (
                <p className="error-message">{errors.mobile.message}</p>
              )}
            </div>

            <div className="leavesChildDiv">
              <label className="detailsLabel">State</label>
              <input
                className="empDtataLeaveLabel"
                {...register("state", { required: "State is required" })}
              />
              {errors.state && (
                <p className="error-message">{errors.state.message}</p>
              )}
            </div>

            <div className="leavesChildDiv">
              <label className="detailsLabel">City</label>
              <input
                className="empDtataLeaveLabel"
                {...register("city", { required: "City is required" })}
              />
              {errors.city && (
                <p className="error-message">{errors.city.message}</p>
              )}
            </div>
          </div>

          <button className="updateBtn" type="submit" disabled={isUpdating}>
            {isUpdating ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Updating...
              </>
            ) : (
              "Update Profile"
            )}
          </button>
        </form>
      </div>
    </>
  );
}

export default EditProfile;

