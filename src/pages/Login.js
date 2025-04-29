import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useHistory for navigation
import mainGif from "../assets/images/mainGif.gif";
import ssLogo from "../assets/images/ssLogo.png";
import Swal from "sweetalert2"; // Import SweetAlert2
import { useDispatch } from "react-redux";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm({ mode: "onBlur" });

  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const navigate = useNavigate(); // Use history for navigation
  let dispatch = useDispatch();

  // const onSubmit = async (data) => {
  //   try {
  //     // Make the API call to login
  //     const response = await axios.post("/login", data);
  //     let JSOData = await response.data;

  //     console.log("Login Success:", JSOData.data);

  //     // If login is successful, store the token in localStorage
  //     localStorage.setItem("authToken", response.data.token);

  //     // Show success alert
  //     Swal.fire({
  //       icon: "success",
  //       title: "Login successful!",
  //       text: "Redirecting to dashboard...",
  //       toast: true,
  //       position: "top-right",
  //       timer: 2000,
  //       showConfirmButton: false,
  //     });

  //     // Redirect to dashboard after a short delay
  //     setTimeout(() => navigate("/dashboard"), 2000);
  //     dispatch({ type: "userDetails", data: JSOData.data });
  //   } catch (error) {
  //     const errorMsg = error.response?.data?.msg || "Login failed";

  //     // Show error alert
  //     Swal.fire({
  //       icon: "error",
  //       title: "Login failed",
  //       text: errorMsg,
  //       toast: true,
  //       position: "top-right",
  //       timer: 3000, // 3 seconds
  //       showConfirmButton: false,
  //     });

  //     setErrorMessage(errorMsg); // Display error message in the form
  //   }
  // };
 const onSubmit = async (data) => {
   try {
     // Make the API call to login
     const response = await axios.post("/login", data);
     const userData = response.data.data;
     console.log("Login Success:", userData);

     // Store token and user details
     localStorage.setItem("authToken", response.data.token);
     dispatch({ type: "userDetails", data: userData });
localStorage.setItem("userData", JSON.stringify(userData));
     // Fetch users based on state location
    //  const state = userData.location.state;
    //  const usersResponse = await axios.get(`/users?state=${state}`, {
    //    headers: { Authorization: `Bearer ${response.data.token}` },
    //  });
    //  console.log("Users from same state:", usersResponse.data);

     Swal.fire({
       icon: "success",
       title: "Login successful!",
       text: "Redirecting to dashboard...",
       toast: true,
       position: "top-right",
       timer: 2000,
       showConfirmButton: false,
     });

     // Redirect to dashboard after a short delay
     setTimeout(() => navigate("/dashboard"), 2000);
   } catch (error) {
     const errorMsg = error.response?.data?.msg || "Login failed";

     Swal.fire({
       icon: "error",
       title: "Login failed",
       text: errorMsg,
       toast: true,
       position: "top-right",
       timer: 3000,
       showConfirmButton: false,
     });

     setErrorMessage(errorMsg); // Display error message in the form
   }
 };

  useEffect(() => {
    axios.defaults.baseURL = REACT_APP_API_URL;
  }, []);

  return (
    <div className="login-container">
      <div className="row min-vh-100">
        <div className="col-md-6 d-none d-md-flex flex-column justify-content-center align-items-center login-right">
          <img
            src={mainGif}
            alt="Illustration"
            className="img-fluid"
            style={{ maxWidth: "60%" }}
          />
        </div>
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center login-left">
          <img
            src={ssLogo}
            alt="ss Logo"
            className="mb-1"
            height={100}
            width={100}
          />
          <h3 className="mb-4">Sign In</h3>

          <form className="w-100 login-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3 w-50">
              <label className="mb-2">Email</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  className={`form-control ${
                    touchedFields.email && errors.email
                      ? "border-tomato"
                      : touchedFields.email && !errors.email
                      ? "border-success"
                      : ""
                  }`}
                  placeholder="Email"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <small className="text-danger">{errors.email.message}</small>
                )}
              </div>
            </div>

            <div className="mb-3 w-50">
              <label className="mb-2">Password</label>
              <div className="input-wrapper">
                <input
                  type="password"
                  className={`form-control ${
                    touchedFields.password && errors.password
                      ? "border-tomato"
                      : touchedFields.password && !errors.password
                      ? "border-success"
                      : ""
                  }`}
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                {errors.password && (
                  <small className="text-danger">
                    {errors.password.message}
                  </small>
                )}
              </div>
            </div>

          
            <div className="mb-3 w-50 text-end">
              <a href="/forgotPassword" className="forgot-password-link">
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="btn btn-primary w-50">
              Continue
            </button>

            <div className="text-center mt-3">
              <span>
                Not a Member yet?{" "}
                <a href="/registerForm" className="signup-link">
                  Sign up
                </a>
              </span>
            </div>
          </form>

          <div className="mt-4 text-center small-links">
            <a href="#">Terms and Conditions</a> | <a href="#">Contact Us</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
