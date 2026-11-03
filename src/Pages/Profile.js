import React, { useContext, useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import FrontendLayout from "../components/Layout/FrontendLayout";
import { PostApi } from "../api/api-service";
import { API_Path } from "../const";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import moment from "moment";
import Subscribe from "../components/Layout/Subscribe";
import review from "../images/user.png";

var startdate = moment();
startdate = startdate.subtract(18, "years");
startdate = startdate.format("YYYY-MM-DD");

export default function Profile() {
  const telentForm = useRef();
  const [images, setImages] = useState(null);
  const [phone, setPhone] = useState("");
  const [data, setData] = useState("");
  const [CountryCode, setCountryCode] = useState("");
  const [countryName, setCountryName] = useState("");
  const { user, setUser } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    getAllIProfile();
  }, []);

  const errorContainer = (form, field) => {
    return form.touched[field] && form.errors[field] ? <span className="error text-danger">{form.errors[field]}</span> : null;
  };

  const formAttr = (form, field) => ({
    onBlur: form.handleBlur,
    onChange: form.handleChange,
    value: form.values[field],
  });

  const imagesFile = (e) => {
    setImages(e.target.files[0]);
  };

  const getAllIProfile = () => {
    let path = API_Path.getAllProfileData;

    const getAllProfileData = new Promise((resolve) => {
      resolve(PostApi(path));
    });
    getAllProfileData.then((res) => {
      if (res.status === 200) {
        setData(res.data.data);
        setUser(res.data.data);
      }  else {
        toast.error(res.data.message);
      }
    });
  };

  const submitFormData = (formData, resetForm) => {
    let data1 = new FormData();
    data1.append("images", images);
    data1.append("username", formData.userName);
    data1.append("fullname", formData.name);
    data1.append("phone", phone);
    data1.append("email", formData.email);
    data1.append("contrycode", CountryCode);
    data1.append("countrysurname", countryName);
    let editProfile = new Promise((resolve) => {
      resolve(PostApi(API_Path.editProfileData, data1));
    });
    editProfile.then((res) => {
      if (res.data.success) {
        toast.success(res.data.message);
        getAllIProfile();
        resetForm();
      }  else {
        toast.error(res.data.message);
      }
    });
  };

  const submitPasswordData = (formData, resetForm) => {
    const changePass = new Promise((resolve) => {
      resolve(PostApi(API_Path.changePassword, formData));
    });
    changePass.then((res) => {
      if (res.data.success) {
        resetForm();
        toast.success(res.data.message);
        navigate("/login");
        localStorage.removeItem("opus_token");
      }  else {
        toast.error(res.data.message);
      }
    });
  };

  const passwordshow = (e) => {
    var x = document.getElementById("new_password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
    document.getElementById("show_pwd").classList.toggle("active");
  };
  const passwordconfirmshow = (e) => {
    var x = document.getElementById("confirm_password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
    document.getElementById("show_confirm_pwd").classList.toggle("active");
  };
  const oldpasswordshow = (e) => {
    var x = document.getElementById("old_password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
    document.getElementById("show_old_pwd").classList.toggle("active");
  };

  const handleChange = (phone, country) => {
    setCountryCode(country.dialCode);
    setCountryName(country.countryCode);
    setPhone(phone);
    if (phone > 9) {
      telentForm.current.setFieldValue("phone", phone);
    }
  };

  return (
    <>
      <FrontendLayout>
        <section className="black-bg-section">
          <div className="container">
            <div className="row">
              <div className="col-12 mb-4">
                <div className="black-comn-box">
                  <div className="black-box-head">Profile</div>
                  <Formik
                    innerRef={telentForm}
                    enableReinitialize
                    initialValues={{
                      name: data?.fullname ? data?.fullname : "",
                      userName: data?.user_name ? data?.user_name : "",
                      email: data?.email ? data?.email : "",
                      number: data?.phone ? data?.phone : "",
                      dob: data?.date_of_birth ? data?.date_of_birth : "",
                    }}
                    validationSchema={Yup.object({
                      name: Yup.string().required("Full name is required."),
                      userName: Yup.string().required("Username is required."),
                      email: Yup.string().email("Enter valid email address.").required("Email is required."),
                    })}
                    onSubmit={(formData, { resetForm }) => {
                      submitFormData(formData, resetForm);
                    }}
                  >
                    {(runform) => (
                      <form className="row" onSubmit={runform.handleSubmit}>
                        <div className="col-12 mb-3">
                          <div className="d-flex justify-content-center mb-2">
                            <div className="upload-profile-box ">
                              <img referrerPolicy="no-referrer" className="profile-class" alt="" src={images != null && images !== "" ? URL.createObjectURL(images) : data.image != "null" && data.image !== "" ? data.image : review} />
                              <label htmlFor="upload-profile" className="upload-cam">
                                <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M14.277 11.3943C14.277 11.7235 14.1457 12.0392 13.912 12.272C13.6783 12.5048 13.3614 12.6356 13.0309 12.6356H1.81549C1.48499 12.6356 1.16803 12.5048 0.934326 12.272C0.700627 12.0392 0.569336 11.7235 0.569336 11.3943V4.56696C0.569336 4.23773 0.700627 3.922 0.934326 3.6892C1.16803 3.45641 1.48499 3.32562 1.81549 3.32562H4.3078L5.55395 1.46362H9.29241L10.5386 3.32562H13.0309C13.3614 3.32562 13.6783 3.45641 13.912 3.6892C14.1457 3.922 14.277 4.23773 14.277 4.56696V11.3943Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M7.42395 10.1523C8.80041 10.1523 9.91626 9.04082 9.91626 7.66968C9.91626 6.29854 8.80041 5.18701 7.42395 5.18701C6.04748 5.18701 4.93164 6.29854 4.93164 7.66968C4.93164 9.04082 6.04748 10.1523 7.42395 10.1523Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <input type="file" id="upload-profile" name="images" onChange={imagesFile} accept="image/*" hidden />
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="comn-label-class">Full name</label>
                          <input type="text" name="name" {...formAttr(runform, "name")} className="form-control comn-input-style" placeholder="Enter your full name" />
                          {errorContainer(runform, "name")}
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="comn-label-class">Username</label>
                          <input type="text" name="userName" {...formAttr(runform, "userName")} className="form-control comn-input-style" placeholder="Enter your username" />
                          {errorContainer(runform, "userName")}
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="comn-label-class">Email address</label>
                          <input type="email" name="email" {...formAttr(runform, "email")} className="form-control comn-input-style" placeholder="Enter your email address" />
                          {errorContainer(runform, "email")}
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="comn-label-class">Phone number</label>
                          <PhoneInput
                            name="phone"
                            country="us"
                            className="marginBottom country-tel-div"
                            value={data.phone ? data.phone : phone}
                            onChange={(value, country) => {
                              handleChange(value, country);
                            }}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="comn-label-class">Date of birth</label>
                          <input type="date" name="dob" max={startdate} {...formAttr(runform, "dob")} className="form-control comn-input-style" />
                          {errorContainer(runform, "dob")}
                        </div>
                        <div className="col-12">
                          <div className="row">
                            <div className="col-lg-6 m-auto">
                              <button className="comn-btn-class w-100" type="submit">
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    )}
                  </Formik>
                </div>
              </div>
              <div className="col-12">
                <div className="black-comn-box">
                  <div className="black-box-head">Change password</div>
                  <Formik
                    enableReinitialize
                    initialValues={{
                      password: "",
                      oldpassword: "",
                      configpassword: "",
                    }}
                    validationSchema={Yup.object({
                      oldpassword: Yup.string().required("Password is required."),
                      password: Yup.string()
                        .required("Password is required.")
                        .when("oldpassword", { is: (val) => (val && val.length > 0 ? true : false), then: Yup.string().notOneOf([Yup.ref("oldpassword")], "Password must be different from old password.") }),
                      configpassword: Yup.string()
                        .required("Password is required.")
                        .when("password", {
                          is: (val) => (val && val.length > 0 ? true : false),
                          then: Yup.string().oneOf([Yup.ref("password")], "Password must match."),
                        }),
                    })}
                    onSubmit={(formData, { resetForm }) => {
                      submitPasswordData(formData, resetForm);
                    }}
                  >
                    {(runform) => (
                      <form className="row" onSubmit={runform.handleSubmit}>
                        <div className="col-12 mb-3">
                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <label className="comn-label-class">Current password</label>
                              <bdi className="d-block position-relative">
                                <input type="password" id="old_password" name="oldpassword" {...formAttr(runform, "oldpassword")} className="form-control comn-input-style pe-5" placeholder="Enter the current password" />
                                <span className="showpwd-class bg-transparent" id="show_old_pwd" onClick={(e) => oldpasswordshow(e)}>
                                  <i className="bi bi-eye-slash"></i>
                                </span>
                              </bdi>
                              {errorContainer(runform, "oldpassword")}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="comn-label-class">New password</label>
                          <bdi className="d-block position-relative">
                            <input type="password" id="new_password" name="password" {...formAttr(runform, "password")} className="form-control comn-input-style pe-5" placeholder="Enter the new password" />
                            <span className="showpwd-class bg-transparent" id="show_pwd" onClick={(e) => passwordshow(e)}>
                              <i className="bi bi-eye-slash"></i>
                            </span>
                          </bdi>
                          {errorContainer(runform, "password")}
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="comn-label-class">Confirm password</label>
                          <bdi className="d-block position-relative">
                            <input type="password" id="confirm_password" name="configpassword" {...formAttr(runform, "configpassword")} className="form-control comn-input-style pe-5" placeholder="Enter the confirm password" />
                            <span className="showpwd-class bg-transparent" id="show_confirm_pwd" onClick={(e) => passwordconfirmshow(e)}>
                              <i className="bi bi-eye-slash"></i>
                            </span>
                          </bdi>
                          {errorContainer(runform, "configpassword")}
                        </div>
                        <div className="col-12">  
                          <div className="row">
                            <div className="col-lg-6 m-auto">
                              <button className="comn-btn-class w-100">Save</button>
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
        </section>
        <Subscribe />
      </FrontendLayout>
    </>
  );
}
