import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PostApi } from "../api/api-service";
import FrontendLayout from "../components/Layout/FrontendLayout";
import Subscribe from "../components/Layout/Subscribe";
import { API_Path } from "../const";

export default function Folllowing() {
  const [data, setData] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    getUserFollowing();
  }, []);

  const getUserFollowing = () => {
    setLoaded(true);
    const getUserFollowingData = new Promise((resolve) => {
      resolve(PostApi(API_Path.getUserFollowing));
    });
    getUserFollowingData.then((res) => {
      if (res.data.success) {
        setData(res.data.data);
        setLoaded(false);
      } else {
        toast.error(res.data.message);
      }
    });
  };

  const handleFollow = (talent) => {
    let data = { talentId: talent.talent_follow };
    let path = API_Path.getUserFollowing;

    const getUserFollowingData = new Promise((resolve) => {
      resolve(PostApi(path, data));
    });
    getUserFollowingData.then((res) => {
      if (res.data.success) {
        setData(res.data.data);
        // toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    });
  };

  return (
    <FrontendLayout>
      {loaded && (
        <div className="loader-class">
          <img src={process.env.PUBLIC_URL + "/images/loader_opase.gif"} alt="opase loader" />
        </div>
      )}
      <section className="black-bg-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-7 mx-auto mb-5">
              <div className="profile-comn-data text-center">
                <span>Following</span>
              </div>
            </div>
            {data &&
              data.length > 0 &&
              data.map((item) => {
                return (
                  <div className="col-lg-6 mb-3">
                    <div className="grey-comn-box">
                      <div className="d-flex align-items-center">
                        <div className="follow-profile">
                          <img referrerPolicy="no-referrer" src={item.image && item.image !== "null" ? item.image : process.env.PUBLIC_URL + "/images/following profile.png"} alt="" />
                        </div>
                        <div className="d-sm-flex align-items-center follow-details pay complete w-100 ms-3">
                          <div className="">
                            <span className="d-block mb-1">{item.fullname}</span>
                            <bdi className="d-block mb-1">{item.headline}</bdi>
                            <p>
                              Fans <span>{item.follower}</span>
                            </p>
                          </div>
                          <div className="ms-auto">
                            <div className="text-sm-end d-sm-block d-flex align-items-center">
                              <span className="pen-follow-span" onClick={() => handleFollow(item)}>
                                {item.isfollow === 1 ? "Following" : "Follow"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            {loaded && Object.keys(data).length === 0 && <h3>No following data found</h3>}
          </div>
        </div>
      </section>
      <Subscribe />
    </FrontendLayout>
  );
}
