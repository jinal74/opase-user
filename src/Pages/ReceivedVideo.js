import React, { useEffect, useState } from "react";
import FrontendLayout from "../components/Layout/FrontendLayout";
import { useLocation } from "react-router-dom";
import { API_Path } from "../const";
import { PostApi } from "../api/api-service";
import { toast } from "react-toastify";
import Subscribe from "../components/Layout/Subscribe";
import { WhatsappIcon, WhatsappShareButton, FacebookIcon, FacebookMessengerShareButton, TwitterIcon, TwitterShareButton, TelegramIcon, TelegramShareButton, LinkedinShareButton, LinkedinIcon } from "react-share";
import { Modal } from "react-bootstrap";

export default function ReceivedVideo() {
  const [received, setReceived] = useState("");
  const [modalShare, setModalShare] = React.useState(false);
  const location = useLocation();

  useEffect(() => {
    GetReceivedVideo();
  }, []);

  const GetReceivedVideo = () => {
    let path = API_Path.GetReceivedVideo;

    const GetReceivedVideoData = new Promise((resolve) => {
      resolve(PostApi(path));
    });
    GetReceivedVideoData.then((res) => {
      if (res.data.success) {
        setReceived(res.data.data);
      } else {
        toast.error(res.data.message);
      }
    });
  };

  return (
    <FrontendLayout>
      <section className="black-bg-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-7 mx-auto mb-5">
              <div className="profile-comn-data text-center">
                <span>Received videos</span>
                {/* <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type</p> */}
              </div>
            </div>
          </div>

          <div className="row">
            {location?.state?.video &&
              location?.state?.video?.map((item1) => {
                return (
                  <>
                    <div className="col-xxl-3 col-lg-4 col-sm-6 mb-3">
                      <div className="comn-recvideo-box">
                        <div className="iner-link-recvideo">
                          <div className="comn-shareicon-main shareicon-main-new pt-3" onClick={() => setModalShare(true)}>
                            <img src={process.env.PUBLIC_URL + "/images/share-icon.svg"} alt="" />
                          </div>
                          <div className="rcv-vedios px-3">
                            <video src={item1 && item1.video_link} width="240" height="150" poster={item1 && item1.thubnail} controls>
                              <source type="video/*" />
                            </video>
                          </div>
                          {/* <img src={process.env.PUBLIC_URL + "/images/recevied-video-img.png"} alt="" className="comn-recom-img img-fluid" /> */}

                          <div className="comn-opaseicon-main">
                            <img src={process.env.PUBLIC_URL + "/images/opase_watermark.png"} alt="" />
                          </div>
                          {/* 
                                  <div className="comn-downloadicon-main">
                                    <a href={process.env.PUBLIC_URL + "/images/share-icon.svg"} download="logo">
                                      <img src={process.env.PUBLIC_URL + "/images/download icon.svg"} />
                                    </a>
                                  </div> */}

                          {/* <div className="play-btn-main">
                                    <svg width="40" height="40" viewBox="0 0 71 71" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M35.2611 70.3C15.7869 70.3 0 54.5628 0 35.15C0 15.7372 15.7869 0 35.2611 0C54.7353 0 70.5222 15.7372 70.5222 35.15C70.5008 54.554 54.7264 70.2787 35.2611 70.3ZM7.05222 35.7546C7.21906 51.2249 19.8912 63.655 35.4111 63.5723C50.931 63.4887 63.4683 50.9235 63.4683 35.4523C63.4683 19.981 50.931 7.41586 35.4111 7.33228C19.8912 7.24954 7.21906 19.6796 7.05222 35.15V35.7546ZM28.2089 50.9675V19.3325L49.3655 35.15L28.2089 50.9675Z" fill="white" />
                                    </svg>
                                  </div> */}
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
            {/* <div className="col-xxl-3 col-lg-4 col-sm-6 mb-3">
              <div className="comn-recvideo-box">
                <Link to="#">
                  <div className="iner-link-recvideo">
                    <img src={process.env.PUBLIC_URL + "/images/received-video2.png"} alt="" className="comn-recom-img img-fluid" />

                    <div className="comn-shareicon-main">
                      <img src={process.env.PUBLIC_URL + "/images/share-icon.svg"} />
                    </div>

                    <div className="comn-opaseicon-main">
                      <img src={process.env.PUBLIC_URL + "/images/opase watermark.svg"} />
                    </div>

                    <div className="comn-downloadicon-main">
                      <a href={process.env.PUBLIC_URL + "/images/download icon.svg"}>
                        <img src={process.env.PUBLIC_URL + "/images/download icon.svg"} />
                      </a>
                    </div>

                    <div className="play-btn-main">
                      <svg width="40" height="40" viewBox="0 0 71 71" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M35.2611 70.3C15.7869 70.3 0 54.5628 0 35.15C0 15.7372 15.7869 0 35.2611 0C54.7353 0 70.5222 15.7372 70.5222 35.15C70.5008 54.554 54.7264 70.2787 35.2611 70.3ZM7.05222 35.7546C7.21906 51.2249 19.8912 63.655 35.4111 63.5723C50.931 63.4887 63.4683 50.9235 63.4683 35.4523C63.4683 19.981 50.931 7.41586 35.4111 7.33228C19.8912 7.24954 7.21906 19.6796 7.05222 35.15V35.7546ZM28.2089 50.9675V19.3325L49.3655 35.15L28.2089 50.9675Z" fill="white" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            <div className="col-xxl-3 col-lg-4 col-sm-6 mb-3">
              <div className="comn-recvideo-box">
                <Link to="#">
                  <div className="iner-link-recvideo">
                    <img src={process.env.PUBLIC_URL + "/images/recevied-video-img.png"} alt="" className="comn-recom-img img-fluid" />

                    <div className="comn-shareicon-main">
                      <img src={process.env.PUBLIC_URL + "/images/share-icon.svg"} />
                    </div>

                    <div className="comn-opaseicon-main">
                      <img src={process.env.PUBLIC_URL + "/images/opase watermark.svg"} />
                    </div>

                    <div className="comn-downloadicon-main">
                      <a href={process.env.PUBLIC_URL + "/images/download icon.svg"}>
                        <img src={process.env.PUBLIC_URL + "/images/download icon.svg"} />
                      </a>
                    </div>

                    <div className="play-btn-main">
                      <svg width="40" height="40" viewBox="0 0 71 71" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M35.2611 70.3C15.7869 70.3 0 54.5628 0 35.15C0 15.7372 15.7869 0 35.2611 0C54.7353 0 70.5222 15.7372 70.5222 35.15C70.5008 54.554 54.7264 70.2787 35.2611 70.3ZM7.05222 35.7546C7.21906 51.2249 19.8912 63.655 35.4111 63.5723C50.931 63.4887 63.4683 50.9235 63.4683 35.4523C63.4683 19.981 50.931 7.41586 35.4111 7.33228C19.8912 7.24954 7.21906 19.6796 7.05222 35.15V35.7546ZM28.2089 50.9675V19.3325L49.3655 35.15L28.2089 50.9675Z" fill="white" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            <div className="col-xxl-3 col-lg-4 col-sm-6 mb-3">
              <div className="comn-recvideo-box">
                <Link to="#">
                  <div className="iner-link-recvideo">
                    <img src={process.env.PUBLIC_URL + "/images/received-video2.png"} alt="" className="comn-recom-img img-fluid" />

                    <div className="comn-shareicon-main">
                      <img src={process.env.PUBLIC_URL + "/images/share-icon.svg"} />
                    </div>

                    <div className="comn-opaseicon-main">
                      <img src={process.env.PUBLIC_URL + "/images/opase watermark.svg"} />
                    </div>

                    <div className="comn-downloadicon-main">
                      <a href={process.env.PUBLIC_URL + "/images/download icon.svg"}>
                        <img src={process.env.PUBLIC_URL + "/images/download icon.svg"} />
                      </a>
                    </div>

                    <div className="play-btn-main">
                      <svg width="40" height="40" viewBox="0 0 71 71" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M35.2611 70.3C15.7869 70.3 0 54.5628 0 35.15C0 15.7372 15.7869 0 35.2611 0C54.7353 0 70.5222 15.7372 70.5222 35.15C70.5008 54.554 54.7264 70.2787 35.2611 70.3ZM7.05222 35.7546C7.21906 51.2249 19.8912 63.655 35.4111 63.5723C50.931 63.4887 63.4683 50.9235 63.4683 35.4523C63.4683 19.981 50.931 7.41586 35.4111 7.33228C19.8912 7.24954 7.21906 19.6796 7.05222 35.15V35.7546ZM28.2089 50.9675V19.3325L49.3655 35.15L28.2089 50.9675Z" fill="white" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </div>
            </div> */}
          </div>
        </div>
      </section>
      <Subscribe />

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
