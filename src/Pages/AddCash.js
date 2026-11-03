import React, { useEffect, useState } from "react";
import { Collapse } from "react-bootstrap";
import FrontendLayout from "../components/Layout/FrontendLayout";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import PaymentRequestForm from "../components/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { PostApi } from "../api/api-service";
import { API_Path } from "../const";
import { Formik } from "formik";
import * as Yup from "yup";
import { isDesktop, isMobile, isSafari } from "react-device-detect";
import Subscribe from "../components/Layout/Subscribe";
import moment from "moment";

const stripePromise = loadStripe("pk_test_51BTUDGJAJfZb9HEBwDg86TN1KNprHjkfipXmEDMb0gSCassK5T3ZfxsAbcgKVmAIXF7oZ6ItlZZbXO6idTHE67IM007EwQ4uN3");

export default function AddCash() {
  const [opencard, setOpenCard] = useState(false);
  const [cardmodalShow, setCardModalShow] = useState(false);
  const [loader, setLoader] = useState(false);
  const [payType, setPayType] = useState(isSafari ? "applepay" : "googlepay");
  const [amount, setAmount] = useState(5);
  const [cardDetail, setCardDetail] = useState("");
  const [myWalletData, setmyWalletData] = useState({});
  const [tempButtonSupport, setTempButtonSupport] = useState(false);
  const [paymentBtn, setPaymentBtn] = useState(true);
  const [bankId, setBankId] = useState("");
  const [finalAmount, setFinalAmount] = useState(5);
  const [custom, setCustom] = useState(false);

  const [option, set_option] = useState({
    sizePerPage: 10,
    search: "",
    totalRecord: 0,
    page: 0,
    sort: "id",
    order: "DESC",
  });

  useEffect(() => {
    getBankData();
    getWalletData();
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
            setBankId(item.id);
          }
        });
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
      } else {
        toast.error(res.data.message);
      }
    });
  };

  const submitBankFormData = (formData, resetForm) => {
    if (amount === " " || amount === 0) {
      toast.error("Please add amount to pay");
    } else {
      let data = {
        CardNumber: formData.CardNumber,
        ExpiryDate: formData.ExpiryDate,
        CVV: formData.CVV,
        amount: parseInt(finalAmount),
        type: payType,
        bankId: formData.bankId,
        iswallet: 1,
      };
      let data1 = {
        type: isSafari ? "applepay" : "googlepay",
        amount: parseInt(finalAmount),
        iswallet: 1,
      };

      const addPaymentData = new Promise((resolve) => {
        resolve(PostApi(API_Path.addPaymentData, payType === "stripe" ? data : data1));
      });

      addPaymentData.then((res) => {
        if (res.data.success) {
          // setLoader(false);
          toast.success(res.data.message);
          resetForm(formData);
          setAmount(5);
          setCardModalShow(false);
        } else {
          toast.error(res.data.message);
        }
      });
    }
  };

  const handlePaymentMethod = (e) => {
    setPayType(e.target.value);
  };

  const handlePrice = (e) => {
    setTempButtonSupport(true);

    if (e.target.value !== "") {
      if (e.target.value === "custom") {
        setCustom(true);
        // let amt = parseFloat(finalAmount);
        // setFinalAmount(amt);
        // setAmount(5);
        // setTempButtonSupport(false);
      } else {
        setCustom(false);
        let amt = parseFloat(e.target.value);
        setFinalAmount(amt);

        // setTempButtonSupport(false);
      }
      setTimeout(() => {
        changeBtnStatus();
      }, 2000);
    }
  };

  const changeBtnStatus = () => {
    // var btnStatus = !status;
    setTempButtonSupport(false);
    setPaymentBtn(true);
  };

  const checkPaymentBtnSupported = (status) => {
    setPaymentBtn(status);
  };

  const errorContainer = (form, field) => {
    return form.touched[field] && form.errors[field] ? <span className="error text-danger">{form.errors[field]}</span> : null;
  };

  const formAttr = (form, field) => ({
    onBlur: form.handleBlur,
    onChange: form.handleChange,
    value: form.values[field],
  });

  const formatNum = (num) => {
    return String(num)?.replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1,");
  };

  return (
    <>
      {loader ? (
        <div className="loader"></div>
      ) : (
        <FrontendLayout>
          <section className="black-bg-section">
            <div className="container">
              <div className="row">
                <div className="col-lg-7 mb-5">
                  <div className="add-cash">
                    <h3>Add cash</h3>
                    <div className="d-flex current-balance-div">
                      <div>
                        <span>Your current balance</span>
                      </div>
                      <div className="ms-auto">
                        <bdi>$ {formatNum(myWalletData.myWallet)}</bdi>
                      </div>
                    </div>

                    <div className="text-cust-radio-main addcash-cust-radio-main mt-3" onChange={(e) => handlePrice(e)}>
                      <label htmlFor="$5" className="text-cust-radio">
                        <input type="radio" id="$5" value="5.00" name="requests" defaultChecked />
                        <span className="text-cust-lbl">$5.00</span>
                      </label>

                      <label htmlFor="$25" className="text-cust-radio">
                        <input type="radio" id="$25" value="25.00" name="requests" />
                        <span className="text-cust-lbl">$25.00</span>
                      </label>

                      <label htmlFor="$50" className="text-cust-radio">
                        <input type="radio" id="$50" value="50.00" name="requests" />
                        <span className="text-cust-lbl">$50.00</span>
                      </label>

                      <label htmlFor="$100" className="text-cust-radio">
                        <input type="radio" id="$100" value="100.00" name="requests" />
                        <span className="text-cust-lbl">$100.00</span>
                      </label>
                      <label htmlFor="$500" className="text-cust-radio">
                        <input type="radio" id="$500" value="500.00" name="requests" />
                        <span className="text-cust-lbl">$500.00</span>
                      </label>

                      <label htmlFor="$1000" className="text-cust-radio">
                        <input type="radio" id="$1000" value="1000.00" name="requests" />
                        <span className="text-cust-lbl">${formatNum(1000.0)}</span>
                      </label>
                      <label htmlFor="$5000" className="text-cust-radio">
                        <input type="radio" id="$5000" value="5000.00" name="requests" />
                        <span className="text-cust-lbl">${formatNum(5000.0)}</span>
                      </label>
                      <label htmlFor="custom" className="text-cust-radio">
                        <input type="radio" id="custom" value="custom" name="requests" />
                        <span className="text-cust-lbl">Custom</span>
                      </label>
                    </div>
                    <div className="mt-3 mx-5">
                      <input type="number" name="amount" value={finalAmount} disabled={custom ? false : true} className="form-control comn-input-style remove-number-arrow" placeholder="Add amount" onChange={(e) => setFinalAmount(parseFloat(e.target.value))} min="0" onWheel={(e) => e.target.blur()} />
                    </div>
                    {/* <div className="mt-3 mx-5">
                      <button className="comn-btn-class w-100" onClick={submitBankFormData}>
                        ADD
                      </button>
                    </div> */}
                  </div>
                </div>
                <div className="col-lg-5">
                  <div className="">
                    <div className="comn-text-class">
                      <h4>Add from</h4>
                    </div>

                    <div className="grey-comn-box position-relative h-100">
                      <div className="row">
                        <div className="col-12 mb-3">
                          <div className="cust-radio-div">
                            <div className="form-check mb-2 mt-3" onChange={handlePaymentMethod}>
                              {tempButtonSupport ? (
                                <button type="button" className="w-100 d-flex align-items-center justify-content-center google-pay-btn-custom">
                                  <div className="spinner-border" role="status">
                                    <span className="sr-only"></span>
                                  </div>
                                </button>
                              ) : paymentBtn ? (
                                <Elements stripe={stripePromise}>
                                  <PaymentRequestForm amount={finalAmount} type={payType} checkPaymentBtnSupported={checkPaymentBtnSupported} requestData="" isWallet={true} />
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
                                CardNumber: Yup.number().typeError("Please enter card number").required("Card number is required."),
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

                                      {finalAmount ? (
                                        <button className="comn-btn-class w-100" type="submit">
                                          ADD
                                        </button>
                                      ) : (
                                        <button className="comn-btn-class disabled w-100" type="button" disabled>
                                          ADD
                                        </button>
                                      )}
                                    </div>
                                  </form>
                                </Collapse>
                              )}
                            </Formik>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <Subscribe />
        </FrontendLayout>
      )}
    </>
  );
}
