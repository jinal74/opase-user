import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { WhatsappIcon, WhatsappShareButton, FacebookIcon, FacebookMessengerShareButton, TwitterIcon, TwitterShareButton, TelegramIcon, TelegramShareButton, LinkedinShareButton, LinkedinIcon } from "react-share";
import { toast } from "react-toastify";
import FrontendLayout from "../components/Layout/FrontendLayout";
import Subscribe from "../components/Layout/Subscribe";

export default function Invitefriends() {
  const [modalShare, setModalShare] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText("opase.com/join/r781gdvu");
    toast.success("coppied.");
  };

  // const share = () => {
  //   navigator.share({ url: "www.google.com", title: "Opase", text: "it's google" });
  // }

  return (
    <FrontendLayout>
      <section className="black-bg-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-7 mx-auto mb-5">
              <div className="profile-comn-data text-center">
                <span>Invite friends</span>
                <p></p>
              </div>
            </div>
            <div className="col-12 mb-3">
              <div className="d-flex ">
                <div className="me-3 d-md-block d-none">
                  {/* <svg width="100" height="100" viewBox="0 0 690 685" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M345.04 0C258.721 0.0877784 175.57 32.5001 111.996 90.841C48.4211 149.182 9.04109 229.214 1.62645 315.143C-5.78819 401.072 19.3011 486.658 71.9435 555.01C124.586 623.363 200.957 669.518 285.987 684.366V549.172H248.337V504.979C222.046 489.03 200.221 466.695 184.893 440.052C169.565 413.409 161.232 383.324 160.67 352.598C160.494 338.162 163.312 323.846 168.947 310.552C174.583 297.258 182.913 285.274 193.412 275.356C203.912 265.437 216.354 257.8 229.954 252.924C243.554 248.048 258.018 246.039 272.433 247.025C402.903 252.489 525.684 225.957 525.684 349.43C525.709 380.65 517.704 411.352 502.435 438.591C487.167 465.829 465.148 488.69 438.493 504.979V549.172H400.525V685C486.053 671.033 563.189 625.419 616.598 557.226C670.006 489.033 695.777 403.255 688.786 316.945C681.795 230.636 642.554 150.116 578.865 91.392C515.176 32.6685 431.702 0.0423989 345.04 0V0ZM379.203 205.92H298.987C293.748 205.924 288.606 204.514 284.103 201.84C279.6 199.166 275.902 195.327 273.402 190.728C270.902 186.128 269.69 180.94 269.897 175.71C270.103 170.479 271.718 165.402 274.573 161.013L292.329 133.214C297.344 125.365 304.258 118.905 312.431 114.43C320.605 109.954 329.775 107.609 339.095 107.609C348.415 107.609 357.585 109.954 365.758 114.43C373.932 118.905 380.845 125.365 385.861 133.214L403.775 161.013C406.609 165.419 408.203 170.506 408.389 175.74C408.575 180.973 407.347 186.161 404.832 190.756C402.318 195.351 398.611 199.184 394.1 201.853C389.59 204.521 384.444 205.926 379.203 205.92Z" fill="#7c64f8" />
                  </svg> */}
                  <img src={process.env.PUBLIC_URL + "/images/logo_invite.svg"} className="img-fluid" alt="" />
                </div>
                <div className="profile-comn-data">
                  <span>Hello, free Opase!</span>
                  <p className="mb-2">When a friend signs up with your code and they request an opase video priced at $10 or more, you’ll get $5!</p>
                  <p className="mb-3"></p>
                  <bdi className="d-block position-relative fix-width-input">
                    <input type="text" readOnly id="password" className="form-control comn-input-style pe-5" value="opase.com/join/r781gdvu" />
                    <span className="showpwd-class bg-transparent" id="show_pwd" onClick={copyToClipboard}>
                      <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.3748 18.8739H2.00088C1.4985 18.8914 1.01144 18.6995 0.655991 18.344C0.300547 17.9886 0.108637 17.5015 0.126095 16.9991V7.62522C0.108637 7.12285 0.300547 6.63578 0.655991 6.28033C1.01144 5.92489 1.4985 5.73298 2.00088 5.75044H5.75044V2.00088C5.73298 1.4985 5.92489 1.01144 6.28033 0.655991C6.63578 0.300547 7.12285 0.108637 7.62522 0.126095H16.9991C17.5015 0.108637 17.9886 0.300547 18.344 0.655991C18.6995 1.01144 18.8914 1.4985 18.8739 2.00088V11.3748C18.8911 11.8771 18.6991 12.364 18.3437 12.7194C17.9883 13.0747 17.5014 13.2667 16.9991 13.2496H13.2496V16.9991C13.2667 17.5014 13.0747 17.9883 12.7194 18.3437C12.364 18.6991 11.8771 18.8911 11.3748 18.8739ZM2.00088 7.62522V16.9991H11.3748V13.2496H7.62522C7.12293 13.2667 6.63602 13.0747 6.28064 12.7194C5.92526 12.364 5.73326 11.8771 5.75044 11.3748V7.62522H2.00088ZM7.62522 2.00088V11.3748H16.9991V2.00088H7.62522Z" fill="#7C64F8" />
                      </svg>
                    </span>
                  </bdi>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="row align-items-center justify-content-center">
                <div className="col-lg-6 col-9">
                  <button className="comn-btn-class w-100">Invite your friends</button>
                </div>
                <div className="col-lg-1 col-3">
                  <button className="grey-btn-class" onClick={() => setModalShare(true)}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.68387 11.3419C6.88616 10.9381 7 10.4824 7 10C7 9.51763 6.88616 9.06185 6.68387 8.65807M6.68387 11.3419C6.19134 12.3251 5.17449 13 4 13C2.34315 13 1 11.6569 1 10C1 8.34315 2.34315 7 4 7C5.17449 7 6.19134 7.67492 6.68387 8.65807M6.68387 11.3419L13.3161 14.6581M6.68387 8.65807L13.3161 5.34193M13.3161 5.34193C13.8087 6.32508 14.8255 7 16 7C17.6569 7 19 5.65685 19 4C19 2.34315 17.6569 1 16 1C14.3431 1 13 2.34315 13 4C13 4.48237 13.1138 4.93815 13.3161 5.34193ZM13.3161 14.6581C13.1138 15.0619 13 15.5176 13 16C13 17.6569 14.3431 19 16 19C17.6569 19 19 17.6569 19 16C19 14.3431 17.6569 13 16 13C14.8255 13 13.8087 13.6749 13.3161 14.6581Z" stroke="white" stroke-width="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Subscribe />

      {/* modal */}

      <Modal show={modalShare} onHide={() => setModalShare(false)} size="md" centered className="comn-modal-style">
        <Modal.Header className="border-0 add-card-modal me-3" closeButton>
          <div className="row px-2">
            <div className="col-12 mt-3">
              <h4>Invite friends</h4>
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="col-12 mt-3 ">
            <div className="row">
              <ul className="d-flex w-100 justify-content-center">
                <li>
                  <WhatsappShareButton className="me-3" url={"https://node.staging.rentechdigital.com:5097"}>
                    <WhatsappIcon size={50} />
                  </WhatsappShareButton>
                </li>
                <li>
                  <FacebookMessengerShareButton className="me-3" url={"https://node.staging.rentechdigital.com:5097"}>
                    <FacebookIcon size={50} />
                  </FacebookMessengerShareButton>
                </li>
                <li>
                  <TwitterShareButton className="me-3" url={"https://node.staging.rentechdigital.com:5097"}>
                    <TwitterIcon size={50}></TwitterIcon>
                  </TwitterShareButton>
                </li>
                <li>
                  <TelegramShareButton className="me-3" url={"https://node.staging.rentechdigital.com:5097"}>
                    <TelegramIcon size={50} />
                  </TelegramShareButton>
                </li>
                <li>
                  <LinkedinShareButton url={"https://node.staging.rentechdigital.com:5097"}>
                    <LinkedinIcon size={50} />{" "}
                  </LinkedinShareButton>
                </li>
              </ul>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </FrontendLayout>
  );
}
