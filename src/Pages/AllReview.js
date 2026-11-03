import React, { useEffect, useState } from "react";
import FrontendLayout from "../components/Layout/FrontendLayout";
import { Rating } from "react-simple-star-rating";
import { PostApi } from "../api/api-service";
import { API_Path } from "../const";
import "toastr/build/toastr.min.css";
import review from "../images/user.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import Subscribe from "../components/Layout/Subscribe";
import { useParams } from "react-router-dom";

export default function AllReviews() {
  const [rating, setRating] = useState(0);
  const [reviewData, setReviewData] = useState([]);
  const [talent, setTalentData] = useState();
  const [about, setAbout] = useState("");
  const [id, setId] = useState("");
  const [loaded, setLoaded] = useState(false);
  const params = useParams();

  const handleRating = (rate) => {
    setRating(rate / 20);
  };

  useEffect(() => {
    if (localStorage.getItem("opus_token") !== "undefined") {
      getTalentDetailData();
    }
  }, []);

  const getTalentDetailData = () => {
    const data = { talentId: params?.id };
    const getTalentDetailData = new Promise((resolve) => {
      resolve(PostApi(API_Path.GetTalentNewDetailData, data));
    });
    getTalentDetailData
      .then((res) => {
        if (res.data.success) {
          setLoaded(true);
          setReviewData(res.data.data.reviews);
          setTalentData(res.data.data);
        } else if (res.status === 401) {
          if (localStorage.getItem("opus_token")) {
            localStorage.removeItem("opus_token");
          }
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  let addReviewData = () => {
    let data = {
      talentId: params?.id,
      reviewDesc: about,
      reviewRating: rating,
    };
    const addReviewsDetails = new Promise((resolve) => {
      resolve(PostApi(API_Path.addReview, data));
    });
    addReviewsDetails.then((res) => {
      if (res.data.success) {
        setAbout("");
        setRating(0);
        setId(res.data.data.id);
        getTalentDetailData();
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    });
  };
  return (
    <>
      <FrontendLayout>
        <section className="black-bg-section">
          <div className="container">
            <div className="row">
              <div className="col-12 mb-3">
                <div className="all-review-top">
                  <div className="d-sm-flex align-items-center talent-detail-main-left mb-3">
                    <div className="d-flex align-items-center mb-sm-0 mb-3">
                      <div className="talent-info-profile">
                        <img referrerPolicy="no-referrer" src={talent?.image !== "null" && talent?.image !== "" ? talent?.image : review} alt="" />
                      </div>
                      <div className="talent-detail-main ms-3">
                        <span>{talent && talent.fullname}</span>
                        <p>{talent && talent.headline}</p>
                      </div>
                    </div>
                    <div className="new-del-class ms-sm-2">24hr Delivery</div>
                  </div>
                  <div className="give-rate-sec mb-3">
                    <bdi className="d-block mb-2">Give a rating</bdi>
                    <Rating onClick={handleRating} ratingValue={rating} className="mb-2" fillColor="#F2C94C" emptyColor="#828282" initialValue={0} iconsCount={5} size={25} allowHalfIcon={true} />
                    <p>Please give a stars and and share your experiance with camden</p>
                    <bdi className="d-block mb-2">What’s your opinion?</bdi>
                    <textarea className="comn-input-style form-control h-auto" rows={5} placeholder="Write your opinion" value={about} onChange={(e) => setAbout(e.target.value)} />
                  </div>
                  <div className="row">
                    <div className="col-md-6 m-auto">
                      <button className="comn-btn-class w-100" type="submit" onClick={() => addReviewData()}>
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="all-review-btm">
                  {loaded && reviewData?.length !== 0 && (
                    <div className="slider-comn-part">
                      <span>Reviews</span>
                    </div>
                  )}
                  {reviewData &&
                    reviewData.length > 0 &&
                    reviewData.map((item, i) => {
                      return (
                        <div className="grey-comn-box grey-comn-detail mt-3">
                          <div className="d-flex align-items-center mb-3">
                            <div className="reviewer-profile">
                              <img referrerPolicy="no-referrer" src={item?.image !== "null" && item?.image !== "" ? item?.image : review} alt="" />
                            </div>
                            <div className="ms-2">
                              <span className="d-block mb-2">{item?.fullname}</span>
                              <div className="d-flex align-items-center rating-data">
                                <span className="me-2">{moment(item?.created_at).format("DD/MM/YYYY")}</span>
                                <span className="me-2">{item?.review_rating}</span>
                                <Rating readonly fillColor="#EE9D26" emptyColor="#6C6A81" initialValue={item?.review_rating} iconsCount={5} size={20} allowHalfIcon={true} />
                              </div>
                            </div>
                          </div>
                          <p className="m-0">{item?.review_desc}</p>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </section>
        <Subscribe />
      </FrontendLayout>
    </>
  );
}
