import React, { useEffect, useState } from "react";
import FrontendLayout from "../components/Layout/FrontendLayout";
import { Collapse, Modal } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PostApi } from "../api/api-service";
import { API_Path } from "../const";
import { toast } from "react-toastify";
import { Formik } from "formik";
import * as Yup from "yup";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { isDesktop, isMobile, isSafari } from "react-device-detect";
import PaymentRequestForm from "../components/CheckoutForm";
import Subscribe from "../components/Layout/Subscribe";
import moment from "moment";

const stripePromise = loadStripe("pk_test_51LO3qNDpz8i4UOTOUaXeECDJ6x7WNgl0o5MfoKhpIZh7SeM2nQjdoZLDNkJuNqMypsBJfqznwu7Iy3YAYLnkHcbZ00AJeBZPov");

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [opencard, setOpenCard] = useState(false);
  const [paymodalShow, setPayModalShow] = useState(false);
  const [requestData, setRequestData] = useState("");
  // const [cardmodalShow, setCardModalShow] = useState(false);
  const [payType, setPayType] = useState(isSafari ? "applepay" : "googlepay");
  const [cardDetail, setCardDetail] = useState(" ");
  const [amount, setAmount] = useState(0);
  const [infovalue, setInfoValue] = useState("");
  const [tempButtonSupport, setTempButtonSupport] = useState(false);
  const [myWalletData, setmyWalletData] = useState({});
  const [paymentBtn, setPaymentBtn] = useState(true);
  const [finalAmount, setFinalAmount] = useState(5);
  const [playing, setPlaying] = React.useState(false);
  const [selectPrice, setSelectPrice] = React.useState("standard");
  // const params = useParams();
  const [option, set_option] = useState({
    sizePerPage: 10,
    search: "",
    totalRecord: 0,
    page: 0,
    sort: "id",
    order: "DESC",
  });

  useEffect(() => {
    // getRequestData();
    getBankData();
    getWalletData();
    getPopularSingleData();
  }, []);

  const getBankData = () => {
    const getBankDetail = new Promise((resolve) => {
      resolve(PostApi(API_Path.getBankDetail));
    });
    getBankDetail.then((res) => {
      if (res.status === 200) {
        res.data.data?.map((item) => {
          if (item.is_default === 1) {
            setCardDetail(item);
          }
        });
      }
      // else if (res.status === 401) {
      //   if (localStorage.getItem("opus_token")) {
      //     localStorage.removeItem("opus_token");
      //   }
      // }
      else {
        toast.error(res.data.message);
      }
    });
  };

  const getPopularSingleData = () => {
    const data = { talentId: location?.state?.requestData?.id };
    const getPopularSingleData = new Promise((resolve) => {
      resolve(PostApi(API_Path.GetTalentNewDetailData, data));
    });
    getPopularSingleData
      .then((res) => {
        if (res.data.success) {
          setRequestData(res.data.data);
          setInfoValue(res.data.data?.video_price);
          setAmount(res.data.data?.video_price);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const errorContainer = (form, field) => {
    return form.touched[field] && form.errors[field] ? <span className="error text-danger">{form.errors[field]}</span> : null;
  };

  const formAttr = (form, field) => ({
    onBlur: form.handleBlur,
    onChange: form.handleChange,
    value: form.values[field],
  });

  const handleEdit = () => {
    // navigate(`/book-talent/${location.state?.id}`, { state: { id: location.state?.id } });
    navigate(`/book-talent/${location?.state?.requestData.id}`, { state: { requestData: location?.state?.requestData } });
  };

  const handleBooking = () => {
    navigate("/all-trending/1");
  };

  const submitBankFormData = (formData, resetForm) => {
    formData.amount = infovalue;
    formData.type = payType;
    const addPaymentData = new Promise((resolve) => {
      resolve(PostApi(API_Path.addPaymentData, formData));
    });
    addPaymentData.then((res) => {
      if (res.data.success) {
        toast.success(res.data.message);
        createTalentRequest();
        resetForm(formData);
        setPayModalShow(true);
      }
      // else if (res.status === 401) {
      //   if (localStorage.getItem("opus_token")) {
      //     localStorage.removeItem("opus_token");
      //   }
      // }
      else {
        toast.error(res.data.message);
      }
    });
  };

  const createTalentRequest = () => {
    let data = new FormData();
    data.append("talentId", location?.state?.requestData?.id);
    data.append("selectoccasion", location?.state?.requestData?.selectoccasion);
    data.append("introduceYourself", location?.state?.requestData?.introduceYourself);
    data.append("instruction", location?.state?.requestData?.instruction);
    data.append("pronoun", location?.state?.requestData?.pronoun);
    data.append("attachVideo", location?.state?.requestData?.attachVideo);
    data.append("phone", location?.state?.requestData?.email);
    data.append("hour24", requestData?.video_price_24 === 0 ? 0 : requestData?.video_price_24 !== 0 && selectPrice === "hours24" ? infovalue : 0);
    data.append("standard", requestData?.video_price_24 === 0 ? requestData?.video_price : requestData?.video_price !== 0 && selectPrice === "standard" ? infovalue : 0);

    // if (requestData.id) {
    //   data.append("requestId", location.state?.id);
    // }
    const BookTalentData = new Promise((resolve) => {
      resolve(PostApi(API_Path.BookNewTalent, data));
    });
    BookTalentData.then((res) => {
      if (res.data.success) {
        if (res.data.data) {
          toast.success(res.data.message);
        }
      } else {
        toast.error(res.data.message);
      }
    });
  };

  const getWalletData = () => {
    let data = { option: option };
    const addWalletDetails = new Promise((resolve) => {
      resolve(PostApi(API_Path.GetTransactionHistory, data));
    });
    addWalletDetails.then((res) => {
      if (res.status === 200) {
        setmyWalletData(res.data.data);
      }
      // else if (res.status === 401) {
      //   if (localStorage.getItem("opus_token")) {
      //     localStorage.removeItem("opus_token");
      //   }
      // }
      else {
        toast.error(res.data.message);
      }
    });
  };

  const handlePaymentMethod = (e) => {
    setPayType(e.target.value);
    if (e.target.value === "googlepay") {
      if (document.querySelector('button[aria-label="Google Pay"]')) {
        document.querySelector('button[aria-label="Google Pay"]').click();
      }
    }
  };

  const handelDeliveryInfo = (e) => {
    setSelectPrice(e.target?.id);
    setInfoValue(parseInt(e.target.value));
    setFinalAmount(parseInt(e.target.value));
    setTempButtonSupport(true);

    if (e.target.value !== "") {
      if (e.target.value === "custom") {
        let amt = parseFloat(5);
        setFinalAmount(amt);
        // setAmount(5);
        // setTempButtonSupport(false);
      } else {
        let amt = parseFloat(e.target.value);
        setFinalAmount(amt);
        // setTempButtonSupport(false);
      }
      setTimeout(() => {
        changeBtnStatus();
      }, 2000);
    }
  };

  const submitFormData = async (e) => {
    if (payType === "stripe") {
      document.getElementById("cardDetail").click();
    }
    if (payType === "wallet") {
      let data = { usewallet: infovalue };
      const addPaymentData = new Promise((resolve) => {
        resolve(PostApi(API_Path.addPaymentData, data));
      });
      addPaymentData.then(async (res) => {
        if (res.data.success) {
          toast.success(res.data.message);
          await createTalentRequest();
          navigate("/requests");
        } else if (res.status === 401) {
          if (localStorage.getItem("opus_token")) {
            localStorage.removeItem("opus_token");
          }
        } else {
          toast.error(res.data.message);
        }
      });
    }
  };

  const checkPaymentBtnSupported = (status) => {
    setPaymentBtn(status);
  };

  const changeBtnStatus = () => {
    // var btnStatus = !status;
    setTempButtonSupport(false);
    setPaymentBtn(true);
  };

  // const handleDelete = () => {
  //   console.log("delete");
  // };

  const handleVideoClick = () => {
    setPlaying(true);
    if (document.getElementById("video1")) {
      document.getElementById("video1").play();
    }
    // vidRef.current?.play();
  };

  const formatNum = (num) => {
    return String(num)?.replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1,");
  };

  return (
    <FrontendLayout>
      <section className="black-bg-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mb-lg-0 mb-3">
              <form className="row">
                <div className="col-12 mb-4">
                  <div className="d-flex align-items-center">
                    <div className="sm-profile-part">
                      <img referrerPolicy="no-referrer" src={requestData?.image && requestData?.image !== "null" ? requestData?.image : process.env.PUBLIC_URL + "/images/talent-1.png"} alt="" />
                    </div>
                    <div className="ms-2 book-talent-info">
                      <span>New request for {requestData.fullname}</span>
                    </div>
                    <span className="ms-2">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.71667 5.51667L10.4833 6.28333L2.93333 13.8333H2.16667V13.0667L9.71667 5.51667ZM12.7167 0.5C12.5083 0.5 12.2917 0.583333 12.1333 0.741667L10.6083 2.26667L13.7333 5.39167L15.2583 3.86667C15.5833 3.54167 15.5833 3.01667 15.2583 2.69167L13.3083 0.741667C13.1417 0.575 12.9333 0.5 12.7167 0.5ZM9.71667 3.15833L0.5 12.375V15.5H3.625L12.8417 6.28333L9.71667 3.15833Z" fill="#7C64F8" />
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="col-12 mb-4">
                  <div className="d-md-flex side-line-class">
                    <span className="comn-num-span">1</span>
                    <div className="ms-md-3 mt-md-0 mt-2 w-100 book-talent-comn">
                      <span>About yourself</span>
                      <p>You’re meeting your hero, time to fun out</p>
                      <div className="grey-comn-box grey-comn-detail">
                        <label className="comn-label-class">About yourself</label>
                        <p className="mb-0">{location?.state?.requestData?.introduceYourself}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 mb-4">
                  <div className="d-md-flex side-line-class">
                    <span className="comn-num-span">2</span>
                    <div className="ms-md-3 mt-md-0 mt-2 w-100 book-talent-comn">
                      <span>Occasion</span>
                      <p>What is this for?</p>
                      <div className="grey-comn-box occ-cust-radio-main">
                        <bdi>
                          <label className="text-center select-occ">
                            <div className="occ-radio-box">
                              <img src={location?.state?.requestData?.selectoccasion === "birthday" ? process.env.PUBLIC_URL + "/images/occ-2.svg" : location?.state?.requestData?.selectoccasion === "pep_talk" ? process.env.PUBLIC_URL + "/images/occ-3.svg" : location?.state?.requestData?.selectoccasion === "thanks" ? process.env.PUBLIC_URL + "/images/occ-4.svg" : location?.state?.requestData?.selectoccasion === "que" ? process.env.PUBLIC_URL + "/images/occ-5.svg" : location?.state?.requestData?.selectoccasion === "advice" ? process.env.PUBLIC_URL + "/images/occ-6.svg" : location?.state?.requestData?.selectoccasion === "roast" ? process.env.PUBLIC_URL + "/images/occ-7.svg" : location?.state?.requestData?.selectoccasion === "anniversery" ? process.env.PUBLIC_URL + "/images/occ-8.svg" : location?.state?.requestData?.selectoccasion === "gift" ? process.env.PUBLIC_URL + "/images/occ-9.svg" : location?.state?.requestData?.selectoccasion === "just_cuz" && process.env.PUBLIC_URL + "/images/occ-10.svg"} alt="" />
                            </div>
                            <span>{location?.state?.requestData?.selectoccasion}</span>
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
                      <span>Pronoun</span>
                      <p>Add optional pronouns</p>
                      <div className="grey-comn-box grey-comn-detail">
                        <label className="comn-label-class">What pronouns would you like them to use?</label>
                        <p>Add optional pronouns</p>
                        <label className="comn-label-class">Pronoun</label>
                        <p className="mb-0">{location?.state?.requestData?.pronoun}</p>
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
                        <p className="mb-0">{location?.state?.requestData?.instruction}</p>
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
                        <div className="d-flex align-items-center">
                          <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 3C1 1.89543 1.89543 1 3 1H17C18.1046 1 19 1.89543 19 3V13C19 14.1046 18.1046 15 17 15H3C1.89543 15 1 14.1046 1 13V3Z" fill="white" />
                            <path d="M1 4L8.8906 9.2604C9.5624 9.70827 10.4376 9.70827 11.1094 9.2604L19 4M3 15H17C18.1046 15 19 14.1046 19 13V3C19 1.89543 18.1046 1 17 1H3C1.89543 1 1 1.89543 1 3V13C1 14.1046 1.89543 15 3 15Z" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <label className="comn-label-class mb-0 ms-2">{location?.state?.requestData?.email}</label>
                        </div>
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
                        <label className="comn-label-class">Uploaded video</label>
                        <div className="dash-box-main">
                          <div className="video-uploaded-main">
                            <span className="play-btn-uploaded" onClick={handleVideoClick}>
                              {!playing && (
                                <svg width="30" height="30" viewBox="0 0 71 71" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M35.2611 70.3C15.7869 70.3 0 54.5628 0 35.15C0 15.7372 15.7869 0 35.2611 0C54.7353 0 70.5222 15.7372 70.5222 35.15C70.5008 54.554 54.7264 70.2787 35.2611 70.3ZM7.05222 35.7546C7.21906 51.2249 19.8912 63.655 35.4111 63.5723C50.931 63.4887 63.4683 50.9235 63.4683 35.4523C63.4683 19.981 50.931 7.41586 35.4111 7.33228C19.8912 7.24954 7.21906 19.6796 7.05222 35.15V35.7546ZM28.2089 50.9675V19.3325L49.3655 35.15L28.2089 50.9675Z" fill="white" />
                                </svg>
                              )}
                            </span>
                            {/* <button className="close-uploaded-btn" type="button" >
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.59 0L5 3.59L1.41 0L0 1.41L3.59 5L0 8.59L1.41 10L5 6.41L8.59 10L10 8.59L6.41 5L10 1.41L8.59 0Z" fill="white" />
                              </svg>
                            </button> */}
                            {/* <img src={process.env.PUBLIC_URL + "/images/video-banner.png"} alt="" /> */}

                            <div className="position-relative">
                              {location?.state?.requestData?.attach_video && (
                                <video src={location?.state?.requestData?.attach_video ? location?.state?.requestData?.attach_video : ""} width="200" height="150" id="video1" controls>
                                  <source type="video/*" />
                                </video>
                              )}
                              {/* <div className="delete-rou-po" onClick={handleDelete}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <circle cx="12" cy="12" r="11.25" fill="#7C64F8" stroke="#121212" stroke-width="1.5" />
                                  <path d="M15.59 7L12 10.59L8.41 7L7 8.41L10.59 12L7 15.59L8.41 17L12 13.41L15.59 17L17 15.59L13.41 12L17 8.41L15.59 7Z" fill="white" />
                                </svg>
                              </div> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="row">
                    <div className="col-lg-8 m-auto">
                      <button className="comn-btn-class w-100" type="button" onClick={handleEdit}>
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="col-lg-4">
              <div className="">
                <div className="comn-text-class">
                  <h4>Payment info</h4>
                </div>
                <div className="grey-comn-box position-relative h-100">
                  <div className="row border-bottom  ">
                    <div className="col-12 mb-3">
                      <div className="comn-text-class">
                        <h5>Delivery info</h5>
                      </div>
                      <div className="cust-radio-div">
                        <div className="form-check mb-2 me-2" onChange={handelDeliveryInfo}>
                          <input className="form-check-input" type="radio" name="delivery" id="standard" value={requestData?.video_price} defaultChecked />
                          <label className="form-check-label ms-2" htmlFor="standard">
                            <span className="d-flex align-items-center">
                              <span className="ms-2 mb-0">Standard price ${formatNum(requestData?.video_price)}</span>
                            </span>
                            <bdi>May up to 7 days</bdi>
                          </label>
                        </div>
                        {requestData?.video_price_24 !== 0 && (
                          <div className="form-check mb-2 me-2" onChange={handelDeliveryInfo}>
                            <input className="form-check-input" type="radio" name="delivery" id="hours24" value={requestData?.video_price_24} />
                            <label className="form-check-label ms-2" htmlFor="hours24">
                              <span className="d-flex align-items-center">
                                <span className="ms-2 mb-0">24 hours or less price ${formatNum(requestData?.video_price_24)}</span>
                              </span>
                              <bdi>Get it in day or less!</bdi>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12 mb-3">
                      <div className="cust-radio-div">
                        <div className="form-check mb-2 mt-3" onChange={handlePaymentMethod}>
                          {/* {amount != null && amount !== 0 && (
                            <Elements stripe={stripePromise}>
                              <PaymentRequestForm amount={amount} type={payType} requestData={{ ...requestData, hour24: requestData?.video_price_24 === 0 ? 0 : requestData?.video_price_24 !== 0 && selectPrice === "hours24" ? infovalue : 0, standard: requestData?.video_price_24 === 0 ? requestData?.video_price : requestData?.video_price !== 0 && selectPrice === "standard" ? infovalue : 0 }} />
                            </Elements>
                          )} */}

                          {tempButtonSupport ? (
                            <button type="button" className="w-100 d-flex align-items-center justify-content-center google-pay-btn-custom">
                              <div className="spinner-border" role="status">
                                <span className="sr-only"></span>
                              </div>
                            </button>
                          ) : paymentBtn ? (
                            <Elements stripe={stripePromise}>
                              <PaymentRequestForm amount={finalAmount} type={payType} checkPaymentBtnSupported={checkPaymentBtnSupported} requestData={{ ...requestData, hour24: requestData?.video_price_24 === 0 ? 0 : requestData?.video_price_24 !== 0 && selectPrice === "hours24" ? infovalue : 0, standard: requestData?.video_price_24 === 0 ? requestData?.video_price : requestData?.video_price !== 0 && selectPrice === "standard" ? infovalue : 0 }} isWallet={false} />
                            </Elements>
                          ) : (
                            <div>
                              {(isMobile || isDesktop) && isSafari ? (
                                <button type="button" className="google-pay-btn apple-pay-img w-100 d-flex align-items-center justify-content-center">
                                  <span className="text-light">
                                    <img src="/images/apple-pay.svg" className="img-fluid" alt="" /> is not supported
                                  </span>
                                </button>
                              ) : (
                                <button type="button" className="google-pay-btn w-100 d-flex align-items-center justify-content-center">
                                  <span className="text-light">
                                    <img src="/images/google-pay-btn.svg" className="me-1 img-fluid" alt="" />
                                    is not supported
                                  </span>
                                </button>
                              )}{" "}
                            </div>
                          )}
                        </div>

                        <div className="form-check mb-2" onChange={handlePaymentMethod}>
                          <input className="form-check-input" type="radio" name="payment" id="creditcard" value="stripe" onClick={() => setOpenCard(true)} />
                          <label className="form-check-label ms-2" htmlFor="creditcard">
                            <span>Credit/Debit card</span>
                            <bdi>All payments will be processed securely</bdi>
                          </label>
                        </div>

                        <Formik
                          enableReinitialize
                          initialValues={{
                            CardName: cardDetail?.hold_name ? cardDetail?.hold_name : "",
                            CardNumber: cardDetail?.card_nomber ? cardDetail?.card_nomber : "",
                            ExpiryDate: cardDetail?.exp_date ? moment(cardDetail?.exp_date)?.format("YYYY-MM") : "",
                            CVV: cardDetail?.cvv_no ? cardDetail?.cvv_no : "",
                            bankId: cardDetail.id,
                          }}
                          validationSchema={Yup.object({
                            CardNumber: Yup.number().typeError("Please enter number").required("Card number is required."),
                            CardName: Yup.string().required("Card name is required."),
                            ExpiryDate: Yup.string().required("Date is required."),
                            CVV: Yup.number().typeError("CVV should be number").required("CVV is required."),
                          })}
                          onSubmit={(formData, { resetForm }) => {
                            submitBankFormData(formData, resetForm);
                          }}
                        >
                          {(runform) => (
                            <Collapse in={opencard}>
                              <form className="row align-items-center" onSubmit={runform.handleSubmit}>
                                <div className="row">
                                  <div className="col-12 mb-3">
                                    <label className="comn-label-class">Name on card</label>
                                    <input className="form-control comn-input-style" type="text" placeholder="Enter the name that on your card" name="CardName" {...formAttr(runform, "CardName")} />
                                    {errorContainer(runform, "CardName")}
                                  </div>
                                  <div className="col-12 mb-3">
                                    <label className="comn-label-class">Card number</label>
                                    <bdi className="d-block position-relative">
                                      <input type="tel" maxLength="16" className="form-control comn-input-style pe-5" placeholder="Enter card number" name="CardNumber" {...formAttr(runform, "CardNumber")} />
                                      <span className="showpwd-class bg-transparent" id="show_pwd">
                                        <img src={process.env.PUBLIC_URL + "/images/card.svg"} alt="" />
                                      </span>
                                    </bdi>
                                    {errorContainer(runform, "CardNumber")}
                                  </div>
                                  <div className="col-xl-6 col-lg-12 col-sm-6 mb-3">
                                    <label className="comn-label-class">Expiry date</label>
                                    <input className="form-control comn-input-style" type="month" name="ExpiryDate" {...formAttr(runform, "ExpiryDate")} />
                                    {errorContainer(runform, "ExpiryDate")}
                                  </div>
                                  <div className="col-xl-6 col-lg-12 col-sm-6 mb-3">
                                    <label className="comn-label-class">CVV</label>
                                    <input className="form-control comn-input-style" type="password" placeholder="CVV" name="CVV" maxLength="3" {...formAttr(runform, "CVV")} />
                                    {errorContainer(runform, "CVV")}
                                  </div>
                                  <button className="d-none" id="cardDetail" type="submit">
                                    Submit
                                  </button>
                                </div>
                              </form>
                            </Collapse>
                          )}
                        </Formik>
                        <div className="cust-radio-div d-flex cash-wallet-check" onChange={handlePaymentMethod}>
                          <div className="form-check mb-2 me-2">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="payment"
                              id="creditcard"
                              value="wallet"
                              onClick={() => {
                                setOpenCard(false);
                              }}
                            />
                            <label className="form-check-label ms-2" htmlFor="creditcard">
                              <span className="d-flex align-items-center">
                                <img src={process.env.PUBLIC_URL + "/images/logo-main.png"} className="radio-logo" alt="" />
                                <span className="ms-2 mb-0">Cash</span>
                              </span>
                              <bdi>Pay with opase wallet</bdi>
                            </label>
                          </div>

                          <span className="ms-auto">${myWalletData.myWallet}</span>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 mb-3">
                      {infovalue ? (
                        <button className="comn-btn-class w-100" type="button" onClick={submitFormData}>
                          Pay ${formatNum(infovalue)}
                        </button>
                      ) : (
                        <button className="comn-btn-class disabled w-100" type="button" disabled>
                          Pay $0.00
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Subscribe />

      {/* -------------------PAYMENT DONE-------------------------- */}
      <Modal show={paymodalShow} onHide={() => setPayModalShow(false)} size="md" centered className="comn-modal-style">
        <Modal.Header className="border-0" closeButton></Modal.Header>
        <Modal.Body>
          <div className="text-center modal-data">
            <img src={process.env.PUBLIC_URL + "/images/successful.svg"} className="img-fluid mb-3" alt="" />
            <span>Payment successfull !</span>
            <p>Congratulations your request is successfull. you will receive an request confimation email/SMS shortly.</p>
            <div className="row">
              <div className="col-sm-6 mb-sm-0 mb-3">
                <button
                  className="comn-btn-class w-100"
                  onClick={() => {
                    navigate("/requests");
                  }}
                >
                  View requests
                </button>
              </div>
              <div className="col-sm-6">
                <button className="border-button-class" onClick={handleBooking}>
                  Continue booking
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* --------------------add card----------------------------- */}
      {/* <Modal show={cardmodalShow} onHide={() => setCardModalShow(false)} size="md" centered className="comn-modal-style">
        <Modal.Header className="border-0 add-card-modal me-3" closeButton>
          <div className="row px-5">
            <div className="col-12 mt-3">
              <h4>Add Credit Card</h4>
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <Formik
            enableReinitialize
            initialValues={{
              CardNumber: cardDetail?.card_nomber ? cardDetail?.card_nomber : "",
              ExpiryDate: cardDetail?.exp_date ? cardDetail?.exp_date : "",
              CVV: "",
              postalcode: cardDetail?.postal_code ? cardDetail?.postal_code : "",
            }}
            validationSchema={Yup.object({
              CardNumber: Yup.number().typeError("Please enter number").required("Card Number is required."),
              ExpiryDate: Yup.string().required("Date is required."),
              postalcode: Yup.string().required("Postal Code is required"),
              CVV: Yup.number().typeError("CVV should be number").required("CVV is required."),
            })}
            onSubmit={(formData, { resetForm }) => {
              submitBankFormData(formData, resetForm);
            }}
          >
            {(runform) => (
              <form className="row align-items-center" onSubmit={runform.handleSubmit}>
                <div className="row px-5">
                  <div className="col-12 mx-auto mb-3">
                    <label className="comn-label-class">Name on card</label>
                    <bdi className="d-block position-relative">
                      <input type="tel" className="form-control comn-input-style pe-5" placeholder="Please eneter the name that on your card" name="CardNumber" {...formAttr(runform, "CardNumber")} />
                    </bdi>
                    {errorContainer(runform, "CardNumber")}
                  </div>
                  <div className="col-12 mb-3">
                    <label className="comn-label-class">Card Number</label>
                    <bdi className="d-block position-relative">
                      <input type="tel" className="form-control comn-input-style pe-5" placeholder="Enter Card Number" name="CardNumber" {...formAttr(runform, "CardNumber")} />
                    </bdi>
                    {errorContainer(runform, "CardNumber")}
                  </div>
                  <div className="col-xl-6 col-lg-12 col-sm-6 mb-3">
                    <label className="comn-label-class">Expiry Date</label>
                    <input className="form-control comn-input-style" type="month" name="ExpiryDate" {...formAttr(runform, "ExpiryDate")} />
                    {errorContainer(runform, "ExpiryDate")}
                  </div>
                  <div className="col-xl-6 col-lg-12 col-sm-6 mb-3">
                    <label className="comn-label-class">CVV</label>
                    <input className="form-control comn-input-style" type="tel" placeholder="CVV" name="CVV" {...formAttr(runform, "CVV")} />
                    {errorContainer(runform, "CVV")}
                  </div>
                  <div className="col-xl-6 col-lg-12 col-sm-6 mb-3">
                    <label className="comn-label-class">Postal Code</label>
                    <input className="form-control comn-input-style" type="tel" placeholder="postalcode" name="postalcode" {...formAttr(runform, "postalcode")} />
                    {errorContainer(runform, "postalcode")}
                  </div>

                  <div className="col-12 mt-3">
                    <button className="comn-btn-class w-100" type="submit">
                      Pay $3.45
                    </button>
                  </div>
                </div>
              </form>
            )}
          </Formik>
        </Modal.Body>
      </Modal> */}
    </FrontendLayout>
  );
}
