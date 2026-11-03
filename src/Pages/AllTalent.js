import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PostApi } from "../api/api-service";
import FrontendLayout from "../components/Layout/FrontendLayout";
import Subscribe from "../components/Layout/Subscribe";
import { API_Path } from "../const";

export default function AllTalent() {
  const [received, setReceived] = useState("");
  const [modalShare, setModalShare] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setLoaded(true);
    GetReceivedVideo();
  }, []);

  const GetReceivedVideo = () => {
    setLoaded(true);
    const GetReceivedVideoData = new Promise((resolve) => {
      resolve(PostApi(API_Path.GetReceivedVideo));
    });
    GetReceivedVideoData.then((res) => {
      if (res.data.success) {
        setLoaded(false);
        setReceived(res.data.data);
      } else {
        toast.error(res.data.message);
      }
    });
  };

  const handleChange = (video1) => {
    navigate("/receivedvideo", { state: { video: video1 } });
  };

  return (
    <FrontendLayout>
      {loaded && (
        <div className="loader-class">
          <img src={process.env.PUBLIC_URL + "/images/loader_opase.gif"} alt="rentech loader" />
        </div>
      )}
      <section className="black-bg-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-7 mx-auto mb-5">
              <div className="profile-comn-data text-center">
                <span>Received video from talent</span>
                {/* <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type galley of type and scrambled it to make a type specimen book.</p> */}
              </div>
            </div>
            {received &&
              received.length > 0 &&
              received.map((item) => {
                return (
                  <div className="col-lg-6 mb-3">
                    <div className="grey-comn-box">
                      <div className="d-flex align-items-center" onClick={() => handleChange(item?.videoList)}>
                        <div className="follow-profile">
                          <img referrerPolicy="no-referrer" src={item?.image && item?.image !== "null" ? item?.image : process.env.PUBLIC_URL + "/images/following profile.png"} alt="" />
                        </div>
                        <div className="d-sm-flex align-items-center follow-details pay complete w-100 ms-3">
                          <div className="">
                            <span className="d-block mb-1">{item.fullname}</span>
                            <bdi className="d-block mb-1">{item.headline}</bdi>
                          </div>
                          <div className="ms-auto">
                            <div className="text-sm-end d-sm-block d-flex align-items-center">
                              <span className="pen-follow-span">{item.videoList?.length}</span>
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
    </FrontendLayout>
  );
}
