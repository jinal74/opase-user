import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Dropdown } from "react-bootstrap";

import search from "../../images/search.svg";
import { API_Path, WebsiteUrl1 } from "../../const";
import { PostApi } from "../../api/api-service";
import { toast } from "react-toastify";
import review from "../../images/user.png";
import OpaseLogo from "../../images/logo-main.png";
import AuthContext from "../../context/AuthContext";
import { getTokenFirebase, onMessageListener } from "../../firebase";

export default function Header() {
  const navigate = useNavigate();
  const [login, setLogin] = useState(false);
  const [data, setData] = useState("");
  const { user, setUser, logOut } = useContext(AuthContext);
  // const { user, logOut } = UserAuth();

  const [path, setPath] = useState("");
  const location = useLocation();

  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState();
  const [notificationData, setNotificationData] = useState();

  useEffect(() => {
    getNotification();
    getTokenFirebase();
    // var url = window.location.href;
    // var pathname = new URL(url).pathname.match(/[^\/]+/g);
    // console.log(location.pathname.replace(/\//g, ""));
    // console.log(location);
    setPath(location.pathname.replace(/\//g, ""));
  }, []);

  useEffect(() => {
    onMessageListener()
      .then((payload) => {
        setNotification({ title: payload.notification.title, body: payload.notification.body });
        if (document.getElementById("notification")) {
          document.getElementById("dropdown-autoclose-true")?.click();
          setTimeout(() => {
            document.getElementById("dropdown-autoclose-true")?.click();
          }, 3000);
        }
      })
      .catch((err) => console.log("failed: ", err));
  }, [notification]);

  useEffect(() => {
    let token = localStorage.getItem("opus_token");
    if (token) {
      setLogin(true);
      getAllIProfile();
    }
  }, [login]);

  const getNotification = () => {
    const getNotification = new Promise((resolve) => {
      resolve(PostApi(API_Path.getNotification));
    });
    getNotification.then((res) => {
      if (res.status === 200) {
        setNotificationData(res.data.data.notif);
      } else {
        // toast.error(res.data.message);
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("opus_token");
    setLogin(false);
    setUser("");
    logOut();
    navigate("/login");
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
      } else if (res.status === 401) {
        if (localStorage.getItem("opus_token")) {
          localStorage.removeItem("opus_token");
        }
      } else {
        console.log(res.data.message);
      }
    });
  };

  const addactiveclass = () => {
    document.getElementById("menu-box").classList.toggle("active");
    document.getElementById("menu-icon").classList.toggle("active");
    document.getElementById("main-header").classList.toggle("active");
  };

  return (
    <>
      <header className="main-header-section" id="main-header">
        <div className="main-header-row">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="header-class">
                  <div className="me-5 header-logo-left text-start">
                    <a href={WebsiteUrl1} className="d-block py-3">
                      <img src={OpaseLogo} className="img-fluid logo" alt="OPASE" />
                    </a>
                  </div>
                  <div className="header-options" id="menu-box">
                    <ul>
                      <li>
                        <a href={WebsiteUrl1}>Home</a>
                      </li>
                      <li>
                        <a href={WebsiteUrl1 + "/about-us"}>About us</a>
                      </li>
                      <li className="d-lg-none d-inline">
                        <button className="border-button-comn">Apply as a talent</button>
                      </li>
                      {/* <li className="d-lg-none d-inline">
                        <button className="comn-btn-class px-3 py-2 ms-2" onClick={() => window.open("/login", "_self")}>
                          Login
                        </button>
                      </li> */}
                      <li className="d-lg-none d-inline">
                        <button className="comn-btn-class d-lg-block d-none px-3 py-2 ms-2" onClick={() => window.open("/login", "_self")}>
                          Login
                        </button>
                      </li>
                    </ul>
                  </div>
                  <div className="ms-auto">
                    <div className="header-rgt-part">
                      <ul>
                        {/* <li>
                          <button className="btn hdr-search-btn me-2" type="button">
                            <img src={search} alt="" />
                          </button>
                        </li> */}
                        {login && (
                          <li className="admin-notif position-relative pe-4" id="notify">
                            <Dropdown className="d-inline" drop="left" id="notification">
                              <Dropdown.Toggle variant="transparent" id="dropdown-autoclose-true">
                                <div className="hdr-notify-box d-flex align-items-center justify-content-center ">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" fill="#FFFFFF" className="bi bi-bell" viewBox="0 0 16 16">
                                    <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" />
                                  </svg>
                                  {notification?.notifCount && <span className="notification-no">{notification?.notifCount}</span>}
                                </div>
                              </Dropdown.Toggle>

                              <Dropdown.Menu className={notification ? "user-new pt-2" : "dropdown-menu"}>
                                {notification ? (
                                  <Dropdown.Item href="">
                                    <div className={notification ? "upload-profile-notif" : "upload-profile-notif  d-none"}>
                                      <div className="d-flex">
                                        {/* <div className="notif-circle">
                                        <svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M12.4211 4.99902C12.4211 7.20816 10.6043 8.99902 8.36317 8.99902C6.12201 8.99902 4.3052 7.20816 4.3052 4.99902C4.3052 2.78988 6.12201 0.999023 8.36317 0.999023C10.6043 0.999023 12.4211 2.78988 12.4211 4.99902Z" stroke="#828282" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                          <path d="M8.36317 11.999C4.44115 11.999 1.26172 15.133 1.26172 18.999H15.4646C15.4646 15.133 12.2852 11.999 8.36317 11.999Z" stroke="#828282" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                      </div> */}
                                        <div className="ps-3">
                                          <span>{notification?.title}</span>
                                          <p className="mb-0">{notification?.body}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </Dropdown.Item>
                                ) : (
                                  <Dropdown.Item href="">
                                    {notificationData &&
                                      notificationData.length > 0 &&
                                      notificationData?.map((item) => {
                                        return (
                                          <>
                                            <div className="upload-profile-notif">
                                              <div className="d-flex">
                                                {/* <div className="notif-circle">
                                                <svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M12.4211 4.99902C12.4211 7.20816 10.6043 8.99902 8.36317 8.99902C6.12201 8.99902 4.3052 7.20816 4.3052 4.99902C4.3052 2.78988 6.12201 0.999023 8.36317 0.999023C10.6043 0.999023 12.4211 2.78988 12.4211 4.99902Z" stroke="#828282" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                  <path d="M8.36317 11.999C4.44115 11.999 1.26172 15.133 1.26172 18.999H15.4646C15.4646 15.133 12.2852 11.999 8.36317 11.999Z" stroke="#828282" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                              </div> */}
                                                <div className="ps-3">
                                                  <span>{item.notif_title}</span>
                                                  <p className="mb-0">{item.notification}</p>
                                                </div>
                                              </div>
                                            </div>
                                          </>
                                        );
                                      })}
                                  </Dropdown.Item>
                                )}
                              </Dropdown.Menu>
                            </Dropdown>
                          </li>
                        )}

                        <li>
                          <a href={WebsiteUrl1 + "/signuptalent"} className="border-button-comn d-lg-block d-none">
                            Apply as a talent
                          </a>
                        </li>
                        {
                          login && (
                            <li className="profile-hdr-drop-class">
                              <Dropdown className="d-inline" drop="left" autoClose={true}>
                                <Dropdown.Toggle variant="transparent" id="dropdown-autoclose-true">
                                  <div className="profile-hdr-drop ms-1">
                                    <div className="profile-pic me-1">
                                      <img referrerPolicy="no-referrer" src={user && user?.image !== "null" && user?.image !== "" ? user?.image : review} className="profile-image" alt="profile" />
                                    </div>
                                    <div className="profil-detail-section d-flex text-start ms-2">
                                      <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FFF" className="bi bi-chevron-down" viewBox="0 0 16 16">
                                          <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="p-0">
                                  <Dropdown.Item to="/profile" className={path === "profile" ? "active d-flex align-items-center" : "d-flex align-items-center"} as={Link}>
                                    <span>
                                      <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10.5008 20.9169C8.92584 20.9213 7.3708 20.565 5.95494 19.8752C5.43676 19.6231 4.94028 19.3287 4.47056 18.995L4.32785 18.8908C3.03599 17.9373 1.9798 16.7004 1.24034 15.2752C0.475481 13.8 0.0787836 12.1618 0.0840359 10.5002C0.0840359 4.7472 4.7478 0.0834961 10.5008 0.0834961C16.2538 0.0834961 20.9175 4.7472 20.9175 10.5002C20.9227 12.161 20.5264 13.7985 19.7623 15.2731C19.0239 16.6975 17.9691 17.9339 16.6789 18.8877C16.1922 19.2439 15.6757 19.5576 15.1352 19.8252L15.0518 19.8668C13.6351 20.5603 12.0781 20.9195 10.5008 20.9169ZM10.5008 15.7085C8.93982 15.7054 7.50876 16.5773 6.79557 17.9658C9.13036 19.1222 11.8712 19.1222 14.206 17.9658V17.9606C13.4919 16.5736 12.0608 15.7037 10.5008 15.7085ZM10.5008 13.6252C12.7572 13.6281 14.8377 14.844 15.9477 16.8085L15.9633 16.795L15.9779 16.7825L15.9602 16.7981L15.9498 16.8064C18.5841 14.5305 19.5261 10.8568 18.3119 7.59402C17.0977 4.33128 13.9832 2.16716 10.5018 2.16716C7.02047 2.16716 3.90597 4.33128 2.69175 7.59402C1.47754 10.8568 2.41951 14.5305 5.0539 16.8064C6.16459 14.8429 8.24491 13.6279 10.5008 13.6252ZM10.5008 12.5835C8.19959 12.5835 6.33411 10.718 6.33411 8.41683C6.33411 6.11564 8.19959 4.25016 10.5008 4.25016C12.802 4.25016 14.6675 6.11564 14.6675 8.41683C14.6675 9.5219 14.2285 10.5817 13.4471 11.3631C12.6657 12.1445 11.6059 12.5835 10.5008 12.5835ZM10.5008 6.3335C9.35019 6.3335 8.41745 7.26624 8.41745 8.41683C8.41745 9.56742 9.35019 10.5002 10.5008 10.5002C11.6514 10.5002 12.5841 9.56742 12.5841 8.41683C12.5841 7.26624 11.6514 6.3335 10.5008 6.3335Z" fill="white" />
                                      </svg>
                                    </span>
                                    <div className="ms-3">Profile</div>
                                  </Dropdown.Item>
                                  <Dropdown.Item to="/requests" className={path === "requests" ? "active d-flex align-items-center" : "d-flex align-items-center"} as={Link}>
                                    <span>
                                      <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.5007 11.5C11.9484 11.5 11.5007 11.9477 11.5007 12.5C11.5007 13.0523 11.9484 13.5 12.5007 13.5V11.5ZM15.6257 13.5C16.178 13.5 16.6257 13.0523 16.6257 12.5C16.6257 11.9477 16.178 11.5 15.6257 11.5V13.5ZM12.5007 15.6667C11.9484 15.6667 11.5007 16.1144 11.5007 16.6667C11.5007 17.219 11.9484 17.6667 12.5007 17.6667V15.6667ZM15.6257 17.6667C16.178 17.6667 16.6257 17.219 16.6257 16.6667C16.6257 16.1144 16.178 15.6667 15.6257 15.6667V17.6667ZM9.37566 11.5C8.82338 11.5 8.37566 11.9477 8.37566 12.5C8.37566 13.0523 8.82338 13.5 9.37566 13.5V11.5ZM9.38608 13.5C9.93837 13.5 10.3861 13.0523 10.3861 12.5C10.3861 11.9477 9.93837 11.5 9.38608 11.5V13.5ZM9.37566 15.6667C8.82338 15.6667 8.37566 16.1144 8.37566 16.6667C8.37566 17.219 8.82338 17.6667 9.37566 17.6667V15.6667ZM9.38608 17.6667C9.93837 17.6667 10.3861 17.219 10.3861 16.6667C10.3861 16.1144 9.93837 15.6667 9.38608 15.6667V17.6667ZM18.7924 7.29167V19.7917H20.7924V7.29167H18.7924ZM17.709 20.875H7.29232V22.875H17.709V20.875ZM6.20898 19.7917V7.29167H4.20898V19.7917H6.20898ZM7.29232 6.20833H9.37566V4.20833H7.29232V6.20833ZM15.6257 6.20833H17.709V4.20833H15.6257V6.20833ZM7.29232 20.875C6.69401 20.875 6.20898 20.39 6.20898 19.7917H4.20898C4.20898 21.4945 5.58945 22.875 7.29232 22.875V20.875ZM18.7924 19.7917C18.7924 20.39 18.3073 20.875 17.709 20.875V22.875C19.4119 22.875 20.7924 21.4945 20.7924 19.7917H18.7924ZM20.7924 7.29167C20.7924 5.58879 19.4119 4.20833 17.709 4.20833V6.20833C18.3073 6.20833 18.7924 6.69336 18.7924 7.29167H20.7924ZM6.20898 7.29167C6.20898 6.69336 6.69401 6.20833 7.29232 6.20833V4.20833C5.58945 4.20833 4.20898 5.58879 4.20898 7.29167H6.20898ZM12.5007 13.5H15.6257V11.5H12.5007V13.5ZM12.5007 17.6667H15.6257V15.6667H12.5007V17.6667ZM11.459 4.125H13.5423V2.125H11.459V4.125ZM13.5423 6.29167H11.459V8.29167H13.5423V6.29167ZM11.459 6.29167C10.8607 6.29167 10.3757 5.80664 10.3757 5.20833H8.37566C8.37566 6.91121 9.75613 8.29167 11.459 8.29167V6.29167ZM14.6257 5.20833C14.6257 5.80664 14.1407 6.29167 13.5423 6.29167V8.29167C15.2452 8.29167 16.6257 6.91121 16.6257 5.20833H14.6257ZM13.5423 4.125C14.1407 4.125 14.6257 4.61003 14.6257 5.20833H16.6257C16.6257 3.50545 15.2452 2.125 13.5423 2.125V4.125ZM11.459 2.125C9.75613 2.125 8.37566 3.50545 8.37566 5.20833H10.3757C10.3757 4.61003 10.8607 4.125 11.459 4.125V2.125ZM9.37566 13.5H9.38608V11.5H9.37566V13.5ZM9.37566 17.6667H9.38608V15.6667H9.37566V17.6667Z" fill="white" />
                                      </svg>
                                    </span>
                                    <div className="ms-3">Requests</div>
                                  </Dropdown.Item>
                                  <Dropdown.Item to="/chat" className={path === "chat" ? "active d-flex align-items-center" : "d-flex align-items-center"} as={Link}>
                                    <span>
                                      <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.33335 12.4998H8.34377M12.5 12.4998H12.5104M16.6667 12.4998H16.6771M21.8751 12.4998C21.8751 17.1022 17.6777 20.8332 12.5 20.8332C10.8966 20.8332 9.38722 20.4754 8.06738 19.8447L3.125 20.8332L4.57812 16.9582C3.65788 15.6689 3.125 14.1397 3.125 12.4998C3.125 7.89746 7.32234 4.1665 12.5 4.1665C17.6777 4.1665 21.8751 7.89746 21.8751 12.4998Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                      </svg>
                                    </span>
                                    <div className="ms-3">Chat</div>
                                  </Dropdown.Item>
                                  <Dropdown.Item to="/following" className={path === "following" ? "active d-flex align-items-center" : "d-flex align-items-center"} as={Link}>
                                    <span>
                                      <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.5 4.5356C13.2635 3.67058 14.3806 3.125 15.625 3.125C17.9262 3.125 19.7917 4.99048 19.7917 7.29167C19.7917 9.59285 17.9262 11.4583 15.625 11.4583C14.3806 11.4583 13.2635 10.9128 12.5 10.0477M15.625 21.875H3.125V20.8333C3.125 17.3816 5.92323 14.5833 9.37502 14.5833C12.8268 14.5833 15.625 17.3816 15.625 20.8333V21.875ZM15.625 21.875H21.8751V20.8333C21.8751 17.3816 19.0768 14.5833 15.625 14.5833C14.4866 14.5833 13.4193 14.8877 12.5 15.4195M13.5417 7.29167C13.5417 9.59285 11.6762 11.4583 9.37502 11.4583C7.07383 11.4583 5.20834 9.59285 5.20834 7.29167C5.20834 4.99048 7.07383 3.125 9.37502 3.125C11.6762 3.125 13.5417 4.99048 13.5417 7.29167Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                      </svg>
                                    </span>
                                    <div className="ms-3">Following</div>
                                    <span className="follower-bg ms-auto">{user ? user?.following : ""}</span>
                                  </Dropdown.Item>
                                  <Dropdown.Item to="/alltalent" className={path === "alltalent" ? "active d-flex align-items-center" : "d-flex align-items-center"} as={Link}>
                                    <span>
                                      <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_3593_5250)">
                                          <path d="M4.16732 6.25016H2.08398V20.8335C2.08398 21.9793 3.02149 22.9168 4.16732 22.9168H18.7507V20.8335H4.16732V6.25016ZM20.834 2.0835H8.334C7.18817 2.0835 6.25066 3.021 6.25066 4.16683V16.6668C6.25066 17.8127 7.18817 18.7502 8.334 18.7502H20.834C21.9799 18.7502 22.9174 17.8127 22.9174 16.6668V4.16683C22.9174 3.021 21.9799 2.0835 20.834 2.0835ZM20.834 16.6668H8.334V4.16683H20.834V16.6668ZM12.5007 5.72933V15.1043L18.7507 10.4168L12.5007 5.72933Z" fill="white" />
                                        </g>
                                        <defs>
                                          <clipPath id="clip0_3593_5250">
                                            <rect width="25.0001" height="25" fill="white" />
                                          </clipPath>
                                        </defs>
                                      </svg>
                                    </span>
                                    <div className="ms-3">Received videos</div>
                                  </Dropdown.Item>
                                  <Dropdown.Item to="/invite-friends" className={path === "invite-friends" ? "active d-flex align-items-center" : "d-flex align-items-center"} as={Link}>
                                    <span>
                                      <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18.7501 9.375V12.5M18.7501 12.5V15.625M18.7501 12.5H21.8751M18.7501 12.5H15.625M13.5417 7.29167C13.5417 9.59285 11.6762 11.4583 9.37502 11.4583C7.07383 11.4583 5.20834 9.59285 5.20834 7.29167C5.20834 4.99048 7.07383 3.125 9.37502 3.125C11.6762 3.125 13.5417 4.99048 13.5417 7.29167ZM3.125 20.8333C3.125 17.3816 5.92323 14.5833 9.37502 14.5833C12.8268 14.5833 15.625 17.3816 15.625 20.8333V21.875H3.125V20.8333Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                      </svg>
                                    </span>
                                    <div className="ms-3">Invite friends</div>
                                  </Dropdown.Item>
                                  <Dropdown.Item to="/opasecash" className={path === "opasecash" ? "active d-flex align-items-center" : "d-flex align-items-center"} as={Link}>
                                    <span>
                                      <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_3593_5261)">
                                          <path d="M21.8751 7.58333V5.20833C21.8751 4.0625 20.9376 3.125 19.7917 3.125H5.20834C4.05209 3.125 3.125 4.0625 3.125 5.20833V19.7917C3.125 20.9375 4.05209 21.875 5.20834 21.875H19.7917C20.9376 21.875 21.8751 20.9375 21.8751 19.7917V17.4167C22.4896 17.0521 22.9167 16.3958 22.9167 15.625V9.375C22.9167 8.60417 22.4896 7.94792 21.8751 7.58333ZM20.8334 9.375V15.625H13.5417V9.375H20.8334ZM5.20834 19.7917V5.20833H19.7917V7.29167H13.5417C12.3959 7.29167 11.4584 8.22917 11.4584 9.375V15.625C11.4584 16.7708 12.3959 17.7083 13.5417 17.7083H19.7917V19.7917H5.20834Z" fill="white" />
                                          <path d="M16.666 14.0625C17.529 14.0625 18.2285 13.3629 18.2285 12.5C18.2285 11.6371 17.529 10.9375 16.666 10.9375C15.8031 10.9375 15.1035 11.6371 15.1035 12.5C15.1035 13.3629 15.8031 14.0625 16.666 14.0625Z" fill="white" />
                                        </g>
                                        <defs>
                                          <clipPath id="clip0_3593_5261">
                                            <rect width="25.0001" height="25" fill="white" />
                                          </clipPath>
                                        </defs>
                                      </svg>
                                    </span>
                                    <div className="ms-3">Opase cash</div>
                                  </Dropdown.Item>
                                  <Dropdown.Item onClick={() => handleLogout()} className="d-flex align-items-center">
                                    <span>
                                      <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10.5008 20.9169C8.92584 20.9213 7.3708 20.565 5.95494 19.8752C5.43676 19.6231 4.94028 19.3287 4.47056 18.995L4.32785 18.8908C3.03599 17.9373 1.9798 16.7004 1.24034 15.2752C0.475481 13.8 0.0787836 12.1618 0.0840359 10.5002C0.0840359 4.7472 4.7478 0.0834961 10.5008 0.0834961C16.2538 0.0834961 20.9175 4.7472 20.9175 10.5002C20.9227 12.161 20.5264 13.7985 19.7623 15.2731C19.0239 16.6975 17.9691 17.9339 16.6789 18.8877C16.1922 19.2439 15.6757 19.5576 15.1352 19.8252L15.0518 19.8668C13.6351 20.5603 12.0781 20.9195 10.5008 20.9169ZM10.5008 15.7085C8.93982 15.7054 7.50876 16.5773 6.79557 17.9658C9.13036 19.1222 11.8712 19.1222 14.206 17.9658V17.9606C13.4919 16.5736 12.0608 15.7037 10.5008 15.7085ZM10.5008 13.6252C12.7572 13.6281 14.8377 14.844 15.9477 16.8085L15.9633 16.795L15.9779 16.7825L15.9602 16.7981L15.9498 16.8064C18.5841 14.5305 19.5261 10.8568 18.3119 7.59402C17.0977 4.33128 13.9832 2.16716 10.5018 2.16716C7.02047 2.16716 3.90597 4.33128 2.69175 7.59402C1.47754 10.8568 2.41951 14.5305 5.0539 16.8064C6.16459 14.8429 8.24491 13.6279 10.5008 13.6252ZM10.5008 12.5835C8.19959 12.5835 6.33411 10.718 6.33411 8.41683C6.33411 6.11564 8.19959 4.25016 10.5008 4.25016C12.802 4.25016 14.6675 6.11564 14.6675 8.41683C14.6675 9.5219 14.2285 10.5817 13.4471 11.3631C12.6657 12.1445 11.6059 12.5835 10.5008 12.5835ZM10.5008 6.3335C9.35019 6.3335 8.41745 7.26624 8.41745 8.41683C8.41745 9.56742 9.35019 10.5002 10.5008 10.5002C11.6514 10.5002 12.5841 9.56742 12.5841 8.41683C12.5841 7.26624 11.6514 6.3335 10.5008 6.3335Z" fill="white" />
                                      </svg>
                                    </span>
                                    <div className="ms-3">Logout</div>
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </li>
                          )
                          // : (
                          //   <li>
                          //     <button className="comn-btn-class d-lg-block d-none px-3 py-2 ms-2" onClick={() => window.open("/login", "_self")}>
                          //       Login
                          //     </button>
                          //   </li>
                          // )
                        }
                      </ul>
                    </div>
                  </div>
                  <div className="responsive-menu" onClick={addactiveclass}>
                    <div className="header-menu-icon">
                      <div className="menu-togle-new-class" id="menu-icon">
                        <svg viewBox="0 0 800 600">
                          <path d="M300,220 C300,220 520,220 540,220 C740,220 640,540 520,420 C440,340 300,200 300,200" id="top"></path>
                          <path d="M300,320 L540,320" id="middle"></path>
                          <path d="M300,210 C300,210 520,210 540,210 C740,210 640,530 520,410 C440,330 300,190 300,190" id="bottom" transform="translate(480, 320) scale(1, -1) translate(-480, -318) "></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
