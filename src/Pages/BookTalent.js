import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PostApi } from "../api/api-service";
import FrontendLayout from "../components/Layout/FrontendLayout";
import { Formik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { API_Path } from "../const";
import jwt_decode from "jwt-decode";
import Subscribe from "../components/Layout/Subscribe";

export default function BookTalent() {
  const [occasion, setOccasion] = useState("");
  const [video, setVideo] = useState("");
  const [id, setId] = useState("");
  const [requestData, setRequestData] = useState("");
  const [talentData, setTalentDetail] = useState("");
  const [highlight, setHighlight] = useState(false);
  const [attachVideo, setAttachVideo] = useState("");
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem("opus_token") !== "undefined") {
      setId(jwt_decode(localStorage.getItem("opus_token"))?.id);
    }

    if (location.state?.id) {
      getRequestData(location.state?.id);
    }

    if (document.getElementById(location?.state?.requestData?.selectoccasion)) {
      document.getElementById(location?.state?.requestData?.selectoccasion).setAttribute("checked", true);
      document.getElementById(location?.state?.requestData?.selectoccasion).value = location?.state?.requestData?.selectoccasion;
    }
    setOccasion(location?.state?.requestData?.selectoccasion);
    setVideo(location?.state?.requestData?.attach_video);
    getTalentDetailData(params);
  }, []);

  const handleChange = (e) => {
    setOccasion(e.target.value);
  };

  const handleVideo = (e) => {
    setAttachVideo(e.target.files[0]);
    // setRequestData({ ...requestData, attach_video: "" });
    // setVideo(e.target.files[0]);
    setVideo(URL.createObjectURL(e.target.files[0]));
  };

  const getTalentDetailData = (id1) => {
    const data = { talentId: parseInt(id1.id) };
    const getTalentDetailData = new Promise((resolve) => {
      resolve(PostApi(API_Path.getTalentDetails, data));
    });
    getTalentDetailData
      .then((res) => {
        if (res.data.success) {
          setTalentDetail(res.data.data);
        }
        // else if (res.status === 401) {
        //   if (localStorage.getItem("opus_token")) {
        //     localStorage.removeItem("opus_token");
        //   }
        // }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const getRequestData = (id1) => {
    const data = {
      id: id1,
    };
    const getRequestData = new Promise((resolve) => {
      resolve(PostApi(API_Path.GetRequestDetail, data));
    });

    getRequestData.then(async (res) => {
      if (res.status === 200) {
        toast.success(res.data.massage);
        setRequestData(res.data.data);
        // setVideo(res.data.data?.attach_video);
        // console.log(file, "shihgi");
        // if (document.getElementById(res.data.data?.selectoccasion)) {
        //   document.getElementById(res.data.data?.selectoccasion).setAttribute("checked", true);
        //   document.getElementById(res.data.data?.selectoccasion).value = res.data.data?.selectoccasion;
        // }

        if (document.getElementById(location?.state?.requestData?.selectoccasion)) {
          document.getElementById(location?.state?.requestData?.selectoccasion).setAttribute("checked", true);
          document.getElementById(location?.state?.requestData?.selectoccasion).value = location?.state?.requestData?.selectoccasion;
        }
      } else {
        toast.error(res.data.massage);
      }
    });
  };

  const submitFormData = (formData, resetForm) => {
    formData.attach_video = video ? video : location?.state?.requestData?.attach_video;
    formData.selectoccasion = occasion;
    formData.id = params.id;
    formData.attachVideo = attachVideo;
    navigate("/payment", { state: { requestData: formData } });
  };
  const errorContainer = (form, field) => {
    return form.touched[field] && form.errors[field] ? <span className="error text-danger">{form.errors[field]}</span> : null;
  };

  const formAttr = (form, field) => ({
    onBlur: form.handleBlur,
    onChange: form.handleChange,
    value: form.values[field],
  });

  const handlehighlight = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setHighlight(true);
  };

  const handleunhighlight = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setHighlight(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setHighlight(false);

    let dt = e.dataTransfer;
    let files = dt.files;

    setVideo(files[0]);
  };

  return (
    <FrontendLayout>
      <section className="black-bg-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 m-auto">
              <Formik
                enableReinitialize
                initialValues={{
                  // email: requestData?.req_notif ? requestData?.req_notif : "",
                  // introduceYourself: requestData?.introduce_yourself ? requestData?.introduce_yourself : "",
                  // pronoun: requestData?.pronoun ? requestData?.pronoun : "",
                  // instruction: requestData?.instruction ? requestData?.instruction : "",
                  email: location?.state?.requestData?.email ? location?.state?.requestData?.email : "",
                  introduceYourself: location?.state?.requestData?.introduceYourself ? location?.state?.requestData?.introduceYourself : "",
                  pronoun: location?.state?.requestData?.pronoun ? location?.state?.requestData?.pronoun : "",
                  instruction: location?.state?.requestData?.instruction ? location?.state?.requestData?.instruction : "",
                }}
                validationSchema={Yup.object({
                  email: Yup.string().required("Email or mobile number is required."),
                  // .min(10)
                  // .matches(/^(\+\d{1,3}[- ]?)?\d{10}$/, "Phone number is not valid"),
                  introduceYourself: Yup.string().required("This field is required."),
                  pronoun: Yup.string().required("This field is required."),
                  instruction: Yup.string().required("This field is required."),
                })}
                onSubmit={(formData, { resetForm }) => {
                  submitFormData(formData, resetForm);
                }}
              >
                {(runform) => (
                  <form className="row" onSubmit={runform.handleSubmit}>
                    <div className="col-12 mb-4">
                      <div className="d-flex align-items-center">
                        <div className="sm-profile-part">
                          <img src={location.state?.image ? location.state?.image : talentData?.image ? talentData?.image : process.env.PUBLIC_URL + "/images/talent-1.png"} alt="" />
                        </div>
                        <div className="ms-2 book-talent-info">
                          <span>New request for {location.state?.fullname ? location.state?.fullname : talentData?.fullname ? talentData?.fullname : ""}</span>
                        </div>
                        {/* <span className="ms-2">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.71667 5.51667L10.4833 6.28333L2.93333 13.8333H2.16667V13.0667L9.71667 5.51667ZM12.7167 0.5C12.5083 0.5 12.2917 0.583333 12.1333 0.741667L10.6083 2.26667L13.7333 5.39167L15.2583 3.86667C15.5833 3.54167 15.5833 3.01667 15.2583 2.69167L13.3083 0.741667C13.1417 0.575 12.9333 0.5 12.7167 0.5ZM9.71667 3.15833L0.5 12.375V15.5H3.625L12.8417 6.28333L9.71667 3.15833Z" fill="#7C64F8" />
                          </svg>
                        </span> */}
                      </div>
                    </div>
                    <div className="col-12 mb-4">
                      <div className="d-md-flex side-line-class">
                        <span className="comn-num-span">1</span>
                        <div className="ms-md-3 mt-md-0 mt-2 w-100 book-talent-comn">
                          <span>Introduce yourself</span>
                          <p>You’re meeting your hero, time to fun out</p>
                          <div className="grey-comn-box grey-comn-detail">
                            <label className="comn-label-class">About yourself</label>
                            <textarea className="form-control h-auto comn-input-style" name="introduceYourself" rows={5} placeholder="Type your request...." {...formAttr(runform, "introduceYourself")} />
                            {errorContainer(runform, "introduceYourself")}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 mb-4">
                      <div className="d-md-flex side-line-class">
                        <span className="comn-num-span">2</span>
                        <div className="ms-md-3 mt-md-0 mt-2 w-100 book-talent-comn">
                          <span>Select an occasion</span>
                          <p>What is this for?</p>
                          <div className="grey-comn-box occ-cust-radio-main" onChange={handleChange}>
                            <bdi>
                              <input type="radio" id="none" name="occasion" value="none" />
                              <label htmlFor="none" className="text-center">
                                <div className="occ-radio-box">
                                  <img src={process.env.PUBLIC_URL + "/images/occ-1.svg"} alt="" />
                                </div>
                                <span>None</span>
                              </label>
                            </bdi>
                            <bdi>
                              <input type="radio" id="birthday" name="occasion" value="birthday" />
                              <label htmlFor="birthday" className="text-center">
                                <div className="occ-radio-box">
                                  <img src={process.env.PUBLIC_URL + "/images/occ-2.svg"} alt="" />
                                </div>
                                <span>Birthday</span>
                              </label>
                            </bdi>
                            <bdi>
                              <input type="radio" id="pep_talk" name="occasion" value="pep_talk" />
                              <label htmlFor="pep_talk" className="text-center">
                                <div className="occ-radio-box">
                                  <img src={process.env.PUBLIC_URL + "/images/occ-3.svg"} alt="" />
                                </div>
                                <span>Pep talk</span>
                              </label>
                            </bdi>
                            <bdi>
                              <input type="radio" id="thanks" name="occasion" value="thanks" />
                              <label htmlFor="thanks" className="text-center">
                                <div className="occ-radio-box">
                                  <img src={process.env.PUBLIC_URL + "/images/occ-4.svg"} alt="" />
                                </div>
                                <span>Give thanks</span>
                              </label>
                            </bdi>
                            <bdi>
                              <input type="radio" id="que" name="occasion" value="que" />
                              <label htmlFor="que" className="text-center">
                                <div className="occ-radio-box">
                                  <img src={process.env.PUBLIC_URL + "/images/occ-5.svg"} alt="" />
                                </div>
                                <span>Ask a question</span>
                              </label>
                            </bdi>
                            <bdi>
                              <input type="radio" id="advice" name="occasion" value="advice" />
                              <label htmlFor="advice" className="text-center">
                                <div className="occ-radio-box">
                                  <img src={process.env.PUBLIC_URL + "/images/occ-6.svg"} alt="" />
                                </div>
                                <span>Get advice</span>
                              </label>
                            </bdi>
                            <bdi>
                              <input type="radio" id="roast" name="occasion" value="roast" />
                              <label htmlFor="roast" className="text-center">
                                <div className="occ-radio-box">
                                  <img src={process.env.PUBLIC_URL + "/images/occ-7.svg"} alt="" />
                                </div>
                                <span>Roast</span>
                              </label>
                            </bdi>
                            <bdi>
                              <input type="radio" id="anniversery" name="occasion" value="anniversery" />
                              <label htmlFor="anniversery" className="text-center">
                                <div className="occ-radio-box">
                                  <img src={process.env.PUBLIC_URL + "/images/occ-8.svg"} alt="" />
                                </div>
                                <span>Anniversary</span>
                              </label>
                            </bdi>
                            <bdi>
                              <input type="radio" id="gift" name="occasion" value="gift" />
                              <label htmlFor="gift" className="text-center">
                                <div className="occ-radio-box">
                                  <img src={process.env.PUBLIC_URL + "/images/occ-9.svg"} alt="" />
                                </div>
                                <span>Gift</span>
                              </label>
                            </bdi>
                            <bdi>
                              <input type="radio" id="just_cuz" name="occasion" value="just_cuz" />
                              <label htmlFor="just_cuz" className="text-center">
                                <div className="occ-radio-box">
                                  <img src={process.env.PUBLIC_URL + "/images/occ-10.svg"} alt="" />
                                </div>
                                <span>Just cuz</span>
                              </label>
                            </bdi>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 mb-4">
                      <div className="d-md-flex side-line-class">
                        <span className="comn-num-span">3</span>
                        <div className="ms-md-3 mt-md-0 mt-2 w-100 book-talent-comn">
                          <span>Add pronoun</span>
                          <p>Add optional pronouns</p>
                          <div className="grey-comn-box grey-comn-detail">
                            <label className="comn-label-class">What pronouns would you like them to use?</label>
                            <p>Add optional pronouns</p>
                            <label className="comn-label-class">Pronoun</label>
                            <input type="text" className="form-control comn-input-style" placeholder="Enter pronoun" name="pronoun" {...formAttr(runform, "pronoun")} />
                            {errorContainer(runform, "pronoun")}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 mb-4">
                      <div className="d-md-flex side-line-class">
                        <span className="comn-num-span">4</span>
                        <div className="ms-md-3 mt-md-0 mt-2 w-100 book-talent-comn">
                          <span>Add instructions (required)</span>
                          <p>What would you like them to say?</p>
                          <div className="grey-comn-box grey-comn-detail">
                            <label className="comn-label-class">You’re meeting your hero, time to fan out</label>
                            <p>Include pronunciation if necessary.</p>
                            <label className="comn-label-class">Instructions</label>
                            <textarea className="form-control comn-input-style h-auto" placeholder="Type your request...." rows={5} name="instruction" {...formAttr(runform, "instruction")} />
                            {errorContainer(runform, "instruction")}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 mb-4">
                      <div className="d-md-flex side-line-class">
                        <span className="comn-num-span">5</span>
                        <div className="ms-md-3 mt-md-0 mt-2 w-100 book-talent-comn">
                          <span>Add email or phone number</span>
                          <p>Where you like to have notifications?</p>
                          <div className="grey-comn-box grey-comn-detail">
                            <label className="comn-label-class">Email or phone number</label>
                            <p>get notification when request is completed</p>
                            <input type="text" className="form-control comn-input-style" placeholder="Enter email or phone number" name="email" {...formAttr(runform, "email")} />
                            {errorContainer(runform, "email")}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 mb-4">
                      <div className="d-md-flex">
                        <span className="comn-num-span">6</span>
                        <div className="ms-md-3 mt-md-0 mt-2 w-100 book-talent-comn">
                          <span>Attach a video</span>
                          <p>Add a short 20 second video</p>
                          <div className="grey-comn-box grey-comn-detail">
                            <label className="comn-label-class">Instructions</label>
                            <div className={highlight ? "custom-file-drop-area highlight" : "custom-file-drop-area"} onDragEnter={handlehighlight} onDragOver={handlehighlight} onDragLeave={handleunhighlight} onDrop={handleDrop}>
                              <label className="upload-video-part">
                                <input type="file" id="upload-vdo" accept="video/*" name="attachVideo" onChange={(e) => handleVideo(e)} />

                                {video || location?.state?.requestData?.attach_video ? (
                                  <div className="video-upload-fix m-auto">
                                    <video src={video ? video : location?.state?.requestData?.attach_video}>
                                      <source src={video ? video : location?.state?.requestData?.attach_video} />
                                    </video>
                                  </div>
                                ) : (
                                  <>
                                    <img className="img-fluid" src={process.env.PUBLIC_URL + "/images/upload-cloud.svg"} />
                                    <bdi className="mt-2">Upload video</bdi>
                                  </>
                                )}
                                <label className="mt-4  border-button-comn py-2 px-3 w-auto" htmlFor="upload-vdo">
                                  Choose file
                                </label>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="row">
                        <div className="col-lg-8 m-auto">
                          <button className="comn-btn-class w-100" type="submit">
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </section>
      <Subscribe />
    </FrontendLayout>
  );
}
