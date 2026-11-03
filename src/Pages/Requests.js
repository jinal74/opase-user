import React, { useEffect, useState } from "react";
import FrontendLayout from "../components/Layout/FrontendLayout";
import { Modal } from "react-bootstrap";
import Profile from "../images/request-profile.png";
import { API_Path } from "../const";
import { PostApi } from "../api/api-service";
import { toast } from "react-toastify";
import moment from "moment";
import Subscribe from "../components/Layout/Subscribe";

export default function Requests() {
  const [paymodalShow, setPayModalShow] = useState(false);
  const [myArr, setmyArr] = useState([]);
  const [loader, setLoader] = useState(false);
  const [request, setRequest] = useState("");
  const [paymentReceipt, setPaymentReceipt] = useState("");

  useEffect(() => {
    setLoader(true);
    getAllRequests();
  }, []);

  const getAllRequests = () => {
    setLoader(true);
    let data = {
      option: {
        sizePerPage: 10,
        search: "",
        totalRecord: 0,
        page: 0,
        sort: "id",
        order: "DESC",
      },
    };

    const getAllRequestseData = new Promise((resolve) => {
      resolve(PostApi(API_Path.getAllRequestData, data));
    });
    getAllRequestseData.then((res) => {
      if (res.data.success) {
        setLoader(false);
        setRequest(res.data.data);
        setmyArr(res.data.data);
      } else {
        toast.error(res.data.message);
      }
    });
  };

  const getPaymentReceipt = (id) => {
    let path = API_Path.getPaymentReceipt;
    let data = {
      orderId: id,
    };

    const getPaymentReceipt = new Promise((resolve) => {
      resolve(PostApi(path, data));
    });
    getPaymentReceipt.then((res) => {
      if (res.data.success) {
        setPaymentReceipt(res.data.data);
      } else {
        toast.error(res.data.message);
      }
    });
  };

  const handleChange = (e) => {
    let arr1 = [];
    let filtered = request.filter((item) => item.request_status === parseInt(e.target.value));
    arr1 = filtered;
    setmyArr(arr1);

    if (e.target.value === "5") {
      setmyArr(request);
    }
  };

  const handleCancel = (item) => {
    let path = API_Path.GetRequestDetail;
    let data = {
      id: item.id,
      status: 4,
    };

    const cancelRequest = new Promise((resolve) => {
      resolve(PostApi(path, data));
    });
    cancelRequest.then((res) => {
      if (res.data.success) {
        toast.success("Request cancelled successfully?");
        getAllRequests();
        if (document.getElementById("status")) {
          document.getElementById("status").selected = true;
        }
      } else {
        toast.error(res.data.message);
      }
    });
  };

  const handleReceipt = (id) => {
    getPaymentReceipt(id);
    setPayModalShow(true);
  };

  const formatNum = (num) => {
    return String(num)?.replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1,");
  };

  const downloadPdf = async (e, pdfUrl) => {
    fetch(`https://${pdfUrl}`, {
      mode: "no-cors",
      method: "GET",
      headers: {
        responseType: "arraybuffer",
        "Content-Type": "application/json",
        Accept: "application/pdf",
      },
    }).then((res) => {
      res.blob().then((blob) => {
        const url = window.URL.createObjectURL(blob, { type: "application/pdf" });
        let link = document.createElement("a");
        link.href = `https://${pdfUrl}`;
        link.href = url;
        link.download = "Payment Receipt.pdf";
        link.target = "_blank";
        link.click();
      });
    });
  };

  return (
    <FrontendLayout>
      {loader && (
        <div className="loader-class">
          <img src={process.env.PUBLIC_URL + "/images/loader_opase.gif"} alt="opase loader" />
        </div>
      )}
      <section className="black-bg-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-7 mx-auto mb-5">
              <div className="profile-comn-data text-center">
                <span>Requests</span>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
              </div>
            </div>
            <div className="mb-3 comn-gray-form-select w-100 d-flex justify-content-end" onChange={handleChange}>
              <select className="form-select form-select-option">
                <option className="text-center" id="status" value="5" selected>
                  All
                </option>
                <option className="text-center" value="1">
                  Active
                </option>
                <option className="text-center" value="3">
                  Declined
                </option>
                <option className="text-center" value="2">
                  Completed
                </option>
                <option className="text-center" value="0">
                  Pending
                </option>
                <option className="text-center" value="4">
                  Cancelled
                </option>
              </select>
            </div>
            {/* <div className="col-12 mb-3">
              <div className="text-cust-radio-main" onChange={handleChange}>
                <label htmlFor="all" className="text-cust-radio">
                  <input type="radio" id="all" name="requests" value="5" defaultChecked />
                  <span className="text-cust-lbl">All</span>
                </label>
                <label htmlFor="open" className="text-cust-radio">
                  <input type="radio" id="open" name="requests" value="1" />
                  <span className="text-cust-lbl">Active</span>
                </label>
                <label htmlFor="declined" className="text-cust-radio">
                  <input type="radio" id="declined" name="requests" value="3" />
                  <span className="text-cust-lbl">Declined</span>
                </label>
                <label htmlFor="completed" className="text-cust-radio">
                  <input type="radio" id="completed" name="requests" value="2" />
                  <span className="text-cust-lbl">Completed</span>
                </label>
                <label htmlFor="pending" className="text-cust-radio">
                  <input type="radio" id="pending" name="requests" value="0" />
                  <span className="text-cust-lbl">Pending</span>
                </label>
                <label htmlFor="canceled" className="text-cust-radio">
                  <input type="radio" id="canceled" name="requests" value="4" />
                  <span className="text-cust-lbl">Cancelled</span>
                </label>
              </div>
            </div> */}
            {myArr &&
              myArr.length > 0 &&
              myArr.map((item) => {
                return (
                  <div className="col-lg-6 mb-3">
                    <div className="grey-comn-box">
                      <div className="d-flex">
                        <div className="req-profile">
                          <img referrerPolicy="no-referrer" src={item.image !== "null" && item.image !== "" ? item.image : Profile} alt="" />
                        </div>
                        <div className="d-sm-flex req-details pay complete w-100 ms-2">
                          <div className="">
                            <span className="d-block mb-1">{item.fullname}</span>
                            <bdi className="d-block mb-1">{moment(item.created_at).format("DD MMM, YYYY")}</bdi>
                            <p>
                              Payment method: <span>{item.paymentMethod}</span>
                            </p>

                            {item.request_status === 2 && (
                              <div className="req-details">
                                <button className="pay req-can-pay-btn mb-sm-0 mb-3" onClick={() => handleReceipt(item.id)}>
                                  Payment receipt
                                </button>
                              </div>
                            )}
                            {item.request_status === 0 && (
                              <div className="req-details">
                                <button className="cancle req-can-pay-btn mb-sm-0 mb-3" onClick={() => handleCancel(item)}>
                                  Cancel request
                                </button>
                              </div>
                            )}
                          </div>
                          <div className="ms-auto">
                            <div className="text-sm-end d-sm-block d-flex align-items-center">
                              <span className="d-block mb-sm-2 me-sm-0 me-2">${item?.chat_request === 1 ? formatNum(item?.chat_price) : formatNum(item.standard_price)}</span>
                              <span className={item.request_status === 1 ? "open pen-com-span " : item.request_status === 2 ? " complete pen-com-span" : item.request_status === 3 ? "decline pen-com-span" : item.request_status === 4 ? "cancel pen-com-span" : item.request_status === 0 && "pending pen-com-span "}>{item.request_status === 1 ? "Active" : item.request_status === 2 ? "Completed" : item.request_status === 3 ? "Decline" : item.request_status === 4 ? "Cancelled" : item.request_status === 0 && "Pending"}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>
      <Subscribe />

      {/* -------------------PAYMENT DONE-------------------------- */}
      <Modal show={paymodalShow} onHide={() => setPayModalShow(false)} size="md" centered className="comn-modal-style receipt-modal">
        <Modal.Header className="border-0 p-0" closeButton></Modal.Header>
        <Modal.Body>
          <div className="text-center modal-data px-5">
            <img src={process.env.PUBLIC_URL + "/images/logo-main.png"} className="img-fluid mb-3" alt="" />
            <div className="order-detail">
              <bdi>Order id: {paymentReceipt?.uniqueOrderId}</bdi>
              <bdi>Invoice id: {paymentReceipt?.invoice}</bdi>
            </div>

            <div className="row my-3">
              <div className="col-4">
                <div className="black-box">
                  <span>{paymentReceipt?.fullname}</span>
                  <p>Username</p>
                </div>
              </div>
              <div className="col-4">
                <div className="black-box">
                  <span>{moment(paymentReceipt?.created_at).format("DD/MM/YYYY")}</span>
                  <p>Date</p>
                </div>
              </div>
              <div className="col-4 ">
                <div className="black-box">
                  <span>{paymentReceipt?.payment_type === 1 ? "Stripe" : paymentReceipt?.payment_type === 2 ? "Stripe to wallet" : paymentReceipt?.payment_type === 3 ? "Wallet" : paymentReceipt?.payment_type === 4 ? "Google Pay" : paymentReceipt?.payment_type === 5 ? "Google to wallet" : paymentReceipt?.payment_type === 6 ? "Apple pay" : paymentReceipt?.payment_type === 7 ? "Apple to wallet" : paymentReceipt?.payment_type === 8 && "Transfer to talent"}</span>
                  <p>Method</p>
                </div>
              </div>
              <div className="col-12 my-3">
                <div className="black-box">
                  <div className="payment-recept">
                    <bdi>Talent name</bdi>
                    <span>{paymentReceipt?.talent}</span>
                  </div>
                  <div className="payment-recept">
                    <bdi>Service type</bdi>
                    <span>{paymentReceipt?.chat_request === 1 ? "Chat" : "Video"}</span>
                  </div>
                  <div className="payment-recept">
                    <bdi>Amount</bdi>
                    <span>${formatNum(paymentReceipt?.amount !== undefined ? paymentReceipt?.amount : 0)}</span>
                  </div>
                  <div className="payment-recept">
                    <bdi>Tax</bdi>
                    <span>${formatNum(paymentReceipt?.tax !== undefined ? paymentReceipt?.tax : 0)}</span>
                  </div>
                  <div className="payment-recept border-top-class">
                    <bdi>Total</bdi>
                    <span>${formatNum(paymentReceipt?.amount + paymentReceipt?.tax)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-12 m-auto mb-sm-0 mb-3">
                <button className="comn-btn-class d-flex align-items-center justify-content-center w-100" onClick={(e) => downloadPdf(e, paymentReceipt?.rptLink)}>
                  <svg width="16" height="18" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                    <path d="M8 8V14M8 14L5 11M8 14L11 11M13 19H3C1.89543 19 1 18.1046 1 17V3C1 1.89543 1.89543 1 3 1H8.58579C8.851 1 9.10536 1.10536 9.29289 1.29289L14.7071 6.70711C14.8946 6.89464 15 7.149 15 7.41421V17C15 18.1046 14.1046 19 13 19Z" stroke="#E0E0E0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  Download
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </FrontendLayout>
  );
}
