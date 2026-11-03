import React, { useContext } from "react";
import FrontendLayout from "../components/Layout/FrontendLayout";
import { Dropdown } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import InputEmoji from "react-input-emoji";
import jwt_decode from "jwt-decode";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";
import { API_Path } from "../const";
import { PostApi } from "../api/api-service";
import { collection, query, where, onSnapshot, orderBy, setDoc, doc, getDoc, updateDoc, getDocs } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase";
import AuthContext from "../context/AuthContext";
import Subscribe from "../components/Layout/Subscribe";

export default function Chats() {
  const [id, setId] = useState("");
  const location = useLocation();
  const msgBoxRef = useRef();
  const [text, setText] = useState("");
  const [data, setData] = useState({});
  // const [loading, setLoading] = useState(false);
  const [allMessages, setMessages] = useState([]);

  const [allMessages2, setMessages2] = useState([]);
  const [talent, setTalentData] = useState();
  const [search, setSearch] = useState();
  const [selected, setSelected] = useState("");
  const [content, setContent] = useState("");
  const [img, setImg] = useState("");
  const [clicked, setClicked] = useState(false);

  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    // getUserData();

    if (localStorage.getItem("opus_token") !== undefined && localStorage.getItem("opus_token") !== null) {
      setId(jwt_decode(localStorage.getItem("opus_token"))?.id);
    }
  }, []);

  useEffect(() => {
    const chatsRef = collection(db, "messages");
    const q = query(chatsRef, where("users", "array-contains", jwt_decode(localStorage.getItem("opus_token"))?.id.toString()));

    const unsub = onSnapshot(q, (querySnap) => {
      setTalentData(querySnap?.docs?.map((item) => (item.data()?.users[0] === jwt_decode(localStorage.getItem("opus_token"))?.id.toString() ? { ...item.data(), id: parseInt(item.data()?.idTo), image: item?.data()?.dataTo?.image, user_name: item?.data()?.dataTo?.name } : { ...item.data(), id: parseInt(item.data()?.idFrom), image: item?.data()?.dataFrom?.image, user_name: item?.data()?.dataFrom?.name })));
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (talent?.length > 0) {
      talent.map((item, i) => {
        if (parseInt(item?.idTo) == parseInt(location?.state?.talentdetail?.id)) {
          chatboxactive(item, "", "initial");
        }
      });
    }
  }, [talent]);

  const chatboxactive = async (item, index, call) => {
    if (call !== "initial") {
      document.getElementById("chat-name" + location?.state?.talentdetail?.id)?.classList.remove("active");
      for (let i = 0; i < talent.length; i++) {
        if (i === index) {
          document.getElementById("chat-name" + i)?.classList.add("active");
        } else {
          document.getElementById("chat-name" + i)?.classList.remove("active");
        }
      }
    } else {
      document.getElementById("chat-name" + location?.state?.talentdetail?.id)?.classList.add("active");
    }

    setSelected(item);

    const user1 = user?.id;
    const user2 = item.id;
    const id1 = user1 <= user2 ? `${user1}-${user2}` : `${user2}-${user1}`;

    const msgRef = collection(db, "messages", id1, id1);
    const q = query(msgRef, orderBy("timestamp", "asc"));
    onSnapshot(q, (querySnap) => {
      let msg1 = [];
      querySnap.forEach((doc) => {
        msg1.push(doc.data());
      });

      setMessages(msg1);
    });

    const colRef = collection(db, "messages", id1, id1);
    const docSnap = await getDoc(doc(db, "messages", id1));
    const docsSnap1 = await getDocs(colRef);

    if (docSnap.data() && docSnap.data()?.idFrom !== user1.toString()) {
      await updateDoc(doc(db, "messages", id1), { read: true });
      try {
        docsSnap1?.forEach(async (doc1) => {
          if (doc1) {
            await updateDoc(doc(db, "messages", id1, id1, doc1?.data()?.timestamp.toString()), { read: true });
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const chatboxclose = () => {
    document.getElementById("chat-main").classList.remove("active");
  };

  let searchTalentData = (val) => {
    let data = {
      search: val,
    };

    const searchTalentData = new Promise((resolve) => {
      resolve(PostApi(API_Path.getTalent, data));
    });
    searchTalentData.then((res) => {
      if (res.data.success) {
        // setSearch("");
        document.getElementById("chat-name" + location?.state?.talentdetail?.id)?.classList.remove("active");

        let data1 = res.data.data?.talent?.filter((item) => item.id !== jwt_decode(localStorage.getItem("opus_token"))?.id);
        setTalentData(data1);
      } else {
        toast.error(res.data.message);
      }
    });
  };

  const handleChange = (e) => {
    setText(e);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    searchTalentData(e.target.value);
  };

  const onSubmit = () => {
    if (text) {
      handleOnEnter1(text);
      msgBoxRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    }
  };

  // onEnter firebase
  const handleOnEnter1 = async (text) => {
    setText(text);
    setContent(text);

    if (text) {
      const user1 = user?.id;
      const user2 = selected?.id;

      const id1 = user1 <= user2 ? `${user1}-${user2}` : `${user2}-${user1}`;
      let timestamp = Date.now();

      let url;
      if (img) {
        const imgRef = ref(storage, `images/${new Date().getTime()}-${img.name}`);
        const snap = await uploadBytes(imgRef, img);
        const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
        url = dlUrl;
      }

      await setDoc(doc(db, "messages", id1, id1, timestamp.toString()), {
        content: text.trim(),
        idFrom: user1?.toString(),
        contentType: 1,
        idTo: user2?.toString(),
        timestamp: timestamp,
        media: url || "",
        read: false,
      });

      await setDoc(doc(db, "messages", id1), {
        content: text.trim(),
        contentType: 1,
        dataFrom: {
          image: user ? user?.image : "",
          name: user ? user?.user_name : "",
        },
        dataTo: {
          image: selected ? selected?.image : "",
          name: selected ? selected?.user_name : "",
        },
        idFrom: user1 ? user1?.toString() : "",
        idTo: user2 ? user2?.toString() : "",
        timestamp: timestamp,
        read: false,
        users: [user1 ? user1.toString() : "", user2 ? user2.toString() : ""],
      });
      setText("");
    }
  };

  const handleDelete = async (e, id) => {
    const user1 = user?.id;
    const user2 = selected?.id;
    const id1 = user1 <= user2 ? `${user1}-${user2}` : `${user2}-${user1}`;

    const docSnap = await getDoc(doc(db, "messages", id1, id1, id.toString()));

    if (docSnap.data()) {
      try {
        await updateDoc(doc(db, "messages", id1, id1, id.toString()), {
          deleted: true,
        });
        toast.success("Message deleted successfully!");
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <FrontendLayout>
      <section className="comn-row-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-4  pe-lg-0">
              <div className="chat-lft-part-main">
                <div className="chat-title">
                  <h5>Chats</h5>
                </div>
                <div className="row chat-left-part-head d-block d-sm-flex align-items-center">
                  <div className="col-12">
                    <div className=" position-relative">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#6C6A81" className="bi bi-search fix-in-icon" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                      </svg>
                      <input type="search" className="form-control login-input-search searchbar ps-5 w-100" name="search" value={search} onChange={handleSearchChange} placeholder="Search..." />
                    </div>
                  </div>
                </div>

                <div className="chat-left-part-btm">
                  <div className="chat-div">
                    {talent?.length > 0 &&
                      talent.map((item, i) => {
                        return (
                          <div
                            className="chat-people-info"
                            id={clicked ? "chat-name" + i : "chat-name" + location?.state?.talentdetail?.id}
                            onClick={() => {
                              setClicked(true);
                              chatboxactive(item, i, "click");
                            }}
                            key={i}
                          >
                            <div className="chat-pro-div d-flex align-items-center">
                              <div className="chat-profile">
                                {/* <span className="active-chat"></span> */}
                                <img referrerPolicy="no-referrer" src={item?.image && item?.image !== "null" ? item?.image : process.env.PUBLIC_URL + "/images/chat_1.png"} alt="" className="img-fluid" />
                              </div>
                              <div className="ms-3 chat-status-class">
                                <bdi>{item?.user_name}</bdi>
                                {/* <p>{item?.content}</p> */}
                              </div>

                              <div className="ms-auto ">
                                {/* <span className="pen-follow-span">{item.users.length}</span> */}
                                {/* <span className="chat-date-date-month-div">{moment(item?.timestamp).fromNow()}</span> */}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-8 ps-0 ">
              {selected === "" ? (
                <div className="chat-display h-100">
                  <div className="d-flex align-items-center justify-content-center h-100 color-txt">
                    <div className="d-flex flex-column align-items-center justify-content-center">
                      <img src={process.env.PUBLIC_URL + "/images/chat_image.png"} className="img-fluid logo mb-3" alt="" />
                      Let's start chat
                      <p>hello!! we are here to discuss about talent....</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="chat-display px-0 px-lg-5 " id="chat-main">
                  <div className="chat-rgt-head">
                    <div className="rgt-pro-info d-flex align-items-center">
                      <div className="d-lg-none pe-2">
                        <button className="bg-transparent border-0 pe-2" onClick={chatboxclose}>
                          <i className="bi bi-arrow-left"></i>
                        </button>
                      </div>
                      <div className="chat-profile d-flex align-items-center">
                        <img referrerPolicy="no-referrer" src={selected?.image && selected?.image !== "null" ? selected?.image : process.env.PUBLIC_URL + "/images/chat_1.png"} alt="" className="img-fluid" />
                        <div className="ms-3 chat-status-class">
                          <bdi>{selected?.user_name}</bdi>
                          {/* <p>Hello, miss You</p> */}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="chat-main-area">
                    <div className="chat-box-part">
                      {allMessages?.map((item) => {
                        return (
                          <>
                            {parseInt(item?.idFrom) === user?.id ? (
                              <>
                                {!item?.deleted && (
                                  <div className="chat-box message-out mx-0 mx-sm-3 mx-lg-0" key={item?.timestamp}>
                                    <div className="chat-main-detail">
                                      <div className="chat-section-side">
                                        <div className="chat-in-box d-flex flex-column">
                                          <div className="d-flex justify-content-between align-items-center">
                                            <p className="mb-0 text-start d-inline">{item?.content}</p>
                                          </div>
                                          <div className="d-flex justify-content-end align-items-center">
                                            <bdi className="ms-auto chat-timestamp">{moment(item?.timestamp).fromNow()}</bdi>
                                            <div className={`${item?.read ? "blue-tick ms-2 seen-msg" : "blue-tick ms-2"}`}>
                                              <i className="bi bi-check2-all"></i>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div ref={msgBoxRef}></div>
                                    <div className="chat-rgt-drop">
                                      <div className="table-ed-drop ms-2">
                                        <Dropdown drop="left">
                                          <Dropdown.Toggle className="table-dropdown-btn" id="dropdown-basic">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="bi bi-three-dots" viewBox="0 0 16 16">
                                              <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                                            </svg>
                                          </Dropdown.Toggle>
                                          <Dropdown.Menu onClick={(e) => handleDelete(e, item?.timestamp)}>
                                            <Dropdown.Item>
                                              <bdi className="d-flex align-items-center mx-2">
                                                <span className="ms-2 text-white">Delete</span>
                                              </bdi>
                                            </Dropdown.Item>
                                          </Dropdown.Menu>
                                        </Dropdown>
                                        {/* <i class="bi bi-x" ></i> */}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </>
                            ) : (
                              <>
                                <div className="chat-box message-in py-3 ">
                                  <div className="chat-main-detail d-flex mx-3 mx-lg-0">
                                    <div className="side-chat-profile  me-2">
                                      <img referrerPolicy="no-referrer" src={selected?.image && selected?.image !== "null" ? selected?.image : process.env.PUBLIC_URL + "/images/chat_1.png"} alt="" />
                                    </div>
                                    <div className="chat-section-side">
                                      <div className="chat-in-box d-flex mb-3 flex-column">
                                        <p className="mb-0">{item?.content}</p>
                                        <bdi className="ms-auto chat-timestamp">{moment(item?.timestamp).fromNow()}</bdi>
                                      </div>
                                    </div>
                                  </div>
                                  <div ref={msgBoxRef}></div>
                                </div>
                              </>
                            )}
                          </>
                        );
                      })}
                      {/* <div className="chat-box message-out mx-3 mx-lg-0">
                      <div className="chat-main-detail">
                        <div className="chat-section-side">
                          <div className="chat-in-box d-flex flex-column">
                            <p className="mb-0 text-start">Lorem Ipsum is simply dummy text of the printing.</p>
                            <bdi className="ms-auto">09:10 PM</bdi>
                          </div>
                        </div>
                      </div>
                    </div> */}
                    </div>
                  </div>
                  <div className="chat-section-right-msg-box  mb-2">
                    <div className=" position-relative">
                      <div>
                        <InputEmoji value={text} onChange={handleChange} name="text" cleanOnEnter onEnter={handleOnEnter1} placeholder="Hi! how are you?" />
                      </div>
                      <div className="send-btn">
                        <button type="button" className=" border-0 cursor-pointer" onClick={onSubmit}>
                          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.75842 21.6298L7.11867 22.6161C7.16257 22.6 7.20535 22.5811 7.24672 22.5593L6.75842 21.6298ZM5.99517 20.8794L6.9774 21.2505C6.98165 21.2392 6.98571 21.2279 6.98958 21.2165L5.99517 20.8794ZM5.99517 5.11999L6.98958 4.78287C6.98571 4.77147 6.98165 4.76013 6.9774 4.74887L5.99517 5.11999ZM6.75842 4.36955L7.24672 3.44C7.20535 3.41826 7.16257 3.39932 7.11867 3.38328L6.75842 4.36955ZM21.1247 14.083L21.613 15.0126L21.613 15.0126L21.1247 14.083ZM21.1247 11.9163L20.6364 12.8459H20.6364L21.1247 11.9163ZM21.7938 12.2679L21.3055 13.1974C21.322 13.2061 21.3388 13.2143 21.3557 13.2221L21.7938 12.2679ZM21.7938 13.7315L21.3557 12.7772C21.3388 12.785 21.322 12.7933 21.3055 12.8019L21.7938 13.7315ZM21.5708 12.1507L22.0591 11.2211L22.0591 11.2211L21.5708 12.1507ZM21.5708 13.8487L22.0591 14.7782L22.0591 14.7782L21.5708 13.8487ZM21.3477 13.9658L20.8594 13.0363L20.8594 13.0363L21.3477 13.9658ZM14.083 14.0497C14.6629 14.0497 15.133 13.5796 15.133 12.9997C15.133 12.4198 14.6629 11.9497 14.083 11.9497V14.0497ZM6.39817 20.6435C6.47769 20.6145 6.56325 20.6087 6.64538 20.6263L6.20483 22.6796C6.50909 22.7448 6.82602 22.723 7.11867 22.6161L6.39817 20.6435ZM6.64538 20.6263C6.72758 20.6439 6.80517 20.6848 6.86805 20.7467L5.39573 22.2441C5.61937 22.464 5.90051 22.6143 6.20483 22.6796L6.64538 20.6263ZM6.86805 20.7467C6.93109 20.8086 6.97665 20.8892 6.99672 20.9796L4.9466 21.4346C5.01514 21.7434 5.17192 22.024 5.39573 22.2441L6.86805 20.7467ZM6.99672 20.9796C7.01681 21.0701 7.00992 21.1644 6.9774 21.2505L5.01294 20.5082C4.90124 20.8039 4.87804 21.1256 4.9466 21.4346L6.99672 20.9796ZM6.98958 21.2165L9.66095 13.3368L7.67213 12.6625L5.00076 20.5422L6.98958 21.2165ZM9.66095 12.6625L6.98958 4.78287L5.00076 5.45712L7.67213 13.3368L9.66095 12.6625ZM6.9774 4.74887C7.00992 4.83495 7.01681 4.92924 6.99671 5.01977L4.9466 4.56477C4.87803 4.87371 4.90124 5.19548 5.01294 5.49111L6.9774 4.74887ZM6.99671 5.01977C6.97665 5.1102 6.93108 5.19071 6.86805 5.25269L5.39573 3.75526C5.17193 3.9753 5.01514 4.25594 4.9466 4.56477L6.99671 5.01977ZM6.86805 5.25269C6.80518 5.3145 6.72758 5.35543 6.64538 5.37306L6.20483 3.31979C5.9005 3.38509 5.61937 3.53537 5.39573 3.75526L6.86805 5.25269ZM6.64538 5.37306C6.56325 5.39068 6.47769 5.38486 6.39817 5.35581L7.11867 3.38328C6.82602 3.27639 6.50908 3.25451 6.20483 3.31979L6.64538 5.37306ZM21.613 10.9868L7.24672 3.44L6.27011 5.29909L20.6364 12.8459L21.613 10.9868ZM21.7938 12.2679C21.3557 13.2221 21.3552 13.2219 21.3547 13.2216C21.3546 13.2216 21.3541 13.2213 21.3537 13.2212C21.3531 13.2209 21.3524 13.2206 21.3518 13.2203C21.3505 13.2197 21.3492 13.2191 21.3479 13.2185C21.3454 13.2173 21.3429 13.2161 21.3405 13.2149C21.3357 13.2126 21.3312 13.2104 21.3269 13.2083C21.3183 13.204 21.3107 13.1999 21.3038 13.1961C21.2903 13.1886 21.2792 13.1818 21.2699 13.1755C21.2523 13.1636 21.2356 13.1499 21.2199 13.1324C21.2031 13.1137 21.1856 13.0885 21.1728 13.0577C21.1666 13.0426 21.1626 13.0288 21.1603 13.0172C21.158 13.0056 21.158 12.9993 21.158 12.9997H23.258C23.258 12.4325 23.032 12.0072 22.782 11.7289C22.6627 11.5961 22.5425 11.5011 22.4472 11.4366C22.3991 11.404 22.3556 11.3781 22.3194 11.358C22.3012 11.348 22.2847 11.3393 22.2701 11.332C22.2628 11.3283 22.2559 11.325 22.2495 11.3219C22.2464 11.3204 22.2433 11.3189 22.2404 11.3175C22.2389 11.3168 22.2375 11.3162 22.236 11.3155C22.2353 11.3152 22.2347 11.3149 22.234 11.3146C22.2336 11.3144 22.2331 11.3142 22.2329 11.3141C22.2324 11.3139 22.2319 11.3136 21.7938 12.2679ZM20.6364 13.1535L6.27011 20.7003L7.24672 22.5593L21.613 15.0126L20.6364 13.1535ZM21.158 12.9997C21.158 13 21.158 12.9937 21.1603 12.9821C21.1626 12.9706 21.1666 12.9567 21.1728 12.9417C21.1856 12.9108 21.2031 12.8857 21.2199 12.867C21.2356 12.8494 21.2523 12.8358 21.2699 12.8239C21.2792 12.8176 21.2903 12.8107 21.3038 12.8032C21.3107 12.7994 21.3183 12.7954 21.3269 12.7911C21.3312 12.7889 21.3357 12.7867 21.3405 12.7844C21.3429 12.7832 21.3454 12.7821 21.3479 12.7809C21.3492 12.7803 21.3505 12.7797 21.3518 12.7791C21.3524 12.7788 21.3531 12.7785 21.3537 12.7782C21.3541 12.778 21.3546 12.7778 21.3547 12.7777C21.3552 12.7775 21.3557 12.7772 21.7938 13.7315C22.2319 14.6857 22.2324 14.6855 22.2329 14.6853C22.2331 14.6852 22.2336 14.6849 22.234 14.6848C22.2347 14.6845 22.2353 14.6842 22.236 14.6838C22.2375 14.6832 22.2389 14.6825 22.2404 14.6818C22.2433 14.6804 22.2464 14.679 22.2495 14.6775C22.2559 14.6744 22.2628 14.671 22.2701 14.6674C22.2847 14.66 22.3012 14.6513 22.3194 14.6413C22.3556 14.6213 22.3991 14.5954 22.4472 14.5628C22.5425 14.4983 22.6627 14.4033 22.782 14.2705C23.032 13.9922 23.258 13.5669 23.258 12.9997H21.158ZM22.2821 11.3383L22.0591 11.2211L21.0825 13.0802L21.3055 13.1974L22.2821 11.3383ZM21.3055 12.8019L21.0825 12.9191L22.0591 14.7782L22.2821 14.661L21.3055 12.8019ZM22.0591 11.2211L21.836 11.104L20.8594 12.9631L21.0825 13.0802L22.0591 11.2211ZM21.836 11.104L21.613 10.9868L20.6364 12.8459L20.8594 12.9631L21.836 11.104ZM21.0825 12.9191L20.8594 13.0363L21.836 14.8954L22.0591 14.7782L21.0825 12.9191ZM20.8594 13.0363L20.6364 13.1535L21.613 15.0126L21.836 14.8954L20.8594 13.0363ZM8.66654 14.0497H14.083V11.9497H8.66654V14.0497Z" fill="#FAFAFA" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Subscribe />
    </FrontendLayout>
  );
}
