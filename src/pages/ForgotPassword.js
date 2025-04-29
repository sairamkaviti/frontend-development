import React from "react";
import { useForm } from "react-hook-form";
import "bootstrap/dist/css/bootstrap.min.css";
import mainGif from "../assets/images/mainGif.gif";
import ssLogo from "../assets/images/ssLogo.png";

import { FaExclamationCircle, FaCheckCircle } from "react-icons/fa"; // Add icon imports

function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields }, // Track touched fields
  } = useForm({mode:"onBlur"});

 

    const onSubmit = async (data) => {
      try {
        const response = await fetch("REACT_APP_API_URL/forgotPassword", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: data.email }),
        });

        const result = await response.json();
        if (response.ok) {
          alert("Reset password email sent successfully!");
        } else {
          alert(result.message || "Something went wrong.");
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred while sending reset email.");
      }
   
    console.log("Form Data:", data);
    // API call for reset password can be done here
  };

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
            className="mb-3"
            height={100}
            width={100}
          />
          <h3 className="mb-3">Forgot Password?</h3>
          <p>Enter your email to reset your password.</p><br/>

          <form className="w-100 login-form" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Input */}
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
                {errors.email ? (
                  <FaExclamationCircle className="input-icon text-tomato" />
                ) : touchedFields.email && !errors.email ? (
                  <FaCheckCircle className="input-icon text-success" />
                ) : null}
              </div>
              {errors.email && (
                <small className="text-danger">{errors.email.message}</small>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-50">
              Submit
            </button>
          </form>

          <div className="mt-4 text-center small-links">
            <a href="#">Terms and Conditions</a> | <a href="#">Contact Us</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
