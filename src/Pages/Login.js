import React, { useContext, useEffect, useState } from "react";
import FrontendLayout from "../components/Layout/FrontendLayout";
import { useNavigate } from "react-router-dom";

import { Modal } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import { PostApi } from "../api/api-service";
import { API_Path, WebsiteUrl1 } from "../const";
import { toast } from "react-toastify";
import jwt_decode from "jwt-decode";
import AuthContext from "../context/AuthContext";
import { getTokenFirebase } from "../firebase";
import PhoneInput from "react-phone-input-2";
import Subscribe from "../components/Layout/Subscribe";
const sign = require("jwt-encode");

const secret = "FHGIHTIHERGhfiguhdiuhgieqqtyqerqqrtrqrtqqtyqytqqqqeeeeushiuhiohuiojaiowjzawrtw";

export default function Login() {
  const navigate = useNavigate();
  const [forgotmodalShow, setForgotModalShow] = useState(false);
  const [email, set_email] = useState("");
  const [remember, setRemember] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState("");
  const [subscribe, setSubscribe] = useState("");
  const [emailReset, setEmailReset] = useState("");
  const [phoneReset, setPhoneReset] = useState("");
  const [resetMode, setResetMode] = useState("");
  const [error, setError] = useState({});
  const [fcmToken, setFcmToken] = useState();
  // const [user, setUser] = useState(false);

  const { googleSignIn, appleSignIn, facebookSignIn, user, setUser } = useContext(AuthContext);

  //  remember me
  useEffect(() => {
    let remember_me_token = localStorage.getItem("remember_token");
    if (remember_me_token !== null && remember_me_token !== undefined) {
      let temp = jwt_decode(remember_me_token);
      // let temp = ""
      if (document.getElementById("remember")) {
        document.getElementById("remember").checked = true;
      }
      let dataemail = temp.email;
      let datapassword = temp.password;
      setRemember(true);
      set_email(dataemail);
      setPassword(datapassword);
    }
    getTokenFirebase()
      .then((token) => {
        setFcmToken(token);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const encode_token_jwt = (formData) => {
    var date = new Date();
    var time = date.getTime();
    const data = { exp: time + 3600, email: formData.email, password: formData.password, iat: time };
    const jwt = sign(data, secret);
    if (remember) {
      localStorage.setItem("remember_token", jwt);
    }
  };

  const errorContainer = (form, field) => {
    if (form.touched["email"]) {
      if (document.getElementById("emailError")) {
        document.getElementById("emailError").style.display = "none";
      }
    }
    return form.touched[field] && form.errors[field] ? <span className="error text-danger">{form.errors[field]}</span> : null;
  };

  const formAttr = (form, field) => ({
    onBlur: form.handleBlur,
    onChange: form.handleChange,
    value: form.values[field],
  });

  const handleGoogleSignIn = async () => {
    googleSignIn()
      .then((result) => {
        try {
          let data = {
            socialId: result?.uid,
            fullname: result?.displayName,
            image: result?.photoURL,
            email: result?.email,
            type: 2,
            role: 1,
            fcmtoken: fcmToken,
          };
          const socialLoginData = new Promise((resolve) => {
            resolve(PostApi(API_Path.socialLogin, data));
          });
          socialLoginData.then((res) => {
            if (res.data.success) {
              toast.success("Login successfully!");
              localStorage.setItem("opus_token", res.data.data.token);
              setUser(res.data.data);
              // window.location.href = "https://node.staging.rentechdigital.com:5013/";
              navigate("/profile");
            } else if (res.status === 401) {
              if (localStorage.getItem("opus_token")) {
                localStorage.removeItem("opus_token");
              }
            } else {
              toast.error(res.data.message);
            }
          });
        } catch (error) {
          console.log(error);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loginFacebook = (res) => {
    facebookSignIn()
      .then((result) => {
        try {
          let data = {
            socialId: result?.uid,
            fullname: result?.displayName,
            image: result?.photoURL,
            email: result?.email,
            type: 1,
            role: 1,
            fcmtoken: fcmToken,
          };

          const socialLoginData = new Promise((resolve) => {
            resolve(PostApi(API_Path.socialLogin, data));
          });
          socialLoginData.then((res) => {
            if (res.data.success) {
              toast.success("Login successfully!");
              localStorage.setItem("opus_token", res.data.data.token);
              setUser(res.data.data);
              navigate("/profile");
              // window.location.href = "https://node.staging.rentechdigital.com:5013/";
            } else if (res.status === 401) {
              if (localStorage.getItem("opus_token")) {
                localStorage.removeItem("opus_token");
              }
            } else {
              toast.error(res.data.message);
            }
          });
        } catch (error) {
          console.log(error);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Apple login
  const appleLoginWithFirebase = async (res) => {
    appleSignIn()
      .then((result) => {
        try {
          let data = {
            socialId: result?.uid,
            fullname: result?.displayName,
            image: result?.photoURL,
            email: result?.email,
            type: 3,
            role: 1,
            fcmtoken: fcmToken,
          };

          const socialLoginData = new Promise((resolve) => {
            resolve(PostApi(API_Path.socialLogin, data));
          });
          socialLoginData.then((res) => {
            if (res.data.success) {
              toast.success("Login successfully!");
              localStorage.setItem("opus_token", res.data.data.token);
              setUser(res.data.data);
              navigate("/profile");
              // window.location.href = "https://node.staging.rentechdigital.com:5013/";
            } else if (res.status === 401) {
              if (localStorage.getItem("opus_token")) {
                localStorage.removeItem("opus_token");
              }
            } else {
              toast.error(res.data.message);
            }
          });
        } catch (error) {
          console.log(error);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const submitFormData = (formData, resetForm) => {
    if (document.getElementById("emailError")) {
      document.getElementById("emailError").style.display = "none";
    }

    set_email(formData.email);
    formData.fcmtoken = fcmToken;
    const SigninUser = new Promise((resolve) => {
      resolve(PostApi(API_Path.login, formData));
    });
    SigninUser.then((res) => {
      if (res.data.success) {
        // change route rolewise
        if (res.data.data.role === 1) {
          setUser(res.data.data);
          encode_token_jwt(formData);
          toast.success(res.data.message);
          localStorage.setItem("opus_token", res.data.data.token);
          setTimeout(() => {
            navigate("/profile");
            // window.location.href = "https://node.staging.rentechdigital.com:5013";
          }, 1000);
        } else {
          toast.warning("User does not exist in user panel");
        }
        resetForm();
      } else {
        toast.error(res.data.message);
      }
    });
  };

  const forgotPasswordData = (type) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    type === "number" ? setResetMode("number") : setResetMode("email");

    if ((type === "email" && (emailReset === "" || !regex.test(emailReset))) || (type === "number" && phoneReset === "")) {
      if (emailReset === "" && type === "email") {
        setError({ name: "Please enter email" });
        document.getElementById("emailError").style.display = "block";
      } else if (!regex.test(emailReset) && type === "email") {
        setError({ name: "Please enter valid email" });
        document.getElementById("emailError").style.display = "block";
      }

      if (phoneReset === "" && type === "number") {
        setError({ name: "Please enter phone number" });
        document.getElementById("emailError").style.display = "block";
      } else if (!regex.test(phoneReset) && type === "number") {
        setError({ name: "Please enter valid phone number" });
        document.getElementById("emailError").style.display = "block";
      }
    } else {
      let data = { email: emailReset };
      const addforgotPassword = new Promise((resolve) => {
        resolve(PostApi(API_Path.forgotPassword, data));
      });
      addforgotPassword.then((res) => {
        if (res.data.success) {
          set_email(res.data.data.email);
          toast.success(res.data.message);
          setTimeout(() => {
            window.location.href = WebsiteUrl1 + "/otp-verification";
            // navigate("/profile")
          }, 1000);
          // navigate("https://node.staging.rentechdigital.com:5013/otp-verification");
        } else {
          toast.error(res.data.message);
        }
      });
    }
  };

  const passwordshow = (e) => {
    setShow(!show);
    document.getElementById("show_pwd")?.classList.toggle("active");
  };

  const handelCheckbox = (e) => {
    if (e.target.checked) {
      setRemember(true);
    } else {
      setRemember(false);
      localStorage.removeItem("remember_token");
    }
  };

  const validateEmail = (email) => {
    return Yup.string().email().isValidSync(email);
  };

  const validatePhone = (phone) => {
    return Yup.number()
      .integer()
      .positive()
      .test((phone) => {
        return phone && phone.toString().length >= 8 && phone.toString().length <= 14 ? true : false;
      })
      .isValidSync(phone);
  };

  return (
    <>
      <FrontendLayout>
        <section className="comn-row-section">
          <div className="container">
            <div className="row align-items-center justify-content-center">
              <div className="col-xl-8">
                <div className="login-main-box">
                  <div className="main-center-form">
                    <Formik
                      enableReinitialize
                      initialValues={{
                        email: email,
                        password: password,
                      }}
                      validationSchema={Yup.object({
                        email: Yup.string()
                          .required("Email / Phone is required")
                          .test("email", "Email / Phone is invalid", (value) => {
                            return validateEmail(value) || validatePhone(parseInt(value ?? "0"));
                          }),
                        password: Yup.string().required("Password is required."),
                      })}
                      onSubmit={(formData, { resetForm }) => {
                        submitFormData(formData, resetForm);
                      }}
                    >
                      {(runform) => (
                        <form className="row align-items-center" onSubmit={runform.handleSubmit}>
                          <div className="col-12 mb-3">
                            <div className="text-center">
                              <div className="comn-login-head">
                                <h2>Welcome to opase</h2>
                                <p>Welcome back! please enter your details.</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-12 mb-3">
                            <label className="comn-label-class">Email or phone number</label>
                            <input type="text" name="email" className="form-control comn-input-style" {...formAttr(runform, "email")} placeholder="Enter your email or phone number" />
                            {errorContainer(runform, "email")}
                          </div>
                          <div className="col-12 mb-3">
                            <label className="comn-label-class">Password</label>
                            <bdi className="d-block position-relative">
                              <input type={show ? "text" : "password"} name="password" id="password" {...formAttr(runform, "password")} className="form-control comn-input-style pe-5" placeholder="Enter the password" />
                              <span className="showpwd-class bg-transparent" id="show_pwd" onClick={(e) => passwordshow(e)}>
                                <i className="bi bi-eye-slash"></i>
                              </span>
                            </bdi>
                            {errorContainer(runform, "password")}
                          </div>
                          <div className="col-6 mb-3">
                            <label className="cust-chk-bx">
                              <input type="checkbox" id="remember" name="remember" onChange={handelCheckbox} />
                              <span className="cust-chkmark"></span>
                              Remember me
                            </label>
                          </div>
                          <div className="col-6 mb-3 text-end">
                            <button type="button" className="btn forgot-pwd" onClick={() => setForgotModalShow(true)}>
                              Forgot password?
                            </button>
                          </div>
                          <div className="col-12 mb-3">
                            <button className="comn-btn-class w-100" type="submit">
                              Sign in
                            </button>
                          </div>
                          <div className="col-12">
                            <div className="text-center form-btm-link">
                              <p>
                                Don’t have an account?
                                {/* <Link to="https://node.staging.rentechdigital.com:5013/signuptalent"> */}
                                <a href={WebsiteUrl1 + "/signup"} className="ms-2">
                                  Sign up
                                </a>
                                {/* </Link> */}
                              </p>
                              <span>Or login with</span>

                              <div className="d-flex align-items-center justify-content-center fb-span">
                                <button appId="555304175955499" type="button" fields="name,email,picture" isMobile={false} autoLoad={false} onClick={loginFacebook} className="social-comn-box me-2" redirectUri="https://node.staging.rentechdigital.com:5097/">
                                  <svg width="10" height="17" viewBox="0 0 10 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.40847 3.40216H6.92831C6.63441 3.40216 6.30784 3.78888 6.30784 4.30278V6.09372H9.41018L8.94097 8.64778H6.30784V16.3151H3.38081V8.64778H0.725342V6.09372H3.38081V4.59153C3.38081 2.43622 4.87612 0.684814 6.92831 0.684814H9.40847V3.40216Z" fill="white" />
                                  </svg>
                                </button>

                                <button type="button" onClick={handleGoogleSignIn} className="social-comn-box me-2">
                                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.6259 11.2139C20.6259 10.4225 20.5604 9.84497 20.4186 9.24609H11.1974V12.818H16.61C16.501 13.7057 15.9117 15.0425 14.6021 15.9408L14.5838 16.0603L17.4993 18.2738L17.7013 18.2936C19.5565 16.6145 20.6259 14.1441 20.6259 11.2139Z" fill="#4285F4" />
                                    <path d="M11.1968 20.6248C13.8486 20.6248 16.0747 19.7692 17.7008 18.2934L14.6016 15.9405C13.7722 16.5073 12.6591 16.903 11.1968 16.903C8.59964 16.903 6.3953 15.224 5.60951 12.9033L5.49433 12.9129L2.46268 15.2122L2.42303 15.3202C4.03809 18.4644 7.35555 20.6248 11.1968 20.6248Z" fill="#34A853" />
                                    <path d="M5.61006 12.9036C5.40272 12.3047 5.28273 11.663 5.28273 11C5.28273 10.3369 5.40272 9.69524 5.59915 9.09636L5.59366 8.96881L2.524 6.63257L2.42357 6.67938C1.75792 7.98412 1.37598 9.44929 1.37598 11C1.37598 12.5507 1.75792 14.0158 2.42357 15.3205L5.61006 12.9036Z" fill="#FBBC05" />
                                    <path d="M11.1968 5.09664C13.041 5.09664 14.2851 5.87733 14.9944 6.52974L17.7662 3.8775C16.0639 2.32681 13.8486 1.375 11.1968 1.375C7.35551 1.375 4.03804 3.53526 2.42297 6.6794L5.59856 9.09638C6.39526 6.77569 8.59961 5.09664 11.1968 5.09664Z" fill="#EB4335" />
                                  </svg>
                                </button>

                                <div id="appleid-signin" data-responsetype="code id_token" data-responsemode="form_post" data-state="intrex" data-popup="true" textbutton="" nonce="nonce" data-clientid="com.app.opaseServiceId" data-mode="center-align" data-type="sign-in" data-color="black" data-border="false" data-border-radius="15" data-width="200" data-height="32">
                                  <button className="social-comn-box" onClick={appleLoginWithFirebase} type="button">
                                    <svg width="16" height="19" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M15.4996 6.48065C15.4122 6.53357 13.3338 7.65045 13.3338 10.1268C13.4318 12.951 15.9567 13.9414 16 13.9414C15.9567 13.9943 15.6188 15.2906 14.6179 16.6494C13.8236 17.8199 12.942 19 11.6032 19C10.3297 19 9.87257 18.2199 8.40317 18.2199C6.82518 18.2199 6.37868 19 5.17051 19C3.83173 19 2.88479 17.7567 2.04717 16.5972C0.958967 15.0796 0.0340318 12.6981 0.00137867 10.4114C-0.0206267 9.19965 0.219303 8.00854 0.828355 6.99682C1.68798 5.58439 3.22268 4.6256 4.89864 4.59398C6.18276 4.55205 7.32562 5.44762 8.1093 5.44762C8.86032 5.44762 10.2644 4.59398 11.853 4.59398C12.5388 4.59467 14.3673 4.79468 15.4996 6.48065ZM8.00069 4.35205C7.77212 3.24548 8.40317 2.13891 8.99093 1.43304C9.74195 0.579402 10.9281 0 11.951 0C12.0163 1.10657 11.6025 2.19183 10.8628 2.98224C10.1991 3.83588 9.05624 4.47851 8.00069 4.35205Z" fill="white" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Subscribe />

        {/* forgot password modal */}
        <Modal
          show={forgotmodalShow}
          onHide={() => {
            setForgotModalShow(false);
            setEmailReset("");
            setPhoneReset("");
          }}
          size="md"
          className="comn-modal-style"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body className="pt-0">
            <div className="text-center modal-data">
              <span>Forgot password</span>
              <p>Select which contact details should we use to reset your password:</p>
              <div
                className="modal-in-box mb-3"
                onClick={() => {
                  setResetMode("number");
                }}
              >
                <div className="d-flex">
                  <div className="me-3">
                    <svg width="19" height="28" viewBox="0 0 19 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.9375 27.75H3.43751C2.05679 27.75 0.9375 26.6307 0.9375 25.25V2.75C0.9375 1.36929 2.05679 0.25 3.43751 0.25H15.9375C17.3183 0.25 18.4376 1.36929 18.4376 2.75V25.25C18.4376 26.6307 17.3183 27.75 15.9375 27.75ZM3.43751 2.75V25.25H15.9375V2.75H3.43751ZM9.68753 24C8.99717 24 8.43752 23.4404 8.43752 22.75C8.43752 22.0596 8.99717 21.5 9.68753 21.5C10.3779 21.5 10.9375 22.0596 10.9375 22.75C10.9375 23.4404 10.3779 24 9.68753 24Z" fill="white" />
                    </svg>
                  </div>
                  <div className="box-in-info text-start">
                    <span className="d-block">Via SMS</span>
                    <p>*** *** 7895</p>
                  </div>
                </div>
              </div>
              <div
                className="modal-in-box"
                onClick={() => {
                  setResetMode("email");
                }}
              >
                <div className="d-flex">
                  <div className="me-3">
                    <svg width="26" height="20" viewBox="0 0 26 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.75 5L11.6133 11.5755C12.453 12.1353 13.547 12.1353 14.3868 11.5755L24.2501 5M4.25001 18.75H21.7501C23.1308 18.75 24.2501 17.6307 24.2501 16.25V3.75C24.2501 2.36929 23.1308 1.25 21.7501 1.25H4.25001C2.86929 1.25 1.75 2.36929 1.75 3.75V16.25C1.75 17.6307 2.86929 18.75 4.25001 18.75Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="box-in-info text-start">
                    <span className="d-block">Via email</span>
                    <p>******e@gmail.com</p>
                  </div>
                </div>
              </div>
              <div>
                {resetMode === "email" && (
                  <>
                    <label className="comn-label-class">Email</label>
                    <div className="d-flex">
                      <input
                        type="text"
                        name="emailReset"
                        value={emailReset}
                        onChange={(e) => {
                          setEmailReset(e.target.value);
                        }}
                        className="form-control comn-input-style"
                        placeholder="Please enter email"
                      />

                      <button className="comn-btn-class px-3 py-1 ms-2" onClick={() => forgotPasswordData("email")}>
                        Submit
                      </button>
                    </div>
                    <span id="emailError" style={{ display: "none" }} className="input-feedback text-danger text-start">
                      {error?.name}
                    </span>
                  </>
                )}
                {resetMode === "number" && (
                  <>
                    <label className="comn-label-class">Phone number</label>
                    <div className="d-flex">
                      <PhoneInput
                        id="phone"
                        name="phone"
                        country="US"
                        CountryCode
                        autoFormat={true}
                        defaultCountry="US"
                        className="marginBottom country-tel-div"
                        copyNumbersOnly="false"
                        onChange={(value, country) => {
                          setPhoneReset(value);
                        }}
                        value={phoneReset}
                      />

                      <button className="comn-btn-class px-3 py-1 ms-2" onClick={() => forgotPasswordData("number")}>
                        Submit
                      </button>
                    </div>
                    <span id="emailError" style={{ display: "none" }} className="input-feedback text-danger text-start">
                      {error?.name}
                    </span>
                  </>
                )}
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </FrontendLayout>
    </>
  );
}
