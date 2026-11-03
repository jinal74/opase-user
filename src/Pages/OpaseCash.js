import React, { useEffect, useRef, useState } from "react";
import FrontendLayout from "../components/Layout/FrontendLayout";
import { Tab, Nav } from "react-bootstrap";

import { Link } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import { Modal } from "react-bootstrap";
import RtdDatatable from "../components/DataTable/RtdDatatable";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { PostApi } from "../api/api-service";
import { API_Path } from "../const";
import moment from "moment";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Subscribe from "../components/Layout/Subscribe";

let settings = {};
export default function OpaseCash() {
  const [bankmodalShow, setBankModalShow] = useState(false);
  const [cardmodalShow, setCardModalShow] = useState(false);
  const [cardDetail, setCardDetail] = useState([]);
  const [bankId, setBankId] = useState("");
  const [defaultSelect, setDefaltSelect] = useState([]);
  const [bankDetail, setBankDetail] = useState(" ");
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [removeData, setRemoveData] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // const [defaultSet, setDefaultSet] = useState(0);
  const slider = useRef();

  const [option, set_option] = useState({
    sizePerPage: 10,
    search: "",
    totalRecord: 0,
    page: 0,
    sort: "id",
    order: "DESC",
  });

  const columns = [
    {
      value: "invoice",
      label: "Invoice Id",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data, i) => {
          return <span>#{data[i].invoice}</span>;
        },
      },
    },
    {
      value: "Type",
      label: "Type",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data, i) => {
          return <span>{data[i].payment_type === 1 ? "chat" : "video"}</span>;
        },
      },
    },
    {
      value: "Form",
      label: "Form",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data, i) => {
          return <span>{data[i].payment_method === 1 ? "Stripe" : "googlePay"}</span>;
        },
      },
    },
    {
      value: "Date",
      label: "Date",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data, i) => {
          return <span>{moment(data[i].created_at).format("DD/MM/YYYY")}</span>;
        },
      },
    },
    {
      value: "Status",
      label: "Status",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data, i) => {
          return <span className={"comn-status-class " + (data[i].status === 1 ? "completed-class" : "failed-class")}>{data[i].status === 1 ? "Completed" : "Failed"}</span>;
        },
      },
    },
    {
      value: "amount",
      label: "Amount",
      options: {
        filter: false,
        sort: false,
      },
    },
  ];

  // ============== slider wallet card ================ //

  const settings = {
    centerMode: true,
    infinite: true,
    slidesToShow: 1,
    speed: 500,
    swipeToSlide: true,
    speed: 1000,
  };

  // =========================================== //

  useEffect(() => {
    getBankData();
    TransactionHistoryData();
  }, []);

  const getBankData = () => {
    const getBankDetail = new Promise((resolve) => {
      resolve(PostApi(API_Path.getBankDetail));
    });
    getBankDetail.then((res) => {
      if (res.status === 200) {
        setCardDetail(res.data.data);
        res.data.data?.map((item, i) => {
          if (item.is_default === 1) {
            slider.current?.slickGoTo(i);
          }
          if (item.bank_name !== "" && item.is_default === 1) {
            setBankDetail(item);
          }
        });
      } else {
        toast.error(res.data.message);
      }
    });
  };

  const TransactionHistoryData = () => {
    let data = { option: option };
    const addServiceDetails = new Promise((resolve) => {
      resolve(PostApi(API_Path.GetTransactionHistory, data));
    });
    addServiceDetails.then((res) => {
      if (res.status === 200) {
        set_option({ ...option, totalRecord: res.data.data.totalRecord });
        setLoaded(true);
        setBankDetail(res.data.data);
        setTransactionHistory(res.data.data.transaction);
      } else {
        toast.error(res.data.message);
      }
    });
  };

  const submitFormData = (formData, resetForm) => {
    let data = {
      holdName: formData.cardName,
      cardNo: formData.cardNumber,
      default: formData.default ? 1 : 0,
      expDate: moment(formData.date).format("MM/YYYY"),
      cvv: formData.cvv,
    };
    const addServiceDetails = new Promise((resolve) => {
      resolve(PostApi(API_Path.getBankDetail, data));
    });
    addServiceDetails.then((res) => {
      if (res.status === 200) {
        toast.success(res.data.message);
        setCardModalShow(false);
        resetForm(formData);
        getBankData();
      } else {
        toast.error(res.data.message);
      }
    });
  };

  const handleDefault = (e, id) => {
    if (e.target.checked) {
      setBankId(id);
      let bankFilter = cardDetail?.filter((item) => item.id === id);
      setDefaltSelect(bankFilter);
      getBankData(bankId, defaultSelect);
    }
  };

  const handleBankDelete = (id) => {
    let data = { bankId: id };
    const deleteCard = new Promise((resolve) => {
      resolve(PostApi(API_Path.removeCard, data));
    });
    deleteCard.then((res) => {
      if (res.status === 200) {
        toast.success(res.data.message);
        getBankData();
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

  const tableCallBack = (option) => {
    set_option(option);
    TransactionHistoryData();
  };

  const formatNum = (num) => {
    return String(num)?.replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1,");
  };

  return (
    <>
      <FrontendLayout>
        <section className="comn-row-section">
          <div className="container">
            <div className="row align-items-center justify-content-center">
              <div className="col-12">
                <div className="opasecash-main-bg pe-lg-3">
                  <div className="row">
                    <div className="col-xxl-4 col-lg-6">
                      <div className="opasecash-left-main">
                        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                          <div className="opasecash-tab-sec">
                            <Nav variant="pills">
                              <Nav.Item>
                                <Nav.Link eventKey="first">Opase cash</Nav.Link>
                              </Nav.Item>
                              <Nav.Item>
                                <Nav.Link eventKey="second">Wallet</Nav.Link>
                              </Nav.Item>
                            </Nav>
                          </div>
                          <Tab.Content>
                            <Tab.Pane eventKey="first">
                              <div className="opasecash-main-sec">
                                <div className="d-flex align-items-center justify-content-center mb-3">
                                  <img src={process.env.PUBLIC_URL + "/images/Opase cash.png"} />
                                </div>
                                <div className="text-center">
                                  <div className="add-cash-main">
                                    <div>
                                      <bdi>Current balance</bdi>
                                      <p>${loaded && formatNum(bankDetail.myWallet)}</p>
                                    </div>
                                    <div className="mx-xl-5 m-auto">
                                      <Link to="/addcash">
                                        <button className="add-cash-btn">+ Add cash</button>
                                      </Link>
                                    </div>
                                  </div>
                                </div>

                                <div className="opasecash-accordion-class mt-5">
                                  <div className="mt-3 text-center faq-txt">
                                    <p>Faqs</p>
                                  </div>
                                  <Accordion>
                                    <Accordion.Item eventKey="0">
                                      <Accordion.Header>What is opase cash?</Accordion.Header>
                                      <Accordion.Body>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</Accordion.Body>
                                    </Accordion.Item>
                                  </Accordion>
                                </div>
                                <div className="opasecash-accordion-class mt-3">
                                  <Accordion>
                                    <Accordion.Item eventKey="0">
                                      <Accordion.Header>When does reward bonus expire?</Accordion.Header>
                                      <Accordion.Body>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</Accordion.Body>
                                    </Accordion.Item>
                                  </Accordion>
                                </div>
                                <div className="opasecash-accordion-class mt-3">
                                  <Accordion>
                                    <Accordion.Item eventKey="0">
                                      <Accordion.Header>Where is reward bonus applicable?</Accordion.Header>
                                      <Accordion.Body>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</Accordion.Body>
                                    </Accordion.Item>
                                  </Accordion>
                                </div>
                                <div className="opasecash-accordion-class mt-3">
                                  <Accordion>
                                    <Accordion.Item eventKey="0">
                                      <Accordion.Header>Where is my cash applicable?</Accordion.Header>
                                      <Accordion.Body>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</Accordion.Body>
                                    </Accordion.Item>
                                  </Accordion>
                                </div>
                              </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="second">
                              <div className="wallet-main-class p-3">
                                <div className="row">
                                  <div className="col-lg-12">
                                    <h3>Credit card</h3>
                                    <div className="mt-3">
                                      <Slider ref={slider} {...settings}>
                                        {cardDetail?.map((val, i) => {
                                          return (
                                            <div>
                                              <div className="position-relative p-2" key={i}>
                                                <button className="bg-transparent border-0 cancel-btn" type="button" onClick={() => handleBankDelete(val.id)}>
                                                  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M10.2228 19.8752H10.2224C7.63592 19.8775 5.15468 18.8511 3.32573 17.0221C1.49679 15.1932 0.470333 12.7119 0.47266 10.1254V10.1252V9.92776C0.553392 6.02115 2.95753 2.53953 6.58239 1.08016C10.208 -0.379525 14.3549 0.46574 17.12 3.22806C19.9109 6.01664 20.7461 10.2123 19.236 13.8571C17.7259 17.502 14.1681 19.8775 10.2228 19.8752ZM14.3994 12.5384L11.9862 10.1252L14.3994 7.71197L14.5762 7.53519L14.3994 7.35841L12.9894 5.94841L12.8127 5.77164L12.6359 5.94841L10.2227 8.36164L7.80944 5.94841L7.63266 5.77164L7.45589 5.94841L6.04589 7.35841L5.86911 7.53519L6.04589 7.71197L8.45911 10.1252L6.04589 12.5384L5.86911 12.7152L6.04589 12.892L7.45589 14.302L7.63263 14.4787L7.80941 14.302L10.2231 11.8892L12.6359 14.302L12.8127 14.4787L12.9894 14.302L14.3994 12.892L14.5762 12.7152L14.3994 12.5384Z" fill="#EB5757" stroke="#1E1E1E" stroke-width="0.5" />
                                                  </svg>
                                                </button>
                                                <div className="card-main-div p-3">
                                                  <div className="card-rounded-innner">
                                                    <img src={process.env.PUBLIC_URL + "/images/card rounded inner.svg"} />
                                                  </div>
                                                  <div className="card-innner-vector">
                                                    <img src={process.env.PUBLIC_URL + "/images/card inner vector.svg"} />
                                                  </div>
                                                  {val.is_default === 1 ? (
                                                    <div className="d-flex justify-content-end default-position">
                                                      <label className="cust-chk-bx">
                                                        <input type="checkbox" id={`default-${val.id}`} onChange={(e) => handleDefault(e, val.id)} defaultChecked />
                                                        <span className="cust-chkmark"></span>
                                                        Default
                                                      </label>
                                                    </div>
                                                  ) : (
                                                    ""
                                                  )}

                                                  <div className="card-num mt-2">
                                                    <img src={process.env.PUBLIC_URL + "/images/chip.svg"} className="img-fluid mb-2" alt="card-chip" />
                                                    <p>{val.card_nomber}</p>
                                                  </div>
                                                  <div className="card-txt-detail d-flex mt-5">
                                                    <div>
                                                      <span>Card holder name</span>
                                                      <p>{val.hold_name}</p>
                                                    </div>
                                                    <div>
                                                      <span>Expiry date</span>
                                                      <p>{val.exp_date}</p>
                                                    </div>
                                                    <div>
                                                      <img src={process.env.PUBLIC_URL + "/images/mastercard.png"} className="img-fluid" alt="mastercard logo" />
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </Slider>
                                    </div>
                                    <div className="mt-4">
                                      <button className="comn-add-btn-class w-100" onClick={() => setCardModalShow(true)}>
                                        Add card
                                      </button>
                                    </div>
                                    {/* <div className="mt-4">
                                      <button className="comn-btn-class w-100">Remove Card</button>
                                    </div> */}
                                  </div>
                                  <div className="opasecash-accordion-class mt-5">
                                    <div className="mt-3 text-center faq-txt">
                                      <p>Faqs</p>
                                    </div>
                                    <Accordion>
                                      <Accordion.Item eventKey="0">
                                        <Accordion.Header>What is opase cash?</Accordion.Header>
                                        <Accordion.Body>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</Accordion.Body>
                                      </Accordion.Item>
                                    </Accordion>
                                  </div>
                                  <div className="opasecash-accordion-class mt-3">
                                    <Accordion>
                                      <Accordion.Item eventKey="0">
                                        <Accordion.Header>When does reward bonus expire?</Accordion.Header>
                                        <Accordion.Body>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</Accordion.Body>
                                      </Accordion.Item>
                                    </Accordion>
                                  </div>
                                  <div className="opasecash-accordion-class mt-3">
                                    <Accordion>
                                      <Accordion.Item eventKey="0">
                                        <Accordion.Header>Where is reward bonus applicable?</Accordion.Header>
                                        <Accordion.Body>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</Accordion.Body>
                                      </Accordion.Item>
                                    </Accordion>
                                  </div>
                                  <div className="opasecash-accordion-class mt-3">
                                    <Accordion>
                                      <Accordion.Item eventKey="0">
                                        <Accordion.Header>Where is my cash applicable?</Accordion.Header>
                                        <Accordion.Body>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</Accordion.Body>
                                      </Accordion.Item>
                                    </Accordion>
                                  </div>
                                </div>
                              </div>
                            </Tab.Pane>
                          </Tab.Content>
                        </Tab.Container>
                      </div>
                    </div>
                    <div className="col-xxl-8 col-lg-6 my-5">
                      <div className="">
                        <div className="row">
                          <div className="col-lg-4 col-sm-6 mb-3">
                            <div className="auto-debit-box">
                              <div className="image-div-main">
                                <img src={process.env.PUBLIC_URL + "/images/autodebit.png"} className="img-fluid" />
                              </div>
                              <div className="box-intro-txt">
                                <div>
                                  <bdi>AUTO DEBIT</bdi>
                                </div>
                                <div className="">
                                  <p>Order cameo from here and autopay with Opasecash</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4 col-sm-6 mb-3">
                            <div className="auto-debit-box">
                              <div className="image-div-main">
                                <img src={process.env.PUBLIC_URL + "/images/refund.png"} className="img-fluid" />
                              </div>
                              <div className="box-intro-txt">
                                <div>
                                  <bdi>REFUND</bdi>
                                </div>
                                <div className="">
                                  <p>Ask for a refund of cancel</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4 col-sm-6 mb-3">
                            <div className="auto-debit-box">
                              <div className="image-div-main">
                                <img src={process.env.PUBLIC_URL + "/images/redeem.png"} className="img-fluid" />
                              </div>
                              <div className="box-intro-txt">
                                <div>
                                  <bdi>REDEEM</bdi>
                                </div>
                                <div className="">
                                  <p>Your invitation points can be redeemed</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="bx-black-main mt-3">
                              <div className="cash-table">
                                <span>Transaction history</span>
                                {/* <Link to="#">
                                  <bdi className="ms-auto table-view-link">View all</bdi>
                                </Link> */}
                              </div>
                              <RtdDatatable option={option} data={transactionHistory} columns={columns} tableCallBack={tableCallBack} />
                            </div>
                          </div>
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

        {/* ------------------- ADD CARD -------------------------- */}
        <Modal show={cardmodalShow} onHide={() => setCardModalShow(false)} size="md" centered className="comn-modal-style">
          <Modal.Header className="border-0 add-card-modal me-3" closeButton>
            <div className="row px-5">
              <div className="col-12 mt-3">
                <h4>Add credit card</h4>
              </div>
            </div>
          </Modal.Header>
          <Modal.Body>
            <Formik
              enableReinitialize
              initialValues={{
                cardName: "",
                cardNumber: "",
                date: "",
                cvv: "",
                default: "",
              }}
              validationSchema={Yup.object({
                cardName: Yup.string().required("Card name is required."),
                cardNumber: Yup.number().typeError("Card number should be digit").required("Card number is required."),
                date: Yup.string().required("Date is required"),
                cvv: Yup.number().typeError("CVV should be number").required("CVV is required."),
              })}
              onSubmit={(formData, { resetForm }) => {
                submitFormData(formData, resetForm);
              }}
            >
              {(runform) => (
                <form className="row align-items-center" onSubmit={runform.handleSubmit}>
                  <div className="row px-5">
                    <div className="col-12 mx-auto mb-3">
                      <label className="comn-label-class">Name on card</label>
                      <bdi className="d-block position-relative">
                        <input type="text" className="form-control comn-input-style pe-5" name="cardName" {...formAttr(runform, "cardName")} placeholder="Enter the name that is on your card" />
                      </bdi>

                      {errorContainer(runform, "cardName")}
                    </div>
                    <div className="col-12 mb-3">
                      <label className="comn-label-class">Card number</label>
                      <bdi className="d-block position-relative">
                        <input type="tel" maxLength="16" className="form-control comn-input-style pe-5" name="cardNumber" placeholder="Enter card number" {...formAttr(runform, "cardNumber")} />
                      </bdi>
                      {errorContainer(runform, "cardNumber")}
                    </div>
                    <div className="col-xl-6 col-lg-12 col-sm-6 mb-3">
                      <label className="comn-label-class">Expiry date</label>
                      <input className="form-control comn-input-style" type="month" name="date" {...formAttr(runform, "date")} />
                      {errorContainer(runform, "date")}
                    </div>
                    <div className="col-xl-6 col-lg-12 col-sm-6 mb-3">
                      <label className="comn-label-class">CVV</label>
                      <input className="form-control comn-input-style" type="password" name="cvv" maxLength="3" placeholder="CVV" {...formAttr(runform, "cvv")} />
                      {errorContainer(runform, "cvv")}
                    </div>
                    <div className="col-12 my-3">
                      <label className="cust-chk-bx">
                        <input type="checkbox" name="default" {...formAttr(runform, "default")} />
                        <span className="cust-chkmark"></span>
                        Set as default
                      </label>
                    </div>
                    <div className="col-12 mt-3">
                      <button className="comn-btn-class w-100" type="submit">
                        Add card
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </Formik>
          </Modal.Body>
        </Modal>
      </FrontendLayout>
    </>
  );
}
