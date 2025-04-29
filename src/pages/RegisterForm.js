import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import indiaStatesCities from "../data/indianCities.json";
import mainGif from "../assets/images/mainGif.gif";
import ssLogo from "../assets/images/ssLogo.png";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

function RegisterForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({ mode: "onChange" });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState("");
  const selectedState = watch("state");

  useEffect(() => {
    setStates(Object.keys(indiaStatesCities));
    axios.defaults.baseURL = "http://localhost:7386";
  }, []);

  useEffect(() => {
    if (selectedState) {
      setCities(indiaStatesCities[selectedState] || []);
    } else {
      setCities([]);
    }
  }, [selectedState]);

  // ✅ NEW OTP SUBMIT FUNCTION
  // ✅ NEW OTP SUBMIT FUNCTION
  const onOtpSubmit = async (otpData) => {
    try {
      const response = await axios.post("/verifyOTP", otpData);
      let verifiedData = response.data;

      console.log("OTP Verification Success:", verifiedData.data);

      localStorage.setItem("authToken", verifiedData.token);
      dispatch({ type: "userDetails", data: verifiedData.data });

      Swal.fire({
        icon: "success",
        title: "OTP Verified!",
        text: "User verified successfully, please log in.",
        toast: true,
        position: "top-right",
        timer: 3000,
        showConfirmButton: false,
        background: "#28a745",
        color: "#fff",
      });

      setTimeout(() => {
        // Navigate to the login page after OTP verification
        navigate("/");
      }, 3000); // Delay navigation to allow user to read the success message
    } catch (error) {
      const errorMsg = error.response?.data?.msg || "OTP Verification Failed";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMsg,
        toast: true,
        position: "top-right",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  // FORM SUBMIT HANDLER
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("userType", userType);
      formData.append("name", data.name);
      formData.append("state", data.state);
      formData.append("city", data.city);
      formData.append("mobile", data.mobile);
      formData.append("email", data.email);
      formData.append("password", data.password);

      const response = await axios.post("/newUseRegister", formData);
      let JSOData = response.data;
      console.log(JSOData);

      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Please verify your OTP.",
        position: "top-right",
        timer: 3000,
        toast: true,
        showConfirmButton: false,
        background: "#28a745",
        color: "#fff",
      });

      // OTP Input
      const { value: otp } = await Swal.fire({
        title: "Enter OTP",
        input: "text",
        inputLabel: "Please enter the OTP sent to your email",
        inputPlaceholder: "Enter OTP",
        showCancelButton: true,
        confirmButtonText: "Verify",
        cancelButtonText: "Cancel",
        inputValidator: (value) => {
          if (!value) {
            return "OTP is required!";
          }
        },
      });

      if (otp) {
        // ✅ Call new onOtpSubmit function
        await onOtpSubmit({ email: data.email, otp });
      }

      reset();
    } catch (error) {
      console.error(
        "Error during registration:",
        error.response?.data || error.message
      );

      Swal.fire({
        icon: "error",
        title: "Registration Failed!",
        text: error.response?.data || "Something went wrong, please try again.",
        position: "top-right",
        timer: 3000,
        toast: true,
        showConfirmButton: false,
        background: "#dc3545",
        color: "#fff",
      });
    } finally {
      setLoading(false);
    }
  };

  const getInputClass = (fieldName) => {
    if (errors[fieldName]) return "form-control error-border";
    if (watch(fieldName)) return "form-control success-border";
    return "form-control";
  };

  return (
    <div className="container-fluid main-container">
      <div className="row m-0">
        {/* Right Side Image */}
        <div className="col-md-6 p-0">
          <div className="right-side">
            <img src={mainGif} alt="Illustration" className="img-fluid" />
          </div>
        </div>

        {/* Left Side Form */}
        <div className="col-md-6 left-side">
          <div className="form-wrapper">
            <div className="logo-heading mb-3 text-center">
              <img
                src={ssLogo}
                alt="ss Logo"
                className="mb-3"
                height={100}
                width={100}
              />
              <h3 className="mb-4">Sign Up</h3>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-100"
              encType="multipart/form-data"
            >
              {/* User Type */}
              <div className="mb-3 position-relative">
                <label>User Type</label>
                <select
                  className={getInputClass("userType")}
                  onChange={(e) => setUserType(e.target.value)}
                  required
                >
                  <option value="">Select User Type</option>
                  <option value="individual">Individual</option>
                  <option value="company">Company</option>
                </select>
                {errors.userType && (
                  <FaExclamationCircle className="input-icon error-icon" />
                )}
                {!errors.userType && userType && (
                  <FaCheckCircle className="input-icon success-icon" />
                )}
              </div>

              {/* Name Field */}
              <div className="mb-3 position-relative">
                <label>User Name / Company Name</label>
                <input
                  type="text"
                  className={getInputClass("name")}
                  {...register("name", {
                    required: "Name is required",
                    pattern: {
                      value: /^[a-zA-Z\s]+$/,
                      message: "Name must only contain letters and spaces",
                    },
                  })}
                />
                {errors.name && (
                  <FaExclamationCircle className="input-icon error-icon" />
                )}
                {!errors.name && watch("name") && (
                  <FaCheckCircle className="input-icon success-icon" />
                )}
                {errors.name && (
                  <small className="text-danger">{errors.name.message}</small>
                )}
              </div>

              {/* State */}
              <div className="mb-3 position-relative">
                <label>State</label>
                <select
                  className={getInputClass("state")}
                  {...register("state", { required: "State is required" })}
                >
                  <option value="">Select State</option>
                  {states.map((stateName) => (
                    <option key={stateName} value={stateName}>
                      {stateName}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <FaExclamationCircle className="input-icon error-icon" />
                )}
                {!errors.state && watch("state") && (
                  <FaCheckCircle className="input-icon success-icon" />
                )}
                {errors.state && (
                  <small className="text-danger">{errors.state.message}</small>
                )}
              </div>

              {/* City */}
              <div className="mb-3 position-relative">
                <label>City</label>
                <select
                  className={getInputClass("city")}
                  {...register("city", { required: "City is required" })}
                >
                  <option value="">Select City</option>
                  {cities.map((cityName) => (
                    <option key={cityName} value={cityName}>
                      {cityName}
                    </option>
                  ))}
                </select>
                {errors.city && (
                  <FaExclamationCircle className="input-icon error-icon" />
                )}
                {!errors.city && watch("city") && (
                  <FaCheckCircle className="input-icon success-icon" />
                )}
                {errors.city && (
                  <small className="text-danger">{errors.city.message}</small>
                )}
              </div>

              {/* Mobile */}
              <div className="mb-3 position-relative">
                <label>Mobile Number</label>
                <input
                  type="text"
                  className={getInputClass("mobile")}
                  {...register("mobile", {
                    required: "Mobile number is required",
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: "Invalid Indian Mobile Number",
                    },
                  })}
                />
                {errors.mobile && (
                  <FaExclamationCircle className="input-icon error-icon" />
                )}
                {!errors.mobile && watch("mobile") && (
                  <FaCheckCircle className="input-icon success-icon" />
                )}
                {errors.mobile && (
                  <small className="text-danger">{errors.mobile.message}</small>
                )}
              </div>

              {/* Email */}
              <div className="mb-3 position-relative">
                <label>Email</label>
                <input
                  type="email"
                  className={getInputClass("email")}
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <FaExclamationCircle className="input-icon error-icon" />
                )}
                {!errors.email && watch("email") && (
                  <FaCheckCircle className="input-icon success-icon" />
                )}
                {errors.email && (
                  <small className="text-danger">{errors.email.message}</small>
                )}
              </div>

              {/* Password */}
              <div className="mb-3 position-relative">
                <label>Password</label>
                <input
                  type="password"
                  className={getInputClass("password")}
                  {...register("password", {
                    required: "Password is required",
                    pattern: {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message:
                        "Password must be strong (8+, upper, lower, number, special)",
                    },
                  })}
                />
                {errors.password && (
                  <FaExclamationCircle className="input-icon error-icon" />
                )}
                {!errors.password && watch("password") && (
                  <FaCheckCircle className="input-icon success-icon" />
                )}
                {errors.password && (
                  <small className="text-danger">
                    {errors.password.message}
                  </small>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-3 position-relative">
                <label>Confirm Password</label>
                <input
                  type="password"
                  className={getInputClass("confirmPassword")}
                  {...register("confirmPassword", {
                    required: "Confirm password is required",
                    validate: (value) =>
                      value === watch("password") || "Passwords don't match",
                  })}
                />
                {errors.confirmPassword && (
                  <FaExclamationCircle className="input-icon error-icon" />
                )}
                {!errors.confirmPassword && watch("confirmPassword") && (
                  <FaCheckCircle className="input-icon success-icon" />
                )}
                {errors.confirmPassword && (
                  <small className="text-danger">
                    {errors.confirmPassword.message}
                  </small>
                )}
              </div>

              {/* Submit Button */}
              <div className="mb-3">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
