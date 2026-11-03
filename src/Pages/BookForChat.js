import React, { useContext, useEffect, useState } from "react";
import FrontendLayout from "../components/Layout/FrontendLayout";
import { Collapse, Modal } from "react-bootstrap";
import { API_Path } from "../const";
import { PostApi } from "../api/api-service";
import { toast } from "react-toastify";
import jwt_decode from "jwt-decode";
import * as Yup from "yup";
import { Formik } from "formik";
import { Elements } from "@stripe/react-stripe-js";
import PaymentRequestForm from "../components/CheckoutForm";
import { isDesktop, isMobile, isSafari } from "react-device-detect";
import { loadStripe } from "@stripe/stripe-js";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import AuthContext from "../context/AuthContext";
import Subscribe from "../components/Layout/Subscribe";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";

// import { doc } from "firebase/firestore";

const stripePromise = loadStripe("pk_test_51LO3qNDpz8i4UOTOUaXeECDJ6x7WNgl0o5MfoKhpIZh7SeM2nQjdoZLDNkJuNqMypsBJfqznwu7Iy3YAYLnkHcbZ00AJeBZPov");

let id1 = window.location.href.split("/").pop();

// let user1 = 1

export default function BookForChat() {
  const params = useParams();
  const [opencard, setOpenCard] = useState(false);
  const [id, setId] = useState();
  const [talentdetail, setTalentDetail] = useState();
  const [text, setText] = useState("");
  const [receiver, setReceiver] = useState("");
  const [payType, setPayType] = useState("wallet");
  const [amount, setAmount] = useState(0);
  const [myWalletData, setmyWalletData] = useState({});
  const [cardDetail, setCardDetail] = useState(" ");
  const [payModal, setPayModal] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState(false);
  const [paymodalShow, setPayModalShow] = useState(false);

  let user1 = jwt_decode(localStorage.getItem("opus_token"))?.id;
  let chatId = user1 <= parseInt(params?.id) ? `${user1}-${params?.id}` : `${params?.id}-${user1}`;

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [option, set_option] = useState({
    sizePerPage: 10,
    search: "",
    totalRecord: 0,
    page: 0,
    sort: "id",
    order: "DESC",
  });

  useEffect(() => {
    setReceiver(params?.id);
    getPopularSingleData(params?.id);
    walletData();
    getBankData();
    if (localStorage.getItem("opus_token") !== undefined && localStorage.getItem("opus_token") !== null) {
      setId(jwt_decode(localStorage.getItem("opus_token")).id);
    }
  }, []);

  // useEffect(() => {
  // const socket = io("https://node.staging.rentechdigital.com:3027/");
  // setSocket(socket);
  // socket.on("connect", () => {
  //   console.log("socket Connected", sender);
  //   socket.emit("joinRoom", { sender: jwt_decode(localStorage.getItem("opus_token")).id });
  // });
  // }, []);

  const getPopularSingleData = (id1) => {
    const data = { talentId: id1 };
    const getPopularSingleData = new Promise((resolve) => {
      resolve(PostApi(API_Path.GetTalentNewDetailData, data));
    });
    getPopularSingleData
      .then((res) => {
        if (res.data.success) {
          setLoaded(true);
          setTalentDetail(res.data.data);
          setAmount(res.data.data?.chat_price);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

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
      } else {
        toast.error(res.data.message);
      }
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

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e, type) => {
    if (talentdetail?.payment === 1 || paid) {
      setError(false);
      if ((e.keyCode === 13 || type === "submit") && text) {
        let chatId = user1 <= parseInt(params?.id) ? `${user1}-${params?.id}` : `${params?.id}-${user1}`;

        let timestamp = Date.now();
        let url;
        // if (img) {
        //   const imgRef = ref(storage, `images/${new Date().getTime()}-${img.name}`);
        //   const snap = await uploadBytes(imgRef, img);
        //   const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
        //   url = dlUrl;
        // }

        await setDoc(doc(db, "messages", chatId, chatId, timestamp.toString()), {
          content: text,
          idFrom: user1?.toString(),
          contentType: 1,
          idTo: params?.id,
          timestamp: timestamp,
          media: url || "",
          read: false,
        });

        await setDoc(doc(db, "messages", chatId), {
          content: text,
          contentType: 1,
          dataFrom: {
            image: user && user !== undefined ? user?.image : "",
            name: user && user !== undefined ? user?.user_name : "",
          },
          dataTo: {
            image: talentdetail ? talentdetail?.image : "",
            name: talentdetail ? talentdetail?.user_name : "",
          },
          idFrom: user1 ? user1?.toString() : "",
          idTo: id1 ? params?.id : "",
          timestamp: timestamp,
          read: false,
          users: [user1 ? user1.toString() : "", params?.id ? params?.id : ""],
        });
        setText("");
        navigate("/chat", { state: { talentdetail: talentdetail } });
      }
    }

    // if (e === "submit" || e.keyCode === 13) {
    //   if (text) {
    //     // const newMessage = { time: format(Date.now()), text, sender: id, receiver: receiver, dir: "right" };
    //     const newMessage = { time: moment(new Date()).format("hh:mm a"), text, sender: id, receiver: parseInt(id1), dir: "right" };
    //     socket.emit("newMessage", newMessage);
    //     arr1.push(newMessage);
    //     setMessages([...arr1]);
    //     setText("");
    //   }
    // }
  };

  const createTalentRequest = () => {
    let data = new FormData();
    data.append("talentId", params?.id);
    data.append("chat", 1);
    data.append("chatPrice", amount);
    const BookTalentData = new Promise((resolve) => {
      resolve(PostApi(API_Path.BookNewTalent, data));
    });
    BookTalentData.then((res) => {
      if (res.data.success) {
        if (res.data.data) {
          // toast.success(`Request sent to ${talentdetail?.user_name}`);
          setPaid(true);
          setError(false);
        }
      } else {
        toast.error(res.data.message);
      }
    });
  };

  const walletData = () => {
    let data = { option: option };
    const addWalletDetails = new Promise((resolve) => {
      resolve(PostApi(API_Path.GetTransactionHistory, data));
    });
    addWalletDetails.then((res) => {
      if (res.status === 200) {
        setmyWalletData(res.data.data);
      } else {
        toast.error(res.data.message);
      }
    });
  };

  const handlePaymentMethod = (e) => {
    setPayType(e.target.value);
  };

  const submitBankFormData = (formData, resetForm) => {
    
    formData.amount = talentdetail?.chat_price;
    formData.type = payType;

    const addPaymentData = new Promise((resolve) => {
      resolve(PostApi(API_Path.addPaymentData, formData));
    });
    addPaymentData.then(async (res) => {
      if (res.data.success) {
        toast.success(res.data.message);
        resetForm(formData);
        await createTalentRequest();

        // setCardModalShow(false);
        // setPayModalShow(true);
      } else {
        toast.error(res.data.message);
      }
    });
  };

  const submitFormData = (e) => {
    
    setError(false);
    if (payType === "stripe") {
      document.getElementById("cardDetail").click();
    }
    if (payType === "wallet") {
      let data = { usewallet: amount };
      const addPaymentData = new Promise((resolve) => {
        resolve(PostApi(API_Path.addPaymentData, data));
      });
      addPaymentData.then(async (res) => {
        if (res.data.success) {
          setPayModalShow(true);
          await createTalentRequest();
        } else {
          toast.error(res.data.message);
        }
      });
    }
  };

  const formatNum = (num) => {
    return String(num)?.replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1,");
  };

  return (
    <FrontendLayout>
      <section className="black-bg-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-7 mb-lg-0 mb-3">
              <div className="grey-comn-box h-100 me-4">
                <div className="row h-100">
                  <div className="col-md-6 mx-auto">
                    <div className="text-center d-flex flex-column talent-detail-main-left ">
                      <div className="talent-msg-profile mt-5 mb-2">
                        <img referrerPolicy="no-referrer" src={talentdetail?.image && talentdetail?.image !== "null" ? talentdetail?.image : process.env.PUBLIC_URL + "/images/user.png"} alt="" />
                      </div>
                      <div className="talent-detail-main ms-3">
                        <span>{talentdetail?.fullname}</span>
                        <bdi>{talentdetail?.user_name}</bdi>
                        <p>{talentdetail?.about}</p>

                        <div className="my-5">
                          <img src={process.env.PUBLIC_URL + "/images/hand.png"} alt="" className="img-fluid" />
                        </div>
                        <span>
                          Say hi to {talentdetail?.fullname} for $ {talentdetail?.chat_price}
                        </span>
                        <p>You have 2550 characters to ask a question, get advice, to whatever. remember, there’s no guaratee you’ll get a response</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 mt-lg-auto mt-3">
                    <div className="chat-sub-span mt-3 p-0">
                      {/* <span>Hi! How do you?</span> */}
                      <input type="text" className="form-control comn-input-style right-pad-add" value={text} onChange={handleTextChange} onKeyDown={(e) => handleSubmit(e)} placeholder="Hi! how are you?" />

                      {loaded &&
                        (talentdetail?.payment === 0 ? (
                          <div className="send-btn">
                            <button type="button" className="border-0 cursor-pointer" onClick={(e) => handleSubmit(e, "submit")}>
                              <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.75842 21.6298L7.11867 22.6161C7.16257 22.6 7.20535 22.5811 7.24672 22.5593L6.75842 21.6298ZM5.99517 20.8794L6.9774 21.2505C6.98165 21.2392 6.98571 21.2279 6.98958 21.2165L5.99517 20.8794ZM5.99517 5.11999L6.98958 4.78287C6.98571 4.77147 6.98165 4.76013 6.9774 4.74887L5.99517 5.11999ZM6.75842 4.36955L7.24672 3.44C7.20535 3.41826 7.16257 3.39932 7.11867 3.38328L6.75842 4.36955ZM21.1247 14.083L21.613 15.0126L21.613 15.0126L21.1247 14.083ZM21.1247 11.9163L20.6364 12.8459H20.6364L21.1247 11.9163ZM21.7938 12.2679L21.3055 13.1974C21.322 13.2061 21.3388 13.2143 21.3557 13.2221L21.7938 12.2679ZM21.7938 13.7315L21.3557 12.7772C21.3388 12.785 21.322 12.7933 21.3055 12.8019L21.7938 13.7315ZM21.5708 12.1507L22.0591 11.2211L22.0591 11.2211L21.5708 12.1507ZM21.5708 13.8487L22.0591 14.7782L22.0591 14.7782L21.5708 13.8487ZM21.3477 13.9658L20.8594 13.0363L20.8594 13.0363L21.3477 13.9658ZM14.083 14.0497C14.6629 14.0497 15.133 13.5796 15.133 12.9997C15.133 12.4198 14.6629 11.9497 14.083 11.9497V14.0497ZM6.39817 20.6435C6.47769 20.6145 6.56325 20.6087 6.64538 20.6263L6.20483 22.6796C6.50909 22.7448 6.82602 22.723 7.11867 22.6161L6.39817 20.6435ZM6.64538 20.6263C6.72758 20.6439 6.80517 20.6848 6.86805 20.7467L5.39573 22.2441C5.61937 22.464 5.90051 22.6143 6.20483 22.6796L6.64538 20.6263ZM6.86805 20.7467C6.93109 20.8086 6.97665 20.8892 6.99672 20.9796L4.9466 21.4346C5.01514 21.7434 5.17192 22.024 5.39573 22.2441L6.86805 20.7467ZM6.99672 20.9796C7.01681 21.0701 7.00992 21.1644 6.9774 21.2505L5.01294 20.5082C4.90124 20.8039 4.87804 21.1256 4.9466 21.4346L6.99672 20.9796ZM6.98958 21.2165L9.66095 13.3368L7.67213 12.6625L5.00076 20.5422L6.98958 21.2165ZM9.66095 12.6625L6.98958 4.78287L5.00076 5.45712L7.67213 13.3368L9.66095 12.6625ZM6.9774 4.74887C7.00992 4.83495 7.01681 4.92924 6.99671 5.01977L4.9466 4.56477C4.87803 4.87371 4.90124 5.19548 5.01294 5.49111L6.9774 4.74887ZM6.99671 5.01977C6.97665 5.1102 6.93108 5.19071 6.86805 5.25269L5.39573 3.75526C5.17193 3.9753 5.01514 4.25594 4.9466 4.56477L6.99671 5.01977ZM6.86805 5.25269C6.80518 5.3145 6.72758 5.35543 6.64538 5.37306L6.20483 3.31979C5.9005 3.38509 5.61937 3.53537 5.39573 3.75526L6.86805 5.25269ZM6.64538 5.37306C6.56325 5.39068 6.47769 5.38486 6.39817 5.35581L7.11867 3.38328C6.82602 3.27639 6.50908 3.25451 6.20483 3.31979L6.64538 5.37306ZM21.613 10.9868L7.24672 3.44L6.27011 5.29909L20.6364 12.8459L21.613 10.9868ZM21.7938 12.2679C21.3557 13.2221 21.3552 13.2219 21.3547 13.2216C21.3546 13.2216 21.3541 13.2213 21.3537 13.2212C21.3531 13.2209 21.3524 13.2206 21.3518 13.2203C21.3505 13.2197 21.3492 13.2191 21.3479 13.2185C21.3454 13.2173 21.3429 13.2161 21.3405 13.2149C21.3357 13.2126 21.3312 13.2104 21.3269 13.2083C21.3183 13.204 21.3107 13.1999 21.3038 13.1961C21.2903 13.1886 21.2792 13.1818 21.2699 13.1755C21.2523 13.1636 21.2356 13.1499 21.2199 13.1324C21.2031 13.1137 21.1856 13.0885 21.1728 13.0577C21.1666 13.0426 21.1626 13.0288 21.1603 13.0172C21.158 13.0056 21.158 12.9993 21.158 12.9997H23.258C23.258 12.4325 23.032 12.0072 22.782 11.7289C22.6627 11.5961 22.5425 11.5011 22.4472 11.4366C22.3991 11.404 22.3556 11.3781 22.3194 11.358C22.3012 11.348 22.2847 11.3393 22.2701 11.332C22.2628 11.3283 22.2559 11.325 22.2495 11.3219C22.2464 11.3204 22.2433 11.3189 22.2404 11.3175C22.2389 11.3168 22.2375 11.3162 22.236 11.3155C22.2353 11.3152 22.2347 11.3149 22.234 11.3146C22.2336 11.3144 22.2331 11.3142 22.2329 11.3141C22.2324 11.3139 22.2319 11.3136 21.7938 12.2679ZM20.6364 13.1535L6.27011 20.7003L7.24672 22.5593L21.613 15.0126L20.6364 13.1535ZM21.158 12.9997C21.158 13 21.158 12.9937 21.1603 12.9821C21.1626 12.9706 21.1666 12.9567 21.1728 12.9417C21.1856 12.9108 21.2031 12.8857 21.2199 12.867C21.2356 12.8494 21.2523 12.8358 21.2699 12.8239C21.2792 12.8176 21.2903 12.8107 21.3038 12.8032C21.3107 12.7994 21.3183 12.7954 21.3269 12.7911C21.3312 12.7889 21.3357 12.7867 21.3405 12.7844C21.3429 12.7832 21.3454 12.7821 21.3479 12.7809C21.3492 12.7803 21.3505 12.7797 21.3518 12.7791C21.3524 12.7788 21.3531 12.7785 21.3537 12.7782C21.3541 12.778 21.3546 12.7778 21.3547 12.7777C21.3552 12.7775 21.3557 12.7772 21.7938 13.7315C22.2319 14.6857 22.2324 14.6855 22.2329 14.6853C22.2331 14.6852 22.2336 14.6849 22.234 14.6848C22.2347 14.6845 22.2353 14.6842 22.236 14.6838C22.2375 14.6832 22.2389 14.6825 22.2404 14.6818C22.2433 14.6804 22.2464 14.679 22.2495 14.6775C22.2559 14.6744 22.2628 14.671 22.2701 14.6674C22.2847 14.66 22.3012 14.6513 22.3194 14.6413C22.3556 14.6213 22.3991 14.5954 22.4472 14.5628C22.5425 14.4983 22.6627 14.4033 22.782 14.2705C23.032 13.9922 23.258 13.5669 23.258 12.9997H21.158ZM22.2821 11.3383L22.0591 11.2211L21.0825 13.0802L21.3055 13.1974L22.2821 11.3383ZM21.3055 12.8019L21.0825 12.9191L22.0591 14.7782L22.2821 14.661L21.3055 12.8019ZM22.0591 11.2211L21.836 11.104L20.8594 12.9631L21.0825 13.0802L22.0591 11.2211ZM21.836 11.104L21.613 10.9868L20.6364 12.8459L20.8594 12.9631L21.836 11.104ZM21.0825 12.9191L20.8594 13.0363L21.836 14.8954L22.0591 14.7782L21.0825 12.9191ZM20.8594 13.0363L20.6364 13.1535L21.613 15.0126L21.836 14.8954L20.8594 13.0363ZM8.66654 14.0497H14.083V11.9497H8.66654V14.0497Z" fill="#FAFAFA" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <button
                            className="comn-btn-class py-1 fix-btn-last"
                            onClick={(e) => {
                              paid ? handleSubmit(e, "submit") : setError(true);
                              setPayModal(true);
                            }}
                          >
                            ${formatNum(talentdetail?.chat_price)}
                          </button>
                        ))}
                    </div>
                    {error && <div className="text-danger ps-2 pt-1">Pay to chat with talent</div>}
                  </div>
                </div>
              </div>
            </div>

            {payModal && (
              <div className="col-lg-5">
                <div className="">
                  <div className="comn-text-class">
                    <h4>Payment info</h4>
                  </div>
                  <div className="grey-comn-box position-relative h-100">
                    <div className="row">
                      <div className="col-12 mb-3">
                        <div className="cust-radio-div">
                          <div className="form-check mb-2" onChange={handlePaymentMethod}>
                            {amount ? (
                              <Elements stripe={stripePromise}>
                                <PaymentRequestForm amount={amount} type={payType} requestData={{ chat: 1, id: params?.id, chat_price: amount }} isWallet={false} />
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
                                )}
                              </div>
                            )}
                          </div>
                          <div className="form-check mb-2" onChange={handlePaymentMethod}>
                            <input className="form-check-input" type="radio" name="payment" id="creditcard" value="stripe" onClick={() => setOpenCard(true)} />
                            <label className="form-check-label ms-2" htmlFor="creditcard">
                              <span>Credit/Debit Card</span>
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
                                    {/* <div className="col-12 mb-3">
                                    <label className="comn-label-class">Postal Code</label>
                                    <input className="form-control comn-input-style" type="tel" placeholder="12345" name="postalcode" {...formAttr(runform, "postalcode")} />
                                    {errorContainer(runform, "postalcode")}
                                  </div> */}
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
                              <input className="form-check-input" type="radio" name="payment" id="creditcard" value="wallet" onClick={() => setOpenCard(false)} defaultChecked />
                              <label className="form-check-label ms-2" htmlFor="creditcard">
                                <span className="d-flex align-items-center">
                                  <img src={process.env.PUBLIC_URL + "/images/logo-main.png"} className="radio-logo" alt="" />
                                  <span className="ms-2 mb-0">Cash</span>
                                </span>
                                <bdi>Pay with opase wallet</bdi>
                              </label>
                            </div>
                            <span className="ms-auto">$ {formatNum(myWalletData.myWallet)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="col-12 mb-3">
                        <button className="comn-btn-class w-100" type="button" onClick={submitFormData}>
                          Pay $ {formatNum(talentdetail?.chat_price) ? formatNum(talentdetail?.chat_price) : 0}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <Subscribe />

      <Modal show={paymodalShow} onHide={() => setPayModalShow(false)} size="md" centered className="comn-modal-style">
        <Modal.Header className="border-0" closeButton></Modal.Header>
        <Modal.Body>
          <div className="text-center modal-data">
            <img src={process.env.PUBLIC_URL + "/images/successful.svg"} className="img-fluid mb-3" alt="" />
            <span>Payment successfull !</span>
            <p>Congratulations your request is successfull. you will receive an order confimation email/SMS shortly.</p>
            <div className="row">
              <div className="col-sm-12 mb-sm-0 mb-3">
                <button
                  className="comn-btn-class w-100"
                  onClick={() => {
                    navigate("/chat", { state: { talentdetail: talentdetail } });
                  }}
                >
                  Continue chatting
                </button>
              </div>
              <div className="col-sm-6">
                {/* <button className="border-button-class" onClick={handleBooking}>
                  Continue booking
                </button> */}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </FrontendLayout>
  );
}
