import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { PostApi } from "../../api/api-service";
import { API_Path } from "../../const";

export const Subscribe = () => {
  const [subscribe, setSubscribe] = useState("");
  const [error, setError] = useState({});

  const handleSubscribe = (e, type) => {
    if (e.keyCode === 13 || type === "click") {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

      if (subscribe === "") {
        setError({ subscribe: "Enter Email" });
        document.getElementById("emailErr").style.display = "block";
      } else if (!regex.test(subscribe)) {
        setError({ subscribe: "Enter Valid Email" });
        document.getElementById("emailErr").style.display = "block";
      } else {
        let data = { emailSubscribe: subscribe };
        const subscribeEmail = new Promise((resolve) => {
          resolve(PostApi(API_Path.emailSubscribe, data));
        });
        subscribeEmail.then((res) => {
          if (res.data.success) {
            toast.success("User Subscribed Successfully!");
          } else {
            toast.error(res.data.message);
          }
        });

        document.getElementById("emailErr").style.display = "none";
        setSubscribe("");
      }
    }
  };

  return (
    <>
      <section className="comn-btm-subscribe">
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-xl-7">
              <div className="text-center comn-text-class">
                <div className="top-new-section position-relative mb-3">
                  <span className="d-inline-block px-2 position-relative">SUBSCRIBE</span>
                </div>
                <h2>Join Our Mailing List</h2>
                <p className="my-4">Be the first to know about the newest stars and best deals on Opase</p>
                <div className="input-group btm-mail-input ">
                  <div className="input-group-text">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 20H2C0.89543 20 0 19.1046 0 18V7.049C0.0337512 6.37786 0.397279 5.76686 0.971 5.41699L8.971 0.616995C9.60412 0.237369 10.3949 0.237369 11.028 0.616995L19.028 5.41699C19.6292 5.77977 19.9976 6.42984 20 7.13199V18C20 19.1046 19.1046 20 18 20ZM2 7.86799V18H18V7.86799L10 13.201L2 7.86799ZM10 2.33199L3.316 6.34199L10 10.798L16.683 6.34199L10 2.33199Z" fill="#7C64F8" />
                    </svg>
                  </div>

                  <input type="email" name="subscribe" value={subscribe} onChange={(e) => setSubscribe(e.target.value)} onKeyDown={(e) => handleSubscribe(e, "enter")} className="form-control" placeholder="Email Address..." />
                  <button type="submit" className="input-group-text px-4" onClick={(e) => handleSubscribe(e, "click")}>
                    Submit
                  </button>
                </div>
                <span id="emailErr" style={{ display: "none" }} className="input-feedback text-danger ps-5 text-start ">
                  {error.subscribe}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Subscribe;
